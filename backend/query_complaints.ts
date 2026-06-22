import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const complaints = await prisma.complaint.findMany({
    take: 10,
    select: {
      id: true,
      title: true,
      aiConfidence: true,
      aiCategory: true,
      aiPriority: true,
    }
  })

  console.log(JSON.stringify(complaints, null, 2))
}

main().catch(console.error).finally(() => process.exit(0))
