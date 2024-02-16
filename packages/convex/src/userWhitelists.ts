import { v } from "convex/values";
import { internalQuery } from "./_generated/server";

// PUBLIC FUNCTIONS
export const publicFindByEmail = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    return ctx.db
      .query("userWhitelist")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
  },
});
