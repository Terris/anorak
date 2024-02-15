import { useMutation } from "convex/react";
import { Field, FieldProps, Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { api } from "@repo/backend/convex/_generated/api";
import { useToast } from "@repo/ui/hooks";
import { Button, Input, Text } from "@repo/ui";
import { useMe } from "../Authorization/MeProvider";

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
  const { me } = useMe();
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
                  {meta.error && meta.touched && (
                    <Text className="text-destructive">{meta.error}</Text>
                  )}
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
