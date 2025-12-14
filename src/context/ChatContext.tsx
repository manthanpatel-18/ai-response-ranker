import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Chat, ChatMessage, ChatContextType } from '@/types/chat';
import {
  getChats,
  saveChat,
  deleteChat as deleteChatStorage,
  clearAllChats as clearAllChatsStorage,
  getActiveChatId,
  setActiveChatId,
  generateChatTitle,
  createNewChat as createNewChatStorage,
} from '@/utils/storage';
import { generateAndRankAnswers } from '@/services/openai';
import { Answer } from '@/types';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load chats from storage on mount
  useEffect(() => {
    const storedChats = getChats();
    setChats(storedChats);

    // Restore active chat
    const activeChatId = getActiveChatId();
    if (activeChatId) {
      const activeChat = storedChats.find(chat => chat.id === activeChatId);
      if (activeChat) {
        setCurrentChat(activeChat);
        return;
      }
    }

    // If no active chat, create a new one
    if (storedChats.length === 0) {
      const newChat = createNewChatStorage();
      setCurrentChat(newChat);
      setChats([newChat]);
      saveChat(newChat);
      setActiveChatId(newChat.id);
    }
  }, []);

  // Save current chat to storage whenever it changes
  useEffect(() => {
    if (currentChat) {
      saveChat(currentChat);
      setActiveChatId(currentChat.id);
      
      // Update chats list
      setChats(prev => {
        const index = prev.findIndex(c => c.id === currentChat.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = currentChat;
          return updated.sort((a, b) => b.updatedAt - a.updatedAt);
        }
        return [...prev, currentChat].sort((a, b) => b.updatedAt - a.updatedAt);
      });
    }
  }, [currentChat]);

  const createNewChat = useCallback(() => {
    const newChat = createNewChatStorage();
    setCurrentChat(newChat);
    setActiveChatId(newChat.id);
  }, []);

  const selectChat = useCallback((chatId: string) => {
    const chat = chats.find(c => c.id === chatId);
    if (chat) {
      setCurrentChat(chat);
      setActiveChatId(chatId);
    }
  }, [chats]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey || !apiKey.trim()) {
      throw new Error('OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file.');
    }

    setIsLoading(true);

    try {
      // Get or create current chat
      let chat = currentChat;
      if (!chat) {
        chat = createNewChatStorage();
        setCurrentChat(chat);
        setActiveChatId(chat.id);
      }

      // Add user message
      const userMessage: ChatMessage = {
        role: 'user',
        content: content.trim(),
        timestamp: Date.now(),
      };

      const updatedMessages = [...chat.messages, userMessage];

      // Update chat title if this is the first message
      if (chat.messages.length === 0) {
        chat.title = generateChatTitle(content);
      }

      // Prepare conversation history (only user and assistant messages, no answers)
      const conversationHistory = chat.messages
        .filter(msg => msg.role === 'user' || msg.role === 'assistant')
        .map(msg => ({
          role: msg.role,
          content: msg.role === 'assistant' 
            ? (msg.answers?.[0]?.content || msg.content) // Use best answer for context
            : msg.content,
        }));

      // Generate and rank answers
      const answers = await generateAndRankAnswers(content.trim(), apiKey, conversationHistory);

      // Add assistant message with answers
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: answers[0]?.content || '', // Best answer as primary content
        timestamp: Date.now(),
        answers,
      };

      const finalMessages = [...updatedMessages, assistantMessage];

      // Update chat
      const updatedChat: Chat = {
        ...chat,
        messages: finalMessages,
        updatedAt: Date.now(),
      };

      setCurrentChat(updatedChat);
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [currentChat, isLoading]);

  const deleteChat = useCallback((chatId: string) => {
    deleteChatStorage(chatId);
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    
    // If deleted chat was current, switch to another or create new
    if (currentChat?.id === chatId) {
      const remaining = chats.filter(chat => chat.id !== chatId);
      if (remaining.length > 0) {
        setCurrentChat(remaining[0]);
        setActiveChatId(remaining[0].id);
      } else {
        const newChat = createNewChatStorage();
        setCurrentChat(newChat);
        setActiveChatId(newChat.id);
      }
    }
  }, [currentChat, chats]);

  const clearAllChats = useCallback(() => {
    clearAllChatsStorage();
    setChats([]);
    const newChat = createNewChatStorage();
    setCurrentChat(newChat);
    setActiveChatId(newChat.id);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        currentChat,
        chats,
        isLoading,
        createNewChat,
        selectChat,
        sendMessage,
        deleteChat,
        clearAllChats,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}
