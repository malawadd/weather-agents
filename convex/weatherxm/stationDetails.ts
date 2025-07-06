import { action } from "../_generated/server";
import { v } from "convex/values";
import { validateApiKey, getApiHeaders, handleApiError, WEATHERXM_BASE_URL } from "./config";
import { transformStation } from './stationTransform';

// Fetch specific station details
export const fetchStationDetails = action({
  args: {
    stationId: v.string(),
  },
  handler: async (ctx, args) => {
    validateApiKey();

    try {
      const url = `${WEATHERXM_BASE_URL}/stations/${args.stationId}/latest`;
      console.log('Fetching station details from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Station Details API Error:', errorText);
        handleApiError(response);
      }

      const station = await response.json();
      console.log('Fetched station details:', station);
      
      // Transform the data to match our expected format
      const transformedStation = transformStation(station);
      
      return {
        ...transformedStation,
        ...station, // Include all other fields
      };
    } catch (error) {
      console.error('Error fetching station details:', error);
      if (error instanceof Error && error.message.includes('WeatherXM')) {
        throw error;
      }
      throw new Error('Failed to fetch station details from WeatherXM API');
    }
  },
});