import React from 'react';

interface HistoryDay {
  _id: string;
  date: string;
  observations: Array<{
    temperature?: number;
    humidity?: number;
    wind_speed?: number;
    pressure?: number;
  }>;
}

interface HistoricalDataPanelProps {
  historyData?: HistoryDay[];
  onSyncData: () => void;
  isSyncing: boolean;
}

export function HistoricalDataPanel({ historyData, onSyncData, isSyncing }: HistoricalDataPanelProps) {
  const calculateAverage = (observations: any[], field: string) => {
    const values = observations.map(obs => obs[field] || 0).filter(val => val > 0);
    return values.length > 0 ? (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(1) : '0.0';
  };

  if (!historyData || historyData.length === 0) {
    return (
      <div className="nb-panel-white p-6">
        <h2 className="text-xl font-bold mb-4">📈 Recent History</h2>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">No historical data available</p>
          <button
            onClick={onSyncData}
            disabled={isSyncing}
            className="nb-button-accent px-4 py-2 font-bold"
          >
            {isSyncing ? 'Syncing...' : 'Sync Historical Data'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="nb-panel-white p-6">
      <h2 className="text-xl font-bold mb-4">📈 Recent History</h2>
      <div className="space-y-4">
        {historyData.map((day) => (
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
                  <p>{calculateAverage(day.observations, 'temperature')}°C</p>
                </div>
                <div>
                  <p className="font-bold">💧 Avg Humidity</p>
                  <p>{calculateAverage(day.observations, 'humidity')}%</p>
                </div>
                <div>
                  <p className="font-bold">💨 Avg Wind</p>
                  <p>{calculateAverage(day.observations, 'wind_speed')} m/s</p>
                </div>
                <div>
                  <p className="font-bold">🌊 Avg Pressure</p>
                  <p>{calculateAverage(day.observations, 'pressure')} hPa</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}