
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Permission, hasPermission } from '@/lib/rbac';
import { UserRole } from '@/lib/rbac';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  requiredPermissions?: Permission[];
  fallback?: React.ReactNode;
}

export function ProtectedRoute({ 
  children, 
  requiredPermission,
  requiredPermissions = [],
  fallback = <div className="flex items-center justify-center h-screen">Loading...</div>
}: ProtectedRouteProps) {
  const { data: session, status } = useSession() || {};
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <>{fallback}</>;
  }

  if (!session?.user) {
    return <>{fallback}</>;
  }

  // Check permissions if required
  if (requiredPermission || requiredPermissions.length > 0) {
    const userRole = session.user.role as UserRole;
    const permissions = requiredPermission 
      ? [requiredPermission] 
      : requiredPermissions;

    const hasRequiredPermission = permissions.every(permission => 
      hasPermission(userRole, permission)
    );

    if (!hasRequiredPermission) {
      return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Go to Dashboard
          </button>
        </div>
      );
    }
  }

  return <>{children}</>;
}
