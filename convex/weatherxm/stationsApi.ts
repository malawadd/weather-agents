import { action } from "../_generated/server";
import { v } from "convex/values";
import { validateApiKey, getApiHeaders, handleApiError, WEATHERXM_BASE_URL } from "./config";

// Helper function to determine region from coordinates
function getRegionFromCoordinates(lat: number, lon: number): string {
  // Europe
  if (lat >= 35 && lat <= 71 && lon >= -10 && lon <= 40) {
    return 'Europe';
  }
  // North America
  if (lat >= 25 && lat <= 72 && lon >= -168 && lon <= -52) {
    return 'North America';
  }
  // Asia
  if (lat >= -11 && lat <= 81 && lon >= 25 && lon <= 180) {
    return 'Asia';
  }
  // Africa
  if (lat >= -35 && lat <= 37 && lon >= -20 && lon <= 55) {
    return 'Africa';
  }
  // Australia/Oceania
  if (lat >= -47 && lat <= -10 && lon >= 113 && lon <= 180) {
    return 'Australia';
  }
  // South America
  if (lat >= -56 && lat <= 13 && lon >= -82 && lon <= -34) {
    return 'South America';
  }
  
  return 'Other';
}

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

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        handleApiError(response);
      }

      const data = await response.json();
      console.log('Stations data received:', Array.isArray(data) ? `${data.length} stations` : 'No data');
      
      // Transform and filter the data
      let stations = Array.isArray(data) ? data : [];
      
      // Transform stations first
      const transformedStations = stations.map((station: any) => {
        const lat = station.lat || 0;
        const lon = station.lon || 0;
        const region = getRegionFromCoordinates(lat, lon);
        
        return {
          id: station.id,
          name: station.name || `Station ${station.id}`,
          location: {
            lat,
            lon,
            address: `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
            elevation: station.elevation,
            cellId: station.cellId,
          },
          isActive: (station.lastDayQod || 0) > 0.5,
          lastActivity: station.createdAt,
          lastDayQod: station.lastDayQod,
          createdAt: station.createdAt,
          region: region,
        };
      });

      // Apply filters
      let filteredStations = transformedStations;

      // Apply search filter
      if (args.search) {
        const searchTerm = args.search.toLowerCase();
        filteredStations = filteredStations.filter((station: any) => 
          station.name?.toLowerCase().includes(searchTerm) ||
          station.id?.toLowerCase().includes(searchTerm)
        );
      }

      // Apply region filter
      if (args.region && args.region !== 'All') {
        filteredStations = filteredStations.filter((station: any) => 
          station.region === args.region
        );
      }

      // Apply pagination
      const page = args.page || 1;
      const limit = args.limit || 20;
      const startIndex = (page - 1) * limit;
      const paginatedStations = filteredStations.slice(startIndex, startIndex + limit);
      
      console.log(`Filtered ${filteredStations.length} stations, showing ${paginatedStations.length} on page ${page}`);
      
      return {
        data: paginatedStations,
        total: filteredStations.length,
        page: page,
        totalPages: Math.ceil(filteredStations.length / limit),
        hasMore: startIndex + limit < filteredStations.length,
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
      const lat = station.lat || 0;
      const lon = station.lon || 0;
      
      return {
        id: station.id,
        name: station.name || `Station ${station.id}`,
        location: {
          lat,
          lon,
          address: `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
          elevation: station.elevation,
          cellId: station.cellId,
        },
        isActive: (station.lastDayQod || 0) > 0.5,
        lastActivity: station.createdAt,
        lastDayQod: station.lastDayQod,
        createdAt: station.createdAt,
        region: getRegionFromCoordinates(lat, lon),
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

// Get available regions from all stations
export const getAvailableRegions = action({
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
      
      // Get unique regions from all stations
      const regions = new Set<string>();
      let regionCounts: Record<string, number> = {};
      
      stations.forEach((station: any) => {
        if (station.lat && station.lon) {
          const region = getRegionFromCoordinates(station.lat, station.lon);
          regions.add(region);
          regionCounts[region] = (regionCounts[region] || 0) + 1;
        }
      });
      
      // Sort regions by station count (descending)
      const sortedRegions = Array.from(regions).sort((a, b) => 
        (regionCounts[b] || 0) - (regionCounts[a] || 0)
      );
      
      return {
        regions: sortedRegions,
        regionCounts,
        totalStations: stations.length,
      };
    } catch (error) {
      console.error('Error fetching regions:', error);
      // Return default regions if API fails
      return {
        regions: ['Europe', 'North America', 'Asia', 'Africa', 'Australia', 'South America'],
        regionCounts: {},
        totalStations: 0,
      };
    }
  },
});