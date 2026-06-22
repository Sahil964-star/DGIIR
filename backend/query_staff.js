import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const staff = await prisma.user.findMany({
    where: { role: { not: 'CITIZEN' } }
  });
  console.log('=== STAFF USER AUDIT ===');
  for (const s of staff) {
    const match = await bcrypt.compare('Password@123', s.passwordHash || '');
    console.log(`Email: ${s.email} | Role: ${s.role} | Hash: ${s.passwordHash} | Matches "Password@123": ${match}`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
