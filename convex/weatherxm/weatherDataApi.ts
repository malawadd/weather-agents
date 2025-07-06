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
      let url = `${WEATHERXM_BASE_URL}/stations/${args.stationId}/latest`;
      const params = new URLSearchParams();
      
      if (args.fromDate) params.append('from', args.fromDate);
      if (args.toDate) params.append('to', args.toDate);
      
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      console.log('Fetching weather data from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: getApiHeaders(),
      });

      console.log('Weather data response status:', response);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Weather Data API Error:', errorText);
        
        // If weather data endpoint doesn't exist, return mock data
        if (response.status === 404) {
          return {
            stationId: args.stationId,
            data: [],
            message: 'Weather data endpoint not available for this station',
            timestamp: new Date().toISOString(),
          };
        }
        
        handleApiError(response);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      
      // Return mock data if API fails
      return {
        stationId: args.stationId,
        data: [],
        message: 'Weather data temporarily unavailable',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});

// Fetch station's current conditions (alternative endpoint)
export const fetchStationCurrentConditions = action({
  args: {
    stationId: v.string(),
  },
  handler: async (ctx, args) => {
    validateApiKey();

    try {
      const url = `${WEATHERXM_BASE_URL}/stations/${args.stationId}/current`;
      
      console.log('Fetching current conditions from:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: getApiHeaders(),
      });

      if (!response.ok) {
        // If current conditions endpoint doesn't exist, return mock data
        if (response.status === 404) {
          return {
            stationId: args.stationId,
            temperature: Math.round(Math.random() * 30 + 10), // 10-40°C
            humidity: Math.round(Math.random() * 40 + 40), // 40-80%
            windSpeed: Math.round(Math.random() * 20), // 0-20 m/s
            windDirection: Math.round(Math.random() * 360), // 0-360°
            pressure: Math.round(Math.random() * 50 + 1000), // 1000-1050 hPa
            timestamp: new Date().toISOString(),
            message: 'Mock data - API endpoint not available',
          };
        }
        
        handleApiError(response);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching current conditions:', error);
      
      // Return mock data if API fails
      return {
        stationId: args.stationId,
        temperature: Math.round(Math.random() * 30 + 10),
        humidity: Math.round(Math.random() * 40 + 40),
        windSpeed: Math.round(Math.random() * 20),
        windDirection: Math.round(Math.random() * 360),
        pressure: Math.round(Math.random() * 50 + 1000),
        timestamp: new Date().toISOString(),
        message: 'Mock data - API temporarily unavailable',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  },
});