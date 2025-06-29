import { action } from "../_generated/server";
import { v } from "convex/values";
import { validateApiKey, getApiHeaders, handleApiError, WEATHERXM_BASE_URL } from "./config";
import { transformStations } from './stationTransform';
import { applyStationFilters, paginateStations } from './stationFilters';
import { getRegionFromCoordinates } from './regionUtils';

// Fetch all stations from WeatherXM API
export const fetchStations = action({
  args: {
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
    search: v.optional(v.string()),
    region: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    validateApiKey();
    
    try {
      const url = `${WEATHERXM_BASE_URL}/stations`;
      console.log('Fetching stations from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        handleApiError(response);
      }

      const data = await response.json();
      const stations = Array.isArray(data) ? data : [];
      
      // Transform stations
      const transformedStations = transformStations(stations);

      // Apply filters
      const filteredStations = applyStationFilters(transformedStations, {
        search: args.search,
        region: args.region,
      });

      // Apply pagination
      const result = paginateStations(
        filteredStations, 
        args.page || 1, 
        args.limit || 20
      );
      
      console.log(`Filtered ${filteredStations.length} stations, showing ${result.data.length}`);
      
      return result;
    } catch (error) {
      console.error('Error fetching stations:', error);
      if (error instanceof Error && error.message.includes('WeatherXM')) {
        throw error;
      }
      throw new Error('Failed to fetch stations from WeatherXM API');
    }
  },
});