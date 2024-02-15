import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api";
import { useMe } from "../../Authorization/MeProvider";
import { OrganizationInviteId } from "../../OrganizationInvites/types";
import { OrganizationUserId } from "../types";

interface CreateOrganizationUserArgs {
  inviteToken: OrganizationInviteId;
}

export function useCreateOrganizationUserWithInviteAsMe() {
  const { me } = useMe();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [newOrganizationUserId, setNewOrganizationUserId] =
    useState<OrganizationUserId | null>(null);

  const createDBOrganizationUser = useMutation(
    api.organizationUsers.sessionedCreateOneByInviteTokenUserId
  );

  async function createOrganizationUser({
    inviteToken,
  }: CreateOrganizationUserArgs) {
    if (!me || !inviteToken) return;

    try {
      setIsLoading(true);
      const newOrganizationUserId = await createDBOrganizationUser({
        inviteToken: inviteToken as OrganizationInviteId,
        userId: me.id,
      });
      setNewOrganizationUserId(newOrganizationUserId);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, error, createOrganizationUser, newOrganizationUserId };
}
