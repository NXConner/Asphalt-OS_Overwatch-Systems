'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { EnhancementsHub } from '@/components/enhancements/EnhancementsHub';
import { Permission } from '@/lib/rbac';

export default function EnhancementsPage() {
  return (
    <ProtectedRoute requiredPermission={Permission.USE_AI_CHATBOT}>
      <div className="container mx-auto p-6">
        <EnhancementsHub />
      </div>
    </ProtectedRoute>
  );
}
