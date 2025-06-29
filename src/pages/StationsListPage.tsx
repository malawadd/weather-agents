import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAction, useMutation, useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../WalletAuthProvider';
import { WalletConnection } from '../WalletConnection';

interface Station {
  id: string;
  name: string;
  location: {
    lat: number;
    lon: number;
    address?: string;
  };
  isActive: boolean;
  lastActivity?: string;
}

export function StationsListPage() {
  const { user, isGuest, signOut, sessionId } = useAuth();
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [addingStations, setAddingStations] = useState<Set<string>>(new Set());

  const fetchStations = useAction(api.weatherxmApi.fetchStations);
  const addStationToMyStations = useMutation(api.weatherxmApi.addStationToMyStations);

  // Load stations on component mount and when search/page changes
  useEffect(() => {
    loadStations();
  }, [searchTerm, currentPage]);

  const loadStations = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchStations({
        page: currentPage,
        limit: 20,
        search: searchTerm || undefined,
      });
      
      // Transform the API response to match our interface
      const transformedStations = result.data?.map((station: any) => ({
        id: station.id,
        name: station.name || `Station ${station.id}`,
        location: {
          lat: station.location?.lat || 0,
          lon: station.location?.lon || 0,
          address: station.location?.address || 'Unknown Location',
        },
        isActive: station.isActive || false,
        lastActivity: station.lastActivity,
      })) || [];

      setStations(transformedStations);
    } catch (err: any) {
      setError(err.message || 'Failed to load stations');
    } finally {
      setLoading(false);
    }
  };

  const handleAddStation = async (station: Station) => {
    if (!sessionId || isGuest) return;

    setAddingStations(prev => new Set(prev).add(station.id));
    try {
      await addStationToMyStations({
        sessionId,
        stationId: station.id,
        stationData: {
          name: station.name,
          location: station.location,
          address: station.location.address,
          isActive: station.isActive,
        },
      });
    } catch (err: any) {
      setError(err.message || 'Failed to add station');
    } finally {
      setAddingStations(prev => {
        const newSet = new Set(prev);
        newSet.delete(station.id);
        return newSet;
      });
    }
  };

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
          </div>
        )}

        {/* Stations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stations.map((station) => (
            <div key={station.id} className="nb-panel-white p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">{station.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    📍 {station.location.address}
                  </p>
                  <p className="text-xs text-gray-500 mb-2">
                    Coordinates: {station.location.lat.toFixed(4)}, {station.location.lon.toFixed(4)}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      station.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {station.isActive ? '🟢 Active' : '🔴 Inactive'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                {!isGuest ? (
                  <button
                    onClick={() => handleAddStation(station)}
                    disabled={addingStations.has(station.id)}
                    className="w-full nb-button-accent py-2 font-bold text-sm"
                  >
                    {addingStations.has(station.id) ? 'Adding...' : '+ Add to My Stations'}
                  </button>
                ) : (
                  <div className="nb-panel-warning p-2 text-center">
                    <p className="text-xs font-bold">Sign in to add stations</p>
                  </div>
                )}
              </div>
            </div>
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