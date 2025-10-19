
/**
 * Database Query Optimization Utilities
 * Provides helpers for efficient Prisma queries
 */

import { Prisma } from '@prisma/client';

/**
 * Common select fields to reduce data transfer
 */
export const selectFields = {
  user: {
    id: true,
    name: true,
    email: true,
    role: true,
    firstName: true,
    lastName: true,
    image: true,
    isActive: true,
  },
  userWithTracking: {
    id: true,
    name: true,
    email: true,
    role: true,
    firstName: true,
    lastName: true,
    image: true,
    isActive: true,
    isCurrentlyClockedIn: true,
    lastClockInTime: true,
  },
  job: {
    id: true,
    title: true,
    description: true,
    status: true,
    priority: true,
    startDate: true,
    endDate: true,
    estimatedCost: true,
    actualCost: true,
    latitude: true,
    longitude: true,
    address: true,
    createdAt: true,
  },
  estimate: {
    id: true,
    title: true,
    description: true,
    totalAmount: true,
    status: true,
    validUntil: true,
    createdAt: true,
  },
  expense: {
    id: true,
    description: true,
    amount: true,
    category: true,
    date: true,
    receiptUrl: true,
    createdAt: true,
  },
  revenue: {
    id: true,
    description: true,
    amount: true,
    category: true,
    date: true,
    source: true,
    createdAt: true,
  },
};

/**
 * Pagination helper
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export function getPaginationArgs(params: PaginationParams) {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 20));
  const skip = (page - 1) * limit;

  return {
    skip,
    take: limit,
    page,
    limit,
  };
}

export function createPaginatedResult<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResult<T> {
  const totalPages = Math.ceil(total / limit);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
    },
  };
}

/**
 * Date range filter helper
 */
export interface DateRangeParams {
  startDate?: string | Date;
  endDate?: string | Date;
}

export function getDateRangeFilter(params: DateRangeParams, field: string = 'createdAt') {
  const filter: any = {};

  if (params.startDate || params.endDate) {
    filter[field] = {};
    
    if (params.startDate) {
      filter[field].gte = new Date(params.startDate);
    }
    
    if (params.endDate) {
      filter[field].lte = new Date(params.endDate);
    }
  }

  return filter;
}

/**
 * Search filter helper
 */
export function getSearchFilter(
  searchTerm: string | undefined,
  fields: string[]
): any {
  if (!searchTerm) {
    return {};
  }

  return {
    OR: fields.map(field => ({
      [field]: {
        contains: searchTerm,
        mode: 'insensitive' as Prisma.QueryMode,
      },
    })),
  };
}

/**
 * Optimized include for relations
 */
export const optimizedIncludes = {
  jobWithCreator: {
    createdBy: {
      select: selectFields.user,
    },
  },
  jobWithAll: {
    createdBy: {
      select: selectFields.user,
    },
    estimates: {
      select: selectFields.estimate,
      take: 5,
      orderBy: { createdAt: 'desc' as const },
    },
  },
  estimateWithUser: {
    createdBy: {
      select: selectFields.user,
    },
  },
  expenseWithUser: {
    createdBy: {
      select: selectFields.user,
    },
    approvedBy: {
      select: selectFields.user,
    },
  },
};

/**
 * Batch operation helper
 */
export async function batchProcess<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  batchSize: number = 10
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(item => processor(item))
    );
    results.push(...batchResults);
  }
  
  return results;
}

/**
 * Connection pool configuration
 */
export const connectionPoolConfig = {
  connection_limit: 10,
  pool_timeout: 20,
};
