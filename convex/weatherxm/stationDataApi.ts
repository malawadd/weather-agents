import { action, mutation, query, internalMutation } from "../_generated/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { validateApiKey, getApiHeaders, handleApiError, WEATHERXM_BASE_URL } from "./config";

// Fetch and store latest station data
export const fetchAndStoreLatestData = action({
  args: {
    stationId: v.string(),
  },
  handler: async (ctx, args): Promise<any> => {
    validateApiKey();

    try {
      const url = `${WEATHERXM_BASE_URL}/stations/${args.stationId}/latest`;
      console.log('Fetching latest data from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Latest Data API Error:', errorText);
        handleApiError(response);
      }

      const data = await response.json();
      
      // Store in database
      await ctx.runMutation(internal.weatherxm.stationDataApi.storeLatestData, {
        stationId: args.stationId,
        data: data,
      });

      return data;
    } catch (error) {
      console.error('Error fetching latest data:', error);
      if (error instanceof Error && error.message.includes('WeatherXM')) {
        throw error;
      }
      throw new Error('Failed to fetch latest station data from WeatherXM API');
    }
  },
});

// Fetch and store historical station data
export const fetchAndStoreHistoryData = action({
  args: {
    stationId: v.string(),
    date: v.optional(v.string()),
  },
  handler: async (ctx, args): Promise<any> => {
    validateApiKey();

    try {
      let url = `${WEATHERXM_BASE_URL}/stations/${args.stationId}/history`;
      if (args.date) {
        url += `?date=${args.date}`;
      }
      
      console.log('Fetching history data from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('History Data API Error:', errorText);
        handleApiError(response);
      }

      const data = await response.json();
      
      // Store in database
      await ctx.runMutation(internal.weatherxm.stationDataApi.storeHistoryData, {
        stationId: args.stationId,
        data: data,
      });

      return data;
    } catch (error) {
      console.error('Error fetching history data:', error);
      if (error instanceof Error && error.message.includes('WeatherXM')) {
        throw error;
      }
      throw new Error('Failed to fetch station history data from WeatherXM API');
    }
  },
});

// Store latest data in database
export const storeLatestData = internalMutation({
  args: {
    stationId: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    // Check if record exists
    const existing = await ctx.db
      .query("stationLatestData")
      .withIndex("by_station", (q) => q.eq("stationId", args.stationId))
      .unique();

    const dataToStore = {
      stationId: args.stationId,
      observation: args.data.observation || {},
      health: args.data.health || { 
        timestamp: new Date().toISOString(),
        data_quality: { score: 0 },
        location_quality: { score: 0, reason: "UNKNOWN" }
      },
      location: args.data.location || { lat: 0, lon: 0 },
      lastUpdated: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, dataToStore);
      return existing._id;
    } else {
      return await ctx.db.insert("stationLatestData", dataToStore);
    }
  },
});

// Store history data in database
export const storeHistoryData = internalMutation({
  args: {
    stationId: v.string(),
    data: v.any(),
  },
  handler: async (ctx, args) => {
    const date = args.data.date || new Date().toISOString().split('T')[0];
    
    // Check if record exists for this station and date
    const existing = await ctx.db
      .query("stationHistoryData")
      .withIndex("by_station_and_date", (q) => 
        q.eq("stationId", args.stationId).eq("date", date)
      )
      .unique();

    const dataToStore = {
      stationId: args.stationId,
      date: date,
      health: args.data.health || { 
        timestamp: new Date().toISOString(),
        data_quality: { score: 0 },
        location_quality: { score: 0, reason: "UNKNOWN" }
      },
      observations: args.data.observations || [],
      location: args.data.location || { lat: 0, lon: 0 },
      lastUpdated: Date.now(),
    };

    if (existing) {
      await ctx.db.patch(existing._id, dataToStore);
      return existing._id;
    } else {
      return await ctx.db.insert("stationHistoryData", dataToStore);
    }
  },
});

// Get latest data from database
export const getLatestData = query({
  args: {
    stationId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("stationLatestData")
      .withIndex("by_station", (q) => q.eq("stationId", args.stationId))
      .unique();
  },
});

// Get history data from database
export const getHistoryData = query({
  args: {
    stationId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 30;
    
    return await ctx.db
      .query("stationHistoryData")
      .withIndex("by_station", (q) => q.eq("stationId", args.stationId))
      .order("desc")
      .take(limit);
  },
});