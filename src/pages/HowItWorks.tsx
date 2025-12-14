import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  Sparkles, 
  TrendingUp, 
  Trophy,
  ArrowRight
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import ThreeBackground from '@/components/ThreeBackground';

const steps = [
  {
    number: 1,
    icon: MessageSquare,
    title: 'Ask Your Question',
    description: 'Type any question into our intelligent input field. Our system accepts questions up to 500 characters.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    number: 2,
    icon: Sparkles,
    title: 'AI Generates Multiple Answers',
    description: 'Our system generates 3 distinct answers using different AI styles: concise, detailed, and practical.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    number: 3,
    icon: TrendingUp,
    title: 'Smart Ranking & Scoring',
    description: 'Each answer is analyzed for relevance, completeness, structure, and clarity. Confidence scores are calculated.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    number: 4,
    icon: Trophy,
    title: 'Best Answer First',
    description: 'Answers are ranked and displayed with the highest quality answer at the top, complete with confidence metrics.',
    color: 'from-orange-500 to-yellow-500',
  },
];

const scoringFactors = [
  {
    name: 'Keyword Overlap',
    weight: '40%',
    description: 'How well the answer addresses question keywords',
  },
  {
    name: 'Completeness',
    weight: '30%',
    description: 'Answer length relative to ideal range (150-350 chars)',
  },
  {
    name: 'Structural Quality',
    weight: '20%',
    description: 'Organization, lists, paragraphs, and clarity',
  },
  {
    name: 'Clarity Penalty',
    weight: '10%',
    description: 'Penalties for vague phrases and repetition',
  },
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <ThreeBackground />
      
      {/* Gradient overlays */}
      <div className="fixed inset-0 bg-gradient-to-b from-background/50 via-transparent to-background pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

      <Navbar />

      <main className="relative z-20 container mx-auto px-4 pt-32 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
            How It Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A simple, intelligent process to get you the best answers
          </p>
        </motion.div>

        {/* Steps Timeline */}
        <div className="max-w-4xl mx-auto mb-20">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;
            
            return (
              <div key={step.number} className="relative">
                <motion.div
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className={`flex flex-col md:flex-row items-center gap-6 mb-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  {/* Icon & Number */}
                  <div className="flex-shrink-0">
                    <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center relative z-10 shadow-lg`}>
                      <Icon className="w-10 h-10 text-white" />
                      <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{step.number}</span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`flex-1 glass-card p-6 ${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                    <h3 className="text-2xl font-bold mb-2 text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>

                {/* Connector Line */}
                {!isLast && (
                  <div className="hidden md:block absolute left-10 top-20 w-0.5 h-full bg-gradient-to-b from-primary/50 to-transparent" />
                )}
              </div>
            );
          })}
        </div>

        {/* Scoring System */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="glass-card p-8 md:p-12 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-8 text-center gradient-text">
            Confidence Scoring System
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Our algorithm evaluates answers across multiple dimensions to calculate confidence scores
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            {scoringFactors.map((factor, index) => (
              <motion.div
                key={factor.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.9 + index * 0.1 }}
                className="p-6 bg-secondary/50 rounded-xl border border-border/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-foreground">
                    {factor.name}
                  </h3>
                  <span className="text-sm font-bold text-primary">
                    {factor.weight}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {factor.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.3 }}
            className="mt-8 p-6 bg-primary/10 rounded-xl border border-primary/20"
          >
            <p className="text-center text-foreground">
              <strong>Final Score Formula:</strong> Relevance (30%) + Confidence (60%) - Hallucination Penalty (10%)
            </p>
          </motion.div>
        </motion.div>
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
}
