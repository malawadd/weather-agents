import React from 'react';

export function PlatformFeatures() {
  return (
    <div className="nb-panel-accent p-6">
      <h3 className="text-2xl font-bold mb-4 text-center">🚀 Platform Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center">
          <div className="text-4xl mb-3">🌍</div>
          <h4 className="font-bold mb-2">Global Weather Network</h4>
          <p className="text-sm">
            Access weather data from decentralized stations worldwide through the WeatherXM network
          </p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-3">🤖</div>
          <h4 className="font-bold mb-2">AI-Powered Insights</h4>
          <p className="text-sm">
            Chat with AI to understand weather patterns, get forecasts, and analyze conditions
          </p>
        </div>
        <div className="text-center">
          <div className="text-4xl mb-3">📊</div>
          <h4 className="font-bold mb-2">Real-time Data</h4>
          <p className="text-sm">
            Get live weather observations and historical data with detailed analytics
          </p>
        </div>
      </div>
    </div>
  );
}