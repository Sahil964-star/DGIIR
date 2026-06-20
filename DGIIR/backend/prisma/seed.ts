import { PrismaClient, Role } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Seeding database...')

  // 1. Seed Districts
  const districts = [
    { name: 'Central', code: 'CEN' },
    { name: 'New Delhi', code: 'ND' },
    { name: 'East', code: 'EAS' },
    { name: 'West', code: 'WES' },
    { name: 'North', code: 'NOR' },
    { name: 'South', code: 'SOU' },
    { name: 'North East', code: 'NE' },
    { name: 'North West', code: 'NW' },
    { name: 'South East', code: 'SE' },
    { name: 'South West', code: 'SW' },
    { name: 'Shahdara', code: 'SHA' },
  ]
  
  for (const d of districts) {
    await prisma.district.upsert({
      where: { code: d.code },
      update: {},
      create: d,
    })
  }

  // 2. Seed Departments and Categories
  const departmentsWithCategories = [
    {
      name: 'Delhi Jal Board',
      code: 'DJB',
      categories: [
        'Water Leakage',
        'Contaminated Water Supply',
        'Sewer Overflow',
        'No Water Supply',
        'Water Billing Dispute'
      ]
    },
    {
      name: 'Public Works Department',
      code: 'PWD',
      categories: [
        'Potholes on Main Roads',
        'Streetlight Malfunction',
        'Waterlogging on Roads',
        'Broken Footpaths',
        'Road Signage Damaged'
      ]
    },
    {
      name: 'Municipal Corporation of Delhi',
      code: 'MCD',
      categories: [
        'Garbage Dump Clearance',
        'Stray Animal Menace',
        'Public Park Maintenance',
        'Illegal Construction',
        'Drainage Blockage'
      ]
    },
    {
      name: 'Transport Department',
      code: 'TRA',
      categories: [
        'Overcharging by Auto/Taxi',
        'Reckless Driving of Bus',
        'Illegal Parking',
        'Permit and License Query'
      ]
    },
    {
      name: 'Environment Department',
      code: 'ENV',
      categories: [
        'Open Garbage Burning',
        'Industrial Pollution',
        'Noise Pollution (Loudspeakers)',
        'Illegal Tree Felling'
      ]
    }
  ]

  for (const dept of departmentsWithCategories) {
    const dbDept = await prisma.department.upsert({
      where: { code: dept.code },
      update: {},
      create: {
        name: dept.name,
        code: dept.code
      }
    })

    for (const catName of dept.categories) {
      await prisma.category.upsert({
        where: { name: catName },
        update: { departmentId: dbDept.id },
        create: {
          name: catName,
          departmentId: dbDept.id
        }
      })
    }
  }

  // 3. Seed Super Admin
  const adminEmail = 'admin@dgiir.gov.in'
  const adminPassword = await bcrypt.hash('Admin@2026', 10)
  
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      phone: '9999999999',
      passwordHash: adminPassword,
      name: 'Super Administrator',
      role: Role.SUPER_ADMIN,
    },
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
