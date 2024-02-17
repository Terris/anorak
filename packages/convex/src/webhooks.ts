import { v } from "convex/values";
import { internalMutation } from "./_generated/server";

// INTERNAL FUNCTIONS
// ==================================================

/**
 * Log a webhook event.
 * @param from - The source of the webhook.
 * @param body - The body of the webhook.
 */
export const systemLogWebhook = internalMutation({
  args: { from: v.string(), body: v.any() },
  handler: async (ctx, { from, body }) => {
    // eslint-disable-next-line -- we want to allot=w body to be any data type
    await ctx.db.insert("webhookLogs", { from, body });
  },
});
