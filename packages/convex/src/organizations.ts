import { v } from "convex/values";
import type { MutationCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { validateOrganizationOwnership } from "./lib/ownership";

// SESSIONED USER ONLY
export const sessionedMeOrganization = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await validateIdentity(ctx);
    const orgUser = await ctx.db
      .query("organizationUsers")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .first();
    if (!orgUser) return null;
    const organization = await ctx.db.get(orgUser.organizationId);
    if (!organization) return null;
    return { ...organization, meIsOwner: organization.ownerId === user._id };
  },
});

export const sessionedFindByOwnerId = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    await validateIdentity(ctx);
    return ctx.db
      .query("organizations")
      .withIndex("by_owner_id", (q) => q.eq("ownerId", userId))
      .first();
  },
});

export const sessionedFindByOrganizationUser = query({
  args: {},
  handler: async (ctx) => {
    const { user } = await validateIdentity(ctx);
    const orgUser = await ctx.db
      .query("organizationUsers")
      .withIndex("by_user_id", (q) => q.eq("userId", user._id))
      .first();
    if (!orgUser) return null;
    return ctx.db.get(orgUser.organizationId);
  },
});

export const sessionedCreate = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const { user } = await validateIdentity(ctx);

    // create a slug and make sure it is unique
    const uniqueSlug = await createUniqueSlug(ctx, name, 0);

    // create the organization
    const newOrganizationId = await ctx.db.insert("organizations", {
      name,
      slug: uniqueSlug,
      ownerId: user._id,
      spendCapInCents: 0,
    });

    // create the organization user
    await ctx.db.insert("organizationUsers", {
      organizationId: newOrganizationId,
      userId: user._id,
      onboardingComplete: false,
    });

    return newOrganizationId;
  },
});

// Organization Owner
export const sessionedUpdateSpendCapAsOrgOwner = mutation({
  args: {
    organizationId: v.id("organizations"),
    spendCapInCents: v.number(),
  },
  handler: async (ctx, { organizationId, spendCapInCents }) => {
    const { user } = await validateIdentity(ctx);
    await validateOrganizationOwnership({
      ctx,
      userId: user._id,
      organizationId,
    });
    return ctx.db.patch(organizationId, { spendCapInCents });
  },
});

// PRIVATE FUNCTIONS
const createUniqueSlug = async (
  ctx: MutationCtx,
  name: string,
  existingCount: number
): Promise<string> => {
  const slug = name.toLowerCase().replace(/\s/g, "-");
  const uniqueSlug = existingCount === 0 ? slug : `${slug}-${existingCount}`;

  const existingSlug = await ctx.db
    .query("organizations")
    .withIndex("by_slug", (q) => q.eq("slug", uniqueSlug))
    .first();

  if (existingSlug) {
    return createUniqueSlug(ctx, name, existingCount + 1);
  }
  return uniqueSlug;
};
