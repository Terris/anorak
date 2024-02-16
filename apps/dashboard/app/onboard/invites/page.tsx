"use client";

import { useRouter } from "next/navigation";
import { Loader, Text } from "@repo/ui";
import { CreateOrganizationInvitesForm } from "../../../lib/OrganizationInvites/CreateOrganizationInvitesForm";
import { useOrg } from "../../../lib/Organizations/OrganizationProvider";
import { useUpdateOrganizationUserAsMe } from "../../../lib/OrganizationUsers/hooks/useUpdateOrganizationUserAsMe";
import { useOrganizationUserAsMe } from "../../../lib/OrganizationUsers/hooks/useOrganizationUserAsMe";

export default function OnboardInvitesPage() {
  const router = useRouter();

  const { org, isLoading: orgIsLoading } = useOrg();

  const { isLoading: orgUserIsLoading, organizationUser } =
    useOrganizationUserAsMe({ organizationId: org?._id });

  const { isLoading: orgUserMutationIsLoading, updateOrganizationUser } =
    useUpdateOrganizationUserAsMe();

  async function handleCompleteOnboarding() {
    if (
      orgIsLoading ||
      orgUserMutationIsLoading ||
      orgUserIsLoading ||
      !org ||
      !organizationUser
    )
      return;
    await updateOrganizationUser({
      organizationUserId: organizationUser._id,
      onboardingComplete: true,
    });
    router.push(`/org/${org.slug}`);
  }

  if (orgIsLoading || orgUserMutationIsLoading || orgUserIsLoading || !org)
    return <Loader />;

  return (
    <>
      <Text className="text-lg pb-4">
        Invite your team. These users will not have access to billing or org
        settings.
      </Text>

      <CreateOrganizationInvitesForm
        orgId={org._id}
        onSuccess={handleCompleteOnboarding}
        onSkip={handleCompleteOnboarding}
      />
      <Text className="pt-12 text-center text-xs">Step 3 of 3</Text>
    </>
  );
}
