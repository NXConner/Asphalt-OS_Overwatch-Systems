
'use client';

import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface GlitchWrapperProps {
  children: React.ReactNode;
  className?: string;
  enableGlitch?: boolean;
  onClick?: () => void;
}

export function GlitchWrapper({
  children,
  className,
  enableGlitch = true,
  onClick,
}: GlitchWrapperProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleClick = () => {
    if (enableGlitch) {
      setIsGlitching(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setIsGlitching(false), 300);
    }
    onClick?.();
  };

  return (
    <div
      className={cn(
        className,
        isGlitching && 'glitch-effect'
      )}
      onClick={handleClick}
    >
      {children}
    </div>
  );
}
