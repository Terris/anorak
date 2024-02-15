import { useQuery } from "convex/react";
import { api } from "@repo/backend/convex/_generated/api";
import { useMe } from "../../Authorization/MeProvider";
import type { OrganizationId } from "../../Organizations/types";

export function useOrganizationUserAsMe({
  organizationId,
}: {
  organizationId?: OrganizationId;
}) {
  const { me } = useMe();

  const organizationUserArgs =
    me && organizationId ? { organizationId, userId: me.id } : "skip";

  const organizationUser = useQuery(
    api.organizationUsers.sessionedFindOneByOrgIdUserId,
    organizationUserArgs
  );

  const isLoading =
    organizationUserArgs !== "skip" && organizationUser === undefined;

  return { organizationUser, isLoading };
}
