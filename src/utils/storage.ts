import { Chat, ChatMessage } from '@/types/chat';

const STORAGE_KEY = 'answerrank_chats';
const ACTIVE_CHAT_KEY = 'answerrank_active_chat';

/**
 * Storage utility for managing chats in localStorage
 * Handles serialization, deserialization, and persistence
 */

/**
 * Get all chats from localStorage
 */
export function getChats(): Chat[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const chats = JSON.parse(stored) as Chat[];
    // Validate and filter out invalid chats
    return chats.filter(chat => 
      chat.id && 
      chat.title && 
      Array.isArray(chat.messages) &&
      chat.createdAt &&
      chat.updatedAt
    );
  } catch (error) {
    console.error('Error reading chats from storage:', error);
    return [];
  }
}

/**
 * Save all chats to localStorage
 */
export function saveChats(chats: Chat[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  } catch (error) {
    console.error('Error saving chats to storage:', error);
    // Handle quota exceeded error
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      // Remove oldest chats if storage is full
      const sorted = [...chats].sort((a, b) => a.updatedAt - b.updatedAt);
      const reduced = sorted.slice(-20); // Keep only last 20 chats
      localStorage.setItem(STORAGE_KEY, JSON.stringify(reduced));
    }
  }
}

/**
 * Get a specific chat by ID
 */
export function getChatById(chatId: string): Chat | null {
  const chats = getChats();
  return chats.find(chat => chat.id === chatId) || null;
}

/**
 * Save or update a chat
 */
export function saveChat(chat: Chat): void {
  const chats = getChats();
  const index = chats.findIndex(c => c.id === chat.id);
  
  if (index >= 0) {
    chats[index] = chat;
  } else {
    chats.push(chat);
  }
  
  // Sort by updatedAt (newest first)
  chats.sort((a, b) => b.updatedAt - a.updatedAt);
  
  saveChats(chats);
}

/**
 * Delete a chat by ID
 */
export function deleteChat(chatId: string): void {
  const chats = getChats();
  const filtered = chats.filter(chat => chat.id !== chatId);
  saveChats(filtered);
}

/**
 * Clear all chats
 */
export function clearAllChats(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(ACTIVE_CHAT_KEY);
}

/**
 * Get the active chat ID
 */
export function getActiveChatId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_CHAT_KEY);
  } catch (error) {
    console.error('Error reading active chat ID:', error);
    return null;
  }
}

/**
 * Set the active chat ID
 */
export function setActiveChatId(chatId: string | null): void {
  try {
    if (chatId) {
      localStorage.setItem(ACTIVE_CHAT_KEY, chatId);
    } else {
      localStorage.removeItem(ACTIVE_CHAT_KEY);
    }
  } catch (error) {
    console.error('Error saving active chat ID:', error);
  }
}

/**
 * Generate a chat title from the first user message
 */
export function generateChatTitle(firstMessage: string): string {
  // Take first 50 characters and clean up
  const title = firstMessage
    .trim()
    .slice(0, 50)
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ');
  
  return title || 'New Chat';
}

/**
 * Create a new chat
 */
export function createNewChat(): Chat {
  const chatId = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  return {
    id: chatId,
    title: 'New Chat',
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
