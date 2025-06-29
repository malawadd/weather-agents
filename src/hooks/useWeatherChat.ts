import { useState, useEffect } from 'react';
import { useQuery, useAction } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { Id } from '../../convex/_generated/dataModel';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  message: string;
  timestamp: number;
}

interface UseWeatherChatProps {
  sessionId: Id<"sessions"> | null;
  stationId: string | null;
}

export function useWeatherChat({ sessionId, stationId }: UseWeatherChatProps) {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const chatWithAI = useAction(api.aiChat.chatWithStationAI);
  const chatHistory = useQuery(api.aiChat.getChatHistory,
    sessionId && stationId ? { 
      sessionId, 
      stationId,
      limit: 50 
    } : "skip"
  );

  // Load chat history when station is selected
  useEffect(() => {
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
    } else if (stationId) {
      setChatMessages([]);
    }
  }, [chatHistory, stationId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !stationId || !sessionId || isLoading) return;

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
        stationId,
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

  return {
    chatMessages,
    newMessage,
    isLoading,
    setNewMessage,
    handleSendMessage,
  };
}