import React from 'react';
import { Link } from 'react-router-dom';
import { StationDetailCard } from './StationDetailCard';

interface Station {
  _id: string;
  stationId: string;
  customName?: string;
  stationData?: any;
  addedAt: number;
}

interface MyStationsListProps {
  stations?: Station[];
  selectedStationId: string | null;
  syncingStations: Set<string>;
  onStationSelect: (stationId: string) => void;
  onRemoveStation: (stationId: string) => void;
  onSyncStation: (stationId: string) => void;
}

export function MyStationsList({
  stations,
  selectedStationId,
  syncingStations,
  onStationSelect,
  onRemoveStation,
  onSyncStation,
}: MyStationsListProps) {
  if (!stations) {
    return (
      <div className="nb-panel-white p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">📍 Saved Stations</h2>
          <Link to="/stations" className="nb-button px-3 py-1 text-sm font-bold">
            + Add More
          </Link>
        </div>
        <div className="text-center py-4">
          <p className="font-medium">Loading stations...</p>
        </div>
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="nb-panel-white p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">📍 Saved Stations</h2>
          <Link to="/stations" className="nb-button px-3 py-1 text-sm font-bold">
            + Add More
          </Link>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">No saved stations yet</p>
          <Link to="/stations" className="nb-button-accent px-4 py-2 font-bold">
            Browse Stations
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="nb-panel-white p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📍 Saved Stations</h2>
        <Link to="/stations" className="nb-button px-3 py-1 text-sm font-bold">
          + Add More
        </Link>
      </div>

      <div className="space-y-3">
        {stations.map((station) => (
          <div
            key={station._id}
            className={`cursor-pointer transition-all ${
              selectedStationId === station.stationId 
                ? 'ring-2 ring-blue-500' 
                : ''
            }`}
            onClick={() => onStationSelect(station.stationId)}
          >
            <StationDetailCard
              station={station}
              onRemove={onRemoveStation}
              onSync={onSyncStation}
              isSyncing={syncingStations.has(station.stationId)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}