import { ConvexError } from "convex/values";
import type { Id } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

export const validateOrganizationOwnership = async ({
  ctx,
  userId,
  organizationId,
}: {
  ctx: MutationCtx | QueryCtx;
  userId: Id<"users">;
  organizationId: Id<"organizations">;
}) => {
  const org = await ctx.db.get(organizationId);
  if (!org) throw new ConvexError("Organization not found");
  if (org.ownerId !== userId) throw new ConvexError("Unauthorized");
  return { org };
};

export const validateOrganizationUserOwnership = async ({
  ctx,
  userId,
  organizationUserId,
}: {
  ctx: MutationCtx | QueryCtx;
  userId: Id<"users">;
  organizationUserId: Id<"organizationUsers">;
}) => {
  const orgUser = await ctx.db.get(organizationUserId);
  if (!orgUser) throw new ConvexError("Organization not found");
  if (orgUser.userId !== userId) throw new ConvexError("Unauthorized");
  return { orgUser };
};
