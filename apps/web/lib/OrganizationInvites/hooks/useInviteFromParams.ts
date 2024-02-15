import { useQuery } from "convex/react";
import { useParams } from "next/navigation";
import { api } from "@repo/backend/convex/_generated/api";
import type { OrganizationInviteId } from "../types";

export function useInviteFromParams() {
  const { inviteToken } = useParams();

  const invite = useQuery(api.organizationInvites.publicFindOneByInviteToken, {
    inviteToken: inviteToken as OrganizationInviteId,
  });
  const isLoading = invite === undefined;

  return { inviteToken, invite, isLoading };
}
