import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ThreeBackground from '@/components/ThreeBackground';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for trying out AnswerRank AI',
    features: [
      '5 questions per day',
      'Basic ranking',
      'Standard confidence scores',
      'Community support',
    ],
    cta: 'Get Started',
    popular: false,
    color: 'from-gray-500 to-gray-600',
  },
  {
    name: 'Pro',
    price: '$19',
    period: 'month',
    description: 'For professionals who need reliable answers',
    features: [
      'Unlimited questions',
      'Advanced ranking algorithm',
      'Detailed confidence breakdowns',
      'Priority support',
      'API access',
      'Export results',
    ],
    cta: 'Start Pro Trial',
    popular: true,
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For teams and organizations',
    features: [
      'Everything in Pro',
      'Custom AI models',
      'White-label solution',
      'Dedicated support',
      'SLA guarantee',
      'Custom integrations',
    ],
    cta: 'Contact Sales',
    popular: false,
    color: 'from-blue-500 to-cyan-500',
  },
];

export default function Pricing() {
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
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
            Choose the plan that works for you
          </p>
          <p className="text-sm text-muted-foreground/70 italic">
            * Demo pricing - actual pricing may vary
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative glass-card p-8 ${
                plan.popular
                  ? 'ring-2 ring-primary scale-105 md:scale-110'
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-primary text-primary-foreground text-sm font-semibold rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-foreground">
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span className="text-4xl font-bold gradient-text">
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-muted-foreground">/{plan.period}</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/"
                className={`block w-full text-center px-6 py-3 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? 'bg-gradient-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/30'
                    : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}
              >
                {plan.cta}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="glass-card p-8 md:p-12 max-w-4xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-8 text-center gradient-text">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Can I change plans later?
              </h3>
              <p className="text-muted-foreground">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                What payment methods do you accept?
              </h3>
              <p className="text-muted-foreground">
                We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">
                Is there a free trial?
              </h3>
              <p className="text-muted-foreground">
                Yes! The Free plan is available forever. Pro plans include a 14-day free trial with full access.
              </p>
            </div>
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
