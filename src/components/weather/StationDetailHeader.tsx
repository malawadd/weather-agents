import React from 'react';

interface StationDetailHeaderProps {
  stationName: string;
  stationId: string;
  location?: {
    lat: number;
    lon: number;
    elevation?: number;
  };
  onSyncData: () => void;
  isSyncing: boolean;
}

export function StationDetailHeader({ 
  stationName, 
  stationId, 
  location, 
  onSyncData, 
  isSyncing 
}: StationDetailHeaderProps) {
  return (
    <div className="nb-panel-white p-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">🌤️ {stationName}</h1>
          <p className="text-gray-600 mb-2">Station ID: {stationId}</p>
          {location && (
            <p className="text-sm text-gray-500">
              📍 {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
              {location.elevation && ` • ${location.elevation}m elevation`}
            </p>
          )}
        </div>
        <button
          onClick={onSyncData}
          disabled={isSyncing}
          className="nb-button-success px-6 py-3 font-bold"
        >
          {isSyncing ? '🔄 Syncing...' : '🔄 Sync Latest Data'}
        </button>
      </div>
    </div>
  );
}