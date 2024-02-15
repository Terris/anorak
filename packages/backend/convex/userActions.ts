"use node";

import { Webhook } from "svix";
import type { WebhookEvent } from "@clerk/clerk-sdk-node";
import { ConvexError, v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";

// INTERNAL

export const internalHandleClerkWebhook = internalAction({
  args: {
    signature: v.object({
      svixId: v.union(v.string(), v.null()),
      svixTimestamp: v.union(v.string(), v.null()),
      svixSignature: v.union(v.string(), v.null()),
    }),
    requestString: v.string(),
  },
  handler: async (ctx, { signature, requestString }) => {
    const clerkWebhookSecret = process.env.CLERK_WEBHOOK_SECRET!;
    const body = requestString;

    try {
      if (
        !signature.svixId ||
        !signature.svixTimestamp ||
        !signature.svixSignature
      ) {
        throw new ConvexError("Error occured -- no svix headers");
      }

      // Clerk uses svix to sign webhooks
      // Create a new Svix instance with clerk webhook secret.
      const wh = new Webhook(clerkWebhookSecret);
      const event: WebhookEvent = wh.verify(body, {
        "svix-id": signature.svixId,
        "svix-timestamp": signature.svixTimestamp,
        "svix-signature": signature.svixSignature,
      }) as WebhookEvent;

      // Handle the event
      switch (event.type) {
        case "user.created":
          {
            const eventData = event.data;
            const email = eventData.email_addresses[0]?.email_address;
            const name = `${eventData.first_name} ${eventData.last_name}`;

            // Check for whitelisted user email
            const emailIsWhitelisted = await ctx.runQuery(
              internal.userWhitelists.publicFindByEmail,
              {
                email,
              }
            );

            // Create db user
            await ctx.runMutation(internal.users.systemSaveNewClerkUser, {
              clerkId: eventData.id,
              email,
              name,
              roles: emailIsWhitelisted ? ["user"] : [],
            });
          }
          break;
        default:
          null;
      }

      await ctx.runMutation(internal.webhooks.systemLogWebhook, {
        from: "clerk",
        body: event,
      });

      return { success: true };
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown";
      return { success: false, error: errorMessage };
    }
  },
});
