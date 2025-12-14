import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';

interface AskButtonProps {
  onClick: () => void;
  isLoading: boolean;
  disabled?: boolean;
}

export default function AskButton({ onClick, isLoading, disabled = false }: AskButtonProps) {
  return (
    <motion.button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled && !isLoading) {
          onClick();
        }
      }}
      disabled={disabled || isLoading}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.05 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.95 }}
      className={`
        relative px-10 py-4 rounded-2xl font-semibold text-lg
        bg-gradient-primary text-primary-foreground
        transition-all duration-300
        disabled:opacity-50 disabled:cursor-not-allowed
        z-20
        ${!disabled && !isLoading ? 'hover:shadow-xl hover:shadow-primary/30 animate-pulse-glow' : ''}
      `}
      style={{ pointerEvents: 'auto', cursor: disabled || isLoading ? 'not-allowed' : 'pointer' }}
    >
      <span className="flex items-center gap-3">
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Ask AI
          </>
        )}
      </span>
    </motion.button>
  );
}
