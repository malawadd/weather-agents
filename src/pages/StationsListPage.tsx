import React, { useState, useEffect } from 'react';
import { useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../WalletAuthProvider';
import { useWeatherStations } from '../hooks/useWeatherStations';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/ToastContainer';
import { StationsHeader } from '../components/weather/StationsHeader';
import { StationFilters } from '../components/weather/StationFilters';
import { StationsErrorDisplay } from '../components/weather/StationsErrorDisplay';
import { StationsLoadingState } from '../components/weather/StationsLoadingState';
import { StationsGrid } from '../components/weather/StationsGrid';
import { StationsEmptyState } from '../components/weather/StationsEmptyState';
import { StationsPagination } from '../components/weather/StationsPagination';
import { StationsApiInfo } from '../components/weather/StationsApiInfo';

export function StationsListPage() {
  const { isGuest, sessionId } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  const [regionCounts, setRegionCounts] = useState<Record<string, number>>({});

  const { toasts, showSuccess, showError, hideToast } = useToast();
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
  } = useWeatherStations({ 
    sessionId, 
    searchTerm, 
    currentPage, 
    selectedRegion,
    onStationAdded: (stationName: string) => {
      showSuccess(`"${stationName}" has been added to your weather stations collection! 🌤️`);
    }
  });

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

  const handleAddStationWithToast = async (station: any) => {
    try {
      await handleAddStation(station);
    } catch (err: any) {
      showError(err.message || 'Failed to add station to your collection');
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <StationsHeader 
          totalStations={totalStations}
          selectedRegion={selectedRegion}
          stationsCount={stations.length}
        />

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

        {error && (
          <StationsErrorDisplay
            error={error}
            onRetry={handleRefresh}
            onDismiss={() => setError(null)}
          />
        )}

        {loading && <StationsLoadingState selectedRegion={selectedRegion} />}

        {!loading && stations.length > 0 && (
          <StationsGrid
            stations={stations}
            addingStations={addingStations}
            isGuest={isGuest}
            onAddStation={handleAddStationWithToast}
          />
        )}

        {!loading && stations.length === 0 && !error && (
          <StationsEmptyState
            searchTerm={searchTerm}
            selectedRegion={selectedRegion}
            onRefresh={handleRefresh}
            onClearFilters={clearAllFilters}
          />
        )}

        <StationsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalStations={totalStations}
          selectedRegion={selectedRegion}
          onPageChange={handlePageChange}
        />

        <StationsApiInfo
          totalStations={totalStations}
          selectedRegion={selectedRegion}
          availableRegions={availableRegions}
        />
      </div>

      <ToastContainer toasts={toasts} onHideToast={hideToast} />
    </>
  );
}