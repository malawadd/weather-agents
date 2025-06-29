import React from 'react';

interface HealthData {
  timestamp: string;
  data_quality: {
    score: number;
  };
  location_quality: {
    score: number;
    reason?: string;
  };
}

interface StationHealthPanelProps {
  health?: HealthData;
}

export function StationHealthPanel({ health }: StationHealthPanelProps) {
  if (!health) {
    return (
      <div className="nb-panel-white p-6">
        <h2 className="text-xl font-bold mb-4">🏥 Station Health</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No health data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="nb-panel-white p-6">
      <h2 className="text-xl font-bold mb-4">🏥 Station Health</h2>
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
    </div>
  );
}