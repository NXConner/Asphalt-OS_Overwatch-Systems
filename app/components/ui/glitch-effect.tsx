
'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface GlitchEffectProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  triggerOnHover?: boolean;
  autoGlitch?: boolean;
  autoGlitchInterval?: number;
}

export function GlitchEffect({
  children,
  className,
  intensity = 'medium',
  triggerOnHover = false,
  autoGlitch = true,
  autoGlitchInterval = 5000,
}: GlitchEffectProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const intensitySettings = {
    low: {
      duration: 200,
      offsetRange: 3,
      scaleRange: 0.02,
      skewRange: 2,
    },
    medium: {
      duration: 400,
      offsetRange: 6,
      scaleRange: 0.05,
      skewRange: 5,
    },
    high: {
      duration: 600,
      offsetRange: 10,
      scaleRange: 0.08,
      skewRange: 8,
    },
  };

  const settings = intensitySettings[intensity];

  const triggerGlitch = () => {
    setIsGlitching(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsGlitching(false);
    }, settings.duration);
  };

  useEffect(() => {
    if (autoGlitch && !triggerOnHover) {
      const interval = setInterval(triggerGlitch, autoGlitchInterval);
      return () => clearInterval(interval);
    }
  }, [autoGlitch, triggerOnHover, autoGlitchInterval]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={contentRef}
      className={cn('relative inline-block', className)}
      onMouseEnter={triggerOnHover ? triggerGlitch : undefined}
      style={{
        filter: isGlitching ? 'blur(0.5px)' : 'none',
      }}
    >
      {/* Main content */}
      <div
        className={cn('relative z-10 transition-all duration-100')}
        style={{
          transform: isGlitching
            ? `translate(${Math.random() * settings.offsetRange - settings.offsetRange / 2}px, ${Math.random() * settings.offsetRange - settings.offsetRange / 2}px) 
               scale(${1 + (Math.random() * settings.scaleRange - settings.scaleRange / 2)}) 
               skew(${Math.random() * settings.skewRange - settings.skewRange / 2}deg, ${Math.random() * settings.skewRange - settings.skewRange / 2}deg)`
            : 'none',
          opacity: isGlitching ? 0.9 : 1,
        }}
      >
        {children}
      </div>

      {/* Glitch layers */}
      {isGlitching && (
        <>
          {/* Red channel offset */}
          <div
            className="absolute inset-0 z-0 pointer-events-none opacity-70"
            style={{
              transform: `translate(${Math.random() * 6 - 3}px, ${Math.random() * 2 - 1}px)`,
              mixBlendMode: 'screen',
              filter: 'blur(0.5px)',
            }}
          >
            <div className="text-red-500 [&>*]:text-red-500" style={{ color: 'rgb(239, 68, 68)' }}>
              {children}
            </div>
          </div>

          {/* Cyan channel offset */}
          <div
            className="absolute inset-0 z-0 pointer-events-none opacity-70"
            style={{
              transform: `translate(${Math.random() * -6 + 3}px, ${Math.random() * -2 + 1}px)`,
              mixBlendMode: 'screen',
              filter: 'blur(0.5px)',
            }}
          >
            <div className="text-cyan-500 [&>*]:text-cyan-500" style={{ color: 'rgb(6, 182, 212)' }}>
              {children}
            </div>
          </div>

          {/* Distortion lines */}
          <div className="absolute inset-0 z-20 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute w-full bg-white opacity-20"
                style={{
                  height: `${Math.random() * 3}px`,
                  top: `${Math.random() * 100}%`,
                  transform: `translateX(${Math.random() * 20 - 10}px)`,
                  animation: `glitch-line ${settings.duration}ms linear`,
                }}
              />
            ))}
          </div>

          {/* Scan line effect */}
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0, 0, 0, 0.1) 2px,
                rgba(0, 0, 0, 0.1) 4px
              )`,
            }}
          />
        </>
      )}

      <style jsx>{`
        @keyframes glitch-line {
          0%, 100% {
            transform: translateX(0);
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}
