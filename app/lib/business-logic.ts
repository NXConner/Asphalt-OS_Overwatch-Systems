
// Business logic for asphalt paving estimates based on provided specifications

export interface EstimateInput {
  jobType: 'SEALCOATING' | 'CRACK_REPAIR' | 'ASPHALT_PATCHING' | 'LINE_STRIPING' | 'COMBINATION';
  squareFootage?: number;
  linearFootage?: number;
  numberOfStalls?: number;
  hasOilSpots?: boolean;
  crackSeverity?: 'LIGHT' | 'MEDIUM' | 'HEAVY';
  jobAddress: string;
  businessAddress: string;
}

export interface DirectionsResult {
  route: {
    distance: string;
    duration: string;
    steps: Array<{
      instruction: string;
      distance: string;
      duration: string;
    }>;
  };
  fuelCost: number;
  distanceValue: number; // in meters
  durationValue: number; // in seconds
}

export interface BusinessSettings {
  [key: string]: number | string | boolean;
}

export interface MaterialCalculation {
  name: string;
  quantity: number;
  unit: string;
  unitCost: number;
  totalCost: number;
}

export interface EstimateResult {
  materials: MaterialCalculation[];
  labor: {
    hours: number;
    rate: number;
    cost: number;
  };
  equipment: {
    fuelCost: number;
    equipmentCost: number;
  };
  travel: {
    distance: number;
    cost: number;
  };
  subtotal: number;
  overhead: number;
  profit: number;
  total: number;
}

// Default business settings (used as fallback if database values not available)
export const DEFAULT_BUSINESS_SETTINGS: BusinessSettings = {
  // Material costs
  PMM_CONCENTRATE: 3.65,
  SAND_50LB: 10.00,
  PREP_SEAL: 50.00,
  FAST_DRY: 140.00,
  CRACK_FILLER_30LB: 44.95,
  FLEXMASTER_CRACK: 27.24,
  PROPANE_REFILL: 10.00,
  HOT_MIX_ASPHALT: 3.50,
  COLD_PATCH: 3.00,
  LINE_PAINT: 0.87,
  
  // Application rates
  SEALCOATING_COVERAGE: 76,
  SAND_RATIO: 300,
  WATER_RATIO: 0.2,
  FAST_DRY_RATIO: 2,
  PREP_SEAL_COVERAGE: 175,
  CRACK_FILL_RATE: 1.75,
  STALL_LINEAR_FEET: 20,
  DOUBLE_STALL_LINEAR_FEET: 25,
  
  // Labor rates
  EMPLOYEE_RATE: 20.00,
  CRACK_FILL_EFFICIENCY: 100,
  SEALCOAT_EFFICIENCY: 2000,
  STRIPING_EFFICIENCY: 500,
  PATCHING_EFFICIENCY: 50,
  
  // Equipment costs
  FUEL_OPERATIONAL: 2,
  FUEL_IDLE: 50,
  VEHICLE_MPG: 17.5,
  FUEL_PRICE: 3.50,
  
  // Business rates
  OVERHEAD_PERCENTAGE: 15,
  PROFIT_PERCENTAGE: 25,
  EQUIPMENT_HOURLY_RATE: 5,
};

// Business address constant
export const BUSINESS_ADDRESS = "337 Ayers Orchard Road, Stuart, VA 24171";

// Helper function to get setting value with fallback
function getSetting(settings: BusinessSettings | null, key: string): number {
  if (!settings || settings[key] === undefined) {
    return DEFAULT_BUSINESS_SETTINGS[key] as number;
  }
  return Number(settings[key]);
}

// Google Maps Directions API integration
export async function getDirections(
  origin: string,
  destination: string,
  settings: BusinessSettings | null = null
): Promise<DirectionsResult | null> {
  try {
    const directionsService = new google.maps.DirectionsService();
    
    const result = await directionsService.route({
      origin,
      destination,
      travelMode: google.maps.TravelMode.DRIVING,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
      avoidTolls: false,
      avoidHighways: false,
    });

    if (result.routes && result.routes.length > 0) {
      const route = result.routes[0];
      const leg = route.legs[0];
      
      if (!leg) return null;

      const steps = leg.steps?.map(step => ({
        instruction: step.instructions?.replace(/<[^>]*>/g, '') || '',
        distance: step.distance?.text || '',
        duration: step.duration?.text || '',
      })) || [];

      const distanceValue = leg.distance?.value || 0; // meters
      const durationValue = leg.duration?.value || 0; // seconds
      
      // Calculate fuel cost for round trip
      const distanceInMiles = (distanceValue * 2) / 1609.34; // round trip in miles
      const vehicleMpg = getSetting(settings, 'VEHICLE_MPG');
      const fuelPrice = getSetting(settings, 'FUEL_PRICE');
      const fuelCost = (distanceInMiles / vehicleMpg) * fuelPrice;

      return {
        route: {
          distance: leg.distance?.text || '',
          duration: leg.duration?.text || '',
          steps,
        },
        fuelCost: Math.round(fuelCost * 100) / 100,
        distanceValue,
        durationValue,
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting directions:', error);
    return null;
  }
}

// Calculate distance between two addresses (simplified - in real app would use Google Maps API)
function calculateDistance(address1: string, address2: string): number {
  // For demo purposes, return a reasonable estimate based on Virginia geography
  // In production, this would use Google Maps Distance Matrix API
  if (address1.toLowerCase().includes('stuart') && address2.toLowerCase().includes('madison')) {
    return 85; // miles from Stuart, VA to Madison, NC (approximate)
  }
  // Default local distance
  return 25;
}

export function calculateSealcoatingMaterials(
  squareFootage: number, 
  hasOilSpots: boolean, 
  settings: BusinessSettings | null = null
) {
  const materials: MaterialCalculation[] = [];
  
  // Calculate mixed sealer needed
  const sealcoatingCoverage = getSetting(settings, 'SEALCOATING_COVERAGE');
  const mixedSealerNeeded = squareFootage / sealcoatingCoverage;
  
  // Calculate PMM concentrate (accounting for water dilution)
  const waterRatio = getSetting(settings, 'WATER_RATIO');
  const concentrateNeeded = mixedSealerNeeded / (1 + waterRatio);
  
  materials.push({
    name: 'SealMaster PMM Concentrate',
    quantity: Math.ceil(concentrateNeeded),
    unit: 'gallon',
    unitCost: getSetting(settings, 'PMM_CONCENTRATE'),
    totalCost: Math.ceil(concentrateNeeded) * getSetting(settings, 'PMM_CONCENTRATE')
  });

  // Calculate sand needed (300 lbs per 100 gallons = 6 bags per 100 gallons)
  const sandBagsNeeded = Math.ceil((concentrateNeeded / 100) * 6);
  materials.push({
    name: 'Sand (50lb bags)',
    quantity: sandBagsNeeded,
    unit: 'bag',
    unitCost: getSetting(settings, 'SAND_50LB'),
    totalCost: sandBagsNeeded * getSetting(settings, 'SAND_50LB')
  });

  // Fast Dry additive (2 gallons per 125 gallons concentrate)
  const fastDryRatio = getSetting(settings, 'FAST_DRY_RATIO');
  const fastDryNeeded = Math.ceil((concentrateNeeded / 125) * fastDryRatio);
  if (fastDryNeeded > 0) {
    const fastDryBuckets = Math.ceil(fastDryNeeded / 5); // 5-gallon buckets
    materials.push({
      name: 'Fast Dry Additive',
      quantity: fastDryBuckets,
      unit: 'bucket',
      unitCost: getSetting(settings, 'FAST_DRY'),
      totalCost: fastDryBuckets * getSetting(settings, 'FAST_DRY')
    });
  }

  // Oil spot primer if needed
  if (hasOilSpots) {
    const oilSpotArea = squareFootage * 0.1; // Assume 10% of area has oil spots
    const prepSealCoverage = getSetting(settings, 'PREP_SEAL_COVERAGE');
    const prepSealNeeded = oilSpotArea / prepSealCoverage;
    const prepSealBuckets = Math.ceil(prepSealNeeded / 5); // 5-gallon buckets
    
    materials.push({
      name: 'Prep Seal (Oil Spot Primer)',
      quantity: prepSealBuckets,
      unit: 'bucket',
      unitCost: getSetting(settings, 'PREP_SEAL'),
      totalCost: prepSealBuckets * getSetting(settings, 'PREP_SEAL')
    });
  }

  return materials;
}

export function calculateCrackRepairMaterials(
  linearFootage: number, 
  severity: 'LIGHT' | 'MEDIUM' | 'HEAVY',
  settings: BusinessSettings | null = null
) {
  const materials: MaterialCalculation[] = [];
  
  // Calculate crack filler needed based on severity
  let crackFillerPerFoot = 0.05; // gallons per foot for light cracks
  if (severity === 'MEDIUM') crackFillerPerFoot = 0.08;
  if (severity === 'HEAVY') crackFillerPerFoot = 0.12;
  
  const crackFillerGallons = linearFootage * crackFillerPerFoot;
  
  materials.push({
    name: 'SealMaster FlexMaster Crack Sealant',
    quantity: Math.ceil(crackFillerGallons),
    unit: 'gallon',
    unitCost: getSetting(settings, 'FLEXMASTER_CRACK'),
    totalCost: Math.ceil(crackFillerGallons) * getSetting(settings, 'FLEXMASTER_CRACK')
  });

  // Propane for hot pour machines (1 tank per 1000 linear feet)
  const propaneTanks = Math.ceil(linearFootage / 1000);
  materials.push({
    name: 'Propane Tank Refill',
    quantity: propaneTanks,
    unit: 'tank',
    unitCost: getSetting(settings, 'PROPANE_REFILL'),
    totalCost: propaneTanks * getSetting(settings, 'PROPANE_REFILL')
  });

  return materials;
}

export function calculateLineStripingMaterials(
  numberOfStalls: number,
  settings: BusinessSettings | null = null
) {
  const materials: MaterialCalculation[] = [];
  
  // Calculate total linear feet needed
  const stallLinearFeet = getSetting(settings, 'STALL_LINEAR_FEET');
  const totalLinearFeet = numberOfStalls * stallLinearFeet;
  
  materials.push({
    name: 'Line Striping Paint',
    quantity: totalLinearFeet,
    unit: 'linear_foot',
    unitCost: getSetting(settings, 'LINE_PAINT'),
    totalCost: totalLinearFeet * getSetting(settings, 'LINE_PAINT')
  });

  return materials;
}

export function calculatePatchingMaterials(
  squareFootage: number, 
  patchType: 'hot' | 'cold' = 'hot',
  settings: BusinessSettings | null = null
) {
  const materials: MaterialCalculation[] = [];
  
  const costPerSqFt = patchType === 'hot' 
    ? getSetting(settings, 'HOT_MIX_ASPHALT') 
    : getSetting(settings, 'COLD_PATCH');
  const materialName = patchType === 'hot' ? 'Hot Mix Asphalt' : 'Cold Patch Asphalt';
  
  materials.push({
    name: materialName,
    quantity: squareFootage,
    unit: 'square_foot',
    unitCost: costPerSqFt,
    totalCost: squareFootage * costPerSqFt
  });

  return materials;
}

export function calculateEstimate(
  input: EstimateInput, 
  settings: BusinessSettings | null = null
): EstimateResult {
  let materials: MaterialCalculation[] = [];
  let laborHours = 0;

  // Calculate materials and labor based on job type
  switch (input.jobType) {
    case 'SEALCOATING':
      if (input.squareFootage) {
        materials = calculateSealcoatingMaterials(input.squareFootage, input.hasOilSpots || false, settings);
        const sealcoatEfficiency = getSetting(settings, 'SEALCOAT_EFFICIENCY');
        laborHours = input.squareFootage / sealcoatEfficiency * 2; // 2-person crew
      }
      break;
      
    case 'CRACK_REPAIR':
      if (input.linearFootage) {
        materials = calculateCrackRepairMaterials(input.linearFootage, input.crackSeverity || 'MEDIUM', settings);
        const crackFillEfficiency = getSetting(settings, 'CRACK_FILL_EFFICIENCY');
        laborHours = input.linearFootage / crackFillEfficiency;
      }
      break;
      
    case 'LINE_STRIPING':
      if (input.numberOfStalls) {
        materials = calculateLineStripingMaterials(input.numberOfStalls, settings);
        const stallLinearFeet = getSetting(settings, 'STALL_LINEAR_FEET');
        const stripingEfficiency = getSetting(settings, 'STRIPING_EFFICIENCY');
        laborHours = (input.numberOfStalls * stallLinearFeet) / stripingEfficiency;
      }
      break;
      
    case 'ASPHALT_PATCHING':
      if (input.squareFootage) {
        materials = calculatePatchingMaterials(input.squareFootage, 'hot', settings);
        const patchingEfficiency = getSetting(settings, 'PATCHING_EFFICIENCY');
        laborHours = input.squareFootage / patchingEfficiency;
      }
      break;
      
    case 'COMBINATION':
      // Handle combination jobs
      if (input.squareFootage) {
        materials.push(...calculateSealcoatingMaterials(input.squareFootage, input.hasOilSpots || false, settings));
        const sealcoatEfficiency = getSetting(settings, 'SEALCOAT_EFFICIENCY');
        laborHours += input.squareFootage / sealcoatEfficiency * 2;
      }
      if (input.linearFootage) {
        materials.push(...calculateCrackRepairMaterials(input.linearFootage, input.crackSeverity || 'MEDIUM', settings));
        const crackFillEfficiency = getSetting(settings, 'CRACK_FILL_EFFICIENCY');
        laborHours += input.linearFootage / crackFillEfficiency;
      }
      if (input.numberOfStalls) {
        materials.push(...calculateLineStripingMaterials(input.numberOfStalls, settings));
        const stallLinearFeet = getSetting(settings, 'STALL_LINEAR_FEET');
        const stripingEfficiency = getSetting(settings, 'STRIPING_EFFICIENCY');
        laborHours += (input.numberOfStalls * stallLinearFeet) / stripingEfficiency;
      }
      break;
  }

  // Calculate costs
  const materialCost = materials.reduce((sum, material) => sum + material.totalCost, 0);
  const employeeRate = getSetting(settings, 'EMPLOYEE_RATE');
  const laborCost = laborHours * employeeRate;
  
  // Calculate travel
  const distance = calculateDistance(input.businessAddress, input.jobAddress);
  const vehicleMpg = getSetting(settings, 'VEHICLE_MPG');
  const fuelPrice = getSetting(settings, 'FUEL_PRICE');
  const travelCost = (distance * 2) / vehicleMpg * fuelPrice; // Round trip
  
  // Calculate equipment/fuel costs
  const fuelOperational = getSetting(settings, 'FUEL_OPERATIONAL');
  const fuelCost = laborHours * fuelOperational * fuelPrice;
  const equipmentHourlyRate = getSetting(settings, 'EQUIPMENT_HOURLY_RATE');
  const equipmentCost = laborHours * equipmentHourlyRate;
  
  const subtotal = materialCost + laborCost + fuelCost + equipmentCost + travelCost;
  const overheadPercentage = getSetting(settings, 'OVERHEAD_PERCENTAGE') / 100;
  const profitPercentage = getSetting(settings, 'PROFIT_PERCENTAGE') / 100;
  const overhead = subtotal * overheadPercentage;
  const profit = subtotal * profitPercentage;
  const total = subtotal + overhead + profit;

  return {
    materials,
    labor: {
      hours: laborHours,
      rate: employeeRate,
      cost: laborCost
    },
    equipment: {
      fuelCost,
      equipmentCost
    },
    travel: {
      distance,
      cost: travelCost
    },
    subtotal,
    overhead,
    profit,
    total
  };
}
