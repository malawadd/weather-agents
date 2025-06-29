import { action } from "../_generated/server";
import { v } from "convex/values";
import { validateApiKey, getApiHeaders, handleApiError, WEATHERXM_BASE_URL } from "./config";

// Fetch station's latest weather data
export const fetchStationWeatherData = action({
  args: {
    stationId: v.string(),
    fromDate: v.optional(v.string()),
    toDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    validateApiKey();

    try {
      let url = `${WEATHERXM_BASE_URL}/stations/${args.stationId}/data`;
      const params = new URLSearchParams();
      
      if (args.fromDate) params.append('from', args.fromDate);
      if (args.toDate) params.append('to', args.toDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
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
      console.error('Error fetching weather data:', error);
      if (error instanceof Error && error.message.includes('WeatherXM')) {
        throw error;
      }
      throw new Error('Failed to fetch weather data from WeatherXM API');
    }
  },
});