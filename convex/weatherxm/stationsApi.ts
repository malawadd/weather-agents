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
    validateApiKey();
    
    try {
      const url = `${WEATHERXM_BASE_URL}/stations`;

      console.log('Fetching stations from:', url);
      console.log('Headers:', getApiHeaders());

      const response = await fetch(url, {
        method: 'GET',
        headers: getApiHeaders(),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        handleApiError(response);
      }

      const data = await response.json();
      console.log('Stations data received:', data ? 'Success' : 'No data');
      
      // Transform the data to match our expected format
      const stations = Array.isArray(data) ? data : (data.data || data.stations || []);
      
      return {
        data: stations.map((station: any) => ({
          id: station.id || station._id || station.stationId,
          name: station.name || `Station ${station.id}`,
          location: {
            lat: station.location?.lat || station.lat || 0,
            lon: station.location?.lon || station.lng || station.lon || 0,
            address: station.location?.address || station.address || 'Unknown Location',
          },
          isActive: station.isActive !== false, // Default to true if not specified
          lastActivity: station.lastActivity || station.last_activity,
        })),
        total: stations.length,
        page: args.page || 1,
      };
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
      const url = `${WEATHERXM_BASE_URL}/stations/${args.stationId}`;
      
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

      const data = await response.json();
      
      // Transform the data to match our expected format
      return {
        id: data.id || data._id || args.stationId,
        name: data.name || `Station ${args.stationId}`,
        location: {
          lat: data.location?.lat || data.lat || 0,
          lon: data.location?.lon || data.lng || data.lon || 0,
          address: data.location?.address || data.address || 'Unknown Location',
        },
        isActive: data.isActive !== false,
        lastActivity: data.lastActivity || data.last_activity,
        ...data, // Include all other fields
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