import React from 'react';

interface StationsEmptyStateProps {
  searchTerm: string;
  selectedRegion: string;
  onRefresh: () => void;
  onClearFilters: () => void;
}

export function StationsEmptyState({ 
  searchTerm, 
  selectedRegion, 
  onRefresh, 
  onClearFilters 
}: StationsEmptyStateProps) {
  return (
    <div className="nb-panel p-8 text-center">
      <h3 className="text-xl font-bold mb-2">📡 No Stations Found</h3>
      <p className="text-gray-600 mb-4">
        {searchTerm || selectedRegion
          ? 'Try searching for a different country or adjusting your filters.' 
          : 'Click "Search" to load stations from the WeatherXM network.'
        }
      </p>
      <div className="flex gap-4 justify-center">
        <button
          onClick={onRefresh}
          className="nb-button-accent px-6 py-3 font-bold"
        >
          🔄 Load Stations
        </button>
        {(searchTerm || selectedRegion) && (
          <button
            onClick={onClearFilters}
            className="nb-button px-6 py-3 font-bold"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}