import React from 'react';

interface WeatherInsightsProps {
  selectedStationId: string | null;
  isGuest: boolean;
}

export function WeatherInsights({ selectedStationId, isGuest }: WeatherInsightsProps) {
  return (
    <div className="nb-panel-white p-6">
      <h3 className="text-xl font-bold mb-4">🧠 AI Weather Insights</h3>
      <div className="space-y-3">
        <div className="nb-panel p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🌡️</span>
            <div>
              <p className="font-bold">Temperature Analysis</p>
              <p className="text-sm font-medium text-gray-600">
                Get insights about temperature trends and patterns
              </p>
            </div>
          </div>
        </div>
        
        <div className="nb-panel p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💧</span>
            <div>
              <p className="font-bold">Humidity & Precipitation</p>
              <p className="text-sm font-medium text-gray-600">
                Understand moisture levels and rainfall patterns
              </p>
            </div>
          </div>
        </div>
        
        <div className="nb-panel p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💨</span>
            <div>
              <p className="font-bold">Wind & Pressure</p>
              <p className="text-sm font-medium text-gray-600">
                Analyze wind conditions and atmospheric pressure
              </p>
            </div>
          </div>
        </div>

        <div className="text-center pt-2">
          <p className="text-sm text-gray-500 mb-2">
            {selectedStationId 
              ? "Start chatting above to get AI insights!" 
              : isGuest 
              ? "Explore stations to start getting insights"
              : "Select a station to start getting AI insights"
            }
          </p>
        </div>
      </div>
    </div>
  );
}