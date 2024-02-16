import * as Yup from "yup";
import { useMutation } from "convex/react";
import type { FieldProps, FormikHelpers } from "formik";
import { Field, Form, Formik } from "formik";
import { api } from "@repo/convex";
import { Button, Text, Textarea } from "@repo/ui";
import { useToast } from "@repo/ui/hooks";
import { useMe } from "@repo/authorization";
import type { OrganizationId } from "../types";

const validationSchema = Yup.object().shape({
  emails: Yup.string().required("Please enter at least one email."),
});

interface CreateOrganizationInvitesFormValues {
  emails: string;
}

interface CreateOrganizationInvitesFormProps {
  orgId: string;
  onSuccess?: () => void;
  onSkip?: () => void;
}
export function CreateOrganizationInvitesForm({
  orgId,
  onSuccess,
  onSkip,
}: CreateOrganizationInvitesFormProps) {
  const { toast } = useToast();
  const { me } = useMe();
  const createOrganizationInvites = useMutation(
    api.organizationInvites.sessionedCreateManyAsOrgOwner
  );

  async function onSubmit(
    values: CreateOrganizationInvitesFormValues,
    actions: FormikHelpers<CreateOrganizationInvitesFormValues>
  ) {
    if (!me)
      throw new Error("User must be logged in to create an organization.");
    try {
      await createOrganizationInvites({
        emails: values.emails,
        organizationId: orgId as OrganizationId,
      });
      onSuccess?.();
      actions.resetForm();
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Something went wrong trying to create invites.",
      });
    }
  }

  return (
    <Formik<CreateOrganizationInvitesFormValues>
      initialValues={{
        emails: "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <Field name="emails">
            {({ field, meta }: FieldProps) => (
              <>
                <Textarea
                  placeholder="user.one@example.com, user.two@example.com"
                  {...field}
                  className="mr-2"
                />
                {meta.error && meta.touched ? (
                  <Text className="text-destructive">{meta.error}</Text>
                ) : null}
              </>
            )}
          </Field>
          <div className="flex flex-row justify-end items-center mt-4">
            <Button
              type="button"
              variant="outline"
              className="mr-4"
              onClick={() => onSkip?.()}
            >
              Skip
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              Invite &amp; Finish
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
