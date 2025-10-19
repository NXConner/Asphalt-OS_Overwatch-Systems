import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function checkUser() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'n8ter8@gmail.com' }
    });
    
    if (user) {
      console.log('User found:', JSON.stringify(user, null, 2));
    } else {
      console.log('User not found with email: n8ter8@gmail.com');
      
      // Check all users
      const allUsers = await prisma.user.findMany({
        select: { email: true, name: true, role: true }
      });
      console.log('\nAll users in database:', JSON.stringify(allUsers, null, 2));
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUser();
