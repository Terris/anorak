import { v } from "convex/values";
import { internalMutation, internalQuery, query } from "./_generated/server";

// SESSIONED USERS ONLY
export const sessionedFindByContextIdentity = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;
    return ctx.db
      .query("users")
      .withIndex("by_token", (q) =>
        q.eq("tokenIdentifier", identity.tokenIdentifier)
      )
      .first();
  },
});

// INTERNAL
export const systemFindById = internalQuery({
  args: { id: v.id("users") },
  handler: async (ctx, { id }) => {
    return ctx.db.get(id);
  },
});

export const systemSaveNewClerkUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    roles: v.optional(v.array(v.string())),
  },
  handler: async (ctx, { clerkId, email, name, roles }) => {
    const tokenIdentifier = `${process.env.CLERK_JWT_ISSUER_DOMAIN}|${clerkId}`;
    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", tokenIdentifier))
      .unique();

    // If we've seen this identity before but the name has changed, patch the value.
    if (user !== null) {
      if (user.name !== name) {
        await ctx.db.patch(user._id, { name });
      }
      return user._id;
    }

    // If it's a new identity, create a new `User`.
    const newUserId = await ctx.db.insert("users", {
      name,
      email,
      tokenIdentifier,
      roles,
    });
    return newUserId;
  },
});
