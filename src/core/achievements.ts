import type { Achievement } from './types';

export const achievements: Achievement[] = [
  {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '👣',
    unlocked: false,
    condition: {
      type: 'lessons',
      threshold: 1
    },
    xpReward: 50
  },
  {
    id: 'cli-novice',
    name: 'CLI Novice',
    description: 'Complete 5 lessons',
    icon: '🎓',
    unlocked: false,
    condition: {
      type: 'lessons',
      threshold: 5
    },
    xpReward: 100
  },
  {
    id: 'cli-master',
    name: 'CLI Master',
    description: 'Complete all core lessons',
    icon: '👑',
    unlocked: false,
    condition: {
      type: 'lessons',
      threshold: 10
    },
    xpReward: 250
  },
  {
    id: 'xp-hunter',
    name: 'XP Hunter',
    description: 'Earn 500 XP',
    icon: '✨',
    unlocked: false,
    condition: {
      type: 'xp',
      threshold: 500
    },
    xpReward: 100
  },
  {
    id: 'level-up',
    name: 'Level Up!',
    description: 'Reach level 5',
    icon: '📈',
    unlocked: false,
    condition: {
      type: 'xp',
      threshold: 400 // Level 5 = 400 XP
    },
    xpReward: 150
  },
  {
    id: 'streak-beginner',
    name: 'Streak Beginner',
    description: 'Maintain a 3-day streak',
    icon: '🔥',
    unlocked: false,
    condition: {
      type: 'streak',
      threshold: 3
    },
    xpReward: 75
  },
  {
    id: 'streak-master',
    name: 'Streak Master',
    description: 'Maintain a 7-day streak',
    icon: '🔥🔥',
    unlocked: false,
    condition: {
      type: 'streak',
      threshold: 7
    },
    xpReward: 200
  },
  {
    id: 'bit-collector',
    name: 'Bit Collector',
    description: 'Earn 100 Bits',
    icon: '🪙',
    unlocked: false,
    condition: {
      type: 'bits',
      threshold: 100
    },
    xpReward: 100
  },
  {
    id: 'xp-boost-user',
    name: 'XP Boost User',
    description: 'Use an XP Boost',
    icon: '🌟',
    unlocked: false,
    condition: {
      type: 'special',
      threshold: 1 // Has used XP boost
    },
    xpReward: 50
  },
  {
    id: 'quiz-master',
    name: 'Quiz Master',
    description: 'Complete 5 quizzes with perfect scores',
    icon: '📝',
    unlocked: false,
    condition: {
      type: 'quiz',
      threshold: 5
    },
    xpReward: 150
  },
  {
    id: 'review-expert',
    name: 'Review Expert',
    description: 'Complete 10 review sessions',
    icon: '🔁',
    unlocked: false,
    condition: {
      type: 'review',
      threshold: 10
    },
    xpReward: 150
  },
  {
    id: 'all-commands',
    name: 'All Commands',
    description: 'Learn all 12+ CLI commands',
    icon: '💻',
    unlocked: false,
    condition: {
      type: 'lessons',
      threshold: 14 // All lessons
    },
    xpReward: 300
  },
  {
    id: 'first-quiz',
    name: 'First Quiz',
    description: 'Complete your first quiz',
    icon: '✅',
    unlocked: false,
    condition: {
      type: 'quiz',
      threshold: 1
    },
    xpReward: 25
  },
  {
    id: 'first-review',
    name: 'First Review',
    description: 'Complete your first review session',
    icon: '🔄',
    unlocked: false,
    condition: {
      type: 'review',
      threshold: 1
    },
    xpReward: 25
  },
  {
    id: 'shopaholic',
    name: 'Shopaholic',
    description: 'Make your first purchase in the shop',
    icon: '🛒',
    unlocked: false,
    condition: {
      type: 'bits',
      threshold: 1 // Has spent bits
    },
    xpReward: 50
  },
  {
    id: 'lucky-spin',
    name: 'Lucky Spin',
    description: 'Win XP Boost from spin wheel',
    icon: '🎰',
    unlocked: false,
    condition: {
      type: 'special',
      threshold: 2 // Won XP boost
    },
    xpReward: 75
  }
];

export const checkAchievements = (
  progress: {
    xp: number;
    level: number;
    streak: number;
    bits: number;
    completedLessons: Set<string>;
    achievements: Achievement[];
  },
  action?: {
    type: 'lesson_complete' | 'quiz_complete' | 'review_complete' | 'spin_wheel' | 'shop_purchase';
    data?: any;
  }
): Achievement[] => {
  const unlocked: Achievement[] = [];
  const currentAchievements = [...progress.achievements];
  
  achievements.forEach(achievement => {
    // Skip if already unlocked
    const existing = currentAchievements.find(a => a.id === achievement.id);
    if (existing?.unlocked) return;
    
    let conditionMet = false;
    
    switch (achievement.condition.type) {
      case 'xp':
        conditionMet = progress.xp >= achievement.condition.threshold;
        break;
      case 'lessons':
        conditionMet = progress.completedLessons.size >= achievement.condition.threshold;
        break;
      case 'streak':
        conditionMet = progress.streak >= achievement.condition.threshold;
        break;
      case 'bits':
        conditionMet = progress.bits >= achievement.condition.threshold;
        break;
      case 'quiz':
        // Track quiz completions in action data
        if (action?.type === 'quiz_complete' && action.data?.perfectScore) {
          // This would need tracking quiz perfect scores count
          // For now, simplified
          conditionMet = false; // Would need additional tracking
        }
        break;
      case 'review':
        // Track review completions in action data  
        if (action?.type === 'review_complete') {
          // This would need tracking review session count
          conditionMet = false; // Would need additional tracking
        }
        break;
      case 'special':
        // Special achievements handled by action data
        if (action?.type === 'spin_wheel' && action.data?.wonXpBoost) {
          conditionMet = true;
        } else if (action?.type === 'shop_purchase') {
          conditionMet = true;
        }
        break;
    }
    
    if (conditionMet) {
      const unlockedAchievement = {
        ...achievement,
        unlocked: true,
        unlockedAt: new Date()
      };
      unlocked.push(unlockedAchievement);
      currentAchievements.push(unlockedAchievement);
    }
  });
  
  return unlocked;
};

export const getAchievementById = (id: string): Achievement | undefined => {
  return achievements.find(a => a.id === id);
};

export const getUnlockedAchievements = (userAchievements: Achievement[]): Achievement[] => {
  return userAchievements.filter(a => a.unlocked);
};

export const getLockedAchievements = (userAchievements: Achievement[]): Achievement[] => {
  const unlockedIds = new Set(userAchievements.filter(a => a.unlocked).map(a => a.id));
  return achievements.filter(a => !unlockedIds.has(a.id));
};