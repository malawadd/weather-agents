import React from 'react';

interface StationsLoadingStateProps {
  selectedRegion: string;
}

export function StationsLoadingState({ selectedRegion }: StationsLoadingStateProps) {
  return (
    <div className="nb-panel p-8 text-center">
      <p className="font-bold mb-2">🔄 Loading weather stations...</p>
      <p className="text-sm text-gray-600">
        {selectedRegion ? `Filtering stations in ${selectedRegion}...` : 'Fetching data from WeatherXM API...'}
      </p>
    </div>
  );
}