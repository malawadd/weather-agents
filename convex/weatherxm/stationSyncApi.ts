import { action } from "../_generated/server";
import { v } from "convex/values";
import { api } from "../_generated/api";

// Sync single station data (latest + recent history)
export const syncStationData = action({
  args: {
    sessionId: v.id("sessions"),
    stationId: v.string(),
  },
  handler: async (ctx, args): Promise<{
    success: boolean;
    stationId: string;
    latestData: any;
    message: string;
  }> => {
    // Validate session using a query
    const session = await ctx.runQuery(api.walletAuth.getCurrentUser, { sessionId: args.sessionId });
    if (!session) {
      throw new Error("Invalid or expired session");
    }

    try {
      // Fetch latest data
      const latestData: any = await ctx.runAction(api.weatherxm.stationDataApi.fetchAndStoreLatestData, {
        stationId: args.stationId,
      });

      // Fetch recent history (last 7 days)
      const historyPromises: Promise<any>[] = [];
      for (let i = 0; i < 3; i++) {
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
    } catch (error: any) {
      console.error('Error syncing station data:', error);
      throw new Error(`Failed to sync station ${args.stationId}: ${error?.message || 'Unknown error'}`);
    }
  },
});

// Sync all user stations
export const syncAllUserStations = action({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args): Promise<{
    success: boolean;
    syncedCount: number;
    failedCount: number;
    totalStations: number;
    message: string;
  }> => {
    // Validate session using a query
    const session = await ctx.runQuery(api.walletAuth.getCurrentUser, { sessionId: args.sessionId });
    if (!session) {
      throw new Error("Invalid or expired session");
    }

    try {
      // Get all user stations
      const userStations: any = await ctx.runQuery(api.weatherxmApi.getMySavedStations, {
        sessionId: args.sessionId,
      });

      if (!userStations || userStations.length === 0) {
        return {
          success: true,
          syncedCount: 0,
          failedCount: 0,
          totalStations: 0,
          message: 'No stations to sync',
        };
      }

      // Sync each station
      const syncPromises: Promise<any>[] = userStations.map((station: any) =>
        ctx.runAction(api.weatherxm.stationSyncApi.syncStationData, {
          sessionId: args.sessionId,
          stationId: station.stationId,
        })
      );

      const results: PromiseSettledResult<any>[] = await Promise.allSettled(syncPromises);
      
      const successful: number = results.filter((r: PromiseSettledResult<any>) => r.status === 'fulfilled').length;
      const failed: number = results.filter((r: PromiseSettledResult<any>) => r.status === 'rejected').length;

      return {
        success: true,
        syncedCount: successful,
        failedCount: failed,
        totalStations: userStations.length,
        message: `Synchronized ${successful} of ${userStations.length} stations`,
      };
    } catch (error: any) {
      console.error('Error syncing all stations:', error);
      throw new Error(`Failed to sync stations: ${error?.message || 'Unknown error'}`);
    }
  },
});