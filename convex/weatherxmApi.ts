import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";

const WEATHERXM_API_KEY = "099baba1-aa70-4e9d-8f17-afc63da80585";
const WEATHERXM_BASE_URL = "https://api.weatherxm.com/api/v1";

// Fetch all stations from WeatherXM API
export const fetchStations = action({
  args: {
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { page = 1, limit = 50, search } = args;
    
    try {
      let url = `${WEATHERXM_BASE_URL}/stations?page=${page}&limit=${limit}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${WEATHERXM_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`WeatherXM API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching stations:', error);
      throw new Error('Failed to fetch stations from WeatherXM API');
    }
  },
});

// Fetch specific station details
export const fetchStationDetails = action({
  args: {
    stationId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const response = await fetch(`${WEATHERXM_BASE_URL}/stations/${args.stationId}`, {
        headers: {
          'Authorization': `Bearer ${WEATHERXM_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`WeatherXM API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching station details:', error);
      throw new Error('Failed to fetch station details from WeatherXM API');
    }
  },
});

// Fetch station's latest weather data
export const fetchStationWeatherData = action({
  args: {
    stationId: v.string(),
    fromDate: v.optional(v.string()),
    toDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      let url = `${WEATHERXM_BASE_URL}/stations/${args.stationId}/data`;
      const params = new URLSearchParams();
      
      if (args.fromDate) params.append('from', args.fromDate);
      if (args.toDate) params.append('to', args.toDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${WEATHERXM_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`WeatherXM API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Failed to fetch weather data from WeatherXM API');
    }
  },
});

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