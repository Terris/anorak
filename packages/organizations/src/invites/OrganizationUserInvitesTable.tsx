import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@repo/ui";
import { formatDate } from "@repo/utils";
import { DeleteOrganizationInviteButton } from "./DeleteOrganizationInviteButton";
import type { OrganizationInviteDoc } from "./types";

type OrganizationInviteRow = OrganizationInviteDoc;

const columns: ColumnDef<OrganizationInviteRow>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    id: "_creationTime",
    header: "Invite Date",
    cell: ({ row }) => formatDate(row.original._creationTime),
  },
  {
    id: "delete",
    header: "Revoke invite",
    cell: ({ row }) => (
      <DeleteOrganizationInviteButton
        orgId={row.original.organizationId}
        inviteId={row.original._id}
      />
    ),
  },
];

export function OrganizationInvitesTable({
  invites,
}: {
  invites: OrganizationInviteDoc[];
}) {
  return <DataTable columns={columns} data={invites} />;
}
