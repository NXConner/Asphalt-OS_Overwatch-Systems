import { calculateSealerGallons, calculateCrackFillerPounds, calculateStripingGallons } from '@/lib/materials';

describe('materials', () => {
  it('calculates sealer gallons', () => {
    expect(calculateSealerGallons({ areaSqFt: 10000, coats: 2, coverageSqFtPerGallon: 100 })).toBe(200);
  });
  it('calculates crack filler pounds', () => {
    expect(calculateCrackFillerPounds({ linearFeet: 500, poundsPerLinearFoot: 0.12 })).toBe(60);
  });
  it('calculates striping gallons', () => {
    expect(calculateStripingGallons({ linearFeet: 1000, coverageLfPerGallon: 250 })).toBe(4);
  });
});
