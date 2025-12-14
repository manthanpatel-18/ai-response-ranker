import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ThreeBackground from '@/components/ThreeBackground';
import HeroSection from '@/components/HeroSection';
import QuestionInput from '@/components/QuestionInput';
import AskButton from '@/components/AskButton';
import ResultsSection from '@/components/ResultsSection';
import { useAnswerGeneration } from '@/hooks/useAnswerGeneration';

const Index = () => {
  const [question, setQuestion] = useState('');
  const { answers, isLoading, generateFromQuestion, reset } = useAnswerGeneration();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleAsk = useCallback(() => {
    if (question.trim() && !isLoading) {
      generateFromQuestion(question);
    }
  }, [question, isLoading, generateFromQuestion]);

  // Handle Enter key to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && !answers && !isLoading) {
        e.preventDefault();
        handleAsk();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleAsk, answers, isLoading]);

  const handleReset = () => {
    reset();
    setQuestion('');
    inputRef.current?.focus();
  };

  const showResults = answers || isLoading;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* 3D Background */}
      <ThreeBackground />

      {/* Gradient overlays for depth */}
      <div className="fixed inset-0 bg-gradient-to-b from-background/50 via-transparent to-background pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="relative z-20 container mx-auto px-4 pt-28 pb-16">
        <AnimatePresence mode="wait">
          {!showResults ? (
            <motion.div
              key="input"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center"
            >
              {/* Hero Section */}
              <HeroSection />

              {/* Question Input */}
              <QuestionInput
                ref={inputRef}
                value={question}
                onChange={setQuestion}
                disabled={isLoading}
              />

              {/* Ask Button */}
              <div className="mt-8 relative z-20">
                <AskButton
                  onClick={handleAsk}
                  isLoading={isLoading}
                  disabled={!question.trim()}
                />
              </div>

              {/* Keyboard hint */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-sm text-muted-foreground"
              >
                Press{' '}
                <kbd className="px-2 py-1 bg-secondary rounded text-xs font-mono">
                  Enter
                </kbd>{' '}
                to ask
              </motion.p>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
            >
              {/* Question display */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-10"
              >
                <p className="text-sm text-muted-foreground mb-2">Your Question</p>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground max-w-3xl mx-auto">
                  "{question}"
                </h2>
              </motion.div>

              {/* Results */}
              <ResultsSection
                answers={answers}
                isLoading={isLoading}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-border/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 AnswerRank AI. Powered by advanced machine learning.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
