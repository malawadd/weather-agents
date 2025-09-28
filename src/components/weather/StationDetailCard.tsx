import React from 'react';
import { Link } from 'react-router-dom';

interface StationDetailCardProps {
  station: {
    _id: string;
    stationId: string;
    customName?: string;
    stationData?: {
      name?: string;
      location?: {
        lat: number;
        lon: number;
        elevation?: number;
      };
      address?: string;
      isActive?: boolean;
      lastDayQod?: number;
    };
    addedAt: number;
  };
  onRemove: (stationId: string) => void;
  onSync?: (stationId: string) => void;
  isSyncing?: boolean;
}

export function StationDetailCard({ station, onRemove, onSync, isSyncing }: StationDetailCardProps) {
  const stationName = station.customName || station.stationData?.name || `Station ${station.stationId}`;
  const location = station.stationData?.location;
  const isActive = station.stationData?.isActive;
  const qod = station.stationData?.lastDayQod;

  const getQualityColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getQualityLabel = (score?: number) => {
    if (!score) return 'Unknown';
    if (score >= 0.8) return 'Excellent';
    if (score >= 0.6) return 'Good';
    return 'Fair';
  };

  return (
    <div className="nb-panel-white p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2">{stationName}</h3>
          <p className="text-sm text-gray-600 mb-2">
            📍 {station.stationData?.address || 'Unknown Location'}
          </p>
          {location && (
            <p className="text-xs text-gray-500 mb-2">
              Coordinates: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
              {location.elevation && ` • Elevation: ${location.elevation}m`}
            </p>
          )}
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-bold ${
              isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {isActive ? '🟢 Active' : '🔴 Inactive'}
            </span>
            {qod !== undefined && (
              <span className={`px-2 py-1 rounded text-xs font-bold ${getQualityColor(qod)}`}>
                📊 {getQualityLabel(qod)} ({(qod * 100).toFixed(1)}%)
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Added: {new Date(station.addedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Link
          to={`/weather-intelligence/station/${station.stationId}`}
          className="w-full nb-button-accent py-2 font-bold text-sm block text-center"
        >
          📊 View Details & Data
        </Link>
        
        {onSync && (
          <button
            onClick={() => onSync(station.stationId)}
            disabled={isSyncing}
            className="w-full nb-button-success py-2 font-bold text-sm"
          >
            {isSyncing ? '🔄 Syncing...' : '🔄 Sync Latest Data'}
          </button>
        )}
        
        <button
          onClick={() => onRemove(station.stationId)}
          className="w-full nb-button px-2 py-1 font-bold text-sm"
        >
          ❌ Remove
        </button>
      </div>
    </div>
  );
}