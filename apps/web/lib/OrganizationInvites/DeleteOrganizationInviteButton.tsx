import { useMutation } from "convex/react";
import { Trash } from "lucide-react";
import { api } from "@repo/convex";
import { Button } from "@repo/ui";
import type { OrganizationId } from "../Organizations/types";
import type { OrganizationInviteId } from "./types";

export function DeleteOrganizationInviteButton({
  orgId,
  inviteId,
}: {
  orgId: OrganizationId;
  inviteId: OrganizationInviteId;
}) {
  const deleteOrgInvite = useMutation(
    api.organizationInvites.sessionedDeleteOrganizationInviteAsOrgOwner
  );
  return (
    <Button
      onClick={() => deleteOrgInvite({ organizationId: orgId, inviteId })}
      variant="ghost"
    >
      <Trash className="w-4 h-4" />
    </Button>
  );
}
