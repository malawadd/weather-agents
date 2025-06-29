import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../WalletAuthProvider';
import { WalletConnection } from '../WalletConnection';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/ToastContainer';
import { StationDetailHeader } from '../components/weather/StationDetailHeader';
import { LatestObservations } from '../components/weather/LatestObservations';
import { StationHealthPanel } from '../components/weather/StationHealthPanel';
import { HistoricalDataPanel } from '../components/weather/HistoricalDataPanel';

export function StationDetailPage() {
  const { stationId } = useParams<{ stationId: string }>();
  const { user, isGuest, signOut, sessionId } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const { toasts, showSuccess, showError, hideToast } = useToast();

  const syncStationData = useAction(api.weatherxm.stationSyncApi.syncStationData);
  
  const savedStations = useQuery(api.weatherxmApi.getMySavedStations, 
    sessionId ? { sessionId } : "skip"
  );
  
  const latestData = useQuery(api.weatherxm.stationDataApi.getLatestData,
    stationId ? { stationId } : "skip"
  );

  const station = savedStations?.find(s => s.stationId === stationId);

  const handleSyncData = async () => {
    if (!sessionId || !stationId) return;
    
    setIsSyncing(true);
    try {
      const result = await syncStationData({ sessionId, stationId });
      showSuccess(result.message);
    } catch (error: any) {
      showError(error.message || 'Failed to sync station data');
    } finally {
      setIsSyncing(false);
    }
  };

  if (isGuest || !station) {
    return (
      <div className="min-h-screen nb-grid-bg">
        <nav className="nb-panel-white p-4 m-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">🤖 Kiyan</h1>
            <div className="flex items-center space-x-4">
              {!isGuest && <WalletConnection />}
              <button onClick={signOut} className="nb-button px-4 py-2 text-sm font-bold">
                Sign Out
              </button>
            </div>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4">
          <div className="nb-panel-warning p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">
              {isGuest ? '🔒 Sign In Required' : '❌ Station Not Found'}
            </h2>
            <p className="mb-4">
              {isGuest 
                ? 'You need to sign in to view station details.' 
                : 'This station is not in your saved stations.'
              }
            </p>
            <Link 
              to={isGuest ? "/" : "/my-stations"} 
              className="nb-button-accent px-6 py-3 font-bold"
            >
              {isGuest ? 'Sign In' : 'Back to My Stations'}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const stationName = station.customName || station.stationData?.name || `Station ${stationId}`;
  const observation = latestData?.observation;
  const health = latestData?.health;
  const location = latestData?.location || station.stationData?.location;

  return (
    <div className="min-h-screen nb-grid-bg">
      <nav className="nb-panel-white p-4 m-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold">🤖 Kiyan</h1>
            <div className="flex space-x-6">
              <Link to="/" className="font-bold text-gray-600 hover:text-black hover:underline">
                Dashboard
              </Link>
              <Link to="/stations" className="font-bold text-gray-600 hover:text-black hover:underline">
                Weather Stations
              </Link>
              <Link to="/my-stations" className="font-bold text-gray-600 hover:text-black hover:underline">
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

      <div className="max-w-6xl mx-auto px-4 space-y-6">
        <StationDetailHeader
          stationName={stationName}
          stationId={stationId!}
          location={location}
          onSyncData={handleSyncData}
          isSyncing={isSyncing}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LatestObservations
            observation={observation}
            onSyncData={handleSyncData}
            isSyncing={isSyncing}
          />
          <StationHealthPanel health={health} />
        </div>

        <HistoricalDataPanel
          stationId={stationId!}
          onSyncData={handleSyncData}
          isSyncing={isSyncing}
        />

        <div className="text-center">
          <Link to="/my-stations" className="nb-button px-6 py-3 font-bold">
            ← Back to My Stations
          </Link>
        </div>
      </div>

      <ToastContainer toasts={toasts} onHideToast={hideToast} />
    </div>
  );
}