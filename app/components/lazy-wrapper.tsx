
/**
 * Lazy Loading Wrapper Component
 * Provides code splitting and lazy loading for heavy components
 */

'use client';

import { Suspense, lazy, ComponentType } from 'react';
import { Skeleton } from '@/components/ui/loading-skeleton';

interface LazyWrapperProps {
  loader: () => Promise<{ default: ComponentType<any> }>;
  fallback?: React.ReactNode;
  [key: string]: any;
}

/**
 * Generic lazy loading wrapper with custom fallback
 */
export function LazyWrapper({ 
  loader, 
  fallback = <Skeleton className="h-64 w-full" />,
  ...props 
}: LazyWrapperProps) {
  const LazyComponent = lazy(loader);

  return (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  );
}

/**
 * Example usage of LazyWrapper:
 * 
 * import { LazyWrapper } from '@/components/lazy-wrapper';
 * 
 * function MyComponent() {
 *   return (
 *     <LazyWrapper
 *       loader={() => import('./heavy-component')}
 *       fallback={<Skeleton className="h-64 w-full" />}
 *       someProp="value"
 *     />
 *   );
 * }
 */
