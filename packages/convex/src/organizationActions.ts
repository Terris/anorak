"use node";

import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { stripe } from "./lib/stripe";
import { internal } from "./_generated/api";

// SYSTEM FUNCTIONS
// ==================================================

/**
 * Create a Stripe customer for an organization.
 * @param organizationId - The ID of the organization.
 */
export const systemCreateOrganizationStripeCustomer = internalAction({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, { organizationId }) => {
    const organization = await ctx.runQuery(
      internal.organizations.systemGetOrganizationById,
      { id: organizationId }
    );
    if (!organization) throw new Error("Organization not found");

    const organizationOwnerUser = await ctx.runQuery(
      internal.users.systemFindById,
      {
        id: organization.ownerId,
      }
    );
    if (!organizationOwnerUser) throw new Error("Organization owner not found");

    const stripeCustomer = await stripe.customers.create({
      name: organization.name,
      email: organizationOwnerUser.email,
      metadata: {
        type: "organization",
        organizationId: organizationId,
      },
    });

    await ctx.runMutation(internal.organizations.systemUpdateById, {
      id: organizationId,
      stripeCustomerId: stripeCustomer.id,
    });
  },
});
