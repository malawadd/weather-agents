import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../WalletAuthProvider';
import { WalletConnection } from '../WalletConnection';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/ui/ToastContainer';

export function StationDetailPage() {
  const { stationId } = useParams<{ stationId: string }>();
  const { user, isGuest, signOut, sessionId } = useAuth();
  const [isSyncing, setIsSyncing] = useState(false);
  const { toasts, showSuccess, showError, hideToast } = useToast();

  const syncStationData = useAction(api.weatherxm.stationSyncApi.syncStationData);
  
  // Get station info from user's saved stations
  const savedStations = useQuery(api.weatherxmApi.getMySavedStations, 
    sessionId ? { sessionId } : "skip"
  );
  
  // Get latest weather data
  const latestData = useQuery(api.weatherxm.stationDataApi.getLatestData,
    stationId ? { stationId } : "skip"
  );
  
  // Get historical data
  const historyData = useQuery(api.weatherxm.stationDataApi.getHistoryData,
    stationId ? { stationId, limit: 7 } : "skip"
  );

  const station = savedStations?.find(s => s.stationId === stationId);

  const handleSyncData = async () => {
    if (!sessionId || !stationId) return;
    
    setIsSyncing(true);
    try {
      const result = await syncStationData({
        sessionId,
        stationId,
      });
      showSuccess(result.message);
    } catch (error: any) {
      showError(error.message || 'Failed to sync station data');
    } finally {
      setIsSyncing(false);
    }
  };

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
            <p className="mb-4">You need to sign in to view station details.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="min-h-screen nb-grid-bg">
        <nav className="nb-panel-white p-4 m-4 mb-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">🤖 Kiyan</h1>
            <div className="flex items-center space-x-4">
              <WalletConnection />
              <button onClick={signOut} className="nb-button px-4 py-2 text-sm font-bold">
                Sign Out
              </button>
            </div>
          </div>
        </nav>
        <div className="max-w-4xl mx-auto px-4">
          <div className="nb-panel-warning p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">❌ Station Not Found</h2>
            <p className="mb-4">This station is not in your saved stations.</p>
            <Link to="/my-stations" className="nb-button-accent px-6 py-3 font-bold">
              Back to My Stations
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
      {/* Navigation */}
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
        {/* Header */}
        <div className="nb-panel-white p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold mb-2">🌤️ {stationName}</h1>
              <p className="text-gray-600 mb-2">Station ID: {stationId}</p>
              {location && (
                <p className="text-sm text-gray-500">
                  📍 {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                  {location.elevation && ` • ${location.elevation}m elevation`}
                </p>
              )}
            </div>
            <button
              onClick={handleSyncData}
              disabled={isSyncing}
              className="nb-button-success px-6 py-3 font-bold"
            >
              {isSyncing ? '🔄 Syncing...' : '🔄 Sync Latest Data'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Latest Observations */}
          <div className="nb-panel-white p-6">
            <h2 className="text-xl font-bold mb-4">📊 Latest Observations</h2>
            {observation ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  {observation.temperature !== undefined && (
                    <div className="nb-panel-accent p-3">
                      <p className="text-sm font-bold">🌡️ Temperature</p>
                      <p className="text-xl font-bold">{observation.temperature}°C</p>
                      {observation.feels_like && (
                        <p className="text-xs">Feels like {observation.feels_like}°C</p>
                      )}
                    </div>
                  )}
                  {observation.humidity !== undefined && (
                    <div className="nb-panel-success p-3">
                      <p className="text-sm font-bold">💧 Humidity</p>
                      <p className="text-xl font-bold">{observation.humidity}%</p>
                    </div>
                  )}
                  {observation.wind_speed !== undefined && (
                    <div className="nb-panel-warning p-3">
                      <p className="text-sm font-bold">💨 Wind Speed</p>
                      <p className="text-xl font-bold">{observation.wind_speed} m/s</p>
                      {observation.wind_direction && (
                        <p className="text-xs">{observation.wind_direction}° direction</p>
                      )}
                    </div>
                  )}
                  {observation.pressure !== undefined && (
                    <div className="nb-panel p-3">
                      <p className="text-sm font-bold">🌊 Pressure</p>
                      <p className="text-xl font-bold">{observation.pressure} hPa</p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Last updated: {new Date(observation.timestamp).toLocaleString()}
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No observation data available</p>
                <button
                  onClick={handleSyncData}
                  disabled={isSyncing}
                  className="nb-button-accent px-4 py-2 font-bold"
                >
                  {isSyncing ? 'Syncing...' : 'Sync Data'}
                </button>
              </div>
            )}
          </div>

          {/* Station Health */}
          <div className="nb-panel-white p-6">
            <h2 className="text-xl font-bold mb-4">🏥 Station Health</h2>
            {health ? (
              <div className="space-y-4">
                <div className="nb-panel-success p-4">
                  <p className="text-sm font-bold mb-2">📊 Data Quality</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${health.data_quality.score * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">
                      {(health.data_quality.score * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="nb-panel-warning p-4">
                  <p className="text-sm font-bold mb-2">📍 Location Quality</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-600 h-2 rounded-full"
                        style={{ width: `${health.location_quality.score * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold">
                      {(health.location_quality.score * 100).toFixed(1)}%
                    </span>
                  </div>
                  {health.location_quality.reason && (
                    <p className="text-xs text-gray-600 mt-1">
                      {health.location_quality.reason}
                    </p>
                  )}
                </div>
                
                <p className="text-xs text-gray-500">
                  Health updated: {new Date(health.timestamp).toLocaleString()}
                </p>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No health data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Historical Data */}
        <div className="nb-panel-white p-6">
          <h2 className="text-xl font-bold mb-4">📈 Recent History</h2>
          {historyData && historyData.length > 0 ? (
            <div className="space-y-4">
              {historyData.map((day, index) => (
                <div key={day._id} className="nb-panel p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">📅 {day.date}</h3>
                    <span className="text-sm text-gray-500">
                      {day.observations.length} observations
                    </span>
                  </div>
                  {day.observations.length > 0 && (
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="font-bold">🌡️ Avg Temp</p>
                        <p>
                          {(day.observations.reduce((sum, obs) => sum + (obs.temperature || 0), 0) / day.observations.length).toFixed(1)}°C
                        </p>
                      </div>
                      <div>
                        <p className="font-bold">💧 Avg Humidity</p>
                        <p>
                          {(day.observations.reduce((sum, obs) => sum + (obs.humidity || 0), 0) / day.observations.length).toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="font-bold">💨 Avg Wind</p>
                        <p>
                          {(day.observations.reduce((sum, obs) => sum + (obs.wind_speed || 0), 0) / day.observations.length).toFixed(1)} m/s
                        </p>
                      </div>
                      <div>
                        <p className="font-bold">🌊 Avg Pressure</p>
                        <p>
                          {(day.observations.reduce((sum, obs) => sum + (obs.pressure || 0), 0) / day.observations.length).toFixed(1)} hPa
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No historical data available</p>
              <button
                onClick={handleSyncData}
                disabled={isSyncing}
                className="nb-button-accent px-4 py-2 font-bold"
              >
                {isSyncing ? 'Syncing...' : 'Sync Historical Data'}
              </button>
            </div>
          )}
        </div>

        {/* Back Button */}
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