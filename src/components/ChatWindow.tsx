import { motion, AnimatePresence } from 'framer-motion';
import { User, Bot, Loader2 } from 'lucide-react';
import { useChatContext } from '@/context/ChatContext';
import AnswerCard from './AnswerCard';
import { Answer } from '@/types';

export default function ChatWindow() {
  const { currentChat, isLoading } = useChatContext();

  if (!currentChat) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
          <p className="text-muted-foreground">Start a new conversation</p>
        </div>
      </div>
    );
  }

  if (currentChat.messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <Bot className="w-16 h-16 mx-auto mb-4 text-primary/50" />
          <h3 className="text-xl font-semibold mb-2 text-foreground">
            Start Your Conversation
          </h3>
          <p className="text-muted-foreground">
            Ask any question and get AI-ranked answers with confidence scores
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <AnimatePresence mode="popLayout">
          {currentChat.messages.map((message, index) => (
            <motion.div
              key={`${message.timestamp}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
            >
              {message.role === 'user' ? (
                <div className="flex items-start gap-3 max-w-[80%]">
                  <div className="flex-1 glass-card p-4 rounded-2xl">
                    <p className="text-foreground whitespace-pre-wrap">{message.content}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-3 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    {message.answers && message.answers.length > 0 ? (
                      <div className="space-y-4">
                        {message.answers.map((answer: Answer, answerIndex: number) => (
                          <AnswerCard
                            key={answer.id}
                            answer={answer}
                            index={answerIndex}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="glass-card p-4 rounded-2xl">
                        <p className="text-foreground whitespace-pre-wrap">{message.content}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 max-w-[80%]"
          >
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 glass-card p-4 rounded-2xl">
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                <span className="text-muted-foreground">Generating answers...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
