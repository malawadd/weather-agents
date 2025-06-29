import React from 'react';

interface StationsHeaderProps {
  totalStations: number;
  selectedRegion: string;
  stationsCount: number;
}

export function StationsHeader({ totalStations, selectedRegion, stationsCount }: StationsHeaderProps) {
  return (
    <div className="nb-panel-white p-6">
      <h1 className="text-3xl font-bold mb-2">🌤️ WeatherXM Stations</h1>
      <p className="text-gray-600">
        Discover weather stations worldwide. Search by country name (e.g., "Germany") or filter by region.
      </p>
      {totalStations > 0 && (
        <p className="text-sm text-gray-500 mt-2">
          Showing {stationsCount} of {totalStations} stations
          {selectedRegion && ` in ${selectedRegion}`}
        </p>
      )}
    </div>
  );
}