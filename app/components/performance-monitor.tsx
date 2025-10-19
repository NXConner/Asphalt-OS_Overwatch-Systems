
/**
 * Performance Monitoring Component
 * Displays performance metrics in development
 */

'use client';

import { useEffect, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  memory: number;
  renderTime: number;
}

export function PerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: 0,
    renderTime: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return;

    // Toggle visibility with Ctrl+Shift+P
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible((v) => !v);
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    // FPS monitoring
    let lastTime = performance.now();
    let frames = 0;

    const measureFPS = () => {
      const now = performance.now();
      frames++;

      if (now >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (now - lastTime));
        
        // Get memory usage if available
        const memory = (performance as any).memory 
          ? Math.round((performance as any).memory.usedJSHeapSize / 1048576)
          : 0;

        setMetrics((prev) => ({
          ...prev,
          fps,
          memory,
        }));

        frames = 0;
        lastTime = now;
      }

      requestAnimationFrame(measureFPS);
    };

    const rafId = requestAnimationFrame(measureFPS);

    // Measure render time
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const renderEntry = entries.find((e) => e.entryType === 'measure');
      if (renderEntry) {
        setMetrics((prev) => ({
          ...prev,
          renderTime: Math.round(renderEntry.duration),
        }));
      }
    });

    observer.observe({ entryTypes: ['measure'] });

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  if (!isVisible || process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] bg-black/90 text-white p-3 rounded-lg text-xs font-mono shadow-lg">
      <div className="font-bold mb-2">Performance Monitor</div>
      <div className="space-y-1">
        <div className="flex justify-between gap-4">
          <span>FPS:</span>
          <span className={metrics.fps < 30 ? 'text-red-400' : 'text-green-400'}>
            {metrics.fps}
          </span>
        </div>
        {metrics.memory > 0 && (
          <div className="flex justify-between gap-4">
            <span>Memory:</span>
            <span>{metrics.memory} MB</span>
          </div>
        )}
        {metrics.renderTime > 0 && (
          <div className="flex justify-between gap-4">
            <span>Render:</span>
            <span>{metrics.renderTime} ms</span>
          </div>
        )}
      </div>
      <div className="mt-2 text-[10px] text-gray-400">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  );
}
