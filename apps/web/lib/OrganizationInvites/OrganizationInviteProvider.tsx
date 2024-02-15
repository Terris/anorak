"use client";

import { createContext, ReactNode, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@repo/ui";
import { useMe } from "../Authorization/MeProvider";
import { OrganizationUserId } from "../OrganizationUsers/types";
import { useInviteFromParams } from "./hooks/useInviteFromParams";
import { useOrganizationUserAsMe } from "../OrganizationUsers/hooks/useOrganizationUserAsMe";
import { useCreateOrganizationUserWithInviteAsMe } from "../OrganizationUsers/hooks/useCreateOrganizationUserWithInviteAsMe";
import { useUpdateOrganizationUserAsMe } from "../OrganizationUsers/hooks/useUpdateOrganizationUser";
import { OrganizationInviteId, OrganizationInviteWithOrgDoc } from "./types";

interface OrganizationInviteContextProps {
  inviteToken?: OrganizationInviteId;
  isLoading: boolean;
  isMutating: boolean;
  invite?: OrganizationInviteWithOrgDoc | null;
  newOrganizationUserId?: OrganizationUserId | null;
  completeOnboarding: () => void;
}

const initialProps = {
  inviteToken: undefined,
  isLoading: true,
  isMutating: false,
  invite: undefined,
  orgUserId: undefined,
  completeOnboarding: () => null,
};

export const OrganizationInviteContext =
  createContext<OrganizationInviteContextProps>(initialProps);

interface OrganizationInviteProviderProps {
  children: ReactNode;
}

export const OrganizationInviteProvider = ({
  children,
}: OrganizationInviteProviderProps) => {
  const router = useRouter();
  const { me } = useMe();

  // GET INVITE
  const {
    inviteToken,
    invite,
    isLoading: inviteIsLoading,
  } = useInviteFromParams();

  // PUSH TO HOME IF NO DB INVITE
  useEffect(() => {
    if (inviteIsLoading) return;
    if (!invite) {
      router.push("/");
    }
  }, [invite, inviteIsLoading, router]);

  const { isLoading: organizationUserIsLoading, organizationUser } =
    useOrganizationUserAsMe({
      organizationId: invite?.organizationId,
    });

  // CREATE ORG USER
  const {
    isLoading: createOrganizationUserIsLoading,
    createOrganizationUser,
    newOrganizationUserId,
  } = useCreateOrganizationUserWithInviteAsMe();

  // SYNC INVITE TO ORGANIZATION USER
  const canCreateOrgUser =
    !!me &&
    !!inviteToken &&
    !organizationUserIsLoading &&
    !organizationUser &&
    !createOrganizationUserIsLoading;

  useEffect(() => {
    if (!canCreateOrgUser) return;
    createOrganizationUser({
      inviteToken: inviteToken as OrganizationInviteId,
    });
  }, [canCreateOrgUser, createOrganizationUser, inviteToken]);

  // COMPLETE ONBOARDING
  const { updateOrganizationUser, isLoading: completeOnboardinIsLoading } =
    useUpdateOrganizationUserAsMe();
  async function completeOnboarding() {
    if (!newOrganizationUserId || !invite) return;
    await updateOrganizationUser({
      organizationUserId: newOrganizationUserId,
      onboardingComplete: true,
      onSuccess: () => router.push(`/org/${invite.organization.slug}`),
    });
  }

  const isLoading = inviteIsLoading || organizationUserIsLoading;
  const isMutating =
    createOrganizationUserIsLoading || completeOnboardinIsLoading;

  return (
    <OrganizationInviteContext.Provider
      value={{
        isLoading,
        isMutating,
        invite,
        newOrganizationUserId,
        completeOnboarding,
      }}
    >
      {isLoading || !invite ? <LoadingScreen /> : children}
    </OrganizationInviteContext.Provider>
  );
};

export const useOrganizationInvite = () => {
  const organizationInviteContext = useContext(OrganizationInviteContext);
  return organizationInviteContext;
};