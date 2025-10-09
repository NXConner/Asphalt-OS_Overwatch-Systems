export type SealcoatParams = { areaSqFt: number; coats: number; coverageSqFtPerGallon: number };
export function calculateSealerGallons({ areaSqFt, coats, coverageSqFtPerGallon }: SealcoatParams): number {
  if (coverageSqFtPerGallon <= 0) return 0;
  return +(areaSqFt * coats / coverageSqFtPerGallon).toFixed(2);
}

export type CrackFillParams = { linearFeet: number; poundsPerLinearFoot: number };
export function calculateCrackFillerPounds({ linearFeet, poundsPerLinearFoot }: CrackFillParams): number {
  return +(linearFeet * poundsPerLinearFoot).toFixed(2);
}

export type StripingParams = { linearFeet: number; coverageLfPerGallon: number };
export function calculateStripingGallons({ linearFeet, coverageLfPerGallon }: StripingParams): number {
  if (coverageLfPerGallon <= 0) return 0;
  return +(linearFeet / coverageLfPerGallon).toFixed(2);
}
