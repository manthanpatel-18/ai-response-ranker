import { motion } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import AnswerCard from './AnswerCard';
import LoadingSkeleton from './LoadingSkeleton';
import { Answer } from '@/types';

interface ResultsSectionProps {
  answers: Answer[] | null;
  isLoading: boolean;
  onReset: () => void;
}

export default function ResultsSection({ answers, isLoading, onReset }: ResultsSectionProps) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!answers) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="flex items-center justify-between mb-8">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-foreground"
        >
          Ranked Answers
        </motion.h2>
        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors text-sm font-medium"
        >
          <RotateCcw className="w-4 h-4" />
          Ask Another
        </motion.button>
      </div>

      <div className="space-y-4">
        {answers.map((answer, index) => (
          <AnswerCard key={answer.id} answer={answer} index={index} />
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-8 text-sm text-muted-foreground"
      >
        Answers are ranked by AI confidence and accuracy analysis
      </motion.p>
    </motion.div>
  );
}
