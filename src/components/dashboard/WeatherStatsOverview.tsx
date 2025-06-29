import React from 'react';

interface WeatherStatsOverviewProps {
  isGuest: boolean;
  savedStationsCount: number;
}

export function WeatherStatsOverview({ isGuest, savedStationsCount }: WeatherStatsOverviewProps) {
  return (
    <div className="space-y-4">
      <div className="nb-panel-success p-4">
        <h4 className="font-bold text-sm mb-2">🌍 GLOBAL NETWORK</h4>
        <p className="text-2xl font-bold">WeatherXM</p>
        <p className="text-sm font-medium text-green-700">
          Decentralized weather stations worldwide
        </p>
      </div>
      
      <div className="nb-panel-white p-4">
        <h4 className="font-bold text-sm mb-2">📊 YOUR COLLECTION</h4>
        <p className="text-xl font-bold">
          {!isGuest ? savedStationsCount : 0} Stations
        </p>
        <p className="text-sm font-medium">
          {isGuest ? 'Sign in to save stations' : 'Saved weather stations'}
        </p>
      </div>
      
      <div className="nb-panel-accent p-4">
        <h4 className="font-bold text-sm mb-2">🤖 AI INSIGHTS</h4>
        <p className="text-xl font-bold">Real-time Analysis</p>
        <p className="text-sm font-medium">
          Chat with AI about weather patterns
        </p>
      </div>
    </div>
  );
}