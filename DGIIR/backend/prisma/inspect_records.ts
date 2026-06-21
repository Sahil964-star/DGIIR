import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function inspect() {
  console.log('=== DATABASE RECORD INSPECTION ===')
  try {
    // Inspect User Table (sample of roles)
    const users = await prisma.user.findMany({
      select: { id: true, email: true, phone: true, role: true, name: true },
      take: 10
    })
    console.log('\n--- Sample Users ---')
    users.forEach(u => {
      console.log(`[${u.role}] ID: ${u.id} | Name: ${u.name} | Email: ${u.email || 'N/A'} | Phone: ${u.phone || 'N/A'}`)
    })

    // Inspect OtpVerification Table
    const otps = await prisma.otpVerification.findMany({
      select: { id: true, phone: true, userId: true, expiresAt: true, isUsed: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
      take: 10
    })
    console.log('\n--- Latest OTP Verifications ---')
    if (otps.length === 0) {
      console.log('No OTP records found.')
    } else {
      otps.forEach(o => {
        console.log(`ID: ${o.id} | Phone: ${o.phone || 'N/A'} | User ID: ${o.userId || 'N/A'} | Expires: ${o.expiresAt} | Used: ${o.isUsed} | Created: ${o.createdAt}`)
      })
    }
  } catch (error) {
    console.error('Inspection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

inspect()
