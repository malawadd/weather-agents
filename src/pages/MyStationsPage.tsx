import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useAction, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth } from '../WalletAuthProvider';
import { WalletConnection } from '../WalletConnection';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: number;
}

export function MyStationsPage() {
  const { user, isGuest, signOut, sessionId } = useAuth();
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const savedStations = useQuery(api.weatherxmApi.getMySavedStations, 
    sessionId ? { sessionId } : "skip"
  );
  const removeStation = useMutation(api.weatherxmApi.removeStationFromMyStations);
  const chatWithAI = useAction(api.aiChat.chatWithStationAI);
  const chatHistory = useQuery(api.aiChat.getChatHistory,
    sessionId && selectedStationId ? { 
      sessionId, 
      stationId: selectedStationId,
      limit: 50 
    } : "skip"
  );

  // Load chat history when station is selected
  React.useEffect(() => {
    if (chatHistory) {
      const messages: ChatMessage[] = [];
      chatHistory.forEach((chat) => {
        messages.push({
          id: `${chat._id}-user`,
          type: 'user',
          message: chat.userMessage,
          timestamp: chat.timestamp,
        });
        messages.push({
          id: `${chat._id}-ai`,
          type: 'ai',
          message: chat.aiResponse,
          timestamp: chat.timestamp + 1,
        });
      });
      setChatMessages(messages);
    }
  }, [chatHistory]);

  const handleRemoveStation = async (stationId: string) => {
    if (!sessionId) return;
    
    try {
      await removeStation({ sessionId, stationId });
      if (selectedStationId === stationId) {
        setSelectedStationId(null);
        setChatMessages([]);
      }
    } catch (error) {
      console.error('Failed to remove station:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedStationId || !sessionId || isLoading) return;

    const userMessage = newMessage.trim();
    setNewMessage('');
    setIsLoading(true);

    // Add user message immediately
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      message: userMessage,
      timestamp: Date.now(),
    };
    setChatMessages(prev => [...prev, userMsg]);

    try {
      const aiResponse = await chatWithAI({
        sessionId,
        stationId: selectedStationId,
        userMessage,
      });

      // Add AI response
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        type: 'ai',
        message: aiResponse,
        timestamp: Date.now(),
      };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Failed to get AI response:', error);
      // Add error message
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        type: 'ai',
        message: 'Sorry, I encountered an error while processing your request. Please try again.',
        timestamp: Date.now(),
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedStation = savedStations?.find(s => s.stationId === selectedStationId);

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
            <p className="mb-4">You need to sign in to access your saved weather stations.</p>
            <button onClick={signOut} className="nb-button-accent px-6 py-3 font-bold">
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

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
              <Link to="/create-agent" className="font-bold text-gray-600 hover:text-black hover:underline">
                Import Agent
              </Link>
              <Link to="/my-agents" className="font-bold text-gray-600 hover:text-black hover:underline">
                My Agents
              </Link>
              <Link to="/stations" className="font-bold text-gray-600 hover:text-black hover:underline">
                Weather Stations
              </Link>
              <Link to="/my-stations" className="font-bold text-black hover:underline">
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

      <div className="max-w-7xl mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="nb-panel-white p-6">
          <h1 className="text-3xl font-bold mb-2">🌤️ My Weather Stations</h1>
          <p className="text-gray-600">
            Chat with AI about your saved weather stations and get insights about weather patterns and conditions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stations List */}
          <div className="lg:col-span-1">
            <div className="nb-panel-white p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">📍 Saved Stations</h2>
                <Link to="/stations" className="nb-button px-3 py-1 text-sm font-bold">
                  + Add More
                </Link>
              </div>

              {!savedStations && (
                <div className="text-center py-4">
                  <p className="font-medium">Loading stations...</p>
                </div>
              )}

              {savedStations?.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">No saved stations yet</p>
                  <Link to="/stations" className="nb-button-accent px-4 py-2 font-bold">
                    Browse Stations
                  </Link>
                </div>
              )}

              <div className="space-y-3">
                {savedStations?.map((station) => (
                  <div
                    key={station._id}
                    className={`nb-panel p-4 cursor-pointer transition-all ${
                      selectedStationId === station.stationId 
                        ? 'nb-panel-accent' 
                        : 'hover:nb-panel-success'
                    }`}
                    onClick={() => setSelectedStationId(station.stationId)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-sm mb-1">
                          {station.customName || station.stationData?.name || `Station ${station.stationId}`}
                        </h3>
                        <p className="text-xs text-gray-600 mb-2">
                          📍 {station.stationData?.address || 'Unknown Location'}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            station.stationData?.isActive 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {station.stationData?.isActive ? '🟢' : '🔴'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveStation(station.stationId);
                        }}
                        className="text-red-600 hover:text-red-800 font-bold text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-2">
            {selectedStationId ? (
              <div className="nb-panel-white p-6 h-[600px] flex flex-col">
                <div className="flex justify-between items-center mb-4 pb-4 border-b-4 border-black">
                  <div>
                    <h2 className="text-xl font-bold">
                      💬 Chat with AI about {selectedStation?.customName || selectedStation?.stationData?.name || 'Station'}
                    </h2>
                    <p className="text-sm text-gray-600">
                      Ask questions about weather patterns, conditions, and insights
                    </p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                  {chatMessages.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-600 mb-4">Start a conversation about this weather station!</p>
                      <div className="nb-panel-accent p-4">
                        <p className="font-bold text-sm mb-2">💡 Try asking:</p>
                        <ul className="text-sm space-y-1">
                          <li>• "What's the current temperature?"</li>
                          <li>• "How has the humidity changed today?"</li>
                          <li>• "What are the wind conditions?"</li>
                          <li>• "Is it likely to rain?"</li>
                        </ul>
                      </div>
                    </div>
                  )}

                  {chatMessages.map((message) => (
                    <div
                      key={message.id}
                      className={message.type === 'user' ? 'nb-chat-bubble-user p-3' : 'nb-chat-bubble-agent p-3'}
                    >
                      <p className="font-medium">{message.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="nb-chat-bubble-agent p-3">
                      <p className="font-medium">🤔 Analyzing weather data...</p>
                    </div>
                  )}
                </div>

                {/* Chat Input */}
                <div className="flex space-x-2 pt-4 border-t-4 border-black">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Ask about weather conditions, patterns, or insights..."
                    className="flex-1 nb-input px-4 py-2"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isLoading}
                    className="nb-button-accent px-6 py-2 font-bold"
                  >
                    {isLoading ? '⏳' : 'Send'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="nb-panel p-8 text-center h-[600px] flex items-center justify-center">
                <div>
                  <h3 className="text-2xl font-bold mb-4">🌤️ Select a Weather Station</h3>
                  <p className="text-gray-600 mb-6">
                    Choose a station from your saved list to start chatting with AI about weather conditions and insights.
                  </p>
                  {savedStations?.length === 0 && (
                    <Link to="/stations" className="nb-button-accent px-6 py-3 font-bold">
                      Add Your First Station
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}