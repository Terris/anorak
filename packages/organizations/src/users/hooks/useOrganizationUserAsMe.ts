import { useQuery } from "convex/react";
import { api } from "@repo/convex";
import { useMe } from "@repo/authorization";
import type { OrganizationId } from "../../types";

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
