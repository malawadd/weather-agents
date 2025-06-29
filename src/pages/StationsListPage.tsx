import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../WalletAuthProvider';
import { WalletConnection } from '../WalletConnection';
import { useWeatherStations } from '../hooks/useWeatherStations';
import { StationCard } from '../components/weather/StationCard';

export function StationsListPage() {
  const { user, isGuest, signOut, sessionId } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const {
    stations,
    loading,
    error,
    addingStations,
    loadStations,
    handleAddStation,
    setError,
  } = useWeatherStations({ sessionId, searchTerm, currentPage });

  useEffect(() => {
    loadStations();
  }, [searchTerm, currentPage]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadStations();
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
            Discover weather stations from the WeatherXM network and add them to your collection for AI-powered weather insights.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="nb-panel p-6">
          <form onSubmit={handleSearch} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-bold mb-2">Search Stations</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or location..."
                className="nb-input w-full px-4 py-2"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="nb-button-accent px-6 py-2 font-bold"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Error Display */}
        {error && (
          <div className="nb-panel-warning p-4">
            <p className="font-bold text-red-700">Error: {error}</p>
            <button 
              onClick={() => setError(null)}
              className="mt-2 text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Stations Grid */}
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

        {/* Loading State */}
        {loading && stations.length === 0 && (
          <div className="nb-panel p-8 text-center">
            <p className="font-bold">Loading weather stations...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && stations.length === 0 && !error && (
          <div className="nb-panel p-8 text-center">
            <p className="font-bold mb-2">No stations found</p>
            <p className="text-gray-600">Try adjusting your search terms or check back later.</p>
          </div>
        )}

        {/* Pagination */}
        {stations.length > 0 && (
          <div className="nb-panel p-4 flex justify-center gap-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
              className="nb-button px-4 py-2 font-bold"
            >
              ← Previous
            </button>
            <span className="flex items-center px-4 py-2 font-bold">
              Page {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={loading || stations.length < 20}
              className="nb-button px-4 py-2 font-bold"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}