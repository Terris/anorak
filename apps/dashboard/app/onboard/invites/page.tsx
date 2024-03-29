"use client";

import { useRouter } from "next/navigation";
import { LoadingBox, Text } from "@repo/ui";
import { CreateOrganizationInvitesForm } from "@repo/organizations/invites";
import { useMeOrganizationContext } from "@repo/organizations/context";
import {
  useGetOrganizationUserAsMe,
  useUpdateOrganizationUserAsMe,
} from "@repo/organizations/users/hooks";

export default function OnboardInvitesPage() {
  const router = useRouter();

  const { meOrganization, isLoading: meOrganizationIsLoading } =
    useMeOrganizationContext();

  const { isLoading: orgUserIsLoading, organizationUser } =
    useGetOrganizationUserAsMe({ organizationId: meOrganization?._id });

  const { isLoading: orgUserMutationIsLoading, updateOrganizationUser } =
    useUpdateOrganizationUserAsMe();

  async function handleCompleteOnboarding() {
    if (
      meOrganizationIsLoading ||
      orgUserMutationIsLoading ||
      orgUserIsLoading ||
      !meOrganization ||
      !organizationUser
    )
      return;
    await updateOrganizationUser({
      organizationUserId: organizationUser._id,
      onboardingComplete: true,
    });
    router.push(`/org/${meOrganization.slug}`);
  }

  if (meOrganizationIsLoading || orgUserIsLoading || !meOrganization)
    return <LoadingBox />;

  return (
    <>
      <Text className="text-lg pb-4">
        Invite your team. These users will not have access to your billing or
        organization settings.
      </Text>

      <CreateOrganizationInvitesForm
        orgId={meOrganization._id}
        onSuccess={handleCompleteOnboarding}
        onSkip={handleCompleteOnboarding}
      />
      <Text className="pt-12 text-center text-xs">Step 3 of 3</Text>
    </>
  );
}
