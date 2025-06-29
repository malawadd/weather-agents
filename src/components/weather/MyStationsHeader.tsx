import React from 'react';
import { Link } from 'react-router-dom';

interface MyStationsHeaderProps {
  stationsCount: number;
  onSyncAll?: () => void;
  isSyncingAll?: boolean;
}

export function MyStationsHeader({ stationsCount, onSyncAll, isSyncingAll }: MyStationsHeaderProps) {
  return (
    <div className="nb-panel-white p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">🌤️ My Weather Stations</h1>
          <p className="text-gray-600">
            Manage your saved weather stations, sync latest data, and chat with AI about weather patterns.
          </p>
          {stationsCount > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {stationsCount} station{stationsCount !== 1 ? 's' : ''} in your collection
            </p>
          )}
        </div>
        {onSyncAll && stationsCount > 0 && (
          <button
            onClick={onSyncAll}
            disabled={isSyncingAll}
            className="nb-button-success px-6 py-3 font-bold"
          >
            {isSyncingAll ? '🔄 Syncing All...' : '🔄 Sync All Stations'}
          </button>
        )}
      </div>
    </div>
  );
}