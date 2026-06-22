import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const priorities = await prisma.complaint.groupBy({
    by: ['priority'],
    _count: {
      priority: true
    }
  })

  console.log('Database Priorities:', JSON.stringify(priorities, null, 2))
}

main().catch(console.error).finally(() => process.exit(0))
