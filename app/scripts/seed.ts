
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { DEFAULT_BUSINESS_SETTINGS } from '../lib/business-logic';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create materials based on business logic
  const materials = [
    {
      name: 'SealMaster PMM Asphalt Sealer Concentrate',
      supplier: 'SealMaster, Madison, NC',
      unit: 'gallon',
      costPerUnit: 3.65,
      category: 'SEALER',
      description: 'PMM asphalt sealer concentrate - bulk 500+ gallons'
    },
    {
      name: 'Sand (50lb bag)',
      supplier: 'SealMaster, Madison, NC',
      unit: 'bag',
      costPerUnit: 10.00,
      category: 'ADDITIVE',
      description: '50lb bag of sand for sealcoating mix'
    },
    {
      name: 'Prep Seal',
      supplier: 'SealMaster, Madison, NC',
      unit: 'bucket',
      costPerUnit: 50.00,
      category: 'PRIMER',
      description: '5-gallon bucket - oil spot primer, coverage 150-200 sq ft per gallon'
    },
    {
      name: 'Fast Dry Additive (FASS-DRI PSA)',
      supplier: 'SealMaster, Madison, NC',
      unit: 'bucket',
      costPerUnit: 140.00,
      category: 'ADDITIVE',
      description: '5-gallon bucket - 2 gallons per 125 gallons of sealer concentrate'
    },
    {
      name: 'CrackMaster Crackfiller Parking Lot LP',
      supplier: 'SealMaster, Madison, NC',
      unit: 'box',
      costPerUnit: 44.95,
      category: 'CRACK_FILLER',
      description: '30lb box for crack filling'
    },
    {
      name: 'SealMaster FlexMaster Crack Sealant',
      supplier: 'SealMaster, Madison, NC',
      unit: 'gallon',
      costPerUnit: 27.24,
      category: 'CRACK_FILLER',
      description: '1 gallon jug crack sealant'
    },
    {
      name: 'Propane Tank Refill',
      supplier: 'Local Supplier',
      unit: 'tank',
      costPerUnit: 10.00,
      category: 'FUEL',
      description: 'Propane tank refill for hot pour crack machines'
    },
    {
      name: 'Hot Mix Asphalt',
      supplier: 'Local Supplier',
      unit: 'square_foot',
      costPerUnit: 3.50,
      category: 'PATCHING',
      description: 'Hot mix asphalt for patching - 2 inch thick average'
    },
    {
      name: 'Cold Patch Asphalt',
      supplier: 'Local Supplier',
      unit: 'square_foot',
      costPerUnit: 3.00,
      category: 'PATCHING',
      description: 'Cold patch asphalt for temporary repairs'
    },
    {
      name: 'Line Striping Paint',
      supplier: 'Local Supplier',
      unit: 'linear_foot',
      costPerUnit: 0.87,
      category: 'STRIPING',
      description: 'Paint for line striping - average $0.75-$1.00 per linear foot'
    }
  ];

  console.log('Creating materials...');
  
  // Clear existing materials first
  await prisma.material.deleteMany({});
  
  for (const material of materials) {
    await prisma.material.create({
      data: material,
    });
  }

  // Create business settings
  console.log('Creating business settings...');

  const businessSettings = [
    // Material costs
    { key: 'PMM_CONCENTRATE', value: '3.65', label: 'PMM Concentrate (per gallon)', category: 'MATERIAL_COSTS', unit: 'gallon' },
    { key: 'SAND_50LB', value: '10.00', label: 'Sand 50lb Bag', category: 'MATERIAL_COSTS', unit: 'bag' },
    { key: 'PREP_SEAL', value: '50.00', label: 'Prep Seal Oil Spot Primer (5-gallon bucket)', category: 'MATERIAL_COSTS', unit: 'bucket' },
    { key: 'FAST_DRY', value: '140.00', label: 'Fast Dry Additive (5-gallon bucket)', category: 'MATERIAL_COSTS', unit: 'bucket' },
    { key: 'CRACK_FILLER_30LB', value: '44.95', label: 'Crack Filler (30lb box)', category: 'MATERIAL_COSTS', unit: 'box' },
    { key: 'FLEXMASTER_CRACK', value: '27.24', label: 'FlexMaster Crack Sealant (per gallon)', category: 'MATERIAL_COSTS', unit: 'gallon' },
    { key: 'PROPANE_REFILL', value: '10.00', label: 'Propane Tank Refill', category: 'MATERIAL_COSTS', unit: 'tank' },
    { key: 'HOT_MIX_ASPHALT', value: '3.50', label: 'Hot Mix Asphalt (per sq ft)', category: 'MATERIAL_COSTS', unit: 'sq_ft' },
    { key: 'COLD_PATCH', value: '3.00', label: 'Cold Patch Asphalt (per sq ft)', category: 'MATERIAL_COSTS', unit: 'sq_ft' },
    { key: 'LINE_PAINT', value: '0.87', label: 'Line Striping Paint (per linear ft)', category: 'MATERIAL_COSTS', unit: 'linear_ft' },
    
    // Application rates
    { key: 'SEALCOATING_COVERAGE', value: '76', label: 'Sealcoating Coverage (sq ft per gallon)', category: 'RATES', unit: 'sq_ft/gallon' },
    { key: 'SAND_RATIO', value: '300', label: 'Sand Ratio (lbs per 100 gallons PMM)', category: 'RATES', unit: 'lbs/100gal' },
    { key: 'WATER_RATIO', value: '0.2', label: 'Water Ratio (20% by volume)', category: 'RATES', unit: 'percentage' },
    { key: 'FAST_DRY_RATIO', value: '2', label: 'Fast Dry Ratio (gallons per 125 gallons concentrate)', category: 'RATES', unit: 'gal/125gal' },
    { key: 'PREP_SEAL_COVERAGE', value: '175', label: 'Prep Seal Coverage (sq ft per gallon)', category: 'RATES', unit: 'sq_ft/gallon' },
    { key: 'CRACK_FILL_RATE', value: '1.75', label: 'Crack Fill Rate ($ per linear ft)', category: 'RATES', unit: '$/linear_ft' },
    { key: 'STALL_LINEAR_FEET', value: '20', label: 'Standard Parking Stall Linear Feet', category: 'RATES', unit: 'linear_ft' },
    { key: 'DOUBLE_STALL_LINEAR_FEET', value: '25', label: 'Double Parking Stall Linear Feet', category: 'RATES', unit: 'linear_ft' },
    
    // Labor rates
    { key: 'EMPLOYEE_RATE', value: '20.00', label: 'Employee Hourly Rate', category: 'LABOR_RATES', unit: '$/hour' },
    { key: 'CRACK_FILL_EFFICIENCY', value: '100', label: 'Crack Fill Efficiency (linear feet per hour)', category: 'LABOR_RATES', unit: 'linear_ft/hour' },
    { key: 'SEALCOAT_EFFICIENCY', value: '2000', label: 'Sealcoat Efficiency (sq ft per hour per person)', category: 'LABOR_RATES', unit: 'sq_ft/hour/person' },
    { key: 'STRIPING_EFFICIENCY', value: '500', label: 'Line Striping Efficiency (linear feet per hour)', category: 'LABOR_RATES', unit: 'linear_ft/hour' },
    { key: 'PATCHING_EFFICIENCY', value: '50', label: 'Asphalt Patching Efficiency (sq ft per hour)', category: 'LABOR_RATES', unit: 'sq_ft/hour' },
    
    // Equipment costs
    { key: 'FUEL_OPERATIONAL', value: '2', label: 'Fuel Operational (gallons per hour)', category: 'EQUIPMENT_COSTS', unit: 'gallons/hour' },
    { key: 'FUEL_IDLE', value: '50', label: 'Fuel Idle Cost ($ per hour)', category: 'EQUIPMENT_COSTS', unit: '$/hour' },
    { key: 'VEHICLE_MPG', value: '17.5', label: 'Average Vehicle MPG', category: 'EQUIPMENT_COSTS', unit: 'mpg' },
    { key: 'FUEL_PRICE', value: '3.50', label: 'Fuel Price ($ per gallon)', category: 'EQUIPMENT_COSTS', unit: '$/gallon' },
    
    // Business rates
    { key: 'OVERHEAD_PERCENTAGE', value: '15', label: 'Overhead Percentage', category: 'BUSINESS_RATES', unit: 'percentage' },
    { key: 'PROFIT_PERCENTAGE', value: '25', label: 'Profit Margin Percentage', category: 'BUSINESS_RATES', unit: 'percentage' },
    { key: 'EQUIPMENT_HOURLY_RATE', value: '5', label: 'Equipment Hourly Rate ($ per hour)', category: 'BUSINESS_RATES', unit: '$/hour' },
  ];

  for (const setting of businessSettings) {
    await prisma.businessSetting.upsert({
      where: { key: setting.key },
      update: {
        value: setting.value,
        label: setting.label,
        category: setting.category,
        unit: setting.unit,
      },
      create: setting,
    });
  }

  // Create test users
  console.log('Creating test users...');
  
  // Required admin test account (hidden credentials)
  await prisma.user.upsert({
    where: { email: 'john@doe.com' },
    update: {},
    create: {
      email: 'john@doe.com',
      password: await bcrypt.hash('johndoe123', 12),
      firstName: 'John',
      lastName: 'Doe',
      role: 'ADMIN',
      hourlyRate: 25.00,
      phone: '555-0100'
    },
  });

  // Business owner account
  await prisma.user.upsert({
    where: { email: 'owner@asphaltpaving.com' },
    update: {},
    create: {
      email: 'owner@asphaltpaving.com',
      password: await bcrypt.hash('owner123', 12),
      firstName: 'Business',
      lastName: 'Owner',
      role: 'OWNER',
      hourlyRate: 0.00,
      phone: '555-0101'
    },
  });

  // Full-time employees
  await prisma.user.upsert({
    where: { email: 'employee1@asphaltpaving.com' },
    update: {},
    create: {
      email: 'employee1@asphaltpaving.com',
      password: await bcrypt.hash('employee123', 12),
      firstName: 'Mike',
      lastName: 'Johnson',
      role: 'EMPLOYEE',
      hourlyRate: 20.00,
      phone: '555-0102'
    },
  });

  await prisma.user.upsert({
    where: { email: 'employee2@asphaltpaving.com' },
    update: {},
    create: {
      email: 'employee2@asphaltpaving.com',
      password: await bcrypt.hash('employee123', 12),
      firstName: 'Sarah',
      lastName: 'Wilson',
      role: 'EMPLOYEE',
      hourlyRate: 20.00,
      phone: '555-0103'
    },
  });

  // Part-time employee
  await prisma.user.upsert({
    where: { email: 'parttime@asphaltpaving.com' },
    update: {},
    create: {
      email: 'parttime@asphaltpaving.com',
      password: await bcrypt.hash('employee123', 12),
      firstName: 'Tom',
      lastName: 'Davis',
      role: 'EMPLOYEE',
      hourlyRate: 20.00,
      phone: '555-0104'
    },
  });

  // Create sample jobs
  console.log('Creating sample jobs...');
  
  const owner = await prisma.user.findFirst({ where: { role: 'OWNER' } });
  
  const sampleJobs = [
    {
      title: 'Walmart Parking Lot Sealcoating',
      address: '1234 Main Street, Martinsville, VA 24112',
      latitude: 36.6851,
      longitude: -79.8725,
      status: 'POSSIBLE' as const,
      type: 'SEALCOATING' as const,
      description: 'Large parking lot sealcoating project',
      contactName: 'Store Manager',
      contactPhone: '555-0200',
      squareFootage: 50000,
      hasOilSpots: true,
      estimatedCost: 15000
    },
    {
      title: 'Medical Center Crack Repair',
      address: '456 Hospital Drive, Stuart, VA 24171',
      latitude: 36.6484,
      longitude: -80.2737,
      status: 'IN_PROGRESS' as const,
      type: 'CRACK_REPAIR' as const,
      description: 'Crack filling and sealing for medical center parking',
      contactName: 'Facility Manager',
      contactPhone: '555-0201',
      linearFootage: 2500,
      crackSeverity: 'MEDIUM',
      estimatedCost: 3750
    },
    {
      title: 'Shopping Plaza Line Striping',
      address: '789 Commerce Blvd, Martinsville, VA 24112',
      latitude: 36.6765,
      longitude: -79.8822,
      status: 'COMPLETED' as const,
      type: 'LINE_STRIPING' as const,
      description: 'Complete re-striping of shopping plaza parking',
      contactName: 'Property Manager',
      contactPhone: '555-0202',
      numberOfStalls: 150,
      completedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
      actualCost: 750,
      invoicedAmount: 950
    },
    {
      title: 'Office Complex Combination Job',
      address: '321 Business Park Dr, Henry, VA 24102',
      latitude: 36.7540,
      longitude: -79.9400,
      status: 'POSSIBLE' as const,
      type: 'COMBINATION' as const,
      description: 'Sealcoating, crack repair, and line striping',
      contactName: 'Building Manager',
      contactPhone: '555-0203',
      squareFootage: 25000,
      linearFootage: 800,
      numberOfStalls: 75,
      hasOilSpots: false,
      estimatedCost: 8500
    },
    {
      title: 'Residential Driveway Sealcoating',
      address: '123 Oak Street, Stuart, VA 24171',
      latitude: 36.6395,
      longitude: -80.2640,
      status: 'LOST' as const,
      type: 'SEALCOATING' as const,
      description: 'Residential driveway sealcoating - lost to competitor',
      contactName: 'Homeowner',
      contactPhone: '555-0204',
      squareFootage: 1200,
      estimatedCost: 480
    }
  ];

  for (const job of sampleJobs) {
    await prisma.job.create({
      data: {
        ...job,
        createdBy: owner?.id
      }
    });
  }

  console.log('Database seeding completed successfully!');
  
  // Log credentials for development (but hide the admin test account)
  console.log('\n=== Development Login Credentials ===');
  console.log('Owner Account:');
  console.log('  Email: owner@asphaltpaving.com');
  console.log('  Password: owner123');
  console.log('\nEmployee Accounts:');
  console.log('  Email: employee1@asphaltpaving.com / Password: employee123');
  console.log('  Email: employee2@asphaltpaving.com / Password: employee123'); 
  console.log('  Email: parttime@asphaltpaving.com / Password: employee123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
