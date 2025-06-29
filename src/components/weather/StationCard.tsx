import React from 'react';

interface Station {
  id: string;
  name: string;
  location: {
    lat: number;
    lon: number;
    address?: string;
    elevation?: number;
    cellId?: string;
  };
  isActive: boolean;
  lastActivity?: string;
  lastDayQod?: number;
  createdAt?: string;
}

interface StationCardProps {
  station: Station;
  onAddStation: (station: Station) => void;
  isAdding: boolean;
  isGuest: boolean;
}

export function StationCard({ station, onAddStation, isAdding, isGuest }: StationCardProps) {
  const formatCoordinates = (lat: number, lon: number) => {
    return `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;
  };

  const getQualityColor = (qod?: number) => {
    if (!qod) return 'bg-gray-100 text-gray-800';
    if (qod >= 0.8) return 'bg-green-100 text-green-800';
    if (qod >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getQualityLabel = (qod?: number) => {
    if (!qod) return 'Unknown';
    if (qod >= 0.8) return 'Excellent';
    if (qod >= 0.6) return 'Good';
    return 'Fair';
  };

  return (
    <div className="nb-panel-white p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2">{station.name}</h3>
          <p className="text-sm text-gray-600 mb-2">
            📍 {formatCoordinates(station.location.lat, station.location.lon)}
          </p>
          {station.location.elevation && (
            <p className="text-xs text-gray-500 mb-2">
              ⛰️ Elevation: {station.location.elevation}m
            </p>
          )}
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-xs font-bold ${
              station.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {station.isActive ? '🟢 Active' : '🔴 Inactive'}
            </span>
            {station.lastDayQod !== undefined && (
              <span className={`px-2 py-1 rounded text-xs font-bold ${getQualityColor(station.lastDayQod)}`}>
                📊 {getQualityLabel(station.lastDayQod)} ({(station.lastDayQod * 100).toFixed(1)}%)
              </span>
            )}
          </div>
          {station.createdAt && (
            <p className="text-xs text-gray-500">
              📅 Created: {new Date(station.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {!isGuest ? (
          <button
            onClick={() => onAddStation(station)}
            disabled={isAdding}
            className="w-full nb-button-accent py-2 font-bold text-sm"
          >
            {isAdding ? 'Adding...' : '+ Add to My Stations'}
          </button>
        ) : (
          <div className="nb-panel-warning p-2 text-center">
            <p className="text-xs font-bold">Sign in to add stations</p>
          </div>
        )}
      </div>
    </div>
  );
}