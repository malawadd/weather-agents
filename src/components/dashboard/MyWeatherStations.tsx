import React from 'react';
import { Link } from 'react-router-dom';

interface Station {
  _id: string;
  stationId: string;
  customName?: string;
  stationData?: {
    name?: string;
    address?: string;
    isActive?: boolean;
  };
}

interface MyWeatherStationsProps {
  stations?: Station[];
  selectedStationId: string | null;
  isGuest: boolean;
  onStationSelect: (stationId: string) => void;
  onNavigateToStations: () => void;
  onNavigateToMyStations: () => void;
}

export function MyWeatherStations({
  stations,
  selectedStationId,
  isGuest,
  onStationSelect,
  onNavigateToStations,
  onNavigateToMyStations,
}: MyWeatherStationsProps) {
  return (
    <div className="nb-panel-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">🌤️ My Weather Stations</h3>
        <button 
          onClick={onNavigateToStations}
          className="nb-button px-4 py-2 text-sm"
        >
          + Add Stations
        </button>
      </div>
      <div className="space-y-3">
        {!isGuest && stations && stations.length > 0 ? (
          stations.slice(0, 5).map((station) => (
            <div 
              key={station._id} 
              className={`nb-panel p-4 cursor-pointer transition-all ${
                selectedStationId === station.stationId ? 'nb-panel-accent' : 'hover:nb-panel-success'
              }`}
              onClick={() => onStationSelect(station.stationId)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold">
                    {station.customName || station.stationData?.name || `Station ${station.stationId}`}
                  </p>
                  <p className="text-sm font-medium">
                    📍 {station.stationData?.address || 'Unknown Location'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      station.stationData?.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {station.stationData?.isActive ? '🟢 Active' : '🔴 Inactive'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Link
                    to={`/station/${station.stationId}`}
                    className="text-xs nb-button px-2 py-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="nb-panel p-4 text-center">
            <p className="font-medium text-gray-600 mb-4">
              {isGuest ? 'Sign in to save weather stations' : 'No weather stations saved yet'}
            </p>
            <button 
              onClick={onNavigateToStations}
              className="nb-button-accent px-4 py-2 font-bold"
            >
              🌍 Explore Stations
            </button>
          </div>
        )}
        {!isGuest && stations && stations.length > 5 && (
          <div className="text-center pt-2">
            <button 
              onClick={onNavigateToMyStations}
              className="nb-button px-4 py-2 text-sm font-bold"
            >
              View All {stations.length} Stations →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}