import { ConvexError, v } from "convex/values";
import { asyncMap } from "convex-helpers";
import { internalMutation, mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { internal } from "./_generated/api";
import { validateOrganizationOwnership } from "./lib/ownership";
import { Id } from "./_generated/dataModel";

// SESSIONED USER ONLY
// public
export const publicFindOneByInviteToken = query({
  args: { inviteToken: v.id("organizationInvites") },
  handler: async (ctx, { inviteToken }) => {
    const invite = await ctx.db.get(inviteToken);
    if (!invite) {
      throw new ConvexError("Invite not found.");
    }

    const inviteOrg = await ctx.db.get(invite.organizationId);
    if (!inviteOrg) {
      throw new ConvexError("Organization not found for invite.");
    }

    return { ...invite, organization: inviteOrg };
  },
});

// As invite owner (via email)
export const sessionedCompleteInviteOnboardingAsEmailOwner = mutation({
  args: { inviteToken: v.id("organizationInvites"), email: v.string() },
  handler: async (ctx, { inviteToken, email }) => {
    const { user } = await validateIdentity(ctx);
    // check that email arg matches session user email
    if (user.email !== email)
      throw new ConvexError("Email does not match user.");

    // check that invite exists and matches email
    const invite = await ctx.db.get(inviteToken);
    if (!invite) throw new ConvexError("Invite not found.");
    if (invite.email !== email)
      throw new ConvexError("Email does not match invite.");

    // check that orgUser was created and mark as completed
    const organizationUser = await ctx.db
      .query("organizationUsers")
      .withIndex("by_organization_id_user_id", (q) =>
        q.eq("organizationId", invite.organizationId).eq("userId", user._id)
      )
      .first();
    if (!organizationUser)
      throw new ConvexError("Organization user not found.");

    // mark related organizationUser as onboardCompleted
    await ctx.db.patch(organizationUser._id, { onboardingComplete: true });

    // schedule delete invite
    // we don't want to delete the invite before the user has beend redirected to the org
    await ctx.scheduler.runAfter(
      10000,
      internal.organizationInvites.systemDeleteInvite,
      { inviteId: inviteToken }
    );
    return true;
  },
});

// As Org Owner
export const sessionedFindAllByOrganizationSlugAsOrgOwner = query({
  args: { organizationSlug: v.string() },
  handler: async (ctx, { organizationSlug }) => {
    const { user } = await validateIdentity(ctx);
    const organization = await ctx.db
      .query("organizations")
      .withIndex("by_slug", (q) => q.eq("slug", organizationSlug))
      .first();
    if (!organization) throw new ConvexError("Organization not found.");
    await validateOrganizationOwnership({
      ctx,
      userId: user._id,
      organizationId: organization._id,
    });
    return ctx.db
      .query("organizationInvites")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", organization._id)
      )
      .collect();
  },
});

export const sessionedCreateManyAsOrgOwner = mutation({
  args: {
    emails: v.string(),
    organizationId: v.id("organizations"),
  },
  handler: async (ctx, { emails, organizationId }) => {
    const { user } = await validateIdentity(ctx);
    const { org } = await validateOrganizationOwnership({
      ctx,
      userId: user._id,
      organizationId,
    });
    const emailList = emails.split(",").map((email) => email.trim());
    await asyncMap(emailList, async (email) => {
      // CHECK IF ORG USER EXISTS IN ORG
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();

      let existingOrgUser;
      if (existingUser) {
        existingOrgUser = await ctx.db
          .query("organizationUsers")
          .withIndex("by_organization_id_user_id", (q) =>
            q
              .eq("organizationId", organizationId)
              .eq("userId", existingUser._id)
          )
          .first();
      }
      if (existingOrgUser) return;

      // CHECK FOR EXISTING INVITE
      const existingInvite = await ctx.db
        .query("organizationInvites")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();

      // either resend invite email or create new invite and send
      const emailInviteId = existingInvite
        ? existingInvite._id
        : await ctx.db.insert("organizationInvites", {
            email,
            organizationId,
            role: "user",
          });

      await ctx.scheduler.runAfter(
        0,
        internal.organizationInviteActions.systemSendOrgInviteEmailToUser,
        {
          toEmail: email,
          orgName: org.name,
          inviteToken: emailInviteId,
        }
      );
    });
    return true;
  },
});

export const sessionedDeleteOrganizationInviteAsOrgOwner = mutation({
  args: {
    organizationId: v.id("organizations"),
    inviteId: v.id("organizationInvites"),
  },
  handler: async (ctx, { organizationId, inviteId }) => {
    const { user } = await validateIdentity(ctx);
    await validateOrganizationOwnership({
      ctx,
      userId: user._id,
      organizationId,
    });
    return ctx.db.delete(inviteId);
  },
});

// INTERNAL FUNCTIONS
export const systemDeleteInvite = internalMutation({
  args: { inviteId: v.id("organizationInvites") },
  handler: async (ctx, { inviteId }) => {
    await ctx.db.delete(inviteId);
  },
});
