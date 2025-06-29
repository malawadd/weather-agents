// WeatherXM API configuration and constants
export const WEATHERXM_API_KEY = "099baba1-aa70-4e9d-8f17-afc63da80585";
export const WEATHERXM_BASE_URL = "https://pro.weatherxm.com/api/v1";

// API key validation helper
export function validateApiKey(): void {
  if (!WEATHERXM_API_KEY) {
    throw new Error('WeatherXM API key is not configured. Please set WEATHERXM_API_KEY environment variable.');
  }
}

// Common headers for WeatherXM API requests
export function getApiHeaders(): Record<string, string> {
  return {
    'Authorization': `Bearer ${WEATHERXM_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

// Error handling for API responses
export function handleApiError(response: Response): never {
  if (response.status === 401) {
    throw new Error('WeatherXM API authentication failed. Please check your API key.');
  } else if (response.status === 404) {
    throw new Error('WeatherXM API endpoint not found. This may indicate an invalid API key or incorrect endpoint URL.');
  } else if (response.status === 403) {
    throw new Error('WeatherXM API access forbidden. Please check your API key permissions.');
  } else if (response.status === 429) {
    throw new Error('WeatherXM API rate limit exceeded. Please try again later.');
  } else {
    throw new Error(`WeatherXM API error: ${response.status} ${response.statusText}`);
  }
}