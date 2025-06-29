import { action } from "../_generated/server";
import { validateApiKey, getApiHeaders, handleApiError, WEATHERXM_BASE_URL } from "./config";
import { transformStations } from './stationTransform';

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
      
      // Transform stations to get regions and countries
      const transformedStations = transformStations(stations);
      
      // Get unique regions and countries
      const regions = new Set<string>();
      const countries = new Set<string>();
      let regionCounts: Record<string, number> = {};
      let countryCounts: Record<string, number> = {};
      
      transformedStations.forEach((station) => {
        regions.add(station.region);
        countries.add(station.country);
        regionCounts[station.region] = (regionCounts[station.region] || 0) + 1;
        countryCounts[station.country] = (countryCounts[station.country] || 0) + 1;
      });
      
      // Sort by station count (descending)
      const sortedRegions = Array.from(regions).sort((a, b) => 
        (regionCounts[b] || 0) - (regionCounts[a] || 0)
      );
      
      const sortedCountries = Array.from(countries)
        .filter(country => country !== 'Unknown')
        .sort((a, b) => (countryCounts[b] || 0) - (countryCounts[a] || 0));
      
      return {
        regions: sortedRegions,
        countries: sortedCountries,
        regionCounts,
        countryCounts,
        totalStations: stations.length,
      };
    } catch (error) {
      console.error('Error fetching regions:', error);
      // Return default regions if API fails
      return {
        regions: ['Europe', 'North America', 'Asia', 'Africa', 'Australia', 'South America'],
        countries: ['Germany', 'France', 'United States', 'Canada', 'United Kingdom'],
        regionCounts: {},
        countryCounts: {},
        totalStations: 0,
      };
    }
  },
});