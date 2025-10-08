import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function checkUser() {
  const user = await prisma.user.findUnique({
    where: { email: 'n8ter8@gmail.com' }
  });
  
  if (user) {
    console.log('\n✓ SuperAdmin Account Found:');
    console.log('  Email:', user.email);
    console.log('  Name:', user.firstName, user.lastName);
    console.log('  Role:', user.role);
    console.log('  Active:', user.isActive);
    
    // Test password
    const isValid = await bcrypt.compare('Starkiller1138!', user.password || '');
    console.log('  Password:', isValid ? '✓ CORRECT - Password matches!' : '✗ INCORRECT - Password does not match');
    console.log('\n=== Login Credentials ===');
    console.log('  Email: n8ter8@gmail.com');
    console.log('  Password: Starkiller1138!');
    console.log('  Role: OWNER (SuperAdmin)');
  } else {
    console.log('✗ User not found!');
  }
  
  await prisma.$disconnect();
}

checkUser().catch(console.error);
