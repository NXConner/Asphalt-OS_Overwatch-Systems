"use client";

import { useEffect, useMemo, useState } from "react";
import { THEME_PRESETS, applyTheme, getThemeById } from "@/lib/theme-presets";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ThemePage() {
  const [selected, setSelected] = useState<string>("black-gold");
  const [wallpaper, setWallpaper] = useState<string | null>(null);
  const [colors, setColors] = useState<Record<string, string>>({});

  useEffect(() => {
    const saved = localStorage.getItem("appTheme");
    const savedColors = localStorage.getItem("customThemeColors");
    const wp = localStorage.getItem("wallpaperDataUrl");
    if (saved) setSelected(saved);
    if (savedColors) setColors(JSON.parse(savedColors));
    if (wp) setWallpaper(wp);
  }, []);

  const preset = useMemo(() => getThemeById(selected) || THEME_PRESETS[0], [selected]);

  const onApplyPreset = () => {
    if (!preset) return;
    localStorage.setItem("appTheme", preset.id);
    localStorage.removeItem("customThemeColors");
    applyTheme(preset.colors);
  };

  const onApplyCustom = () => {
    localStorage.setItem("appTheme", "custom");
    localStorage.setItem("customThemeColors", JSON.stringify(colors));
    applyTheme(colors);
  };

  const onWallpaperChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setWallpaper(dataUrl);
      localStorage.setItem("wallpaperDataUrl", dataUrl);
      document.body.style.backgroundImage = `url(${dataUrl})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundAttachment = "fixed";
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    if (wallpaper) {
      document.body.style.backgroundImage = `url(${wallpaper})`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundAttachment = "fixed";
    } else {
      document.body.style.backgroundImage = "none";
    }
  }, [wallpaper]);

  return (
    <div className="p-6">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Theme Presets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {THEME_PRESETS.map((t) => (
              <div key={t.id} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.id}</div>
                </div>
                <Button variant={selected === t.id ? "default" : "outline"} onClick={() => setSelected(t.id)}>Select</Button>
              </div>
            ))}
            <Button className="w-full" onClick={onApplyPreset}>Apply Selected</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Colors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(preset.colors).map(([key, value]) => (
              <div className="grid grid-cols-2 gap-2" key={key}>
                <Label>{key}</Label>
                <Input defaultValue={colors[key] ?? value} onChange={(e) => setColors((c) => ({ ...c, [key]: e.target.value }))} />
              </div>
            ))}
            <Button className="w-full" onClick={onApplyCustom}>Apply Custom</Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Wallpaper</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <input type="file" accept="image/*" onChange={onWallpaperChange} />
            {wallpaper && (
              <img src={wallpaper} alt="Wallpaper preview" className="w-full max-h-96 object-cover rounded" />
            )}
            <Button variant="outline" onClick={() => { setWallpaper(null); localStorage.removeItem("wallpaperDataUrl"); }}>Clear Wallpaper</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
