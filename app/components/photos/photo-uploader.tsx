
'use client';

import { useState, useRef, useCallback } from 'react';
import { Camera, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { enhanceImage, defaultEnhancementSettings, asphaltPreset, type EnhancementSettings } from '@/lib/image-enhancement';

interface PhotoUploaderProps {
  jobId: string;
  onUploadComplete?: () => void;
}

export function PhotoUploader({ jobId, onUploadComplete }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [photoType, setPhotoType] = useState<string>('PROGRESS');
  const [autoEnhance, setAutoEnhance] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [gpsData, setGpsData] = useState<{ latitude: number; longitude: number } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Get GPS location
  const getLocation = useCallback(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGpsData({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          toast.success('GPS location captured');
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Could not get GPS location');
        }
      );
    }
  }, []);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    getLocation();

    // Auto-enhance if enabled
    if (autoEnhance) {
      setEnhancing(true);
      try {
        const enhancedBlob = await enhanceImage(file, asphaltPreset);
        const enhancedFile = new File([enhancedBlob], file.name, { type: 'image/jpeg' });
        setSelectedFile(enhancedFile);
        setPreviewUrl(URL.createObjectURL(enhancedBlob));
        toast.success('Photo auto-enhanced');
      } catch (error) {
        console.error('Enhancement error:', error);
        toast.error('Could not enhance photo');
      } finally {
        setEnhancing(false);
      }
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('jobId', jobId);
      formData.append('photoType', photoType);
      formData.append('title', title);
      formData.append('description', description);
      if (gpsData) {
        formData.append('latitude', gpsData.latitude.toString());
        formData.append('longitude', gpsData.longitude.toString());
      }

      const response = await fetch('/api/photos', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      toast.success('Photo uploaded successfully');
      setSelectedFile(null);
      setPreviewUrl(null);
      setTitle('');
      setDescription('');
      onUploadComplete?.();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Job Site Photo</CardTitle>
        <CardDescription>Capture or upload photos with GPS and auto-enhancement</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!previewUrl ? (
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-32"
              onClick={() => cameraInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-2">
                <Camera className="h-8 w-8" />
                <span>Take Photo</span>
              </div>
            </Button>
            <Button
              variant="outline"
              className="h-32"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-8 w-8" />
                <span>Upload Photo</span>
              </div>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
              {enhancing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                  <Loader2 className="h-8 w-8 animate-spin text-white" />
                </div>
              )}
              <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            </div>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="photo-type">Photo Type</Label>
                <Select value={photoType} onValueChange={setPhotoType}>
                  <SelectTrigger id="photo-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BEFORE">Before</SelectItem>
                    <SelectItem value="DURING">During</SelectItem>
                    <SelectItem value="AFTER">After</SelectItem>
                    <SelectItem value="PROGRESS">Progress</SelectItem>
                    <SelectItem value="ISSUE">Issue</SelectItem>
                    <SelectItem value="COMPLETION">Completion</SelectItem>
                    <SelectItem value="AERIAL">Aerial</SelectItem>
                    <SelectItem value="DRONE">Drone</SelectItem>
                    <SelectItem value="MEASUREMENT">Measurement</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Title (Optional)</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Main parking lot crack repair"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Cracks filled with polymer-modified sealer"
                />
              </div>

              {gpsData && (
                <div className="text-sm text-muted-foreground">
                  GPS: {gpsData.latitude.toFixed(6)}, {gpsData.longitude.toFixed(6)}
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={handleUpload} disabled={uploading} className="flex-1">
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Upload
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file);
          }}
        />
      </CardContent>
    </Card>
  );
}
