
'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Map, Bell, Palette, User, Shield } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function SettingsPage() {
  const { data: session } = useSession() || {};
  const [loading, setLoading] = useState(false);

  // Map Settings
  const [defaultLat, setDefaultLat] = useState('40.7128');
  const [defaultLng, setDefaultLng] = useState('-74.0060');
  const [defaultZoom, setDefaultZoom] = useState('12');
  const [defaultMapType, setDefaultMapType] = useState('roadmap');

  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [jobAlerts, setJobAlerts] = useState(true);
  const [employeeAlerts, setEmployeeAlerts] = useState(true);

  // Display Settings
  const [darkMode, setDarkMode] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [showWeather, setShowWeather] = useState(true);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mapSettings: {
            defaultLat: parseFloat(defaultLat),
            defaultLng: parseFloat(defaultLng),
            defaultZoom: parseInt(defaultZoom, 10),
            defaultMapType,
          },
          notifications: {
            email: emailNotifications,
            push: pushNotifications,
            jobAlerts,
            employeeAlerts,
          },
          display: {
            darkMode,
            compactView,
            showWeather,
          },
        }),
      });

      if (response.ok) {
        toast.success('Settings saved successfully!');
      } else {
        toast.error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('An error occurred while saving settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Configure your Asphalt OS preferences and defaults
        </p>
      </div>

      <Tabs defaultValue="map" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="map" className="gap-2">
            <Map className="h-4 w-4" />
            <span className="hidden sm:inline">Map</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="display" className="gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Display</span>
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
        </TabsList>

        {/* Map Settings */}
        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Default Map Configuration</CardTitle>
              <CardDescription>
                Set your default map location and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultLat">Default Latitude</Label>
                  <Input
                    id="defaultLat"
                    type="number"
                    step="0.0001"
                    value={defaultLat}
                    onChange={(e) => setDefaultLat(e.target.value)}
                    placeholder="40.7128"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultLng">Default Longitude</Label>
                  <Input
                    id="defaultLng"
                    type="number"
                    step="0.0001"
                    value={defaultLng}
                    onChange={(e) => setDefaultLng(e.target.value)}
                    placeholder="-74.0060"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="defaultZoom">Default Zoom Level</Label>
                <Select value={defaultZoom} onValueChange={setDefaultZoom}>
                  <SelectTrigger id="defaultZoom">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 - Wide Area</SelectItem>
                    <SelectItem value="12">12 - City View</SelectItem>
                    <SelectItem value="14">14 - Neighborhood</SelectItem>
                    <SelectItem value="16">16 - Street Level</SelectItem>
                    <SelectItem value="18">18 - Close Up</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mapType">Default Map Type</Label>
                <Select value={defaultMapType} onValueChange={setDefaultMapType}>
                  <SelectTrigger id="mapType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="roadmap">Roadmap</SelectItem>
                    <SelectItem value="satellite">Satellite</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="terrain">Terrain</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications via email
                  </p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive browser push notifications
                  </p>
                </div>
                <Switch
                  id="pushNotifications"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="jobAlerts">Job Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about job updates
                  </p>
                </div>
                <Switch
                  id="jobAlerts"
                  checked={jobAlerts}
                  onCheckedChange={setJobAlerts}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="employeeAlerts">Employee Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about employee activities
                  </p>
                </div>
                <Switch
                  id="employeeAlerts"
                  checked={employeeAlerts}
                  onCheckedChange={setEmployeeAlerts}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Display Settings */}
        <TabsContent value="display" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Display Preferences</CardTitle>
              <CardDescription>
                Customize your interface appearance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Use dark theme by default
                  </p>
                </div>
                <Switch
                  id="darkMode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="compactView">Compact View</Label>
                  <p className="text-sm text-muted-foreground">
                    Use more compact interface elements
                  </p>
                </div>
                <Switch
                  id="compactView"
                  checked={compactView}
                  onCheckedChange={setCompactView}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showWeather">Show Weather Widget</Label>
                  <p className="text-sm text-muted-foreground">
                    Display weather information on dashboard
                  </p>
                </div>
                <Switch
                  id="showWeather"
                  checked={showWeather}
                  onCheckedChange={setShowWeather}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Settings */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your account details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  defaultValue={session?.user?.name || ''}
                  placeholder="Enter your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={session?.user?.email || ''}
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                />
              </div>

              <Button>Change Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end mt-6">
        <Button onClick={handleSaveSettings} disabled={loading} size="lg">
          {loading ? 'Saving...' : 'Save All Settings'}
        </Button>
      </div>
    </div>
  );
}
