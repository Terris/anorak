"use client";

import {
  OrganizationInvitesTable,
  QuickCreateOrganizationInviteForm,
} from "@repo/organizations/invites";
import { useFindAllOrganizationInvitesAsOrgOwner } from "@repo/organizations/invites/hooks";
import { LoadingBox, Text } from "@repo/ui";
import { useParams } from "next/navigation";

export default function DashboardPage() {
  const { orgSlug } = useParams();
  const { invites, isLoading: invitesIsLoading } =
    useFindAllOrganizationInvitesAsOrgOwner({
      organizationSlug: orgSlug as string,
    });

  if (invitesIsLoading) return <LoadingBox />;

  return (
    <>
      <div className="flex flex-row items-center justify-between pb-4">
        <Text as="h2" className="text-2xl">
          Invites
        </Text>
        <QuickCreateOrganizationInviteForm />
      </div>
      {invites ? <OrganizationInvitesTable invites={invites} /> : null}
    </>
  );
}
