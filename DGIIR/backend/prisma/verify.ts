import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import 'dotenv/config'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function verify() {
  console.log('=== DGIIR DATABASE SEED VERIFICATION ===\n')

  try {
    // 1. Verify Districts
    const districts = await prisma.district.findMany({
      orderBy: { name: 'asc' }
    })
    console.log(`📍 Districts Found: ${districts.length}`)
    districts.forEach(d => console.log(`  - [${d.code}] ${d.name}`))
    console.log()

    // 2. Verify Departments & Categories
    const departments = await prisma.department.findMany({
      include: { categories: true },
      orderBy: { name: 'asc' }
    })
    console.log(`🏢 Departments Found: ${departments.length}`)
    departments.forEach(dep => {
      console.log(`  - [${dep.code}] ${dep.name}`)
      dep.categories.forEach(cat => console.log(`      ↳ Category: ${cat.name}`))
    })
    console.log()

    // 3. Verify Super Admin User
    const admin = await prisma.user.findFirst({
      where: { email: 'admin@dgiir.gov.in' }
    })
    if (admin) {
      console.log(`👤 Super Admin User Found:`)
      console.log(`  - Name: ${admin.name}`)
      console.log(`  - Email: ${admin.email}`)
      console.log(`  - Phone: ${admin.phone}`)
      console.log(`  - Role: ${admin.role}`)
    } else {
      console.log(`❌ Super Admin User 'admin@dgiir.gov.in' was NOT found!`)
    }
    console.log()

    // 4. Verify Complaints
    const complaintsCount = await prisma.complaint.count()
    console.log(`📝 Total Complaints: ${complaintsCount}`)

  } catch (error) {
    console.error('❌ Error during verification:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verify()
