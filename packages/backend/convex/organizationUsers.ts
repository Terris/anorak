import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { validateOrganizationUserOwnership } from "./lib/ownership";

// SESSIONED

// read
export const sessionedFindOneByOrgIdUserId = query({
  args: { organizationId: v.id("organizations"), userId: v.id("users") },
  handler: async (ctx, { organizationId, userId }) => {
    await validateIdentity(ctx);
    return ctx.db
      .query("organizationUsers")
      .withIndex("by_organization_id_user_id", (q) =>
        q.eq("organizationId", organizationId).eq("userId", userId)
      )
      .first();
  },
});

// create
export const sessionedCreateOneByInviteTokenUserId = mutation({
  args: { inviteToken: v.id("organizationInvites"), userId: v.id("users") },
  handler: async (ctx, { inviteToken, userId }) => {
    await validateIdentity(ctx);

    const invite = await ctx.db.get(inviteToken);
    if (!invite) throw new Error("Invite not found");

    const org = await ctx.db.get(invite.organizationId);
    if (!org) throw new Error("Organization not found");

    const user = await ctx.db.get(userId);
    if (!user) throw new Error("User not found");

    if (user.email !== invite.email)
      throw new Error("User email does not match invite");

    return await ctx.db.insert("organizationUsers", {
      userId: user._id,
      organizationId: invite.organizationId,
      onboardingComplete: false,
    });
  },
});

// update
export const sessionedUpdateOrganizationUserAsOwner = mutation({
  args: {
    organizationUserId: v.id("organizationUsers"),
    onboardingComplete: v.optional(v.boolean()),
  },
  handler: async (ctx, { organizationUserId, onboardingComplete }) => {
    const { user } = await validateIdentity(ctx);
    await validateOrganizationUserOwnership({
      ctx,
      userId: user._id,
      organizationUserId,
    });
    return await ctx.db.patch(organizationUserId, { onboardingComplete });
  },
});
