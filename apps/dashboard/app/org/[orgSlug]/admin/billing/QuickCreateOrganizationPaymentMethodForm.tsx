"use client";

import { type FormEvent, useState } from "react";
import { useAction, useMutation } from "convex/react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js";
import { api } from "@repo/convex";
import { useMeOrganizationContext } from "@repo/organizations/context";
import { useToast } from "@repo/ui/hooks";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
  Loader,
  LoadingBox,
  Text,
} from "@repo/ui";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export function QuickCreateOrganizationPaymentMethodForm() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { meOrganization } = useMeOrganizationContext();

  const stripeElementsOptions: StripeElementsOptions = {
    mode: "subscription",
    amount: meOrganization?.spendCapInCents ?? 100,
    currency: "usd",
    appearance: {
      theme: "stripe",
      rules: {
        ".Input": {
          boxShadow: "none",
        },
        ".Input--focus": {
          boxShadow: "none",
        },
      },
    },
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(o) => {
        setIsOpen(o);
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">Add a payment method</Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a payment method</DialogTitle>
          </DialogHeader>
          <Elements stripe={stripePromise} options={stripeElementsOptions}>
            <PaymentMethodForm setIsOpen={setIsOpen} />
          </Elements>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

function PaymentMethodForm({
  setIsOpen,
}: {
  setIsOpen: (open: boolean) => void;
}) {
  const { toast } = useToast();

  const { meOrganization, isLoading: meOrganizationIsLoading } =
    useMeOrganizationContext();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const createOrganizationSetupIntent = useAction(
    api.organizationActions.sessionedOrganizationCreateSetupIntentAsOrgOwner
  );

  const updateOrganizationPaymentMethod = useMutation(
    api.organizations.sessionedUpdateAsOrgOwner
  );

  const isSubmitDisabled =
    !stripe || !elements || isSubmitting || meOrganizationIsLoading;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      if (isSubmitDisabled || !meOrganization) {
        throw new Error("Unable to submit payment method. Please try again.");
      }
      setIsSubmitting(true);
      setErrorMessage(null);

      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message ?? "Unable to submit payment");
      }

      // create a setup intent on the backend
      const { client_secret: clientSecret } =
        await createOrganizationSetupIntent({
          organizationId: meOrganization._id,
        });
      if (!clientSecret) {
        throw new Error("Unable to create PaymentIntent");
      }

      // confirm the setup intent via stripe
      const { error: confirmSetupError, setupIntent } =
        await stripe.confirmSetup({
          elements,
          clientSecret,
          confirmParams: {
            return_url: `${process.env.NEXT_PUBLIC_DASHBOARD_URL}/org/${meOrganization.slug}/admin/billing`,
          },
          redirect: "if_required",
        });

      const stripePaymentMethodId = setupIntent?.payment_method;
      if (confirmSetupError || !stripePaymentMethodId) {
        throw new Error(
          `Unable to confirm payment method. ${confirmSetupError?.message}`
        );
      }

      // save the payment method id to the organization
      await updateOrganizationPaymentMethod({
        organizationId: meOrganization._id,
        stripePaymentMethodId: stripePaymentMethodId as string,
      });

      // show a success toast & close dialogue
      toast({
        title: "Success!",
        description: `Successfully added payment method.`,
      });
      setIsOpen(false);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setErrorMessage(errorMessage);
      setIsSubmitting(false);
    }
  };

  if (!stripe || !elements) return <LoadingBox />;

  return (
    <form onSubmit={handleSubmit}>
      {errorMessage ? (
        <Text className="text-destructive">{errorMessage}</Text>
      ) : null}
      <PaymentElement />
      <div className="flex flex-row items-center justify-end">
        <Button type="submit" disabled={isSubmitDisabled} className="mt-4">
          {isSubmitting ? <Loader /> : null}
          Save payment method
        </Button>
      </div>
    </form>
  );
}
