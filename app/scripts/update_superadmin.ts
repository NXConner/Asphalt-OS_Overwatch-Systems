import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateSuperAdmin() {
  const user = await prisma.user.update({
    where: { email: 'n8ter8@gmail.com' },
    data: {
      lastName: 'SuperAdmin',
      firstName: 'Nathan'
    }
  });
  
  console.log('\n✓ Account Updated Successfully!');
  console.log('  Email:', user.email);
  console.log('  Name:', user.firstName, user.lastName);
  console.log('  Role:', user.role);
  console.log('\n=== Your SuperAdmin Login Credentials ===');
  console.log('  Email: n8ter8@gmail.com');
  console.log('  Password: Starkiller1138!');
  console.log('  Role: OWNER (SuperAdmin - Highest Permission Level)');
  console.log('\nYou are now the one and only SuperAdmin! 🎖️');
  
  await prisma.$disconnect();
}

updateSuperAdmin().catch(console.error);
