
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { z } from 'zod';

/**
 * Security middleware for API routes
 * Combines authentication, authorization, validation, and security headers
 */

interface SecurityConfig {
  requireAuth?: boolean;
  allowedRoles?: string[];
  validationSchema?: z.ZodSchema;
  rateLimit?: (request: Request) => Promise<Response | null>;
}

/**
 * Apply security middleware to API route handler
 */
export function withSecurity(
  handler: (request: Request, context?: any) => Promise<Response>,
  config: SecurityConfig = {}
) {
  return async (request: Request, context?: any) => {
    try {
      // 1. Apply rate limiting if configured
      if (config.rateLimit) {
        const rateLimitResponse = await config.rateLimit(request);
        if (rateLimitResponse) {
          return rateLimitResponse;
        }
      }

      // 2. Check authentication if required
      if (config.requireAuth !== false) {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
          return NextResponse.json(
            { error: 'Unauthorized - Authentication required' },
            { status: 401 }
          );
        }

        // 3. Check authorization (role-based access control)
        if (config.allowedRoles && config.allowedRoles.length > 0) {
          const userRole = session.user.role || 'employee';
          if (!config.allowedRoles.includes(userRole)) {
            return NextResponse.json(
              { error: 'Forbidden - Insufficient permissions' },
              { status: 403 }
            );
          }
        }
      }

      // 4. Validate request body if schema provided (for POST/PUT/PATCH)
      if (
        config.validationSchema &&
        (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH')
      ) {
        try {
          const body = await request.json();
          const validated = config.validationSchema.parse(body);
          
          // Attach validated data to request for handler to use
          (request as any).validatedData = validated;
          
          // Recreate request with original body for handler
          request = new Request(request.url, {
            method: request.method,
            headers: request.headers,
            body: JSON.stringify(validated),
          });
        } catch (error) {
          if (error instanceof z.ZodError) {
            return NextResponse.json(
              {
                error: 'Validation failed',
                details: error.issues.map((e: any) => ({
                  field: e.path.join('.'),
                  message: e.message,
                })),
              },
              { status: 400 }
            );
          }
          throw error;
        }
      }

      // 5. Execute handler
      const response = await handler(request, context);

      // 6. Add security headers
      response.headers.set('X-Content-Type-Options', 'nosniff');
      response.headers.set('X-Frame-Options', 'DENY');
      response.headers.set('X-XSS-Protection', '1; mode=block');
      response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
      response.headers.set(
        'Permissions-Policy',
        'camera=(), microphone=(), geolocation=(self)'
      );

      return response;
    } catch (error: any) {
      console.error('API Error:', error);
      
      // Don't expose internal errors to clients
      return NextResponse.json(
        {
          error: 'Internal server error',
          message: process.env.NODE_ENV === 'development' ? error.message : undefined,
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Helper to get validated data from request
 */
export function getValidatedData<T>(request: Request): T {
  return (request as any).validatedData as T;
}

/**
 * Helper for audit logging (to be implemented with actual audit system)
 */
export async function auditLog(action: string, details: any) {
  // TODO: Implement actual audit logging system
  if (process.env.NODE_ENV === 'development') {
    console.log('[AUDIT]', action, details);
  }
}
