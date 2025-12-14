import { motion } from 'framer-motion';
import { 
  Sparkles, 
  TrendingUp, 
  Shield, 
  Zap, 
  BarChart3, 
  Brain,
  CheckCircle2
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import ThreeBackground from '@/components/ThreeBackground';

const features = [
  {
    icon: Sparkles,
    title: 'Multi-Answer Generation',
    description: 'Get 3 distinct AI-generated answers for every question, each with a unique style and approach.',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: TrendingUp,
    title: 'Smart Ranking',
    description: 'Answers are intelligently ranked based on relevance, quality, and completeness using advanced algorithms.',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: BarChart3,
    title: 'Confidence Scoring',
    description: 'Each answer comes with a confidence score calculated from keyword overlap, structure, and clarity metrics.',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Brain,
    title: 'AI-Powered Reliability',
    description: 'Advanced scoring system detects and penalizes vague or uncertain answers to ensure quality.',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get ranked answers in seconds with parallel AI generation and optimized ranking algorithms.',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Shield,
    title: 'Quality Assurance',
    description: 'Built-in checks prevent hallucination-like responses and ensure accurate, reliable answers.',
    color: 'from-indigo-500 to-purple-500',
  },
];

const benefits = [
  'Compare multiple perspectives instantly',
  'Save time with pre-ranked best answers',
  'Trust confidence scores for decision making',
  'Get answers tailored to different needs',
  'No more sifting through similar responses',
];

export default function Features() {
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
            Powerful Features
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to get the best AI-ranked answers for any question
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-6 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="glass-card p-8 md:p-12 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-6 text-center gradient-text">
            Why Choose AnswerRank AI?
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-3"
              >
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-foreground">{benefit}</span>
              </motion.div>
            ))}
          </div>
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
