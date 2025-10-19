
/**
 * Achievement Definitions and Tracking
 */

import { Achievement, AchievementCategory } from './types';

export const ACHIEVEMENTS: Achievement[] = [
  // CAREER ACHIEVEMENTS
  {
    id: 'first-mission',
    category: 'CAREER',
    name: 'Rookie Contractor',
    description: 'Complete your first mission',
    icon: '🎖️',
    xpReward: 50,
    prestigeReward: 25,
    requirement: 1,
  },
  {
    id: 'centurion',
    category: 'CAREER',
    name: 'Centurion',
    description: 'Complete 100 missions',
    icon: '💯',
    xpReward: 1000,
    prestigeReward: 500,
    requirement: 100,
  },
  {
    id: 'thousand-roads',
    category: 'CAREER',
    name: 'Thousand Roads',
    description: 'Complete 1,000 missions',
    icon: '🛣️',
    xpReward: 10000,
    prestigeReward: 5000,
    requirement: 1000,
  },
  
  // QUALITY ACHIEVEMENTS
  {
    id: 'perfectionist',
    category: 'QUALITY',
    name: 'Perfectionist',
    description: 'Complete 50 perfect (5-star) missions',
    icon: '⭐',
    xpReward: 2000,
    prestigeReward: 1000,
    requirement: 50,
  },
  {
    id: 'flawless-craftsman',
    category: 'QUALITY',
    name: 'Flawless Craftsman',
    description: 'Complete 10 consecutive perfect missions',
    icon: '💎',
    xpReward: 1500,
    prestigeReward: 750,
    requirement: 10,
  },
  
  // SPEED ACHIEVEMENTS
  {
    id: 'speed-demon',
    category: 'SPEED',
    name: 'Speed Demon',
    description: 'Complete 10 missions 50% under time',
    icon: '⚡',
    xpReward: 1000,
    prestigeReward: 500,
    requirement: 10,
  },
  {
    id: 'lightning-strike',
    category: 'SPEED',
    name: 'Lightning Strike',
    description: 'Complete a mission in under 1 hour',
    icon: '🌩️',
    xpReward: 500,
    prestigeReward: 250,
    requirement: 1,
  },
  
  // FINANCIAL ACHIEVEMENTS
  {
    id: 'first-million',
    category: 'FINANCIAL',
    name: 'First Million',
    description: 'Earn $1,000,000 total revenue',
    icon: '💰',
    xpReward: 2000,
    prestigeReward: 1000,
    requirement: 1000000,
  },
  {
    id: 'profit-master',
    category: 'FINANCIAL',
    name: 'Profit Master',
    description: 'Maintain 60%+ profit margin for 6 months',
    icon: '📈',
    xpReward: 3000,
    prestigeReward: 1500,
    requirement: 1,
  },
  {
    id: 'investment-guru',
    category: 'FINANCIAL',
    name: 'Investment Guru',
    description: 'Own $500,000 in equipment',
    icon: '🏦',
    xpReward: 2500,
    prestigeReward: 1250,
    requirement: 500000,
  },
  
  // EMPLOYEE ACHIEVEMENTS
  {
    id: 'recruiter',
    category: 'EMPLOYEE',
    name: 'Recruiter',
    description: 'Hire 10 employees',
    icon: '👥',
    xpReward: 500,
    prestigeReward: 250,
    requirement: 10,
  },
  {
    id: 'dream-team',
    category: 'EMPLOYEE',
    name: 'Dream Team',
    description: 'Have 5 legendary-rank warriors',
    icon: '🌟',
    xpReward: 5000,
    prestigeReward: 2500,
    requirement: 5,
  },
  {
    id: 'zero-turnover',
    category: 'EMPLOYEE',
    name: 'Zero Turnover',
    description: 'No employee leaves for 12 months',
    icon: '🛡️',
    xpReward: 3000,
    prestigeReward: 1500,
    requirement: 1,
  },
  
  // SAFETY ACHIEVEMENTS
  {
    id: 'safety-champion',
    category: 'SAFETY',
    name: 'Safety Champion',
    description: '365 days accident-free',
    icon: '🏥',
    xpReward: 5000,
    prestigeReward: 2500,
    requirement: 365,
  },
  {
    id: 'safety-first',
    category: 'SAFETY',
    name: 'Safety First',
    description: '30 days accident-free',
    icon: '⚠️',
    xpReward: 500,
    prestigeReward: 250,
    requirement: 30,
  },
  
  // SPECIAL ACHIEVEMENTS
  {
    id: 'early-bird',
    category: 'SPECIAL',
    name: 'Early Bird',
    description: 'Clock in before 6 AM for 30 days',
    icon: '🌅',
    xpReward: 1000,
    prestigeReward: 500,
    requirement: 30,
  },
  {
    id: 'night-owl',
    category: 'SPECIAL',
    name: 'Night Owl',
    description: 'Complete 10 missions after 8 PM',
    icon: '🌙',
    xpReward: 750,
    prestigeReward: 375,
    requirement: 10,
  },
  {
    id: 'weather-warrior',
    category: 'SPECIAL',
    name: 'Weather Warrior',
    description: 'Complete 5 missions in adverse weather',
    icon: '⛈️',
    xpReward: 1000,
    prestigeReward: 500,
    requirement: 5,
  },
  
  // HIDDEN ACHIEVEMENTS
  {
    id: 'easter-egg-hunter',
    category: 'HIDDEN',
    name: 'Easter Egg Hunter',
    description: 'Find the hidden easter egg',
    icon: '🥚',
    xpReward: 500,
    prestigeReward: 250,
    requirement: 1,
    hidden: true,
  },
  {
    id: 'completionist',
    category: 'HIDDEN',
    name: 'Completionist',
    description: 'Unlock ALL achievements',
    icon: '🌈',
    xpReward: 10000,
    prestigeReward: 5000,
    requirement: 1,
    hidden: true,
  },
];

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

export function getAchievementsByCategory(category: AchievementCategory): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.category === category && !a.hidden);
}

export function getAllAchievements(): Achievement[] {
  return ACHIEVEMENTS.filter(a => !a.hidden);
}

export function getHiddenAchievements(): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.hidden);
}

export function calculateAchievementProgress(
  achievement: Achievement,
  currentValue: number
): {
  progress: number;
  percentage: number;
  isComplete: boolean;
} {
  const progress = Math.min(currentValue, achievement.requirement);
  const percentage = (progress / achievement.requirement) * 100;
  const isComplete = progress >= achievement.requirement;

  return {
    progress,
    percentage,
    isComplete,
  };
}
