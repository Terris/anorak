import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

// INTERNAL FUNCTIONS
export const systemLogWebhook = internalMutation({
  args: { from: v.string(), body: v.any() },
  handler: async (ctx, { from, body }) => {
    await ctx.db.insert("webhookLogs", { from, body });
  },
});
