import type { Doc, Id } from "@repo/backend/convex/_generated/dataModel";

export type OrganizationInviteId = Id<"organizationInvites">;
export type OrganizationInviteDoc = Doc<"organizationInvites">;
export type OrganizationInviteWithOrgDoc = Doc<"organizationInvites"> & {
  organization: Doc<"organizations">;
};
