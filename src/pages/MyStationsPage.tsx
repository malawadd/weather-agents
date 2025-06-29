import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../WalletAuthProvider';
import { WalletConnection } from '../WalletConnection';
import { useWeatherChat } from '../hooks/useWeatherChat';
import { ChatInterface } from '../components/weather/ChatInterface';
import { StationDetailCard } from '../components/weather/StationDetailCard';
import { SyncAllStationsButton } from '../components/weather/SyncAllStationsButton';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/ToastContainer';

export function MyStationsPage() {
  const { user, isGuest, signOut, sessionId } = useAuth();
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [syncingStations, setSyncingStations] = useState<Set<string>>(new Set());
  const { toasts, showSuccess, showError, hideToast } = useToast();

  const savedStations = useQuery(api.weatherxmApi.getMySavedStations, 
    sessionId ? { sessionId } : "skip"
  );
  const removeStation = useMutation(api.weatherxmApi.removeStationFromMyStations);
  const syncStationData = useAction(api.weatherxm.stationSyncApi.syncStationData);

  const {
    chatMessages,
    newMessage,
    isLoading,
    setNewMessage,
    handleSendMessage,
  } = useWeatherChat({ sessionId, stationId: selectedStationId });

  const handleRemoveStation = async (stationId: string) => {
    if (!sessionId) return;
    
    try {
      await removeStation({ sessionId, stationId });
      if (selectedStationId === stationId) {
        setSelectedStationId(null);
      }
      showSuccess('Station removed from your collection');
    } catch (error: any) {
      showError(error.message || 'Failed to remove station');
    }
  };

  const handleSyncStation = async (stationId: string) => {
    if (!sessionId) return;
    
    setSyncingStations(prev => new Set(prev).add(stationId));
    try {
      const result = await syncStationData({ sessionId, stationId });
      showSuccess(result.message);
    } catch (error: any) {
      showError(error.message || 'Failed to sync station data');
    } finally {
      setSyncingStations(prev => {
        const newSet = new Set(prev);
        newSet.delete(stationId);
        return newSet;
      });
    }
  };

  const handleSyncAllComplete = (message: string) => {
    showSuccess(message);
  };

  const handleSyncAllError = (error: string) => {
    showError(error);
  };

  const selectedStation = savedStations?.find(s => s.stationId === selectedStationId);

  if (isGuest) {
    return (
      <div className="min-h-screen nb-grid-bg">
        <nav className="nb-panel-white p-4 m-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">🤖 Kiyan</h1>
            <button onClick={signOut} className="nb-button px-4 py-2 text-sm font-bold">
              Sign Out
            </button>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4">
          <div className="nb-panel-warning p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">🔒 Sign In Required</h2>
            <p className="mb-4">You need to sign in to access your saved weather stations.</p>
            <button onClick={signOut} className="nb-button-accent px-6 py-3 font-bold">
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              <Link to="/create-agent" className="font-bold text-gray-600 hover:text-black hover:underline">
                Import Agent
              </Link>
              <Link to="/my-agents" className="font-bold text-gray-600 hover:text-black hover:underline">
                My Agents
              </Link>
              <Link to="/stations" className="font-bold text-gray-600 hover:text-black hover:underline">
                Weather Stations
              </Link>
              <Link to="/my-stations" className="font-bold text-black hover:underline">
                My Stations
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-bold">Welcome, {user?.name || 'Trader'}!</span>
            <WalletConnection />
            <button onClick={signOut} className="nb-button px-4 py-2 text-sm font-bold">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="nb-panel-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">🌤️ My Weather Stations</h1>
              <p className="text-gray-600">
                Manage your saved weather stations, sync latest data, and chat with AI about weather patterns.
              </p>
            </div>
            {sessionId && savedStations && savedStations.length > 0 && (
              <SyncAllStationsButton
                sessionId={sessionId}
                onSyncComplete={handleSyncAllComplete}
                onSyncError={handleSyncAllError}
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stations List */}
          <div className="lg:col-span-1">
            <div className="nb-panel-white p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">📍 Saved Stations</h2>
                <Link to="/stations" className="nb-button px-3 py-1 text-sm font-bold">
                  + Add More
                </Link>
              </div>

              {!savedStations && (
                <div className="text-center py-4">
                  <p className="font-medium">Loading stations...</p>
                </div>
              )}

              {savedStations?.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No saved stations yet</p>
                  <Link to="/stations" className="nb-button-accent px-4 py-2 font-bold">
                    Browse Stations
                  </Link>
                </div>
              )}

              <div className="space-y-3">
                {savedStations?.map((station) => (
                  <div
                    key={station._id}
                    className={`cursor-pointer transition-all ${
                      selectedStationId === station.stationId 
                        ? 'ring-2 ring-blue-500' 
                        : ''
                    }`}
                    onClick={() => setSelectedStationId(station.stationId)}
                  >
                    <StationDetailCard
                      station={station}
                      onRemove={handleRemoveStation}
                      onSync={handleSyncStation}
                      isSyncing={syncingStations.has(station.stationId)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            {selectedStationId ? (
              <ChatInterface
                messages={chatMessages}
                newMessage={newMessage}
                isLoading={isLoading}
                onMessageChange={setNewMessage}
                onSendMessage={handleSendMessage}
                stationName={selectedStation?.customName || selectedStation?.stationData?.name || 'Station'}
              />
            ) : (
              <div className="nb-panel p-8 text-center h-[600px] flex items-center justify-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">🌤️ Select a Weather Station</h3>
                  <p className="text-gray-600 mb-6">
                    Choose a station from your saved list to start chatting with AI about weather conditions and insights.
                  </p>
                  {savedStations?.length === 0 && (
                    <Link to="/stations" className="nb-button-accent px-6 py-3 font-bold">
                      Add Your First Station
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} onHideToast={hideToast} />
    </div>
  );
}