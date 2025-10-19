import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function checkUser() {
  try {
    // Use raw SQL to avoid schema mismatch
    const users = await prisma.$queryRaw`
      SELECT email, name, role, "createdAt" 
      FROM "User" 
      WHERE email = 'n8ter8@gmail.com'
    `;
    
    console.log('User found:', JSON.stringify(users, null, 2));
    
    if ((users as any[]).length === 0) {
      console.log('\nUser not found. Checking all users:');
      const allUsers = await prisma.$queryRaw`
        SELECT email, name, role 
        FROM "User"
        LIMIT 10
      `;
      console.log('All users:', JSON.stringify(allUsers, null, 2));
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
