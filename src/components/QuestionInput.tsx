import { motion } from 'framer-motion';
import { forwardRef } from 'react';

interface QuestionInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

const QuestionInput = forwardRef<HTMLTextAreaElement, QuestionInputProps>(
  ({ value, onChange, disabled = false }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-3xl mx-auto relative z-20"
        style={{ pointerEvents: 'auto' }}
      >
        <div className="relative glass-card p-1 gradient-border" style={{ pointerEvents: 'auto' }}>
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => {
              const newValue = e.target.value;
              if (newValue.length <= 500) {
                onChange(newValue);
              }
            }}
            onFocus={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            disabled={disabled}
            maxLength={500}
            placeholder="Ask any question and get the best AI-ranked answers..."
            className="w-full min-h-[60px] max-h-[200px] p-4 bg-transparent text-foreground placeholder:text-muted-foreground/60 resize-none focus:outline-none text-base font-medium rounded-xl relative z-10"
            style={{ pointerEvents: 'auto', position: 'relative' }}
            aria-label="Enter your question"
          />
          <div className="absolute bottom-4 right-4 text-xs text-muted-foreground pointer-events-none z-20">
            {value.length} / 500
          </div>
        </div>
      </motion.div>
    );
  }
);

QuestionInput.displayName = 'QuestionInput';

export default QuestionInput;
