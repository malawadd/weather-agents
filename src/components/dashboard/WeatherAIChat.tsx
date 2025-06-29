import React from 'react';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: number;
}

interface WeatherAIChatProps {
  selectedStationId: string | null;
  selectedStationName?: string;
  chatMessages: ChatMessage[];
  newMessage: string;
  isLoading: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onNavigateToStations: () => void;
  onNavigateToMyStations: () => void;
  isGuest: boolean;
  hasStations: boolean;
}

export function WeatherAIChat({
  selectedStationId,
  selectedStationName,
  chatMessages,
  newMessage,
  isLoading,
  onMessageChange,
  onSendMessage,
  onNavigateToStations,
  onNavigateToMyStations,
  isGuest,
  hasStations,
}: WeatherAIChatProps) {
  return (
    <div className="nb-panel-white p-6 h-96">
      <h3 className="text-xl font-bold mb-4">💬 Weather AI Assistant</h3>
      {selectedStationId ? (
        <div className="flex flex-col h-full">
          <div className="mb-2">
            <p className="text-sm font-bold text-green-600">
              🌤️ Chatting about: {selectedStationName || 'Weather Station'}
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
              onChange={(e) => onMessageChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
              placeholder="Ask about weather conditions..."
              className="flex-1 nb-input px-4 py-2"
              disabled={isLoading}
            />
            <button 
              onClick={onSendMessage}
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
                : hasStations
                ? "Select a weather station from your collection to start chatting."
                : "Add weather stations to your collection to start getting AI insights."
              }
            </p>
          </div>
          <div className="space-y-2">
            <button 
              onClick={onNavigateToStations}
              className="nb-button-accent px-4 py-2 font-bold"
            >
              🌍 Browse Weather Stations
            </button>
            {!isGuest && hasStations && (
              <button 
                onClick={onNavigateToMyStations}
                className="nb-button px-4 py-2 font-bold"
              >
                📊 Go to My Stations
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}