import { ConvexError, v } from "convex/values";
import { asyncMap } from "convex-helpers";
import { mutation, query } from "./_generated/server";
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

// As Org Owner
export const sessionedFindAllByOrganizationIdAsOrgOwner = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, { organizationId }) => {
    const { user } = await validateIdentity(ctx);
    await validateOrganizationOwnership({
      ctx,
      userId: user._id,
      organizationId,
    });

    return ctx.db
      .query("organizationInvites")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", organizationId)
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
