import React, { useState } from 'react';
import { useAction } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { Id } from '../../../convex/_generated/dataModel';

interface SyncAllStationsButtonProps {
  sessionId: Id<"sessions">;
  onSyncComplete: (message: string) => void;
  onSyncError: (error: string) => void;
}

export function SyncAllStationsButton({ sessionId, onSyncComplete, onSyncError }: SyncAllStationsButtonProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const syncAllStations = useAction(api.weatherxm.stationSyncApi.syncAllUserStations);

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      const result = await syncAllStations({ sessionId });
      onSyncComplete(result.message);
    } catch (error: any) {
      onSyncError(error.message || 'Failed to sync stations');
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <button
      onClick={handleSyncAll}
      disabled={isSyncing}
      className="nb-button-success px-6 py-3 font-bold"
    >
      {isSyncing ? '🔄 Syncing All Stations...' : '🔄 Sync All Stations'}
    </button>
  );
}