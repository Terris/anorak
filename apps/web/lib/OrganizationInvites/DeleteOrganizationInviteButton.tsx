import { useMutation } from "convex/react";
import { Trash } from "lucide-react";
import { api } from "@repo/backend/convex/_generated/api";
import { Button } from "@repo/ui";
import { OrganizationId } from "../Organizations/types";
import { OrganizationInviteId } from "./types";

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
