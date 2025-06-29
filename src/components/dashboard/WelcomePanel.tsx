import React from 'react';

interface WelcomePanelProps {
  isGuest: boolean;
  savedStationsCount: number;
  onNavigateToStations: () => void;
  onNavigateToMyStations: () => void;
}

export function WelcomePanel({ 
  isGuest, 
  savedStationsCount, 
  onNavigateToStations, 
  onNavigateToMyStations 
}: WelcomePanelProps) {
  return (
    <div className="nb-panel p-6">
      <h2 className="text-3xl font-bold mb-4">🌤️ Welcome to Your Weather Intelligence Hub</h2>
      <p className="text-lg mb-6 font-medium">
        {isGuest 
          ? "Explore weather stations worldwide and chat with AI about weather patterns and insights!"
          : "Discover weather stations, save your favorites, and get AI-powered insights about weather conditions and patterns."
        }
      </p>
      <div className="flex gap-4">
        <button 
          onClick={onNavigateToStations}
          className="nb-button-accent px-6 py-3 text-lg"
        >
          🌍 Explore Weather Stations
        </button>
        {!isGuest && savedStationsCount > 0 && (
          <button 
            onClick={onNavigateToMyStations}
            className="nb-button-success px-6 py-3 text-lg font-bold"
          >
            📊 My Weather Stations ({savedStationsCount})
          </button>
        )}
      </div>
    </div>
  );
}