import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Plus, Trash2, X, Menu } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useChatContext } from '@/context/ChatContext';
import { cn } from '@/lib/utils';

export default function Sidebar() {
  const { chats, currentChat, createNewChat, selectChat, deleteChat, clearAllChats } = useChatContext();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isOpen, setIsOpen] = useState(!isMobile); // Open on desktop, closed on mobile

  // Handle window resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle window resize
  useState(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  });

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      {/* Mobile toggle button */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-20 left-4 z-40 p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || !isMobile) && (
          <motion.aside
            initial={isMobile ? { x: -300 } : { x: 0 }}
            animate={{ x: 0 }}
            exit={isMobile ? { x: -300 } : { x: 0 }}
            transition={{ duration: 0.3 }}
            className={cn(
              'fixed left-0 top-16 bottom-0 w-64 bg-background/95 backdrop-blur-lg border-r border-border z-30 flex flex-col',
              isMobile && 'shadow-2xl'
            )}
          >
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Chats</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={createNewChat}
                  className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  title="New Chat"
                >
                  <Plus className="w-4 h-4" />
                </button>
                {isMobile && (
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-secondary transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {chats.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground text-sm">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No chats yet</p>
                  <p className="text-xs mt-1">Start a new conversation</p>
                </div>
              ) : (
                <div className="p-2">
                  {chats.map((chat) => (
                    <motion.div
                      key={chat.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={cn(
                        'group relative p-3 rounded-lg mb-2 cursor-pointer transition-colors',
                        currentChat?.id === chat.id
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-secondary/50'
                      )}
                      onClick={() => {
                        selectChat(chat.id);
                        if (isMobile) setIsOpen(false);
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {chat.title}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(chat.updatedAt)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteChat(chat.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-destructive/20 transition-all"
                          title="Delete chat"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-destructive" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {chats.length > 0 && (
              <div className="p-4 border-t border-border">
                <button
                  onClick={clearAllChats}
                  className="w-full px-4 py-2 rounded-lg bg-destructive/10 hover:bg-destructive/20 text-destructive text-sm font-medium transition-colors"
                >
                  Clear All Chats
                </button>
              </div>
            )}
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-background/50 backdrop-blur-sm z-20"
        />
      )}
    </>
  );
}
