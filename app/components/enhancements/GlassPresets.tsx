
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Zap, Ghost, Flame, Droplet, Wind } from 'lucide-react';

export type GlassPreset = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  settings: {
    blur: number;
    opacity: number;
    brightness: number;
    tint: string;
    borderOpacity: number;
  };
};

export const GLASS_PRESETS: GlassPreset[] = [
  {
    id: 'default',
    name: 'Default Glass',
    description: 'Standard glass effect with balanced settings',
    icon: <Sparkles className="w-5 h-5" />,
    settings: {
      blur: 12,
      opacity: 0.15,
      brightness: 1,
      tint: '#FF6B00',
      borderOpacity: 0.3
    }
  },
  {
    id: 'high-clarity',
    name: 'High Clarity',
    description: 'Maximum transparency and sharpness',
    icon: <Zap className="w-5 h-5" />,
    settings: {
      blur: 8,
      opacity: 0.08,
      brightness: 1.1,
      tint: '#FF6B00',
      borderOpacity: 0.4
    }
  },
  {
    id: 'frosted',
    name: 'Frosted Glass',
    description: 'Heavy blur with subtle tint',
    icon: <Ghost className="w-5 h-5" />,
    settings: {
      blur: 20,
      opacity: 0.2,
      brightness: 0.95,
      tint: '#FFFFFF',
      borderOpacity: 0.2
    }
  },
  {
    id: 'fire',
    name: 'Fire Glow',
    description: 'Warm orange/red tint with high intensity',
    icon: <Flame className="w-5 h-5" />,
    settings: {
      blur: 14,
      opacity: 0.18,
      brightness: 1.05,
      tint: '#FF4500',
      borderOpacity: 0.35
    }
  },
  {
    id: 'aqua',
    name: 'Aqua Cool',
    description: 'Cool blue tint with smooth blur',
    icon: <Droplet className="w-5 h-5" />,
    settings: {
      blur: 16,
      opacity: 0.12,
      brightness: 1,
      tint: '#00CED1',
      borderOpacity: 0.3
    }
  },
  {
    id: 'stealth',
    name: 'Stealth Mode',
    description: 'Minimal blur, maximum darkness',
    icon: <Wind className="w-5 h-5" />,
    settings: {
      blur: 6,
      opacity: 0.25,
      brightness: 0.8,
      tint: '#000000',
      borderOpacity: 0.5
    }
  }
];

interface GlassPresetsProps {
  onApplyPreset: (preset: GlassPreset) => void;
  currentPreset?: string;
}

export function GlassPresets({ onApplyPreset, currentPreset }: GlassPresetsProps) {
  const [selectedPreset, setSelectedPreset] = useState<string>(currentPreset || 'default');

  const handleApply = (preset: GlassPreset) => {
    setSelectedPreset(preset.id);
    onApplyPreset(preset);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Glass Effect Presets</h3>
        <p className="text-sm text-muted-foreground">
          Quick-apply preset combinations for different visual styles
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GLASS_PRESETS.map((preset) => (
          <Card
            key={preset.id}
            className={`p-4 cursor-pointer transition-all hover:scale-105 ${
              selectedPreset === preset.id
                ? 'ring-2 ring-primary bg-primary/10'
                : 'hover:bg-accent'
            }`}
            onClick={() => handleApply(preset)}
          >
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/20 text-primary">
                {preset.icon}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-1">{preset.name}</h4>
                <p className="text-xs text-muted-foreground">{preset.description}</p>
              </div>
            </div>

            {/* Preview */}
            <div className="mt-3 h-20 rounded-lg relative overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  backdropFilter: `blur(${preset.settings.blur}px)`,
                  backgroundColor: `${preset.settings.tint}${Math.round(
                    preset.settings.opacity * 255
                  ).toString(16)}`,
                  filter: `brightness(${preset.settings.brightness})`,
                  border: `1px solid rgba(255, 255, 255, ${preset.settings.borderOpacity})`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                Preview
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
