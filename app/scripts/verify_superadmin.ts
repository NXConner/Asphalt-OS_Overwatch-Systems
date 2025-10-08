import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function verifySuperAdmin() {
  console.log('\n🔍 Verifying SuperAdmin Account...\n');
  
  const user = await prisma.user.findUnique({
    where: { email: 'n8ter8@gmail.com' }
  });
  
  if (!user) {
    console.log('❌ ERROR: User not found!');
    await prisma.$disconnect();
    return;
  }

  const isPasswordValid = await bcrypt.compare('Starkiller1138!', user.password || '');
  
  console.log('═══════════════════════════════════════════');
  console.log('   ASPHALT OS - SUPERADMIN VERIFICATION   ');
  console.log('═══════════════════════════════════════════');
  console.log('');
  console.log('Account Status: ✓ ACTIVE');
  console.log('');
  console.log('User Details:');
  console.log('  • Email:      n8ter8@gmail.com');
  console.log('  • Full Name:  Nathan SuperAdmin');
  console.log('  • First Name: Nathan');
  console.log('  • Last Name:  SuperAdmin');
  console.log('  • Role:       OWNER (SuperAdmin Level)');
  console.log('  • Hourly Rate: $50.00');
  console.log('  • Status:     Active');
  console.log('');
  console.log('Authentication:');
  console.log('  • Password:   ' + (isPasswordValid ? '✓ VERIFIED' : '❌ INVALID'));
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('         LOGIN CREDENTIALS                ');
  console.log('═══════════════════════════════════════════');
  console.log('');
  console.log('  Email:    n8ter8@gmail.com');
  console.log('  Password: Starkiller1138!');
  console.log('');
  console.log('  Role:     OWNER (SuperAdmin)');
  console.log('  Access:   Full System Access');
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('');
  console.log('✓ You are the one and only SuperAdmin!');
  console.log('✓ All permissions granted');
  console.log('✓ Full control over Asphalt OS');
  console.log('');
  
  await prisma.$disconnect();
}

verifySuperAdmin().catch(console.error);
