"use client";

import * as Yup from "yup";
import { useMutation } from "convex/react";
import { Plus } from "lucide-react";
import { api } from "@repo/convex";
import { useToast } from "@repo/ui/hooks";
import type { SimpleFormConfig } from "@repo/ui";
import { SimpleDialogForm, Button } from "@repo/ui";
import { useMe } from "../Authorization/MeProvider";
import { useOrg } from "../Organizations/OrganizationProvider";

interface CreateOrganizationInvitesFormFields {
  emails: string;
}

const validationSchema = Yup.object().shape({
  emails: Yup.string().required("Please enter at least one email."),
});

const fields = [{ name: "emails", label: "Emails", initialValue: "" }];

const initialValues = {
  emails: "",
};

export function QuickCreateOrganizationInviteForm() {
  const { toast } = useToast();
  const { me } = useMe();
  const { org } = useOrg();
  const createOrganizationInvites = useMutation(
    api.organizationInvites.sessionedCreateManyAsOrgOwner
  );

  async function onSubmit(values: CreateOrganizationInvitesFormFields) {
    if (!me)
      throw new Error("User must be logged in to create an organization.");
    if (!org)
      throw new Error("User must be in an organization to create invites.");
    try {
      await createOrganizationInvites({
        emails: values.emails,
        organizationId: org._id,
      });
      toast({
        title: "Success!",
        description: "Saved new assessment.",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "Something went wrong trying to create invites.",
      });
    }
  }

  const formConfig: SimpleFormConfig<CreateOrganizationInvitesFormFields> = {
    validationSchema,
    initialValues,
    fields,
    onSubmit,
  };

  return (
    <SimpleDialogForm<CreateOrganizationInvitesFormFields>
      config={formConfig}
      formTitle="Add invites"
      renderTrigger={
        <Button size="sm">
          <Plus className="w-3 h-3 mr-2" />
          Add invites
        </Button>
      }
    />
  );
}
