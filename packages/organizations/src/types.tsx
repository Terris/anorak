import type { Doc, Id } from "@repo/convex";

export type OrganizationId = Id<"organizations">;
export type OrganizationDoc = Doc<"organizations">;
export type MeOrganizationDoc = Doc<"organizations"> & { meIsOwner: boolean };
