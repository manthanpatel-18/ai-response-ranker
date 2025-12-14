import { motion } from 'framer-motion';
import { Trophy, Medal, Award } from 'lucide-react';

interface RankingBadgeProps {
  rank: 1 | 2 | 3;
}

const rankConfig = {
  1: {
    icon: Trophy,
    label: '#1 Best Answer',
    className: 'rank-gold text-background',
    emoji: '🥇',
  },
  2: {
    icon: Medal,
    label: '#2 Runner Up',
    className: 'rank-silver text-background',
    emoji: '🥈',
  },
  3: {
    icon: Award,
    label: '#3 Third Place',
    className: 'rank-bronze text-background',
    emoji: '🥉',
  },
};

export default function RankingBadge({ rank }: RankingBadgeProps) {
  const config = rankConfig[rank];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 260, 
        damping: 20,
        delay: rank * 0.1 
      }}
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm
        ${config.className}
      `}
    >
      <Icon className="w-4 h-4" />
      <span>{config.label}</span>
      <span className="text-base">{config.emoji}</span>
    </motion.div>
  );
}
