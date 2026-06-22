import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const users = await prisma.user.findMany({
    where: { isActive: true },
    select: {
      role: true,
      name: true,
      email: true,
      phone: true,
      id: true,
      isActive: true,
    }
  })

  const grouped: any = {}
  for (const u of users) {
    if (!grouped[u.role]) grouped[u.role] = []
    grouped[u.role].push(u)
  }

  console.log(JSON.stringify(grouped, null, 2))
}

main().catch(console.error).finally(() => process.exit(0))
