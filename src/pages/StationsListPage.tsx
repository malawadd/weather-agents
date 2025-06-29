import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../WalletAuthProvider';
import { WalletConnection } from '../WalletConnection';
import { useWeatherStations } from '../hooks/useWeatherStations';
import { StationCard } from '../components/weather/StationCard';
import { StationFilters } from '../components/weather/StationFilters';
import { StationsPagination } from '../components/weather/StationsPagination';

export function StationsListPage() {
  const { user, isGuest, signOut, sessionId } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  const [regionCounts, setRegionCounts] = useState<Record<string, number>>({});

  const getAvailableRegions = useAction(api.weatherxmApi.getAvailableRegions);

  const {
    stations,
    loading,
    error,
    addingStations,
    totalPages,
    totalStations,
    loadStations,
    handleAddStation,
    setError,
  } = useWeatherStations({ sessionId, searchTerm, currentPage, selectedRegion });

  // Load available regions on mount
  useEffect(() => {
    const loadRegions = async () => {
      try {
        const result = await getAvailableRegions({});
        setAvailableRegions(result.regions);
        setRegionCounts(result.regionCounts);
      } catch (err) {
        console.error('Failed to load regions:', err);
        setAvailableRegions(['Europe', 'North America', 'Asia', 'Africa', 'Australia', 'South America']);
      }
    };
    loadRegions();
  }, [getAvailableRegions]);

  useEffect(() => {
    loadStations();
  }, [currentPage, selectedRegion]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadStations();
  };

  const handleRefresh = () => {
    setError(null);
    loadStations();
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedRegion('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen nb-grid-bg">
      {/* Navigation */}
      <nav className="nb-panel-white p-4 m-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold">🤖 Kiyan</h1>
            <div className="flex space-x-6">
              <Link to="/" className="font-bold text-gray-600 hover:text-black hover:underline">
                Dashboard
              </Link>
              {!isGuest && (
                <>
                  <Link to="/create-agent" className="font-bold text-gray-600 hover:text-black hover:underline">
                    Import Agent
                  </Link>
                  <Link to="/my-agents" className="font-bold text-gray-600 hover:text-black hover:underline">
                    My Agents
                  </Link>
                </>
              )}
              <Link to="/stations" className="font-bold text-black hover:underline">
                Weather Stations
              </Link>
              {!isGuest && (
                <Link to="/my-stations" className="font-bold text-gray-600 hover:text-black hover:underline">
                  My Stations
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-bold">
              Welcome, {user?.name || 'Trader'}!
              {isGuest && <span className="text-sm text-gray-600"> (Guest)</span>}
            </span>
            {!isGuest && <WalletConnection />}
            <button onClick={signOut} className="nb-button px-4 py-2 text-sm font-bold">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="nb-panel-white p-6">
          <h1 className="text-3xl font-bold mb-2">🌤️ WeatherXM Stations</h1>
          <p className="text-gray-600">
            Discover weather stations worldwide. Search by country name (e.g., "Germany") or filter by region.
          </p>
          {totalStations > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              Showing {stations.length} of {totalStations} stations
              {selectedRegion && ` in ${selectedRegion}`}
            </p>
          )}
        </div>

        {/* Filters */}
        <StationFilters
          searchTerm={searchTerm}
          selectedRegion={selectedRegion}
          availableRegions={availableRegions}
          regionCounts={regionCounts}
          loading={loading}
          onSearchChange={setSearchTerm}
          onRegionChange={handleRegionChange}
          onSearch={() => handleSearch({ preventDefault: () => {} } as React.FormEvent)}
          onRefresh={handleRefresh}
          onClearFilters={clearAllFilters}
        />

        {/* Error Display */}
        {error && (
          <div className="nb-panel-warning p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold text-red-700 mb-1">⚠️ Error</p>
                <p className="text-sm">{error}</p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={handleRefresh}
                  className="nb-button px-3 py-1 text-sm font-bold"
                >
                  Retry
                </button>
                <button 
                  onClick={() => setError(null)}
                  className="text-red-600 hover:text-red-800 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="nb-panel p-8 text-center">
            <p className="font-bold mb-2">🔄 Loading weather stations...</p>
            <p className="text-sm text-gray-600">
              {selectedRegion ? `Filtering stations in ${selectedRegion}...` : 'Fetching data from WeatherXM API...'}
            </p>
          </div>
        )}

        {/* Stations Grid */}
        {!loading && stations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stations.map((station) => (
              <StationCard
                key={station.id}
                station={station}
                onAddStation={handleAddStation}
                isAdding={addingStations.has(station.id)}
                isGuest={isGuest}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && stations.length === 0 && !error && (
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
                onClick={handleRefresh}
                className="nb-button-accent px-6 py-3 font-bold"
              >
                🔄 Load Stations
              </button>
              {(searchTerm || selectedRegion) && (
                <button
                  onClick={clearAllFilters}
                  className="nb-button px-6 py-3 font-bold"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Pagination */}
        <StationsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalStations={totalStations}
          selectedRegion={selectedRegion}
          onPageChange={handlePageChange}
        />

        {/* API Info */}
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
      </div>
    </div>
  );
}