
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { NextResponse } from 'next/server';
import { Permission, hasPermission, UserRole } from './rbac';

/**
 * API Route Protection Helper
 * Use this in API routes to enforce RBAC
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return {
      error: true,
      response: NextResponse.json(
        { error: 'Unauthorized - Please sign in' },
        { status: 401 }
      )
    };
  }
  
  return {
    error: false,
    session,
    user: session.user
  };
}

/**
 * Require specific permission for API route
 */
export async function requirePermissions(permissions: Permission[]) {
  const authResult = await requireAuth();
  
  if (authResult.error || !authResult.user) {
    return authResult;
  }
  
  const userRole = authResult.user.role as UserRole;
  
  const hasRequiredPermissions = permissions.every(permission =>
    hasPermission(userRole, permission)
  );
  
  if (!hasRequiredPermissions) {
    return {
      error: true,
      response: NextResponse.json(
        { error: 'Forbidden - Insufficient permissions' },
        { status: 403 }
      )
    };
  }
  
  return {
    error: false,
    session: authResult.session,
    user: authResult.user
  };
}

/**
 * Check if user is OWNER
 */
export async function requireOwner() {
  const authResult = await requireAuth();
  
  if (authResult.error || !authResult.user) {
    return authResult;
  }
  
  if (authResult.user.role !== 'OWNER') {
    return {
      error: true,
      response: NextResponse.json(
        { error: 'Forbidden - Owner access required' },
        { status: 403 }
      )
    };
  }
  
  return authResult;
}

/**
 * Check if user is OWNER or ADMIN
 */
export async function requireAdminOrOwner() {
  const authResult = await requireAuth();
  
  if (authResult.error || !authResult.user) {
    return authResult;
  }
  
  const role = authResult.user.role;
  
  if (role !== 'OWNER' && role !== 'ADMIN') {
    return {
      error: true,
      response: NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    };
  }
  
  return authResult;
}
