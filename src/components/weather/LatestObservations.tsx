import React from 'react';

interface Observation {
  timestamp: string;
  temperature?: number;
  feels_like?: number;
  humidity?: number;
  wind_speed?: number;
  wind_direction?: number;
  pressure?: number;
}

interface LatestObservationsProps {
  observation?: Observation;
  onSyncData: () => void;
  isSyncing: boolean;
}

export function LatestObservations({ observation, onSyncData, isSyncing }: LatestObservationsProps) {
  if (!observation) {
    return (
      <div className="nb-panel-white p-6">
        <h2 className="text-xl font-bold mb-4">📊 Latest Observations</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No observation data available</p>
          <button
            onClick={onSyncData}
            disabled={isSyncing}
            className="nb-button-accent px-4 py-2 font-bold"
          >
            {isSyncing ? 'Syncing...' : 'Sync Data'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="nb-panel-white p-6">
      <h2 className="text-xl font-bold mb-4">📊 Latest Observations</h2>
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
    </div>
  );
}