import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../WalletAuthProvider';
import { useWeatherChat } from '../hooks/useWeatherChat';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/ToastContainer';
import { MyStationsHeader } from '../components/weather/MyStationsHeader';
import { MyStationsList } from '../components/weather/MyStationsList';
import { ChatSection } from '../components/weather/ChatSection';

export function MyStationsPage() {
  const { isGuest, signOut, sessionId } = useAuth();
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [syncingStations, setSyncingStations] = useState<Set<string>>(new Set());
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const { toasts, showSuccess, showError, hideToast } = useToast();

  const savedStations = useQuery(api.weatherxmApi.getMySavedStations, 
    sessionId ? { sessionId } : "skip"
  );
  const removeStation = useMutation(api.weatherxmApi.removeStationFromMyStations);
  const syncStationData = useAction(api.weatherxm.stationSyncApi.syncStationData);
  const syncAllStations = useAction(api.weatherxm.stationSyncApi.syncAllUserStations);

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

  const handleSyncAll = async () => {
    if (!sessionId) return;
    
    setIsSyncingAll(true);
    try {
      const result = await syncAllStations({ sessionId });
      showSuccess(result.message);
    } catch (error: any) {
      showError(error.message || 'Failed to sync all stations');
    } finally {
      setIsSyncingAll(false);
    }
  };

  const selectedStation = savedStations?.find(s => s.stationId === selectedStationId);

  if (isGuest) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="nb-panel-warning p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">🔒 Sign In Required</h2>
          <p className="mb-4">You need to sign in to access your saved weather stations.</p>
          <button onClick={signOut} className="nb-button-accent px-6 py-3 font-bold">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <MyStationsHeader
          stationsCount={savedStations?.length || 0}
          onSyncAll={savedStations && savedStations.length > 0 ? handleSyncAll : undefined}
          isSyncingAll={isSyncingAll}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <MyStationsList
              stations={savedStations}
              selectedStationId={selectedStationId}
              syncingStations={syncingStations}
              onStationSelect={setSelectedStationId}
              onRemoveStation={handleRemoveStation}
              onSyncStation={handleSyncStation}
            />
          </div>

          <div className="lg:col-span-2">
            <ChatSection
              selectedStationId={selectedStationId}
              selectedStationName={selectedStation?.customName || selectedStation?.stationData?.name}
              chatMessages={chatMessages}
              newMessage={newMessage}
              isLoading={isLoading}
              onMessageChange={setNewMessage}
              onSendMessage={handleSendMessage}
              hasStations={!!savedStations && savedStations.length > 0}
            />
          </div>
        </div>
      </div>

    </div>
  );
}