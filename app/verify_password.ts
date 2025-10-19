import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function verifyPassword() {
  try {
    const result = await prisma.$queryRaw`
      SELECT id, email, password, role, name
      FROM "User" 
      WHERE email = 'n8ter8@gmail.com'
    ` as any[];
    
    if (result.length === 0) {
      console.log('User not found');
      return;
    }
    
    const user = result[0];
    console.log('User ID:', user.id);
    console.log('Email:', user.email);
    console.log('Role:', user.role);
    console.log('Name:', user.name);
    console.log('Password hash exists:', !!user.password);
    
    if (user.password) {
      const testPassword = 'Starkiller1138!';
      const isValid = await bcrypt.compare(testPassword, user.password);
      console.log(`\nPassword "${testPassword}" is ${isValid ? 'VALID ✓' : 'INVALID ✗'}`);
      
      if (!isValid) {
        console.log('\nThe password does not match. The user may need to reset their password.');
      }
    } else {
      console.log('\nNo password hash found for this user.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyPassword();
