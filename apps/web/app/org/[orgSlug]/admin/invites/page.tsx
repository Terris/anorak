"use client";

import { api } from "@repo/backend/convex/_generated/api";
import { OrganizationInvitesTable } from "../../../../../lib/OrganizationInvites/OrganizationUserInvitesTable";
import { QuickCreateOrganizationInviteForm } from "../../../../../lib/OrganizationInvites/QuickCreateOrganizationInvitesForm";
import { useOrg } from "../../../../../lib/Organizations/OrganizationProvider";
import { Text } from "../../../../../lib/ui";
import { useQuery } from "convex/react";

export default function DashboardPage() {
  const { isLoading, org } = useOrg();
  const invitesQueryArgs = org ? { organizationId: org._id } : "skip";

  const invites = useQuery(
    api.organizationInvites.sessionedFindAllByOrganizationIdAsOrgOwner,
    invitesQueryArgs
  );
  const invitesIsLoading = invites === undefined;

  if (isLoading || invitesIsLoading) return null;

  return (
    <>
      <div className="flex flex-row items-center justify-between pb-4">
        <Text as="h2" className="text-2xl">
          Invites
        </Text>
        <QuickCreateOrganizationInviteForm />
      </div>
      <OrganizationInvitesTable invites={invites} />
    </>
  );
}
