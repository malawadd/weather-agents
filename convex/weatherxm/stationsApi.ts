import { action } from "../_generated/server";
import { v } from "convex/values";
import { validateApiKey, getApiHeaders, handleApiError, WEATHERXM_BASE_URL } from "./config";

// Fetch all stations from WeatherXM API
export const fetchStations = action({
  args: {
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { page = 1, limit = 50, search } = args;
    
    validateApiKey();
    
    try {
      let url = `${WEATHERXM_BASE_URL}/stations?page=${page}&limit=${limit}`;
      if (search) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const response = await fetch(url, {
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        handleApiError(response);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching stations:', error);
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
    validateApiKey();

    try {
      const response = await fetch(`${WEATHERXM_BASE_URL}/stations/${args.stationId}`, {
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        handleApiError(response);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching station details:', error);
      if (error instanceof Error && error.message.includes('WeatherXM')) {
        throw error;
      }
      throw new Error('Failed to fetch station details from WeatherXM API');
    }
  },
});