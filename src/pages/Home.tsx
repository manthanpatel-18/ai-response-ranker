import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ThreeBackground from '@/components/ThreeBackground';
import QuestionInput from '@/components/QuestionInput';
import AskButton from '@/components/AskButton';
import Sidebar from '@/components/Sidebar';
import ChatWindow from '@/components/ChatWindow';
import { useChatContext } from '@/context/ChatContext';
import { useToast } from '@/hooks/use-toast';

const Home = () => {
  const [question, setQuestion] = useState('');
  const { sendMessage, isLoading, currentChat } = useChatContext();
  const { toast } = useToast();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatWindowRef.current) {
      setTimeout(() => {
        chatWindowRef.current?.scrollTo({
          top: chatWindowRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }
  }, [currentChat?.messages.length, isLoading]);

  const handleAsk = useCallback(async () => {
    if (!question.trim() || isLoading) return;

    const questionText = question.trim();
    setQuestion(''); // Clear input immediately

    try {
      await sendMessage(questionText);
      // Focus input after sending
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } catch (error) {
      // Restore question on error
      setQuestion(questionText);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  }, [question, isLoading, sendMessage, toast]);

  // Handle Enter key to submit (Shift+Enter for new line)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
        e.preventDefault();
        handleAsk();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAsk, isLoading]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col">
      {/* 3D Background */}
      <ThreeBackground />

      {/* Gradient overlays for depth */}
      <div className="fixed inset-0 bg-gradient-to-b from-background/50 via-transparent to-background pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

      {/* Navigation */}
      <Navbar />

      {/* Main Layout */}
      <div className="flex-1 flex relative z-20 pt-16">
        {/* Sidebar */}
        <Sidebar />

        {/* Chat Area */}
        <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
          {/* Chat Window */}
          <div ref={chatWindowRef} className="flex-1 overflow-y-auto">
            <ChatWindow />
          </div>

          {/* Input Area */}
          <div className="border-t border-border/50 bg-background/80 backdrop-blur-sm p-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <QuestionInput
                    ref={inputRef}
                    value={question}
                    onChange={setQuestion}
                    disabled={isLoading}
                  />
                </div>
                <div className="pb-2">
                  <AskButton
                    onClick={handleAsk}
                    isLoading={isLoading}
                    disabled={!question.trim()}
                  />
                </div>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-xs text-center text-muted-foreground"
              >
                Press <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs font-mono">Enter</kbd> to send,
                {' '}
                <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs font-mono">Shift+Enter</kbd> for new line
              </motion.p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
