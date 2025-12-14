import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Copy, Check, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState } from 'react';
import RankingBadge from './RankingBadge';
import { Answer } from '@/types';

export type { Answer };

interface AnswerCardProps {
  answer: Answer;
  index: number;
}

export default function AnswerCard({ answer, index }: AnswerCardProps) {
  const [isExpanded, setIsExpanded] = useState(answer.rank === 1);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(answer.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring' as const,
        stiffness: 100,
        damping: 15,
        delay: index * 0.15,
      },
    },
  };

  const getRankGlow = () => {
    switch (answer.rank) {
      case 1:
        return 'hover:shadow-[0_0_40px_hsl(45_93%_47%/0.2)]';
      case 2:
        return 'hover:shadow-[0_0_30px_hsl(210_14%_60%/0.15)]';
      case 3:
        return 'hover:shadow-[0_0_25px_hsl(30_61%_50%/0.15)]';
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className={`
        glass-card overflow-hidden transition-all duration-300
        ${answer.rank === 1 ? 'ring-2 ring-rank-gold/30' : ''}
        ${getRankGlow()}
      `}
    >
      {/* Header */}
      <div
        className="p-6 cursor-pointer flex items-center justify-between"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-4 flex-wrap">
          <RankingBadge rank={answer.rank} />
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Confidence:</div>
            <div className="flex items-center gap-1">
              <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${answer.confidence}%` }}
                  transition={{ duration: 1, delay: index * 0.15 + 0.3 }}
                  className={`h-full rounded-full ${
                    answer.rank === 1
                      ? 'bg-gradient-to-r from-rank-gold to-yellow-400'
                      : answer.rank === 2
                      ? 'bg-gradient-to-r from-rank-silver to-slate-400'
                      : 'bg-gradient-to-r from-rank-bronze to-orange-400'
                  }`}
                />
              </div>
              <span className="text-sm font-medium text-foreground">{answer.confidence}%</span>
            </div>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <ChevronDown className="w-5 h-5 text-muted-foreground" />
        </motion.div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-6 pb-6">
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground/90 leading-relaxed text-base">
                  {answer.content}
                </p>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors text-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </motion.button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground mr-2">Was this helpful?</span>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setFeedback(feedback === 'up' ? null : 'up')}
                    className={`p-2 rounded-lg transition-colors ${
                      feedback === 'up'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    <ThumbsUp className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setFeedback(feedback === 'down' ? null : 'down')}
                    className={`p-2 rounded-lg transition-colors ${
                      feedback === 'down'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    <ThumbsDown className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
