
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

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
