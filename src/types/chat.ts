import { Answer } from './index';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  answers?: Answer[]; // Only for assistant messages
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface ChatContextType {
  currentChat: Chat | null;
  chats: Chat[];
  isLoading: boolean;
  createNewChat: () => void;
  selectChat: (chatId: string) => void;
  sendMessage: (content: string) => Promise<void>;
  deleteChat: (chatId: string) => void;
  clearAllChats: () => void;
}
