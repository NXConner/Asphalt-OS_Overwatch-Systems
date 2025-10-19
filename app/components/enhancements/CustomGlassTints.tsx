
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Palette, Save, X } from 'lucide-react';

interface CustomTint {
  id: string;
  name: string;
  color: string;
  opacity: number;
  brightness: number;
}

const PRESET_TINTS: CustomTint[] = [
  { id: 'tactical-orange', name: 'Tactical Orange', color: '#FF6B00', opacity: 0.15, brightness: 1 },
  { id: 'midnight-blue', name: 'Midnight Blue', color: '#1E3A8A', opacity: 0.12, brightness: 0.95 },
  { id: 'emerald-green', name: 'Emerald Green', color: '#10B981', opacity: 0.13, brightness: 1 },
  { id: 'ruby-red', name: 'Ruby Red', color: '#DC2626', opacity: 0.14, brightness: 1.05 },
  { id: 'amethyst-purple', name: 'Amethyst Purple', color: '#9333EA', opacity: 0.12, brightness: 1 },
  { id: 'gold-amber', name: 'Gold Amber', color: '#F59E0B', opacity: 0.16, brightness: 1.1 }
];

export function CustomGlassTints() {
  const [customTints, setCustomTints] = useState<CustomTint[]>(PRESET_TINTS);
  const [newTint, setNewTint] = useState<Partial<CustomTint>>({
    color: '#FF6B00',
    opacity: 0.15,
    brightness: 1
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCreateTint = () => {
    if (newTint.name && newTint.color) {
      const tint: CustomTint = {
        id: `custom-${Date.now()}`,
        name: newTint.name,
        color: newTint.color,
        opacity: newTint.opacity || 0.15,
        brightness: newTint.brightness || 1
      };
      setCustomTints([...customTints, tint]);
      setNewTint({ color: '#FF6B00', opacity: 0.15, brightness: 1 });
    }
  };

  const handleDeleteTint = (id: string) => {
    setCustomTints(customTints.filter(t => t.id !== id));
  };

  const applyTint = (tint: CustomTint) => {
    // Apply to global theme
    localStorage.setItem('customGlassTint', JSON.stringify(tint));
    
    // Update CSS variables
    document.documentElement.style.setProperty('--glass-tint', tint.color);
    document.documentElement.style.setProperty('--glass-opacity', tint.opacity.toString());
    document.documentElement.style.setProperty('--glass-brightness', tint.brightness.toString());
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Custom Glass Tints</h2>
        <p className="text-muted-foreground">
          Create and manage custom tint colors for your glass effects
        </p>
      </div>

      {/* Create New Tint */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-primary" />
          Create Custom Tint
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="tint-name">Tint Name</Label>
              <Input
                id="tint-name"
                placeholder="e.g., Sunset Orange"
                value={newTint.name || ''}
                onChange={(e) => setNewTint({ ...newTint, name: e.target.value })}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="tint-color">Base Color</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="tint-color"
                  type="color"
                  value={newTint.color}
                  onChange={(e) => setNewTint({ ...newTint, color: e.target.value })}
                  className="w-16 h-10 p-1 cursor-pointer"
                />
                <Input
                  value={newTint.color}
                  onChange={(e) => setNewTint({ ...newTint, color: e.target.value })}
                  className="flex-1 font-mono"
                />
              </div>
            </div>

            <div>
              <Label>Opacity: {Math.round((newTint.opacity || 0.15) * 100)}%</Label>
              <Slider
                value={[(newTint.opacity || 0.15) * 100]}
                onValueChange={([value]) => setNewTint({ ...newTint, opacity: value / 100 })}
                min={0}
                max={50}
                step={1}
                className="mt-2"
              />
            </div>

            <div>
              <Label>Brightness: {newTint.brightness || 1}</Label>
              <Slider
                value={[(newTint.brightness || 1) * 100]}
                onValueChange={([value]) => setNewTint({ ...newTint, brightness: value / 100 })}
                min={50}
                max={150}
                step={5}
                className="mt-2"
              />
            </div>

            <Button onClick={handleCreateTint} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save Custom Tint
            </Button>
          </div>

          {/* Live Preview */}
          <div className="flex items-center justify-center">
            <div className="w-full aspect-square max-w-sm rounded-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <div className="absolute inset-0 opacity-30">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        opacity: Math.random()
                      }}
                    />
                  ))}
                </div>
              </div>
              <div
                className="absolute inset-4 rounded-xl flex items-center justify-center"
                style={{
                  backdropFilter: 'blur(12px)',
                  backgroundColor: `${newTint.color}${Math.round((newTint.opacity || 0.15) * 255).toString(16).padStart(2, '0')}`,
                  filter: `brightness(${newTint.brightness || 1})`,
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <div className="text-center">
                  <p className="text-white font-semibold text-lg mb-1">
                    {newTint.name || 'Custom Tint'}
                  </p>
                  <p className="text-white/70 text-sm">Live Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Saved Tints */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Your Custom Tints</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {customTints.map((tint) => (
            <div
              key={tint.id}
              className="relative group"
            >
              <div
                className="h-32 rounded-lg overflow-hidden cursor-pointer transition-transform hover:scale-105"
                onClick={() => applyTint(tint)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-gray-800" />
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{
                    backdropFilter: 'blur(12px)',
                    backgroundColor: `${tint.color}${Math.round(tint.opacity * 255).toString(16).padStart(2, '0')}`,
                    filter: `brightness(${tint.brightness})`,
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <p className="text-white font-medium">{tint.name}</p>
                </div>
              </div>
              {!PRESET_TINTS.find(p => p.id === tint.id) && (
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteTint(tint.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Tips */}
      <Card className="p-4 bg-accent/50">
        <h4 className="font-semibold mb-2">Tint Customization Tips</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Lower opacity (5-15%) for subtle, professional effects</li>
          <li>• Warm colors (orange, red) create energetic feels</li>
          <li>• Cool colors (blue, cyan) provide calm atmospheres</li>
          <li>• Brightness above 1.0 makes tints more vibrant</li>
          <li>• Click any tint to apply it instantly</li>
        </ul>
      </Card>
    </div>
  );
}
