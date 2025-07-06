"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateWeatherResponse = action({
  args: {
    userMessage: v.string(),
    stationData: v.any(),
    weatherData: v.any(),
    chatHistory: v.optional(v.array(v.object({
      role: v.union(v.literal("user"), v.literal("assistant")),
      content: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    try {
      // Prepare the system prompt with weather context
      const systemPrompt = createSystemPrompt(args.stationData, args.weatherData);
      
      // Prepare messages array
      const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
        { role: "system", content: systemPrompt }
      ];

      // Add chat history if provided (last 10 messages to stay within token limits)
      if (args.chatHistory && args.chatHistory.length > 0) {
        const recentHistory = args.chatHistory.slice(-10);
        messages.push(...recentHistory.map(msg => ({
          role: msg.role as "user" | "assistant",
          content: msg.content
        })));
      }

      // Add current user message
      messages.push({ role: "user", content: args.userMessage });

      // Call OpenAI API
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const response = completion.choices[0]?.message?.content;
      
      if (!response) {
        throw new Error("No response generated from OpenAI");
      }

      return response;
    } catch (error: any) {
      console.error("OpenAI API error:", error);
      
      // Provide fallback response
      if (error.code === 'insufficient_quota') {
        return "I'm currently experiencing high demand. Please try again in a moment, or check the weather data directly in the station details.";
      } else if (error.code === 'rate_limit_exceeded') {
        return "I'm processing many requests right now. Please wait a moment before asking another question.";
      } else {
        return "I'm having trouble connecting to my AI services right now. You can still view the raw weather data in the station details panel.";
      }
    }
  },
});

function createSystemPrompt(stationData: any, weatherData: any): string {
  const stationName = stationData?.name || stationData?.id || "this weather station";
  const location = stationData?.location || stationData?.address || "Unknown location";
  
  let weatherInfo = "No current weather data available.";
  
  if (weatherData?.observation) {
    const obs = weatherData.observation;
    const parts = [];
    
    if (obs.temperature !== null && obs.temperature !== undefined) {
      parts.push(`Temperature: ${obs.temperature}°C`);
      if (obs.feels_like) parts.push(`(feels like ${obs.feels_like}°C)`);
    }
    
    if (obs.humidity !== null && obs.humidity !== undefined) {
      parts.push(`Humidity: ${obs.humidity}%`);
    }
    
    if (obs.wind_speed !== null && obs.wind_speed !== undefined) {
      parts.push(`Wind: ${obs.wind_speed} m/s`);
      if (obs.wind_direction) parts.push(`from ${obs.wind_direction}°`);
      if (obs.wind_gust) parts.push(`(gusts up to ${obs.wind_gust} m/s)`);
    }
    
    if (obs.pressure !== null && obs.pressure !== undefined) {
      parts.push(`Pressure: ${obs.pressure} hPa`);
    }
    
    if (obs.precipitation_rate !== null && obs.precipitation_rate !== undefined) {
      if (obs.precipitation_rate > 0) {
        parts.push(`Precipitation: ${obs.precipitation_rate} mm/h`);
      } else {
        parts.push(`No precipitation`);
      }
    }
    
    if (obs.uv_index !== null && obs.uv_index !== undefined) {
      parts.push(`UV Index: ${obs.uv_index}`);
    }
    
    if (obs.solar_irradiance !== null && obs.solar_irradiance !== undefined) {
      parts.push(`Solar Irradiance: ${obs.solar_irradiance} W/m²`);
    }
    
    if (parts.length > 0) {
      weatherInfo = parts.join(", ");
      
      if (obs.timestamp) {
        weatherInfo += `. Last updated: ${new Date(obs.timestamp).toLocaleString()}`;
      }
    }
  }

  let healthInfo = "";
  if (weatherData?.health) {
    const dataQuality = (weatherData.health.data_quality?.score * 100).toFixed(1);
    const locationQuality = (weatherData.health.location_quality?.score * 100).toFixed(1);
    healthInfo = `Station health: Data quality ${dataQuality}%, Location quality ${locationQuality}%.`;
    
    if (weatherData.health.location_quality?.reason) {
      healthInfo += ` Location status: ${weatherData.health.location_quality.reason}.`;
    }
  }

  return `You are a helpful weather AI assistant specializing in analyzing weather data from the WeatherXM network. You're currently helping a user understand weather conditions at "${stationName}" located at ${location}.

Current Weather Data:
${weatherInfo}

${healthInfo}

Your role:
- Provide clear, accurate interpretations of weather data
- Explain weather patterns and trends in simple terms
- Offer insights about current conditions and what they mean
- Help users understand the significance of different weather measurements
- Be conversational and helpful, but stay focused on weather-related topics
- If asked about non-weather topics, politely redirect to weather discussion
- If weather data is missing or incomplete, acknowledge this and suggest syncing the station data

Guidelines:
- Keep responses concise but informative (under 200 words typically)
- Use clear, non-technical language when possible
- Provide context for weather measurements (e.g., "high humidity" vs just the number)
- Be helpful and engaging in your responses
- If data seems unusual or concerning, mention it appropriately`;
}