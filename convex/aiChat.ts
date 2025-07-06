import { action, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

interface ChatMessage {
  userMessage: string;
  aiResponse: string;
}

interface WeatherContext {
  station: {
    id: string;
    name: string;
    [key: string]: unknown;
  };
  weatherData: unknown;
  timestamp: string;
}

interface Session {
  userId: string;
  expiresAt: number;
}

interface ChatHistoryEntry {
  userId: string;
  stationId: string;
  userMessage: string;
  aiResponse: string;
  timestamp: number;
  weatherData?: WeatherContext;
}

// Helper query to get session
export const getSession = query({
  args: { sessionId: v.id("sessions") },
  handler: async (ctx, args): Promise<Session | null> => {
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.expiresAt < Date.now()) {
      return null;
    }
    return session as Session;
  },
});

// Chat with AI about a specific weather station
export const chatWithStationAI = action({
  args: {
    sessionId: v.id("sessions"),
    stationId: v.string(),
    userMessage: v.string(),
  },
  handler: async (ctx, args): Promise<string> => {
    // Validate session using a query
    const session = await ctx.runQuery(api.aiChat.getSession, { sessionId: args.sessionId });
    if (!session) {
      throw new Error("Invalid or expired session");
    }

    try {
      // Try to fetch station details and weather data
      let stationDetails = null;
      let weatherData = null;

      try {
        stationDetails = await ctx.runAction(api.weatherxm.stationDetails.fetchStationDetails, { 
          stationId: args.stationId 
        });
      } catch (error) {
        console.warn('Could not fetch station details:', error);
      }

      try {
        // Using fetchStationWeatherData instead of fetchStationCurrentConditions
        weatherData = await ctx.runAction(api.weatherxm.weatherDataApi.fetchStationWeatherData, { 
          stationId: args.stationId 
        });
      } catch (error) {
        console.warn('Could not fetch weather data:', error);
      }

      // Get recent chat history for context
      const chatHistory = await ctx.runQuery(api.aiChat.getChatHistory, {
        sessionId: args.sessionId,
        stationId: args.stationId,
        limit: 10
      });

      // Convert chat history to OpenAI format
      const formattedHistory = chatHistory.flatMap((chat: ChatMessage) => [
        { role: "user" as const, content: chat.userMessage },
        { role: "assistant" as const, content: chat.aiResponse }
      ]);

      // Prepare context for AI
      const weatherContext: WeatherContext = {
        station: stationDetails || { id: args.stationId, name: `Station ${args.stationId}` },
        weatherData: weatherData || null,
        timestamp: new Date().toISOString(),
      };

      // Generate AI response using OpenAI
      const aiResponse: string = await ctx.runAction(api.openaiService.generateWeatherResponse, {
        userMessage: args.userMessage,
        stationData: weatherContext.station,
        weatherData: weatherContext.weatherData,
        chatHistory: formattedHistory,
      });

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
  handler: async (ctx, args): Promise<Id<"weatherChatHistory">> => {
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Invalid or expired session");
    }

    return await ctx.db.insert("weatherChatHistory", {
      userId: session.userId,
      stationId: args.stationId,
      userMessage: args.userMessage,
      aiResponse: args.aiResponse,
      timestamp: Date.now(),
      weatherData: args.weatherData,
    });
  },
});

// Get chat history for a station
export const getChatHistory = query({
  args: {
    sessionId: v.optional(v.id("sessions")),
    stationId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args): Promise<ChatHistoryEntry[]> => {
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



