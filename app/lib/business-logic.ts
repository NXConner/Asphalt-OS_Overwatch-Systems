
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

// Material costs from business specifications
export const MATERIAL_COSTS = {
  PMM_CONCENTRATE: 3.65, // per gallon
  SAND_50LB: 10.00,       // per bag
  PREP_SEAL: 50.00,       // per 5-gallon bucket
  FAST_DRY: 140.00,       // per 5-gallon bucket
  CRACK_FILLER_30LB: 44.95, // per 30lb box
  FLEXMASTER_CRACK: 27.24,  // per gallon
  PROPANE_REFILL: 10.00,    // per tank
  HOT_MIX_ASPHALT: 3.50,    // per sq ft
  COLD_PATCH: 3.00,         // per sq ft
  LINE_PAINT: 0.87,         // per linear foot
};

// Application rates and coverage
export const APPLICATION_RATES = {
  SEALCOATING_COVERAGE: 76, // sq ft per gallon of mixed sealer (average of 70-82)
  SAND_RATIO: 300, // lbs per 100 gallons PMM (6 bags * 50lbs)
  WATER_RATIO: 0.2, // 20% water by volume
  FAST_DRY_RATIO: 2, // gallons per 125 gallons concentrate
  PREP_SEAL_COVERAGE: 175, // sq ft per gallon (average of 150-200)
  CRACK_FILL_RATE: 1.75, // $/linear foot (average of $0.50-$3.00)
  STALL_LINEAR_FEET: 20, // standard parking stall
  DOUBLE_STALL_LINEAR_FEET: 25,
};

// Labor rates and efficiency
export const LABOR_RATES = {
  EMPLOYEE_RATE: 20.00, // per hour
  CRACK_FILL_EFFICIENCY: 100, // linear feet per hour
  SEALCOAT_EFFICIENCY: 2000, // sq ft per hour per person
  STRIPING_EFFICIENCY: 500, // linear feet per hour
  PATCHING_EFFICIENCY: 50, // sq ft per hour
};

// Equipment costs
export const EQUIPMENT_COSTS = {
  FUEL_OPERATIONAL: 2, // gallons per hour for equipment
  FUEL_IDLE: 50, // $ per hour excessive idle
  VEHICLE_MPG: 17.5, // average MPG for trucks (15-20)
  FUEL_PRICE: 3.50, // $ per gallon (estimate)
};

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

export function calculateSealcoatingMaterials(squareFootage: number, hasOilSpots: boolean) {
  const materials: MaterialCalculation[] = [];
  
  // Calculate mixed sealer needed
  const mixedSealerNeeded = squareFootage / APPLICATION_RATES.SEALCOATING_COVERAGE;
  
  // Calculate PMM concentrate (accounting for water dilution)
  const concentrateNeeded = mixedSealerNeeded / (1 + APPLICATION_RATES.WATER_RATIO);
  
  materials.push({
    name: 'SealMaster PMM Concentrate',
    quantity: Math.ceil(concentrateNeeded),
    unit: 'gallon',
    unitCost: MATERIAL_COSTS.PMM_CONCENTRATE,
    totalCost: Math.ceil(concentrateNeeded) * MATERIAL_COSTS.PMM_CONCENTRATE
  });

  // Calculate sand needed (300 lbs per 100 gallons = 6 bags per 100 gallons)
  const sandBagsNeeded = Math.ceil((concentrateNeeded / 100) * 6);
  materials.push({
    name: 'Sand (50lb bags)',
    quantity: sandBagsNeeded,
    unit: 'bag',
    unitCost: MATERIAL_COSTS.SAND_50LB,
    totalCost: sandBagsNeeded * MATERIAL_COSTS.SAND_50LB
  });

  // Fast Dry additive (2 gallons per 125 gallons concentrate)
  const fastDryNeeded = Math.ceil((concentrateNeeded / 125) * 2);
  if (fastDryNeeded > 0) {
    const fastDryBuckets = Math.ceil(fastDryNeeded / 5); // 5-gallon buckets
    materials.push({
      name: 'Fast Dry Additive',
      quantity: fastDryBuckets,
      unit: 'bucket',
      unitCost: MATERIAL_COSTS.FAST_DRY,
      totalCost: fastDryBuckets * MATERIAL_COSTS.FAST_DRY
    });
  }

  // Oil spot primer if needed
  if (hasOilSpots) {
    const oilSpotArea = squareFootage * 0.1; // Assume 10% of area has oil spots
    const prepSealNeeded = oilSpotArea / APPLICATION_RATES.PREP_SEAL_COVERAGE;
    const prepSealBuckets = Math.ceil(prepSealNeeded / 5); // 5-gallon buckets
    
    materials.push({
      name: 'Prep Seal (Oil Spot Primer)',
      quantity: prepSealBuckets,
      unit: 'bucket',
      unitCost: MATERIAL_COSTS.PREP_SEAL,
      totalCost: prepSealBuckets * MATERIAL_COSTS.PREP_SEAL
    });
  }

  return materials;
}

export function calculateCrackRepairMaterials(linearFootage: number, severity: 'LIGHT' | 'MEDIUM' | 'HEAVY') {
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
    unitCost: MATERIAL_COSTS.FLEXMASTER_CRACK,
    totalCost: Math.ceil(crackFillerGallons) * MATERIAL_COSTS.FLEXMASTER_CRACK
  });

  // Propane for hot pour machines (1 tank per 1000 linear feet)
  const propaneTanks = Math.ceil(linearFootage / 1000);
  materials.push({
    name: 'Propane Tank Refill',
    quantity: propaneTanks,
    unit: 'tank',
    unitCost: MATERIAL_COSTS.PROPANE_REFILL,
    totalCost: propaneTanks * MATERIAL_COSTS.PROPANE_REFILL
  });

  return materials;
}

export function calculateLineStripingMaterials(numberOfStalls: number) {
  const materials: MaterialCalculation[] = [];
  
  // Calculate total linear feet needed
  const totalLinearFeet = numberOfStalls * APPLICATION_RATES.STALL_LINEAR_FEET;
  
  materials.push({
    name: 'Line Striping Paint',
    quantity: totalLinearFeet,
    unit: 'linear_foot',
    unitCost: MATERIAL_COSTS.LINE_PAINT,
    totalCost: totalLinearFeet * MATERIAL_COSTS.LINE_PAINT
  });

  return materials;
}

export function calculatePatchingMaterials(squareFootage: number, patchType: 'hot' | 'cold' = 'hot') {
  const materials: MaterialCalculation[] = [];
  
  const costPerSqFt = patchType === 'hot' ? MATERIAL_COSTS.HOT_MIX_ASPHALT : MATERIAL_COSTS.COLD_PATCH;
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

export function calculateEstimate(input: EstimateInput): EstimateResult {
  let materials: MaterialCalculation[] = [];
  let laborHours = 0;

  // Calculate materials and labor based on job type
  switch (input.jobType) {
    case 'SEALCOATING':
      if (input.squareFootage) {
        materials = calculateSealcoatingMaterials(input.squareFootage, input.hasOilSpots || false);
        laborHours = input.squareFootage / LABOR_RATES.SEALCOAT_EFFICIENCY * 2; // 2-person crew
      }
      break;
      
    case 'CRACK_REPAIR':
      if (input.linearFootage) {
        materials = calculateCrackRepairMaterials(input.linearFootage, input.crackSeverity || 'MEDIUM');
        laborHours = input.linearFootage / LABOR_RATES.CRACK_FILL_EFFICIENCY;
      }
      break;
      
    case 'LINE_STRIPING':
      if (input.numberOfStalls) {
        materials = calculateLineStripingMaterials(input.numberOfStalls);
        laborHours = (input.numberOfStalls * APPLICATION_RATES.STALL_LINEAR_FEET) / LABOR_RATES.STRIPING_EFFICIENCY;
      }
      break;
      
    case 'ASPHALT_PATCHING':
      if (input.squareFootage) {
        materials = calculatePatchingMaterials(input.squareFootage);
        laborHours = input.squareFootage / LABOR_RATES.PATCHING_EFFICIENCY;
      }
      break;
      
    case 'COMBINATION':
      // Handle combination jobs
      if (input.squareFootage) {
        materials.push(...calculateSealcoatingMaterials(input.squareFootage, input.hasOilSpots || false));
        laborHours += input.squareFootage / LABOR_RATES.SEALCOAT_EFFICIENCY * 2;
      }
      if (input.linearFootage) {
        materials.push(...calculateCrackRepairMaterials(input.linearFootage, input.crackSeverity || 'MEDIUM'));
        laborHours += input.linearFootage / LABOR_RATES.CRACK_FILL_EFFICIENCY;
      }
      if (input.numberOfStalls) {
        materials.push(...calculateLineStripingMaterials(input.numberOfStalls));
        laborHours += (input.numberOfStalls * APPLICATION_RATES.STALL_LINEAR_FEET) / LABOR_RATES.STRIPING_EFFICIENCY;
      }
      break;
  }

  // Calculate costs
  const materialCost = materials.reduce((sum, material) => sum + material.totalCost, 0);
  const laborCost = laborHours * LABOR_RATES.EMPLOYEE_RATE;
  
  // Calculate travel
  const distance = calculateDistance(input.businessAddress, input.jobAddress);
  const travelCost = (distance * 2) / EQUIPMENT_COSTS.VEHICLE_MPG * EQUIPMENT_COSTS.FUEL_PRICE; // Round trip
  
  // Calculate equipment/fuel costs
  const fuelCost = laborHours * EQUIPMENT_COSTS.FUEL_OPERATIONAL * EQUIPMENT_COSTS.FUEL_PRICE;
  const equipmentCost = laborHours * 5; // $5/hour equipment depreciation/maintenance
  
  const subtotal = materialCost + laborCost + fuelCost + equipmentCost + travelCost;
  const overhead = subtotal * 0.15; // 15% overhead
  const profit = subtotal * 0.25; // 25% profit margin
  const total = subtotal + overhead + profit;

  return {
    materials,
    labor: {
      hours: laborHours,
      rate: LABOR_RATES.EMPLOYEE_RATE,
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
