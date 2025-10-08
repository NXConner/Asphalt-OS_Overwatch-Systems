

'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, Save, ArrowLeft, DollarSign, Settings, Wrench, Percent, Map } from 'lucide-react';

interface BusinessSetting {
  id: string;
  key: string;
  value: string;
  label: string;
  category: string;
  unit?: string;
  dataType: string;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<BusinessSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changes, setChanges] = useState<Record<string, string>>({});
  const [mapType, setMapType] = useState<string>('hybrid');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/');
    }
  }, [status, router]);

  // Load saved map type from localStorage
  useEffect(() => {
    const savedMapType = localStorage.getItem('mapType');
    if (savedMapType) {
      setMapType(savedMapType);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Only ADMIN and OWNER can access settings
      if (!['ADMIN', 'OWNER'].includes(session.user.role)) {
        router.replace('/dashboard');
        return;
      }
      fetchSettings();
    }
  }, [status, session, router]);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/business-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      } else {
        toast.error('Failed to load settings');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (key: string, value: string) => {
    setChanges(prev => ({ ...prev, [key]: value }));
  };

  const getDisplayValue = (setting: BusinessSetting) => {
    return changes[setting.key] !== undefined ? changes[setting.key] : setting.value;
  };

  const hasChanges = () => {
    return Object.keys(changes).length > 0;
  };

  const handleSave = async () => {
    if (!hasChanges()) return;

    setSaving(true);
    try {
      const updates = Object.entries(changes).map(([key, value]) => ({ key, value }));
      
      const response = await fetch('/api/business-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        toast.success('Settings updated successfully');
        setChanges({});
        await fetchSettings(); // Refresh data
      } else {
        toast.error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setChanges({});
  };

  const handleMapTypeChange = (value: string) => {
    setMapType(value);
    localStorage.setItem('mapType', value);
    toast.success('Map type updated', {
      description: 'Refresh the map to see changes',
    });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'MATERIAL_COSTS': return <DollarSign className="w-4 h-4" />;
      case 'LABOR_RATES': return <Settings className="w-4 h-4" />;
      case 'EQUIPMENT_COSTS': return <Wrench className="w-4 h-4" />;
      case 'BUSINESS_RATES': return <Percent className="w-4 h-4" />;
      default: return <Settings className="w-4 h-4" />;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'MATERIAL_COSTS': return 'Material Costs';
      case 'LABOR_RATES': return 'Labor Rates & Efficiency';
      case 'EQUIPMENT_COSTS': return 'Equipment & Fuel Costs';
      case 'BUSINESS_RATES': return 'Business Rates';
      case 'RATES': return 'Application Rates & Coverage';
      default: return category.replace('_', ' ');
    }
  };

  const groupedSettings = settings.reduce((groups, setting) => {
    const category = setting.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(setting);
    return groups;
  }, {} as Record<string, BusinessSetting[]>);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated' || !session?.user || !['ADMIN', 'OWNER'].includes(session.user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Access denied</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="container max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Business Settings</h1>
              <p className="text-muted-foreground">
                Configure material costs, labor rates, and business parameters
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {hasChanges() && (
              <>
                <Badge variant="secondary" className="px-3 py-1">
                  {Object.keys(changes).length} unsaved change(s)
                </Badge>
                <Button variant="outline" onClick={handleReset} disabled={saving}>
                  Reset
                </Button>
              </>
            )}
            <Button onClick={handleSave} disabled={!hasChanges() || saving}>
              {saving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="MATERIAL_COSTS" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            {Object.keys(groupedSettings).map(category => (
              <TabsTrigger key={category} value={category} className="flex items-center gap-2">
                {getCategoryIcon(category)}
                <span className="hidden sm:inline">{getCategoryTitle(category)}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(groupedSettings).map(([category, categorySettings]) => (
            <TabsContent key={category} value={category} className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {getCategoryIcon(category)}
                    {getCategoryTitle(category)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    {categorySettings.map((setting) => (
                      <div key={setting.key} className="space-y-2">
                        <Label htmlFor={setting.key} className="text-sm font-medium">
                          {setting.label}
                          {setting.unit && (
                            <Badge variant="outline" className="ml-2 text-xs">
                              {setting.unit}
                            </Badge>
                          )}
                        </Label>
                        <Input
                          id={setting.key}
                          type="number"
                          step="0.01"
                          value={getDisplayValue(setting)}
                          onChange={(e) => handleValueChange(setting.key, e.target.value)}
                          className={changes[setting.key] !== undefined ? 'border-orange-500' : ''}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <Separator className="my-8" />

        {/* Map Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Map Display Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mapType" className="text-sm font-medium">
                  Map View Type
                  <Badge variant="outline" className="ml-2 text-xs">
                    Display
                  </Badge>
                </Label>
                <Select value={mapType} onValueChange={handleMapTypeChange}>
                  <SelectTrigger id="mapType" className="w-full">
                    <SelectValue placeholder="Select map type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roadmap">Roadmap (Standard)</SelectItem>
                    <SelectItem value="satellite">Satellite</SelectItem>
                    <SelectItem value="hybrid">Hybrid (Satellite + Roads)</SelectItem>
                    <SelectItem value="terrain">Terrain</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Choose how the map is displayed on the dashboard. Changes take effect immediately.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-8" />
        
        {/* Footer Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Changes to these settings will immediately affect all new estimates and calculations.
            <br />
            Contact your system administrator if you need additional settings or have questions.
          </p>
        </div>
      </div>
    </div>
  );
}

