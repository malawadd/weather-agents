import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Helper query to get session
export const getSession = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.expiresAt < Date.now()) {
      return null;
    }
    return session;
  },
});

// Chat with AI about a specific weather station
export const chatWithStationAI = action({
  args: {
    sessionId: v.id("sessions"),
    stationId: v.string(),
    userMessage: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate session using a query
    const session = await ctx.runQuery(api.aiChat.getSession, { sessionId: args.sessionId });
    if (!session) {
      throw new Error("Invalid or expired session");
    }

    try {
      // Try to fetch station details and weather data
      let stationDetails: any = null;
      let weatherData: any = null;

      try {
        stationDetails = await ctx.runAction(api.weatherxm.stationDetails.fetchStationDetails, { 
          stationId: args.stationId 
        });
      } catch (error) {
        console.warn('Could not fetch station details:', error);
        // Continue without station details
      }

      try {
        weatherData = await ctx.runQuery(api.weatherxm.stationDataApi.getLatestData, { 
          stationId: args.stationId 
        });
      } catch (error) {
        console.warn('Could not fetch weather data:', error);
        // Continue without weather data
      }

      // Prepare context for AI
      const weatherContext = {
        station: stationDetails || { id: args.stationId, name: `Station ${args.stationId}` },
        weatherData: weatherData || null,
        timestamp: new Date().toISOString(),
      };

      // Generate AI response based on available data
      const aiResponse = await generateMockAIResponse(args.userMessage, weatherContext);

      // Save chat history
      await ctx.runMutation(api.aiChat.saveChatHistory, {
        sessionId: args.sessionId,
        stationId: args.stationId,
        userMessage: args.userMessage,
        aiResponse,
        weatherData: weatherContext,
      });

      return aiResponse;
    } catch (error) {
      console.error('Error in AI chat:', error);
      throw new Error('Failed to process AI chat request');
    }
  },
});

// Save chat history
export const saveChatHistory = mutation({
  args: {
    sessionId: v.id("sessions"),
    stationId: v.string(),
    userMessage: v.string(),
    aiResponse: v.string(),
    weatherData: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Invalid or expired session");
    }

    const chatId = await ctx.db.insert("weatherChatHistory", {
      userId: session.userId,
      stationId: args.stationId,
      userMessage: args.userMessage,
      aiResponse: args.aiResponse,
      timestamp: Date.now(),
      weatherData: args.weatherData,
    });

    return chatId;
  },
});

// Get chat history for a station
export const getChatHistory = query({
  args: {
    sessionId: v.optional(v.id("sessions")),
    stationId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (!args.sessionId) return [];

    const session = await ctx.db.get(args.sessionId);
    if (!session || session.expiresAt < Date.now()) {
      return [];
    }

    const limit = args.limit || 50;
    const chatHistory = await ctx.db
      .query("weatherChatHistory")
      .withIndex("by_user_and_station", (q) => 
        q.eq("userId", session.userId).eq("stationId", args.stationId)
      )
      .order("desc")
      .take(limit);

    return chatHistory.reverse(); // Return in chronological order
  },
});

// Mock AI response generator (replace with real AI integration)
async function generateMockAIResponse(userMessage: string, weatherContext: any): Promise<string> {
  const message = userMessage.toLowerCase();
  const station = weatherContext.station;
  const weather = weatherContext.weatherData;

  // Simple pattern matching for demo
  if (message.includes('temperature') || message.includes('temp')) {
    if (weather?.observation?.temperature) {
      return `The current temperature at ${station?.name || 'this station'} is ${weather.observation.temperature}°C. ${weather.observation.feels_like ? `It feels like ${weather.observation.feels_like}°C.` : ''} This data was last updated at ${new Date(weather.observation.timestamp).toLocaleString()}.`;
    }
    return `I don't have current temperature data for ${station?.name || 'this station'}. Try syncing the station data to get the latest readings.`;
  }
  
  if (message.includes('humidity')) {
    if (weather?.observation?.humidity) {
      return `The humidity at ${station?.name || 'this station'} is currently ${weather.observation.humidity}%. This indicates ${weather.observation.humidity > 70 ? 'high humidity conditions' : weather.observation.humidity > 40 ? 'moderate humidity levels' : 'low humidity conditions'}.`;
    }
    return `I don't have current humidity data for ${station?.name || 'this station'}. The station may need to sync its latest readings.`;
  }
  
  if (message.includes('wind')) {
    if (weather?.observation?.wind_speed) {
      return `Wind conditions at ${station?.name || 'this station'}: ${weather.observation.wind_speed} m/s${weather.observation.wind_direction ? ` from ${weather.observation.wind_direction}°` : ''}. ${weather.observation.wind_gust ? `Wind gusts up to ${weather.observation.wind_gust} m/s.` : ''}`;
    }
    return `I don't have current wind data for ${station?.name || 'this station'}. Try syncing the station to get updated wind measurements.`;
  }
  
  if (message.includes('rain') || message.includes('precipitation')) {
    if (weather?.observation?.precipitation_rate !== undefined) {
      return `Precipitation at ${station?.name || 'this station'}: ${weather.observation.precipitation_rate > 0 ? `Currently ${weather.observation.precipitation_rate} mm/h` : 'No active precipitation'}. ${weather.observation.precipitation_accumulated ? `Total accumulated: ${weather.observation.precipitation_accumulated} mm.` : ''}`;
    }
    return `I don't have current precipitation data for ${station?.name || 'this station'}. Sync the station data to check for rainfall information.`;
  }

  if (message.includes('pressure')) {
    if (weather?.observation?.pressure) {
      return `Atmospheric pressure at ${station?.name || 'this station'} is ${weather.observation.pressure} hPa. ${weather.observation.pressure > 1020 ? 'This indicates high pressure conditions.' : weather.observation.pressure < 1000 ? 'This indicates low pressure conditions.' : 'This is within normal pressure range.'}`;
    }
    return `I don't have current pressure data for ${station?.name || 'this station'}. Try syncing to get the latest atmospheric pressure readings.`;
  }

  if (message.includes('health') || message.includes('quality')) {
    if (weather?.health) {
      const dataQuality = (weather.health.data_quality.score * 100).toFixed(1);
      const locationQuality = (weather.health.location_quality.score * 100).toFixed(1);
      return `Station health for ${station?.name || 'this station'}: Data quality is ${dataQuality}% and location quality is ${locationQuality}%. ${weather.health.location_quality.reason ? `Location status: ${weather.health.location_quality.reason}.` : ''}`;
    }
    return `I don't have health data for ${station?.name || 'this station'}. Sync the station to check its operational status.`;
  }

  // Default response
  if (weather?.observation) {
    return `I have weather data for ${station?.name || 'this station'}. The station is monitoring temperature, humidity, wind, and other conditions. What specific weather information would you like to know about?`;
  } else {
    return `I'm ready to help you analyze weather data from ${station?.name || 'this station'}. However, I don't have current weather readings. Try syncing the station data first, then ask me about specific conditions like temperature, humidity, wind, or precipitation.`;
  }
}