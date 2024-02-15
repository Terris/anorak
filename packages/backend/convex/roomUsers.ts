import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { validateIdentity } from "./lib/authorization";
import { asyncMap } from "convex-helpers";

const ROOM_USER_STATUS = {
  CONNECTED: "connected",
  DISCONNECTED: "disconnected",
};

// SESSIONED USERS ONLY

export const sessionedFindAllByRoomId = query({
  args: { roomId: v.id("rooms") },
  handler: async (ctx, { roomId }) => {
    await validateIdentity(ctx);
    const allRoomUsers = await ctx.db
      .query("roomUsers")
      .withIndex("by_room_id", (q) => q.eq("roomId", roomId))
      .collect();
    return await asyncMap(allRoomUsers, async (roomUser) => {
      const user = await ctx.db.get(roomUser.userId);
      return { ...roomUser, user };
    });
  },
});

export const sessionedCreateAndJoinUserByRoomId = mutation({
  args: { roomId: v.id("rooms"), userId: v.id("users") },
  handler: async (ctx, { roomId, userId }) => {
    await validateIdentity(ctx);
    const existingRoom = await ctx.db.get(roomId);
    if (!existingRoom) throw new ConvexError("Room not found");
    const existingRoomUser = await ctx.db
      .query("roomUsers")
      .withIndex("by_room_id_user_id", (q) =>
        q.eq("roomId", roomId).eq("userId", userId)
      )
      .first();
    if (existingRoomUser) {
      return await ctx.db.patch(existingRoomUser._id, {
        status: ROOM_USER_STATUS.CONNECTED,
      });
    }
    return ctx.db.insert("roomUsers", {
      roomId,
      userId,
      status: ROOM_USER_STATUS.CONNECTED,
    });
  },
});

export const sessionedConnectUserByRoomId = mutation({
  args: { roomId: v.id("rooms"), userId: v.id("users") },
  handler: async (ctx, { roomId, userId }) => {
    await validateIdentity(ctx);
    const existingRoom = await ctx.db.get(roomId);
    if (!existingRoom) throw new ConvexError("Room not found");
    const existingRoomUser = await ctx.db
      .query("roomUsers")
      .withIndex("by_room_id_user_id", (q) =>
        q.eq("roomId", roomId).eq("userId", userId)
      )
      .first();
    if (!existingRoomUser) throw new ConvexError("User not found in room");
    return await ctx.db.patch(existingRoomUser._id, {
      status: ROOM_USER_STATUS.CONNECTED,
    });
  },
});

export const sessionedDisconnectUserByRoomId = mutation({
  args: { roomId: v.id("rooms"), userId: v.id("users") },
  handler: async (ctx, { roomId, userId }) => {
    await validateIdentity(ctx);
    const existingRoom = await ctx.db.get(roomId);
    if (!existingRoom) throw new ConvexError("Room not found");
    const existingRoomUser = await ctx.db
      .query("roomUsers")
      .withIndex("by_room_id_user_id", (q) =>
        q.eq("roomId", roomId).eq("userId", userId)
      )
      .first();
    if (!existingRoomUser) throw new ConvexError("User not found in room");
    return await ctx.db.patch(existingRoomUser._id, {
      status: ROOM_USER_STATUS.DISCONNECTED,
    });
  },
});
