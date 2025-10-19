
/**
 * In-Memory Cache System for API Responses
 * Implements time-based expiration and cache invalidation
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class CacheManager {
  private cache: Map<string, CacheEntry<any>>;
  private cleanupInterval: NodeJS.Timeout | null;

  constructor() {
    this.cache = new Map();
    this.cleanupInterval = null;
    this.startCleanup();
  }

  /**
   * Get cached data if not expired
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const isExpired = now - entry.timestamp > entry.ttl;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cache data with TTL
   */
  set<T>(key: string, data: T, ttl: number = 60000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  }

  /**
   * Delete specific cache entry
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Delete all cache entries matching pattern
   */
  invalidate(pattern: string): number {
    let count = 0;
    const regex = new RegExp(pattern);

    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
        count++;
      }
    }

    return count;
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  /**
   * Start periodic cleanup of expired entries
   */
  private startCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      
      for (const [key, entry] of this.cache.entries()) {
        if (now - entry.timestamp > entry.ttl) {
          this.cache.delete(key);
        }
      }
    }, 60000); // Clean up every minute
  }

  /**
   * Stop cleanup interval
   */
  stopCleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }
}

// Singleton instance
export const cache = new CacheManager();

// Cache key generators
export const cacheKeys = {
  jobs: {
    all: () => 'jobs:all',
    byId: (id: string) => `jobs:${id}`,
    byStatus: (status: string) => `jobs:status:${status}`,
  },
  employees: {
    all: () => 'employees:all',
    byId: (id: string) => `employees:${id}`,
    active: () => 'employees:active',
  },
  estimates: {
    all: () => 'estimates:all',
    byId: (id: string) => `estimates:${id}`,
    pending: () => 'estimates:pending',
  },
  financial: {
    summary: () => 'financial:summary',
    expenses: () => 'financial:expenses',
    revenue: () => 'financial:revenue',
  },
  analytics: {
    dashboard: () => 'analytics:dashboard',
    performance: () => 'analytics:performance',
  },
};

// Cache TTL constants (in milliseconds)
export const CACHE_TTL = {
  SHORT: 30000, // 30 seconds
  MEDIUM: 60000, // 1 minute
  LONG: 300000, // 5 minutes
  VERY_LONG: 900000, // 15 minutes
};

// Helper to wrap API calls with caching
export async function withCache<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<T> {
  // Try to get from cache first
  const cached = cache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetchFn();
  
  // Store in cache
  cache.set(key, data, ttl);
  
  return data;
}
