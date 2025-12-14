import { motion } from 'framer-motion';
import { Zap, Brain, Trophy } from 'lucide-react';

export default function HeroSection() {
  const features = [
    { icon: Zap, text: 'Instant AI Answers' },
    { icon: Brain, text: 'Smart Ranking' },
    { icon: Trophy, text: 'Best Results First' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="text-center mb-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-6"
      >
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight">
          <span className="gradient-text">Ask Once.</span>
          <br />
          <span className="text-foreground">Get the Best Answer.</span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10"
      >
        Our AI generates multiple answers and ranks them so you always get the most accurate response first.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex flex-wrap items-center justify-center gap-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.text}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            whileHover={{ scale: 1.05, y: -2 }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full glass-card border border-border/50"
          >
            <feature.icon className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-foreground">{feature.text}</span>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
