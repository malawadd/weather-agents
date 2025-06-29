import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get API key from environment variable
const WEATHERXM_API_KEY = process.env.WEATHERXM_API_KEY;
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
    
    // Check if API key is configured
    if (!WEATHERXM_API_KEY) {
      throw new Error('WeatherXM API key is not configured. Please set WEATHERXM_API_KEY environment variable.');
    }
    
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
        // Provide more specific error messages based on status code
        if (response.status === 401) {
          throw new Error('WeatherXM API authentication failed. Please check your API key.');
        } else if (response.status === 404) {
          throw new Error('WeatherXM API endpoint not found. This may indicate an invalid API key or incorrect endpoint URL.');
        } else if (response.status === 403) {
          throw new Error('WeatherXM API access forbidden. Please check your API key permissions.');
        } else if (response.status === 429) {
          throw new Error('WeatherXM API rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`WeatherXM API error: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching stations:', error);
      // Re-throw the error with the original message if it's already a descriptive error
      if (error instanceof Error && error.message.includes('WeatherXM')) {
        throw error;
      }
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
    // Check if API key is configured
    if (!WEATHERXM_API_KEY) {
      throw new Error('WeatherXM API key is not configured. Please set WEATHERXM_API_KEY environment variable.');
    }

    try {
      const response = await fetch(`${WEATHERXM_BASE_URL}/stations/${args.stationId}`, {
        headers: {
          'Authorization': `Bearer ${WEATHERXM_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Provide more specific error messages based on status code
        if (response.status === 401) {
          throw new Error('WeatherXM API authentication failed. Please check your API key.');
        } else if (response.status === 404) {
          throw new Error('Station not found or WeatherXM API endpoint not accessible. Please check your API key.');
        } else if (response.status === 403) {
          throw new Error('WeatherXM API access forbidden. Please check your API key permissions.');
        } else if (response.status === 429) {
          throw new Error('WeatherXM API rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`WeatherXM API error: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching station details:', error);
      // Re-throw the error with the original message if it's already a descriptive error
      if (error instanceof Error && error.message.includes('WeatherXM')) {
        throw error;
      }
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
    // Check if API key is configured
    if (!WEATHERXM_API_KEY) {
      throw new Error('WeatherXM API key is not configured. Please set WEATHERXM_API_KEY environment variable.');
    }

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
        // Provide more specific error messages based on status code
        if (response.status === 401) {
          throw new Error('WeatherXM API authentication failed. Please check your API key.');
        } else if (response.status === 404) {
          throw new Error('Weather data not found or WeatherXM API endpoint not accessible. Please check your API key.');
        } else if (response.status === 403) {
          throw new Error('WeatherXM API access forbidden. Please check your API key permissions.');
        } else if (response.status === 429) {
          throw new Error('WeatherXM API rate limit exceeded. Please try again later.');
        } else {
          throw new Error(`WeatherXM API error: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Re-throw the error with the original message if it's already a descriptive error
      if (error instanceof Error && error.message.includes('WeatherXM')) {
        throw error;
      }
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