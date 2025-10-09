"use client";
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { apiPost } from '@/lib/api-client';
import { isEnabled } from '@/lib/flags';
import { toast } from 'sonner';

export function MaterialCalculator() {
  const [sealArea, setSealArea] = useState(10000);
  const [sealCoats, setSealCoats] = useState(2);
  const [sealCoverage, setSealCoverage] = useState(100);
  const [crackLf, setCrackLf] = useState(500);
  const [crackLbPerLf, setCrackLbPerLf] = useState(0.12);
  const [stripLf, setStripLf] = useState(1000);
  const [stripCoverage, setStripCoverage] = useState(300);
  const [result, setResult] = useState<any>(null);

  const disabled = !isEnabled('material_calculator');

  const calc = async () => {
    try {
      const data = await apiPost('/api/materials/calc', {
        sealcoat: { areaSqFt: sealArea, coats: sealCoats, coverageSqFtPerGallon: sealCoverage },
        crack: { linearFeet: crackLf, poundsPerLinearFoot: crackLbPerLf },
        striping: { linearFeet: stripLf, coverageLfPerGallon: stripCoverage },
      });
      setResult(data);
      toast.success('Materials calculated');
    } catch (e: any) {
      toast.error(e.message || 'Calculation failed');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Material Calculator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {disabled && <div className="text-sm text-muted-foreground">Feature disabled by flag.</div>}
        <Tabs defaultValue="sealcoating">
          <TabsList>
            <TabsTrigger value="sealcoating">Sealcoating</TabsTrigger>
            <TabsTrigger value="crack">Crack Fill</TabsTrigger>
            <TabsTrigger value="striping">Striping</TabsTrigger>
          </TabsList>
          <TabsContent value="sealcoating" className="grid grid-cols-3 gap-3">
            <div>
              <Label>Area (sq ft)</Label>
              <Input type="number" value={sealArea} onChange={e => setSealArea(+e.target.value)} />
            </div>
            <div>
              <Label>Coats</Label>
              <Input type="number" value={sealCoats} onChange={e => setSealCoats(+e.target.value)} />
            </div>
            <div>
              <Label>Coverage (sq ft/gal)</Label>
              <Input type="number" value={sealCoverage} onChange={e => setSealCoverage(+e.target.value)} />
            </div>
          </TabsContent>
          <TabsContent value="crack" className="grid grid-cols-3 gap-3">
            <div>
              <Label>Linear feet</Label>
              <Input type="number" value={crackLf} onChange={e => setCrackLf(+e.target.value)} />
            </div>
            <div>
              <Label>Pounds per LF</Label>
              <Input type="number" step="0.01" value={crackLbPerLf} onChange={e => setCrackLbPerLf(+e.target.value)} />
            </div>
          </TabsContent>
          <TabsContent value="striping" className="grid grid-cols-3 gap-3">
            <div>
              <Label>Linear feet</Label>
              <Input type="number" value={stripLf} onChange={e => setStripLf(+e.target.value)} />
            </div>
            <div>
              <Label>Coverage (lf/gal)</Label>
              <Input type="number" value={stripCoverage} onChange={e => setStripCoverage(+e.target.value)} />
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex gap-2">
          <Button onClick={calc} disabled={disabled}>Calculate</Button>
        </div>
        {result && (
          <div className="text-sm">
            {result.sealcoatGallons !== undefined && <div>Sealer: <strong>{result.sealcoatGallons} gal</strong></div>}
            {result.crackFillerPounds !== undefined && <div>Crack Filler: <strong>{result.crackFillerPounds} lb</strong></div>}
            {result.stripingGallons !== undefined && <div>Striping Paint: <strong>{result.stripingGallons} gal</strong></div>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
