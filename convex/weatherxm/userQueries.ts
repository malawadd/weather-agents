import { query } from "../_generated/server";
import { v } from "convex/values";

// Get user's saved stations
export const getMySavedStations = query({
  args: { sessionId: v.optional(v.id("sessions")) },
  handler: async (ctx, args) => {
    if (!args.sessionId) return [];

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.expiresAt < Date.now()) {
      return [];
    }

    const stations = await ctx.db
      .query("userStations")
      .withIndex("by_user", (q) => q.eq("userId", session.userId))
      .order("desc")
      .collect();

    return stations;
  },
});

// Check if station is saved by user
export const isStationSaved = query({
  args: { 
    sessionId: v.optional(v.id("sessions")),
    stationId: v.string(),
  },
  handler: async (ctx, args) => {
    if (!args.sessionId) return false;

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.expiresAt < Date.now()) {
      return false;
    }

    const station = await ctx.db
      .query("userStations")
      .withIndex("by_user_and_station", (q) => 
        q.eq("userId", session.userId).eq("stationId", args.stationId)
      )
      .unique();

    return !!station;
  },
});