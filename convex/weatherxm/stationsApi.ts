import { action } from "../_generated/server";
import { v } from "convex/values";
import { validateApiKey, getApiHeaders, handleApiError, WEATHERXM_BASE_URL } from "./config";

// Fetch all stations from WeatherXM API
export const fetchStations = action({
  args: {
    page: v.optional(v.number()),
    limit: v.optional(v.number()),
    search: v.optional(v.string()),
    country: v.optional(v.string()),
    city: v.optional(v.string()),
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

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        handleApiError(response);
      }

      const data = await response.json();
      console.log('Stations data received:', data ? 'Success' : 'No data');
      
      // Transform the data to match our expected format
      let stations = Array.isArray(data) ? data : [];
      
      // Apply search filter if provided
      if (args.search) {
        const searchTerm = args.search.toLowerCase();
        stations = stations.filter((station: any) => 
          station.name?.toLowerCase().includes(searchTerm) ||
          station.id?.toLowerCase().includes(searchTerm)
        );
      }

      // Apply country filter if provided
      if (args.country) {
        stations = stations.filter((station: any) => 
          station.country?.toLowerCase() === args.country?.toLowerCase()
        );
      }

      // Apply city filter if provided
      if (args.city) {
        stations = stations.filter((station: any) => 
          station.city?.toLowerCase() === args.city?.toLowerCase()
        );
      }

      // Apply pagination
      const page = args.page || 1;
      const limit = args.limit || 20;
      const startIndex = (page - 1) * limit;
      const paginatedStations = stations.slice(startIndex, startIndex + limit);
      
      return {
        data: paginatedStations.map((station: any) => ({
          id: station.id,
          name: station.name || `Station ${station.id}`,
          location: {
            lat: station.lat || 0,
            lon: station.lon || 0,
            address: `${station.lat?.toFixed(4)}, ${station.lon?.toFixed(4)}`,
            elevation: station.elevation,
            cellId: station.cellId,
          },
          isActive: station.lastDayQod > 0.5, // Consider active if QoD > 0.5
          lastActivity: station.createdAt,
          lastDayQod: station.lastDayQod,
          createdAt: station.createdAt,
        })),
        total: stations.length,
        page: page,
        totalPages: Math.ceil(stations.length / limit),
        hasMore: startIndex + limit < stations.length,
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

      const station = await response.json();
      
      // Transform the data to match our expected format
      return {
        id: station.id,
        name: station.name || `Station ${station.id}`,
        location: {
          lat: station.lat || 0,
          lon: station.lon || 0,
          address: `${station.lat?.toFixed(4)}, ${station.lon?.toFixed(4)}`,
          elevation: station.elevation,
          cellId: station.cellId,
        },
        isActive: station.lastDayQod > 0.5,
        lastActivity: station.createdAt,
        lastDayQod: station.lastDayQod,
        createdAt: station.createdAt,
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

// Get unique locations for filtering
export const getStationLocations = action({
  args: {},
  handler: async (ctx) => {
    validateApiKey();
    
    try {
      const url = `${WEATHERXM_BASE_URL}/stations`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        handleApiError(response);
      }

      const data = await response.json();
      const stations = Array.isArray(data) ? data : [];
      
      // Extract unique locations for filtering
      const locations = new Set<string>();
      const countries = new Set<string>();
      const cities = new Set<string>();
      
      stations.forEach((station: any) => {
        if (station.lat && station.lon) {
          // Create location strings for major regions
          const lat = station.lat;
          const lon = station.lon;
          
          // Simple region detection based on coordinates
          let region = 'Unknown';
          if (lat >= 35 && lat <= 71 && lon >= -10 && lon <= 40) {
            region = 'Europe';
          } else if (lat >= 25 && lat <= 49 && lon >= -125 && lon <= -66) {
            region = 'North America';
          } else if (lat >= -35 && lat <= 37 && lon >= -20 && lon <= 55) {
            region = 'Africa';
          } else if (lat >= -50 && lat <= 70 && lon >= 25 && lon <= 180) {
            region = 'Asia';
          } else if (lat >= -47 && lat <= -10 && lon >= 113 && lon <= 154) {
            region = 'Australia';
          }
          
          locations.add(region);
        }
      });
      
      return {
        regions: Array.from(locations).sort(),
        totalStations: stations.length,
      };
    } catch (error) {
      console.error('Error fetching station locations:', error);
      return {
        regions: ['Europe', 'North America', 'Asia', 'Africa', 'Australia'],
        totalStations: 0,
      };
    }
  },
});