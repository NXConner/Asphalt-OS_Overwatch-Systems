
'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TickerItem {
  id: string;
  type: 'job' | 'employee' | 'alert' | 'info';
  message: string;
  time: Date;
}

interface BottomTickerProps {
  enabled?: boolean;
  onToggle?: (enabled: boolean) => void;
}

const DEMO_TICKER_ITEMS: TickerItem[] = [
  {
    id: '1',
    type: 'job',
    message: 'New job assigned: Main Street Paving - 2500 sq ft',
    time: new Date(),
  },
  {
    id: '2',
    type: 'employee',
    message: 'John Smith arrived at job site - Richmond Plaza',
    time: new Date(Date.now() - 5 * 60000),
  },
  {
    id: '3',
    type: 'alert',
    message: 'Weather alert: Rain expected in 2 hours',
    time: new Date(Date.now() - 10 * 60000),
  },
  {
    id: '4',
    type: 'info',
    message: 'Truck #1 completed delivery - 3 tons asphalt',
    time: new Date(Date.now() - 15 * 60000),
  },
  {
    id: '5',
    type: 'job',
    message: 'Job completed: Park Avenue Sealcoating',
    time: new Date(Date.now() - 20 * 60000),
  },
];

export function BottomTicker({ 
  enabled = true,
  onToggle 
}: BottomTickerProps) {
  const [items] = useState<TickerItem[]>(DEMO_TICKER_ITEMS);
  const [isVisible, setIsVisible] = useState(enabled);
  const [isPaused, setIsPaused] = useState(false);

  const toggleVisibility = () => {
    const newState = !isVisible;
    setIsVisible(newState);
    onToggle?.(newState);
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleVisibility}
          className="shadow-lg"
        >
          <Eye className="h-3 w-3 mr-2" />
          Show Ticker
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 w-full max-w-4xl px-4">
      <div 
        className={cn(
          "bg-background/95 backdrop-blur-sm border rounded-lg shadow-lg p-3 flex items-center gap-3",
          "transition-all duration-300"
        )}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="flex-1 overflow-hidden">
          <div className={cn("ticker-scroll flex items-center gap-8", isPaused && "paused")}>
            {items.concat(items).map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex items-center gap-2 whitespace-nowrap">
                <Badge 
                  variant={
                    item.type === 'job' ? 'default' :
                    item.type === 'employee' ? 'secondary' :
                    item.type === 'alert' ? 'destructive' :
                    'outline'
                  }
                  className="flex-shrink-0"
                >
                  {item.type}
                </Badge>
                <span className="text-sm">{item.message}</span>
                <span className="text-xs text-muted-foreground">
                  {Math.floor((Date.now() - item.time.getTime()) / 60000)}m ago
                </span>
              </div>
            ))}
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleVisibility}
        >
          {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
