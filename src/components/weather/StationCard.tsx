import React from 'react';

interface Station {
  id: string;
  name: string;
  location: {
    lat: number;
    lon: number;
    address?: string;
  };
  isActive: boolean;
  lastActivity?: string;
}

interface StationCardProps {
  station: Station;
  onAddStation: (station: Station) => void;
  isAdding: boolean;
  isGuest: boolean;
}

export function StationCard({ station, onAddStation, isAdding, isGuest }: StationCardProps) {
  return (
    <div className="nb-panel-white p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-2">{station.name}</h3>
          <p className="text-sm text-gray-600 mb-2">
            📍 {station.location.address}
          </p>
          <p className="text-xs text-gray-500 mb-2">
            Coordinates: {station.location.lat.toFixed(4)}, {station.location.lon.toFixed(4)}
          </p>
          <div className="flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-xs font-bold ${
              station.isActive 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {station.isActive ? '🟢 Active' : '🔴 Inactive'}
            </span>
          </div>
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