import React from 'react';

interface StationFiltersProps {
  searchTerm: string;
  selectedRegion: string;
  availableRegions: string[];
  regionCounts: Record<string, number>;
  loading: boolean;
  onSearchChange: (value: string) => void;
  onRegionChange: (value: string) => void;
  onSearch: () => void;
  onRefresh: () => void;
  onClearFilters: () => void;
}

export function StationFilters({
  searchTerm,
  selectedRegion,
  availableRegions,
  regionCounts,
  loading,
  onSearchChange,
  onRegionChange,
  onSearch,
  onRefresh,
  onClearFilters,
}: StationFiltersProps) {
  return (
    <div className="nb-panel p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-bold mb-2">Search Stations</label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, country (e.g., Germany)..."
            className="nb-input w-full px-4 py-2"
          />
          <p className="text-xs text-gray-500 mt-1">
            Try: "Germany", "France", "United States", or station names
          </p>
        </div>
        <div>
          <label className="block text-sm font-bold mb-2">Filter by Region</label>
          <select
            value={selectedRegion}
            onChange={(e) => onRegionChange(e.target.value)}
            className="nb-input w-full px-4 py-2"
          >
            <option value="">All Regions</option>
            {availableRegions.map((region) => (
              <option key={region} value={region}>
                {region} {regionCounts[region] ? `(${regionCounts[region]})` : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-end gap-2">
          <button
            onClick={onSearch}
            disabled={loading}
            className="nb-button-accent px-6 py-2 font-bold flex-1"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="nb-button px-4 py-2 font-bold"
          >
            🔄
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {(searchTerm || selectedRegion) && (
        <div className="flex flex-wrap gap-2 mt-4">
          {searchTerm && (
            <span className="nb-panel-accent px-3 py-1 text-sm font-bold">
              Search: "{searchTerm}"
              <button
                onClick={() => onSearchChange('')}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </span>
          )}
          {selectedRegion && (
            <span className="nb-panel-success px-3 py-1 text-sm font-bold">
              Region: {selectedRegion}
              <button
                onClick={() => onRegionChange('')}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                ✕
              </button>
            </span>
          )}
          <button
            onClick={onClearFilters}
            className="nb-button px-3 py-1 text-sm font-bold"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}