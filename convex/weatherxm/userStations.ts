import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// Add station to user's saved stations
export const addStationToMyStations = mutation({
  args: {
    sessionId: v.id("sessions"),
    stationId: v.string(),
    customName: v.optional(v.string()),
    stationData: v.optional(v.object({
      name: v.optional(v.string()),
      location: v.optional(v.object({
        lat: v.number(),
        lon: v.number(),
      })),
      address: v.optional(v.string()),
      isActive: v.optional(v.boolean()),
    })),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Invalid or expired session");
    }

    // Check if station is already saved
    const existingStation = await ctx.db
      .query("userStations")
      .withIndex("by_user_and_station", (q) => 
        q.eq("userId", session.userId).eq("stationId", args.stationId)
      )
      .unique();

    if (existingStation) {
      throw new Error("Station is already in your saved stations");
    }

    const stationId = await ctx.db.insert("userStations", {
      userId: session.userId,
      stationId: args.stationId,
      customName: args.customName,
      addedAt: Date.now(),
      stationData: args.stationData,
    });

    return stationId;
  },
});

// Remove station from user's saved stations
export const removeStationFromMyStations = mutation({
  args: {
    sessionId: v.id("sessions"),
    stationId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Invalid or expired session");
    }

    const station = await ctx.db
      .query("userStations")
      .withIndex("by_user_and_station", (q) => 
        q.eq("userId", session.userId).eq("stationId", args.stationId)
      )
      .unique();

    if (!station) {
      throw new Error("Station not found in your saved stations");
    }

    await ctx.db.delete(station._id);
    return true;
  },
});