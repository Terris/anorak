import { useMutation } from "convex/react";
import type { FieldProps, FormikHelpers } from "formik";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { api } from "@repo/convex";
import { useMeContext } from "@repo/auth/context";
import { useToast } from "@repo/ui/hooks";
import { Button, Input, Text } from "@repo/ui";

const validationSchema = Yup.object().shape({
  name: Yup.string(),
});

interface CreateOrganizationFormValues {
  name: string;
}

interface CreateOrganizationFormProps {
  onSuccess?: (newOrgId: string) => void;
}
export function CreateOrganizationForm({
  onSuccess,
}: CreateOrganizationFormProps) {
  const { toast } = useToast();
  const { me } = useMeContext();
  const createOrganization = useMutation(api.organizations.sessionedCreate);

  async function onSubmit(
    values: CreateOrganizationFormValues,
    actions: FormikHelpers<CreateOrganizationFormValues>
  ) {
    if (!me)
      throw new Error("User must be logged in to create an organization.");
    try {
      const newOrgId = await createOrganization({
        name: values.name,
      });
      onSuccess?.(newOrgId);
      actions.resetForm();
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Something went wrong trying to create organization.",
      });
    }
  }

  return (
    <Formik<CreateOrganizationFormValues>
      initialValues={{
        name: "",
      }}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="flex flex-row justify-between items-start">
            <Field name="name">
              {({ field, meta }: FieldProps) => (
                <>
                  <Input
                    placeholder="Organization name"
                    {...field}
                    className="mr-2"
                  />
                  {meta.error && meta.touched ? (
                    <Text className="text-destructive">{meta.error}</Text>
                  ) : null}
                </>
              )}
            </Field>
            <Button type="submit" disabled={isSubmitting}>
              Next
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
