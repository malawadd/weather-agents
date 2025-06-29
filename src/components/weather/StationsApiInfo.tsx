import React from 'react';

interface StationsApiInfoProps {
  totalStations: number;
  selectedRegion: string;
  availableRegions: string[];
}

export function StationsApiInfo({ totalStations, selectedRegion, availableRegions }: StationsApiInfoProps) {
  return (
    <div className="nb-panel-accent p-4">
      <h4 className="font-bold mb-2">🔗 API Status</h4>
      <p className="text-sm">
        Connected to WeatherXM Pro API • 
        {totalStations > 0 ? ` ${totalStations} stations available` : ' Ready to load stations'}
        {selectedRegion && ` • Filtered by ${selectedRegion}`}
      </p>
      {availableRegions.length > 0 && (
        <p className="text-xs text-gray-600 mt-1">
          Available regions: {availableRegions.join(', ')}
        </p>
      )}
    </div>
  );
}