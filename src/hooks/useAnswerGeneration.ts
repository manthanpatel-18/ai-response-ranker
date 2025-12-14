import { useState, useCallback } from 'react';
import { Answer } from '@/types';
import { generateAndRankAnswers } from '@/services/openai';
import { useToast } from '@/hooks/use-toast';

interface UseAnswerGenerationReturn {
  answers: Answer[] | null;
  isLoading: boolean;
  error: string | null;
  generateFromQuestion: (question: string) => Promise<void>;
  reset: () => void;
}

export function useAnswerGeneration(): UseAnswerGenerationReturn {
  const [answers, setAnswers] = useState<Answer[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateFromQuestion = useCallback(async (question: string) => {
    if (!question.trim()) {
      toast({
        title: 'Empty Question',
        description: 'Please enter a question to get answers.',
        variant: 'destructive',
      });
      return;
    }

    // Get API key from environment variable
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

    if (!apiKey || !apiKey.trim()) {
      const errorMsg = 'OpenAI API key not found. Please set VITE_OPENAI_API_KEY in your .env file.';
      setError(errorMsg);
      toast({
        title: 'API Key Missing',
        description: errorMsg,
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnswers(null);

    try {
      const result = await generateAndRankAnswers(question, apiKey);
      setAnswers(result);
      toast({
        title: 'Answers Generated! 🎉',
        description: 'We ranked the best answers for your question.',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate answers';
      setError(errorMessage);
      toast({
        title: 'Generation Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const reset = useCallback(() => {
    setAnswers(null);
    setError(null);
  }, []);

  return {
    answers,
    isLoading,
    error,
    generateFromQuestion,
    reset,
  };
}
