import * as Yup from "yup";
import { useMutation } from "convex/react";
import type { FieldProps } from "formik";
import { Field, Form, Formik } from "formik";
import { api } from "@repo/convex";
import { useMeContext } from "@repo/auth/context";
import { useToast } from "@repo/ui/hooks";
import { Button, CurrencyInput, Loader, Text } from "@repo/ui";
import { useMeOrganizationContext } from "./context/MeOrganizationContext";
import type { OrganizationId } from "./types";

const validationSchema = Yup.object().shape({
  spendCapInCents: Yup.string().required("Spending cap is required."),
});

interface UpdateOrgSpendCapFormValues {
  spendCapInCents: string;
}

interface UpdateOrgSpendCapFormProps {
  orgId: OrganizationId;
  onSuccess?: () => void;
}
export function UpdateOrgSpendCapForm({
  onSuccess,
}: UpdateOrgSpendCapFormProps) {
  const { toast } = useToast();
  const { me } = useMeContext();
  const { meOrganization, isLoading } = useMeOrganizationContext();

  const updateOrgSpendingCap = useMutation(
    api.organizations.sessionedUpdateSpendCapAsOrgOwner
  );

  async function onSubmit(values: UpdateOrgSpendCapFormValues) {
    if (!me)
      throw new Error("User must be logged in to update an organization.");
    if (!meOrganization)
      throw new Error("Organization must be loaded to update spend cap.");
    try {
      await updateOrgSpendingCap({
        organizationId: meOrganization._id,
        spendCapInCents: Number(values.spendCapInCents),
      });
      onSuccess?.();
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Something went wrong trying to update spending cap.",
      });
    }
  }

  if (isLoading) return null;

  return (
    <Formik<UpdateOrgSpendCapFormValues>
      initialValues={{
        spendCapInCents: String(meOrganization?.spendCapInCents),
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="flex flex-row justify-between items-start">
            <Field name="spendCapInCents">
              {({ form, field, meta }: FieldProps) => (
                <div className="w-full mr-2">
                  <CurrencyInput
                    {...field}
                    className="mr-2"
                    onChange={(v) => {
                      void form.setFieldValue(field.name, v);
                    }}
                  />
                  {meta.error && meta.touched ? (
                    <Text className="text-destructive">{meta.error}</Text>
                  ) : null}
                </div>
              )}
            </Field>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Loader className="mr-2" /> : null}
              Next
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
