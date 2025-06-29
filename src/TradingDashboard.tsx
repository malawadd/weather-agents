import { useState } from "react";
import { useQuery } from 'convex/react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../convex/_generated/api';
import { WalletConnection } from "./WalletConnection";
import { useAuth } from "./WalletAuthProvider";
import { useWeatherChat } from './hooks/useWeatherChat';

export function TradingDashboard() {
  const navigate = useNavigate();
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const { user, isGuest, signOut, sessionId } = useAuth();

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
    void navigate('/stations');
  };

  const handleNavigateToMyStations = () => {
    void navigate('/my-stations');
  };

  return (
    <div className="min-h-screen nb-grid-bg">
      {/* Navigation */}
      <nav className="nb-panel-white p-4 m-4 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold">🤖 Kiyan</h1>
            <div className="flex space-x-6">
              <Link to="/" className="font-bold text-black hover:underline">Dashboard</Link>
              {!isGuest && (
                <>
                  <Link to="/create-agent" className="font-bold text-gray-600 hover:text-black hover:underline">
                    Import Agent
                  </Link>
                  <Link to="/my-agents" className="font-bold text-gray-600 hover:text-black hover:underline">
                    My Agents
                  </Link>
                </>
              )}
              <Link to="/stations" className="font-bold text-gray-600 hover:text-black hover:underline">
                Weather Stations
              </Link>
              {!isGuest && (
                <Link to="/my-stations" className="font-bold text-gray-600 hover:text-black hover:underline">
                  My Stations
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-bold">
              Welcome, {user?.name || 'Explorer'}!
              {isGuest && <span className="text-sm text-gray-600"> (Guest)</span>}
            </span>
            {!isGuest && <WalletConnection />}
            <button 
              onClick={signOut}
              className="nb-button px-4 py-2 text-sm font-bold"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="p-4 space-y-6">
        {/* Welcome Panel */}
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
              onClick={handleNavigateToStations}
              className="nb-button-accent px-6 py-3 text-lg"
            >
              🌍 Explore Weather Stations
            </button>
            {!isGuest && savedStations && savedStations.length > 0 && (
              <button 
                onClick={handleNavigateToMyStations}
                className="nb-button-success px-6 py-3 text-lg font-bold"
              >
                📊 My Weather Stations ({savedStations.length})
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Guest Mode Notice */}
          {isGuest && (
            <div className="lg:col-span-3">
              <div className="nb-panel-warning p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">👤 Guest Mode Active</h3>
                    <p className="font-medium">Sign in to save weather stations and access personalized AI insights.</p>
                  </div>
                  <button 
                    onClick={signOut}
                    className="nb-button-accent px-6 py-3 text-lg"
                  >
                    🔗 Sign In
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Weather AI Chat */}
          <div className="lg:col-span-2">
            <div className="nb-panel-white p-6 h-96">
              <h3 className="text-xl font-bold mb-4">💬 Weather AI Assistant</h3>
              {selectedStationId ? (
                <div className="flex flex-col h-full">
                  <div className="mb-2">
                    <p className="text-sm font-bold text-green-600">
                      🌤️ Chatting about: {selectedStation?.customName || selectedStation?.stationData?.name || 'Weather Station'}
                    </p>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={msg.type === 'user' ? 'nb-chat-bubble-user p-3' : 'nb-chat-bubble-agent p-3'}
                      >
                        <p className="font-medium">{msg.message}</p>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="nb-chat-bubble-agent p-3">
                        <p className="font-medium">🤔 Analyzing weather data...</p>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask about weather conditions..."
                      className="flex-1 nb-input px-4 py-2"
                      disabled={isLoading}
                    />
                    <button 
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || isLoading}
                      className="nb-button px-4 py-2"
                    >
                      Send
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="mb-4">
                    <h4 className="text-lg font-bold mb-2">🤖 AI Weather Assistant Ready</h4>
                    <p className="text-gray-600 mb-4">
                      {isGuest 
                        ? "Explore weather stations and start chatting with AI about weather patterns!"
                        : savedStations && savedStations.length > 0
                        ? "Select a weather station from your collection to start chatting."
                        : "Add weather stations to your collection to start getting AI insights."
                      }
                    </p>
                  </div>
                  <div className="space-y-2">
                    <button 
                      onClick={handleNavigateToStations}
                      className="nb-button-accent px-4 py-2 font-bold"
                    >
                      🌍 Browse Weather Stations
                    </button>
                    {!isGuest && savedStations && savedStations.length > 0 && (
                      <button 
                        onClick={handleNavigateToMyStations}
                        className="nb-button px-4 py-2 font-bold"
                      >
                        📊 Go to My Stations
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Weather Stations Overview */}
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
                {!isGuest && savedStations ? savedStations.length : 0} Stations
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Weather Stations */}
          <div className="nb-panel-white p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">🌤️ My Weather Stations</h3>
              <button 
                onClick={handleNavigateToStations}
                className="nb-button px-4 py-2 text-sm"
              >
                + Add Stations
              </button>
            </div>
            <div className="space-y-3">
              {!isGuest && savedStations && savedStations.length > 0 ? (
                savedStations.slice(0, 5).map((station) => (
                  <div 
                    key={station._id} 
                    className={`nb-panel p-4 cursor-pointer transition-all ${
                      selectedStationId === station.stationId ? 'nb-panel-accent' : 'hover:nb-panel-success'
                    }`}
                    onClick={() => setSelectedStationId(station.stationId)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold">
                          {station.customName || station.stationData?.name || `Station ${station.stationId}`}
                        </p>
                        <p className="text-sm font-medium">
                          📍 {station.stationData?.address || 'Unknown Location'}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            station.stationData?.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {station.stationData?.isActive ? '🟢 Active' : '🔴 Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Link
                          to={`/station/${station.stationId}`}
                          className="text-xs nb-button px-2 py-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="nb-panel p-4 text-center">
                  <p className="font-medium text-gray-600 mb-4">
                    {isGuest ? 'Sign in to save weather stations' : 'No weather stations saved yet'}
                  </p>
                  <button 
                    onClick={handleNavigateToStations}
                    className="nb-button-accent px-4 py-2 font-bold"
                  >
                    🌍 Explore Stations
                  </button>
                </div>
              )}
              {!isGuest && savedStations && savedStations.length > 5 && (
                <div className="text-center pt-2">
                  <button 
                    onClick={handleNavigateToMyStations}
                    className="nb-button px-4 py-2 text-sm font-bold"
                  >
                    View All {savedStations.length} Stations →
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Weather Insights */}
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
        </div>

        {/* Features Overview */}
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
      </div>
    </div>
  );
}