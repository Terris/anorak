import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    ownerId: v.id("users"),
    spendCapInCents: v.optional(v.number()),
    stripeCustomerId: v.optional(v.string()),
  })
    .index("by_slug", ["slug"])
    .index("by_owner_id", ["ownerId"]),
  organizationInvites: defineTable({
    email: v.string(),
    organizationId: v.id("organizations"),
    role: v.string(),
    isClaimed: v.optional(v.boolean()),
  })
    .index("by_organization_id", ["organizationId"])
    .index("by_email", ["email"]),
  organizationUsers: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    onboardingComplete: v.boolean(),
  })
    .index("by_organization_id", ["organizationId"])
    .index("by_user_id", ["userId"])
    .index("by_organization_id_user_id", ["organizationId", "userId"]),
  rooms: defineTable({
    name: v.string(),
  }),
  roomUsers: defineTable({
    roomId: v.id("rooms"),
    userId: v.id("users"),
    status: v.string(),
  })
    .index("by_room_id", ["roomId"])
    .index("by_room_id_user_id", ["roomId", "userId"]),
  users: defineTable({
    name: v.string(),
    email: v.string(),
    tokenIdentifier: v.string(),
    roles: v.optional(v.array(v.string())),
  })
    .index("by_token", ["tokenIdentifier"])
    .index("by_email", ["email"]),
  userWhitelist: defineTable({
    email: v.string(),
  }).index("by_email", ["email"]),
  webhookLogs: defineTable({
    body: v.any(),
    from: v.string(),
  }),
});
