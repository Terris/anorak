"use client";

import { useQuery } from "convex/react";
import { api } from "@repo/convex";
import { useMeOrganizationContext } from "@repo/organizations/context";
import {
  OrganizationInvitesTable,
  QuickCreateOrganizationInviteForm,
} from "@repo/organizations/invites";
import { Text } from "@repo/ui";

export default function DashboardPage() {
  const { isLoading, meOrganization } = useMeOrganizationContext();
  const invitesQueryArgs = meOrganization
    ? { organizationId: meOrganization._id }
    : "skip";

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
