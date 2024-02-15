import { ConvexError } from "convex/values";
import { MutationCtx, QueryCtx } from "../_generated/server";

export async function validateIdentity(
  ctx: MutationCtx | QueryCtx,
  options?: { requiredRoles?: string[] }
) {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new Error("Unauthenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_token", (q) =>
      q.eq("tokenIdentifier", identity.tokenIdentifier)
    )
    .first();
  const isAuthorizedUser = user && user.roles?.includes("user");
  if (!isAuthorizedUser) {
    throw new ConvexError("Unauthorized");
  }

  if (
    options?.requiredRoles &&
    user.roles &&
    options.requiredRoles.every((role) => user.roles?.includes(role))
  ) {
    throw new ConvexError("Unauthorized user role");
  }

  return { identity, user };
}
