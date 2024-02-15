"use client";

import { useRouter } from "next/navigation";
import { Text } from "@repo/ui";
import { CreateOrganizationInvitesForm } from "../../../lib/OrganizationInvites/CreateOrganizationInvitesForm";
import { useOrg } from "../../../lib/Organizations/OrganizationProvider";

export default function OnboardInvitesPage() {
  const router = useRouter();
  const { org, isLoading } = useOrg();

  if (isLoading) return null;

  return (
    <>
      <Text className="text-lg pb-4">
        Invite your team. These users will not have access to billing or org
        settings.
      </Text>
      <CreateOrganizationInvitesForm
        orgId={org!._id}
        onSuccess={() => router.push(`/dashboard`)}
        onSkip={() => router.push(`/dashboard`)}
      />
      <Text className="pt-12 text-center text-xs">Step 3 of 3</Text>
    </>
  );
}
