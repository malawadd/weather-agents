import { useState } from "react";
import { useQuery } from 'convex/react';
import { useNavigate } from 'react-router-dom';
import { api } from '../convex/_generated/api';
import { useAuth } from "./WalletAuthProvider";
import { useWeatherChat } from './hooks/useWeatherChat';
import { WelcomePanel } from './components/dashboard/WelcomePanel';
import { GuestModeNotice } from './components/dashboard/GuestModeNotice';
import { WeatherAIChat } from './components/dashboard/WeatherAIChat';
import { WeatherStatsOverview } from './components/dashboard/WeatherStatsOverview';
import { MyWeatherStations } from './components/dashboard/MyWeatherStations';
import { WeatherInsights } from './components/dashboard/WeatherInsights';
import { PlatformFeatures } from './components/dashboard/PlatformFeatures';

export function WeatherIntelligenceDashboard() {
  const navigate = useNavigate();
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const { isGuest, signOut, sessionId } = useAuth();

  // Fetch weather data
  const savedStations = useQuery(api.weatherxmApi.getMySavedStations, 
    sessionId ? { sessionId } : "skip"
  );

  const {
    chatMessages,
    newMessage,
    isLoading,
    setNewMessage,
    handleSendMessage,
  } = useWeatherChat({ sessionId, stationId: selectedStationId });

  const selectedStation = savedStations?.find(s => s.stationId === selectedStationId);

  const handleNavigateToStations = () => {
    void navigate('/weather-intelligence/stations');
  };

  const handleNavigateToMyStations = () => {
    void navigate('/weather-intelligence/my-stations');
  };

  return (
    <div className="p-4 space-y-6">
      <WelcomePanel
        isGuest={isGuest}
        savedStationsCount={savedStations?.length || 0}
        onNavigateToStations={handleNavigateToStations}
        onNavigateToMyStations={handleNavigateToMyStations}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {isGuest && (
          <GuestModeNotice onSignIn={signOut} />
        )}
        
        <div className="lg:col-span-2">
          <WeatherAIChat
            selectedStationId={selectedStationId}
            selectedStationName={selectedStation?.customName || selectedStation?.stationData?.name}
            chatMessages={chatMessages}
            newMessage={newMessage}
            isLoading={isLoading}
            onMessageChange={setNewMessage}
            onSendMessage={handleSendMessage}
            onNavigateToStations={handleNavigateToStations}
            onNavigateToMyStations={handleNavigateToMyStations}
            isGuest={isGuest}
            hasStations={!!savedStations && savedStations.length > 0}
          />
        </div>

        <WeatherStatsOverview
          isGuest={isGuest}
          savedStationsCount={savedStations?.length || 0}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MyWeatherStations
          stations={savedStations}
          selectedStationId={selectedStationId}
          isGuest={isGuest}
          onStationSelect={setSelectedStationId}
          onNavigateToStations={handleNavigateToStations}
          onNavigateToMyStations={handleNavigateToMyStations}
        />

        <WeatherInsights
          selectedStationId={selectedStationId}
          isGuest={isGuest}
        />
      </div>

      <PlatformFeatures />
    </div>
  );
}