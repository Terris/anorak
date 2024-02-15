import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api";
import { useMe } from "../../Authorization/MeProvider";
import type { OrganizationUserId } from "../types";

interface UpdateOrganizationUserArgs {
  organizationUserId: OrganizationUserId;
  onboardingComplete?: boolean;
  onSuccess?: () => void;
}

export function useUpdateOrganizationUserAsMe() {
  const { me } = useMe();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const updateDBOrganizationUser = useMutation(
    api.organizationUsers.sessionedUpdateOrganizationUserAsOwner
  );

  async function updateOrganizationUser({
    organizationUserId,
    onboardingComplete,
    onSuccess,
  }: UpdateOrganizationUserArgs) {
    if (!me || !organizationUserId) return;
    setIsLoading(true);
    try {
      await updateDBOrganizationUser({
        organizationUserId,
        onboardingComplete,
      });
      onSuccess?.();
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  return { isLoading, error, updateOrganizationUser };
}
