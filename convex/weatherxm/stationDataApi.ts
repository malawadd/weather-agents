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

// Fetch and store historical station data with date parameter
export const fetchAndStoreHistoryData = action({
  args: {
    stationId: v.string(),
    date: v.string(), // Required - format: YYYY-MM-DD
  },
  handler: async (ctx, args): Promise<any> => {
    validateApiKey();

    try {
      // Validate date format and ensure it's within the last month
      const selectedDate = new Date(args.date);
      const today = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(today.getMonth() - 1);

      if (selectedDate > today) {
        throw new Error('Cannot fetch data for future dates');
      }

      if (selectedDate < oneMonthAgo) {
        throw new Error('Historical data is only available for the last month');
      }

      const url = `${WEATHERXM_BASE_URL}/stations/${args.stationId}/history?date=${args.date}`;
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

      const rawData = await response.json();
      
      // Process the array of observations
      const processedData = processHistoricalObservations(rawData, args.date);
      
      // Store in database
      await ctx.runMutation(internal.weatherxm.stationDataApi.storeHistoryData, {
        stationId: args.stationId,
        data: processedData,
      });

      return processedData;
    } catch (error) {
      console.error('Error fetching history data:', error);
      if (error instanceof Error && error.message.includes('WeatherXM')) {
        throw error;
      }
      throw new Error('Failed to fetch station history data from WeatherXM API');
    }
  },
});

// Process historical observations array into structured data
function processHistoricalObservations(rawData: any[], date: string) {
  if (!Array.isArray(rawData) || rawData.length === 0) {
    return {
      date,
      observations: [],
      health: {
        timestamp: new Date().toISOString(),
        data_quality: { score: 0 },
        location_quality: { score: 0, reason: "NO_DATA" }
      },
      location: { lat: 0, lon: 0 },
      summary: {
        totalObservations: 0,
        validObservations: 0,
        dataQuality: 0
      }
    };
  }

  // Filter out observations with all null values
  const validObservations = rawData.filter(item => {
    const obs = item.observation;
    if (!obs) return false;
    
    // Check if at least one weather parameter has a valid value
    return obs.temperature !== null || 
           obs.humidity !== null || 
           obs.wind_speed !== null || 
           obs.pressure !== null ||
           obs.precipitation_rate !== null ||
           obs.solar_irradiance !== null ||
           obs.uv_index !== null;
  });

  // Sort by timestamp
  validObservations.sort((a, b) => 
    new Date(a.observation.timestamp).getTime() - new Date(b.observation.timestamp).getTime()
  );

  // Take the most recent health and location data
  const latestItem = rawData[rawData.length - 1] || rawData[0];
  
  // Calculate summary statistics
  const summary = calculateDailySummary(validObservations);

  return {
    date,
    observations: validObservations.map(item => filterObservationData(item.observation)),
    health: latestItem?.health || {
      timestamp: new Date().toISOString(),
      data_quality: { score: 0 },
      location_quality: { score: 0, reason: "UNKNOWN" }
    },
    location: latestItem?.location || { lat: 0, lon: 0 },
    summary: {
      totalObservations: rawData.length,
      validObservations: validObservations.length,
      dataQuality: latestItem?.health?.data_quality?.score || 0,
      ...summary
    }
  };
}

// Calculate daily summary statistics
function calculateDailySummary(observations: any[]) {
  if (observations.length === 0) {
    return {
      avgTemperature: null,
      minTemperature: null,
      maxTemperature: null,
      avgHumidity: null,
      avgWindSpeed: null,
      maxWindSpeed: null,
      avgPressure: null,
      totalPrecipitation: null,
      maxUvIndex: null,
      avgSolarIrradiance: null
    };
  }

  const temps = observations.map(o => o.observation.temperature).filter(v => v !== null);
  const humidity = observations.map(o => o.observation.humidity).filter(v => v !== null);
  const windSpeeds = observations.map(o => o.observation.wind_speed).filter(v => v !== null);
  const pressures = observations.map(o => o.observation.pressure).filter(v => v !== null);
  const precipitation = observations.map(o => o.observation.precipitation_rate).filter(v => v !== null);
  const uvIndex = observations.map(o => o.observation.uv_index).filter(v => v !== null);
  const solar = observations.map(o => o.observation.solar_irradiance).filter(v => v !== null);

  return {
    avgTemperature: temps.length > 0 ? temps.reduce((a, b) => a + b, 0) / temps.length : null,
    minTemperature: temps.length > 0 ? Math.min(...temps) : null,
    maxTemperature: temps.length > 0 ? Math.max(...temps) : null,
    avgHumidity: humidity.length > 0 ? humidity.reduce((a, b) => a + b, 0) / humidity.length : null,
    avgWindSpeed: windSpeeds.length > 0 ? windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length : null,
    maxWindSpeed: windSpeeds.length > 0 ? Math.max(...windSpeeds) : null,
    avgPressure: pressures.length > 0 ? pressures.reduce((a, b) => a + b, 0) / pressures.length : null,
    totalPrecipitation: precipitation.length > 0 ? precipitation.reduce((a, b) => a + b, 0) : null,
    maxUvIndex: uvIndex.length > 0 ? Math.max(...uvIndex) : null,
    avgSolarIrradiance: solar.length > 0 ? solar.reduce((a, b) => a + b, 0) / solar.length : null
  };
}

// Helper function to filter observation data to match schema
function filterObservationData(observation: any) {
  if (!observation) return {};
  
  // Only include fields that are expected in the schema and are not null
  const filtered: any = {};
  
  if (observation.timestamp !== undefined) filtered.timestamp = observation.timestamp;
  if (observation.temperature !== null && observation.temperature !== undefined) filtered.temperature = observation.temperature;
  if (observation.humidity !== null && observation.humidity !== undefined) filtered.humidity = observation.humidity;
  if (observation.pressure !== null && observation.pressure !== undefined) filtered.pressure = observation.pressure;
  if (observation.wind_speed !== null && observation.wind_speed !== undefined) filtered.wind_speed = observation.wind_speed;
  if (observation.wind_direction !== null && observation.wind_direction !== undefined) filtered.wind_direction = observation.wind_direction;
  if (observation.wind_gust !== null && observation.wind_gust !== undefined) filtered.wind_gust = observation.wind_gust;
  if (observation.precipitation_rate !== null && observation.precipitation_rate !== undefined) filtered.precipitation_rate = observation.precipitation_rate;
  if (observation.precipitation_accumulated !== null && observation.precipitation_accumulated !== undefined) filtered.precipitation_accumulated = observation.precipitation_accumulated;
  if (observation.solar_irradiance !== null && observation.solar_irradiance !== undefined) filtered.solar_irradiance = observation.solar_irradiance;
  if (observation.uv_index !== null && observation.uv_index !== undefined) filtered.uv_index = observation.uv_index;
  if (observation.dew_point !== null && observation.dew_point !== undefined) filtered.dew_point = observation.dew_point;
  if (observation.feels_like !== null && observation.feels_like !== undefined) filtered.feels_like = observation.feels_like;
  if (observation.icon !== null && observation.icon !== undefined) filtered.icon = observation.icon;

  return filtered;
}

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
      observation: filterObservationData(args.data.observation),
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
      summary: args.data.summary || {},
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

// Get history data from database with optional date filter
export const getHistoryData = query({
  args: {
    stationId: v.string(),
    date: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 30;
    
    if (args.date) {
      // Get data for specific date
      return await ctx.db
        .query("stationHistoryData")
        .withIndex("by_station_and_date", (q) => 
          q.eq("stationId", args.stationId).eq("date", args.date!)
        )
        .unique();
    } else {
      // Get recent history data
      return await ctx.db
        .query("stationHistoryData")
        .withIndex("by_station", (q) => q.eq("stationId", args.stationId))
        .order("desc")
        .take(limit);
    }
  },
});

// Get available dates for a station (last month)
export const getAvailableDates = query({
  args: {
    stationId: v.string(),
  },
  handler: async (ctx, args) => {
    const historyData = await ctx.db
      .query("stationHistoryData")
      .withIndex("by_station", (q) => q.eq("stationId", args.stationId))
      .order("desc")
      .take(31); // Last month

    return historyData.map(data => data.date).sort().reverse();
  },
});