import React from 'react';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: number;
}

interface ChatInterfaceProps {
  messages: ChatMessage[];
  newMessage: string;
  isLoading: boolean;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  stationName?: string;
}

export function ChatInterface({ 
  messages, 
  newMessage, 
  isLoading, 
  onMessageChange, 
  onSendMessage,
  stationName 
}: ChatInterfaceProps) {
  return (
    <div className="nb-panel-white p-6 h-[600px] flex flex-col">
      <div className="flex justify-between items-center mb-4 pb-4 border-b-4 border-black">
        <div>
          <h2 className="text-xl font-bold">
            💬 Chat with AI about {stationName || 'Station'}
          </h2>
          <p className="text-sm text-gray-600">
            Ask questions about weather patterns, conditions, and insights
          </p>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4">
        {messages.length === 0 && (
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

        {messages.map((message) => (
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
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
          placeholder="Ask about weather conditions, patterns, or insights..."
          className="flex-1 nb-input px-4 py-2"
          disabled={isLoading}
        />
        <button
          onClick={onSendMessage}
          disabled={!newMessage.trim() || isLoading}
          className="nb-button-accent px-6 py-2 font-bold"
        >
          {isLoading ? '⏳' : 'Send'}
        </button>
      </div>
    </div>
  );
}