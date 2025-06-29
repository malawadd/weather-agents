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
      // Fetch station details and weather data
      const [stationDetails, weatherData] = await Promise.all([
        ctx.runAction(api.weatherxmApi.fetchStationDetails, { stationId: args.stationId }),
        ctx.runAction(api.weatherxmApi.fetchStationWeatherData, { stationId: args.stationId }),
      ]);

      // Prepare context for AI
      const weatherContext = {
        station: stationDetails,
        weatherData: weatherData,
        timestamp: new Date().toISOString(),
      };

      // Create AI prompt
      const systemPrompt = `You are a helpful weather assistant with access to real-time weather data from WeatherXM stations. 
      You can analyze weather patterns, provide insights, and answer questions about weather conditions.
      
      Current station data:
      Station: ${stationDetails?.name || 'Unknown Station'}
      Location: ${stationDetails?.location?.address || 'Unknown Location'}
      
      Latest weather data: ${JSON.stringify(weatherData, null, 2)}
      
      Please provide helpful, accurate responses based on this data. If the user asks about trends or comparisons, 
      use the available historical data. Be conversational and informative.`;

      const userPrompt = `User question: ${args.userMessage}`;

      // For demo purposes, we'll create a mock AI response
      // In production, you would integrate with OpenAI, Anthropic, or another AI service
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
    return `Based on the latest data from ${station?.name || 'this station'}, the current temperature readings show interesting patterns. The weather station is actively monitoring conditions and providing real-time updates. Would you like me to analyze any specific temperature trends or compare with historical data?`;
  }
  
  if (message.includes('humidity')) {
    return `The humidity levels at ${station?.name || 'this station'} are being tracked continuously. Weather stations like this one provide valuable insights into local atmospheric conditions. I can help you understand humidity patterns and their implications for local weather.`;
  }
  
  if (message.includes('wind')) {
    return `Wind conditions at ${station?.name || 'this station'} are part of the comprehensive weather monitoring system. The station tracks wind speed, direction, and patterns that are crucial for understanding local weather dynamics.`;
  }
  
  if (message.includes('rain') || message.includes('precipitation')) {
    return `Precipitation data from ${station?.name || 'this station'} helps track rainfall patterns and water cycle dynamics in this area. This information is valuable for agriculture, urban planning, and weather forecasting.`;
  }

  // Default response
  return `I'm analyzing the weather data from ${station?.name || 'this station'}. The station is providing valuable meteorological information including temperature, humidity, wind, and precipitation data. What specific aspect of the weather conditions would you like me to help you understand better?`;
}