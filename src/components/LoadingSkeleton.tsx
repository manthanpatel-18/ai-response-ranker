import { motion } from 'framer-motion';

export default function LoadingSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full max-w-3xl mx-auto space-y-6"
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 text-lg text-muted-foreground">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full"
          />
          <span>Generating & ranking answers...</span>
        </div>
      </motion.div>

      {[1, 2, 3].map((index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.15 }}
          className="glass-card p-6 space-y-4"
        >
          {/* Badge skeleton */}
          <div className="flex items-center gap-3">
            <div 
              className="h-8 w-32 rounded-full animate-shimmer"
              style={{
                background: 'linear-gradient(90deg, hsl(var(--secondary)) 25%, hsl(var(--muted)) 50%, hsl(var(--secondary)) 75%)',
                backgroundSize: '200% 100%',
              }}
            />
            <div 
              className="h-6 w-20 rounded-full animate-shimmer"
              style={{
                background: 'linear-gradient(90deg, hsl(var(--secondary)) 25%, hsl(var(--muted)) 50%, hsl(var(--secondary)) 75%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>

          {/* Content skeleton */}
          <div className="space-y-3">
            <div 
              className="h-4 w-full rounded animate-shimmer"
              style={{
                background: 'linear-gradient(90deg, hsl(var(--secondary)) 25%, hsl(var(--muted)) 50%, hsl(var(--secondary)) 75%)',
                backgroundSize: '200% 100%',
              }}
            />
            <div 
              className="h-4 w-5/6 rounded animate-shimmer"
              style={{
                background: 'linear-gradient(90deg, hsl(var(--secondary)) 25%, hsl(var(--muted)) 50%, hsl(var(--secondary)) 75%)',
                backgroundSize: '200% 100%',
              }}
            />
            <div 
              className="h-4 w-4/6 rounded animate-shimmer"
              style={{
                background: 'linear-gradient(90deg, hsl(var(--secondary)) 25%, hsl(var(--muted)) 50%, hsl(var(--secondary)) 75%)',
                backgroundSize: '200% 100%',
              }}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
