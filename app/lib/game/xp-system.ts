
/**
 * XP Calculation and Leveling System
 */

import { getXPRequiredForLevel, calculateLevel, XPGain } from './types';

// XP Sources and Amounts
export const XP_SOURCES = {
  // Job Completion
  JOB_COMPLETE_SMALL: 50,
  JOB_COMPLETE_MEDIUM: 150,
  JOB_COMPLETE_LARGE: 300,
  JOB_COMPLETE_HUGE: 500,
  
  // Quality Bonuses
  FIVE_STAR_BONUS: 100,
  PERFECT_WORK_BONUS: 50,
  
  // Time Bonuses
  ON_TIME_COMPLETION: 50,
  EARLY_COMPLETION: 75,
  SPEED_BONUS: 100,
  
  // Cost Bonuses
  UNDER_BUDGET: 75,
  WAY_UNDER_BUDGET: 150,
  
  // Safety
  ZERO_INCIDENTS: 25,
  SAFETY_RECORD: 50,
  
  // Client Relations
  CLIENT_SATISFACTION: 30,
  REPEAT_CUSTOMER: 50,
  NEW_CLIENT: 100,
  CLIENT_REFERRAL: 150,
  
  // Employee
  EMPLOYEE_TRAINING: 20,
  EMPLOYEE_CERTIFICATION: 50,
  
  // Achievements
  ACHIEVEMENT_UNLOCK: 100,
};

/**
 * Calculate XP for job completion
 */
export function calculateJobXP(job: {
  totalCost: number;
  status: string;
  rating?: number;
  completedOnTime?: boolean;
  budgetUsed?: number;
  budgetTotal?: number;
  incidents?: number;
}): {
  baseXP: number;
  bonuses: XPGain[];
  totalXP: number;
} {
  // Base XP based on job size
  let baseXP = XP_SOURCES.JOB_COMPLETE_SMALL;
  if (job.totalCost > 10000) baseXP = XP_SOURCES.JOB_COMPLETE_HUGE;
  else if (job.totalCost > 5000) baseXP = XP_SOURCES.JOB_COMPLETE_LARGE;
  else if (job.totalCost > 2000) baseXP = XP_SOURCES.JOB_COMPLETE_MEDIUM;

  const bonuses: XPGain[] = [];

  // Quality bonuses
  if (job.rating === 5) {
    bonuses.push({
      source: 'QUALITY',
      amount: XP_SOURCES.FIVE_STAR_BONUS,
      reason: 'Perfect 5-star rating',
      timestamp: new Date(),
    });
  }

  // Time bonuses
  if (job.completedOnTime) {
    bonuses.push({
      source: 'TIME',
      amount: XP_SOURCES.ON_TIME_COMPLETION,
      reason: 'Completed on time',
      timestamp: new Date(),
    });
  }

  // Budget bonuses
  if (job.budgetUsed && job.budgetTotal) {
    const budgetPercent = (job.budgetUsed / job.budgetTotal) * 100;
    if (budgetPercent < 80) {
      bonuses.push({
        source: 'BUDGET',
        amount: XP_SOURCES.WAY_UNDER_BUDGET,
        reason: 'Way under budget',
        timestamp: new Date(),
      });
    } else if (budgetPercent < 95) {
      bonuses.push({
        source: 'BUDGET',
        amount: XP_SOURCES.UNDER_BUDGET,
        reason: 'Under budget',
        timestamp: new Date(),
      });
    }
  }

  // Safety bonuses
  if (job.incidents === 0) {
    bonuses.push({
      source: 'SAFETY',
      amount: XP_SOURCES.ZERO_INCIDENTS,
      reason: 'Zero safety incidents',
      timestamp: new Date(),
    });
  }

  const totalXP = baseXP + bonuses.reduce((sum, bonus) => sum + bonus.amount, 0);

  return {
    baseXP,
    bonuses,
    totalXP,
  };
}

/**
 * Calculate employee XP gain
 */
export function calculateEmployeeXP(jobXP: number, role: string): number {
  const baseEmployeeXP = Math.floor(jobXP * 0.6); // Employees get 60% of job XP

  // Role-based multipliers
  const roleMultipliers: Record<string, number> = {
    FOREMAN: 1.2,
    SPECIALIST: 1.15,
    OPERATOR: 1.1,
    SCOUT: 1.05,
    LABORER: 1.0,
  };

  const multiplier = roleMultipliers[role] || 1.0;
  return Math.floor(baseEmployeeXP * multiplier);
}

/**
 * Level up rewards
 */
export function getLevelUpRewards(level: number): {
  skillPoints: number;
  prestigePoints: number;
  unlocks: string[];
} {
  const rewards = {
    skillPoints: 1, // Always get 1 skill point
    prestigePoints: level * 10, // 10 PP per level
    unlocks: [] as string[],
  };

  // Special rewards at milestones
  if (level % 5 === 0) {
    rewards.unlocks.push('New vehicle/equipment unlock');
  }

  if (level % 10 === 0) {
    rewards.unlocks.push('New service type available');
    rewards.prestigePoints += 100; // Bonus PP
  }

  if (level % 25 === 0) {
    rewards.unlocks.push('Major title upgrade');
    rewards.prestigePoints += 500; // Big bonus
  }

  if (level === 100) {
    rewards.unlocks.push('Dynasty Master title');
    rewards.unlocks.push('Exclusive legendary rewards');
    rewards.prestigePoints += 10000;
  }

  return rewards;
}

/**
 * Get rank title based on level
 */
export function getRankTitle(level: number): string {
  if (level < 10) return 'Novice Contractor';
  if (level < 25) return 'Apprentice Paver';
  if (level < 50) return 'Journeyman Contractor';
  if (level < 75) return 'Master Craftsman';
  if (level < 100) return 'Elite Operator';
  return 'Dynasty Master';
}

/**
 * Get reputation tier based on reputation points
 */
export function getReputationTier(reputation: number): string {
  if (reputation < 1000) return 'Unknown';
  if (reputation < 5000) return 'Local Contractor';
  if (reputation < 15000) return 'Respected Business';
  if (reputation < 40000) return 'Regional Leader';
  if (reputation < 100000) return 'State Champion';
  return 'National Legend';
}
