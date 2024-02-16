"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@repo/ui";
import { useMe } from "@repo/authorization";
import {
  useOrganizationUserAsMe,
  useUpdateOrganizationUserAsMe,
  useCreateOrganizationUserWithInviteAsMe,
} from "../users/hooks";
import type { OrganizationUserId } from "../users";
import { useInviteFromParams } from "./hooks/useInviteFromParams";
import type {
  OrganizationInviteId,
  OrganizationInviteWithOrgDoc,
} from "./types";

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

export function OrganizationInviteProvider({
  children,
}: OrganizationInviteProviderProps) {
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
    Boolean(me) &&
    Boolean(inviteToken) &&
    !organizationUserIsLoading &&
    !organizationUser &&
    !createOrganizationUserIsLoading;

  useEffect(() => {
    if (!canCreateOrgUser) return;
    void createOrganizationUser({
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
      onSuccess: () => {
        router.push(`/org/${invite.organization.slug}`);
      },
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
}

export const useOrganizationInvite = () => {
  const organizationInviteContext = useContext(OrganizationInviteContext);
  return organizationInviteContext;
};
