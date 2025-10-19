import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function testSignIn() {
  try {
    console.log('Testing sign-in for n8ter8@gmail.com...\n');
    
    const user = await prisma.user.findUnique({
      where: { email: 'n8ter8@gmail.com' }
    });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✓ User found:');
    console.log('  ID:', user.id);
    console.log('  Email:', user.email);
    console.log('  Name:', user.name);
    console.log('  Role:', user.role);
    console.log('  Has password:', !!user.password);
    
    if (user.password) {
      const testPassword = 'Starkiller1138!';
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log('\n✓ Password test:', isValid ? 'VALID ✓' : 'INVALID ✗');
      
      if (isValid) {
        console.log('\n✅ Sign-in should work! User can log in successfully.');
      } else {
        console.log('\n❌ Password is incorrect.');
      }
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSignIn();
