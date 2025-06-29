import { action, mutation } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";

// Sync single station data (latest + recent history)
export const syncStationData = action({
  args: {
    sessionId: v.id("sessions"),
    stationId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Invalid or expired session");
    }

    try {
      // Fetch latest data
      const latestData = await ctx.runAction(api.weatherxm.stationDataApi.fetchAndStoreLatestData, {
        stationId: args.stationId,
      });

      // Fetch recent history (last 7 days)
      const historyPromises = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        historyPromises.push(
          ctx.runAction(api.weatherxm.stationDataApi.fetchAndStoreHistoryData, {
            stationId: args.stationId,
            date: dateStr,
          })
        );
      }

      await Promise.all(historyPromises);

      return {
        success: true,
        stationId: args.stationId,
        latestData,
        message: 'Station data synchronized successfully',
      };
    } catch (error) {
      console.error('Error syncing station data:', error);
      throw new Error(`Failed to sync station ${args.stationId}: ${error.message}`);
    }
  },
});

// Sync all user stations
export const syncAllUserStations = action({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.expiresAt < Date.now()) {
      throw new Error("Invalid or expired session");
    }

    try {
      // Get all user stations
      const userStations = await ctx.runQuery(api.weatherxmApi.getMySavedStations, {
        sessionId: args.sessionId,
      });

      if (!userStations || userStations.length === 0) {
        return {
          success: true,
          syncedCount: 0,
          message: 'No stations to sync',
        };
      }

      // Sync each station
      const syncPromises = userStations.map(station =>
        ctx.runAction(api.weatherxm.stationSyncApi.syncStationData, {
          sessionId: args.sessionId,
          stationId: station.stationId,
        })
      );

      const results = await Promise.allSettled(syncPromises);
      
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;

      return {
        success: true,
        syncedCount: successful,
        failedCount: failed,
        totalStations: userStations.length,
        message: `Synchronized ${successful} of ${userStations.length} stations`,
      };
    } catch (error) {
      console.error('Error syncing all stations:', error);
      throw new Error(`Failed to sync stations: ${error.message}`);
    }
  },
});