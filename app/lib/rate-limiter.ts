
/**
 * Rate Limiting Middleware for API Routes
 * Protects against abuse and DDoS attacks
 */

interface RateLimitConfig {
  windowMs: number;
  max: number;
  message?: string;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export function rateLimit(config: RateLimitConfig) {
  const { windowMs, max, message = 'Too many requests, please try again later' } = config;

  return async (request: Request) => {
    // Get IP address from headers
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    
    const key = `${ip}-${new URL(request.url).pathname}`;
    const now = Date.now();
    
    if (!store[key] || store[key].resetTime < now) {
      // Initialize or reset
      store[key] = {
        count: 1,
        resetTime: now + windowMs,
      };
      return null; // Allow request
    }
    
    store[key].count++;
    
    if (store[key].count > max) {
      const retryAfter = Math.ceil((store[key].resetTime - now) / 1000);
      return new Response(
        JSON.stringify({
          error: message,
          retryAfter,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': retryAfter.toString(),
            'X-RateLimit-Limit': max.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': store[key].resetTime.toString(),
          },
        }
      );
    }
    
    return null; // Allow request
  };
}

// Predefined rate limit configurations
export const rateLimiters = {
  // General API routes - 100 requests per 15 minutes
  general: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP, please try again later',
  }),
  
  // Authentication - 5 attempts per 15 minutes
  auth: rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again later',
  }),
  
  // File uploads - 20 per hour
  upload: rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 20,
    message: 'Too many file uploads, please try again later',
  }),
  
  // Search/query - 50 per 5 minutes
  search: rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 50,
    message: 'Too many search requests, please slow down',
  }),
  
  // Strict - 10 per minute (for sensitive operations)
  strict: rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: 'Rate limit exceeded for this operation',
  }),
};

// Helper to apply rate limiting to API routes
export async function withRateLimit(
  request: Request,
  handler: () => Promise<Response>,
  limiter = rateLimiters.general
) {
  const limitResponse = await limiter(request);
  
  if (limitResponse) {
    return limitResponse;
  }
  
  return handler();
}

