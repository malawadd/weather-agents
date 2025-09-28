import React from 'react';
import { Link } from 'react-router-dom';
import { ChatInterface } from './ChatInterface';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: number;
}

interface ChatSectionProps {
  selectedStationId: string | null;
  selectedStationName?: string;
  chatMessages: ChatMessage[];
  newMessage: string;
  isLoading: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  hasStations: boolean;
}

export function ChatSection({
  selectedStationId,
  selectedStationName,
  chatMessages,
  newMessage,
  isLoading,
  onMessageChange,
  onSendMessage,
  hasStations,
}: ChatSectionProps) {
  if (!selectedStationId) {
    return (
      <div className="nb-panel p-8 text-center h-[600px] flex items-center justify-center">
        <div>
          <h3 className="text-2xl font-bold mb-4">🌤️ Select a Weather Station</h3>
          <p className="text-gray-600 mb-6">
            Choose a station from your saved list to start chatting with AI about weather conditions and insights.
          </p>
          {!hasStations && (
            <Link to="/weather-intelligence/stations" className="nb-button-accent px-6 py-3 font-bold">
              Add Your First Station
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <ChatInterface
      messages={chatMessages}
      newMessage={newMessage}
      isLoading={isLoading}
      onMessageChange={onMessageChange}
      onSendMessage={onSendMessage}
      stationName={selectedStationName || 'Station'}
    />
  );
}