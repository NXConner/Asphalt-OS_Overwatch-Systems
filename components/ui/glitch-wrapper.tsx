'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export function GlitchWrapper({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-0 pointer-events-none glitch-effect" />
      <div className="absolute inset-0 pointer-events-none glitch-effect-color" />
      {children}
    </div>
  );
}
