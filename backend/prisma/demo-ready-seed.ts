import { PrismaClient, Role, Priority, ComplaintStatus, NotificationType } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'
import bcrypt from 'bcryptjs'
import 'dotenv/config'

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Starting Demo-Ready Seed generation...')
  
  await prisma.complaintEvent.deleteMany()
  await prisma.escalation.deleteMany()
  await prisma.media.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.otpVerification.deleteMany()
  await prisma.complaintVerification.deleteMany()
  await prisma.complaint.deleteMany()
  await prisma.slaConfiguration.deleteMany()
  await prisma.category.deleteMany()
  await prisma.department.deleteMany()
  await prisma.auditLog.deleteMany()
  await prisma.user.deleteMany()
  await prisma.district.deleteMany()

  const dData = [
    { name: 'North West', code: 'NW' },
    { name: 'East', code: 'EAS' },
    { name: 'North', code: 'NOR' },
    { name: 'South', code: 'SOU' },
    { name: 'West', code: 'WES' },
    { name: 'South East', code: 'SE' }
  ]
  const districts = []
  for (const d of dData) {
    districts.push(await prisma.district.create({ data: d }))
  }
  const distMap: Record<string, string> = {}
  for (const d of districts) {
    distMap[d.name] = d.id
  }

  const pwd = await prisma.department.create({ data: { name: 'Public Works Department', code: 'PWD' } })
  const djb = await prisma.department.create({ data: { name: 'Delhi Jal Board', code: 'DJB' } })
  const mcd = await prisma.department.create({ data: { name: 'Municipal Corporation of Delhi', code: 'MCD' } })

  const catData = [
    { name: 'Water Crisis', dept: djb.id },
    { name: 'Garbage Dump', dept: mcd.id },
    { name: 'Streetlight Failure', dept: pwd.id },
    { name: 'Road Damage', dept: pwd.id },
    { name: 'Drainage Issue', dept: djb.id },
    { name: 'Unique Issue', dept: mcd.id },
  ]
  const categories = []
  for (const c of catData) {
    categories.push(await prisma.category.create({ data: { name: c.name, departmentId: c.dept } }))
  }
  const catMap: Record<string, { id: string, deptId: string }> = {}
  for (const c of categories) {
    catMap[c.name] = { id: c.id, deptId: c.departmentId }
  }

  for (const c of categories) {
    await prisma.slaConfiguration.create({
      data: {
        categoryId: c.id,
        resolveHours: 48,
        escalationTarget: 'OPERATIONS',
        priorityRules: { HIGH: 24, MEDIUM: 48, LOW: 72 },
      }
    })
  }

  const pwdHash = await bcrypt.hash('Demo@123', 10)
  const citizens = []
  for(let i=1; i<=40; i++) {
    citizens.push(await prisma.user.create({
      data: {
        name: `Citizen ${i}`,
        phone: `99999000${i.toString().padStart(2, '0')}`,
        role: Role.CITIZEN,
        passwordHash: pwdHash,
        districtId: districts[i % districts.length].id
      }
    }))
  }

  const officers = []
  for(let i=0; i<5; i++) {
    officers.push(await prisma.user.create({
      data: {
        name: `Field Officer ${String.fromCharCode(65+i)}`,
        phone: `888880000${i}`,
        email: `officer${String.fromCharCode(97+i)}@dgiir.gov.in`,
        role: Role.FIELD_OFFICER,
        passwordHash: pwdHash,
        districtId: districts[0].id
      }
    }))
  }

  const opsUser = await prisma.user.create({
    data: { name: 'Ops Lead', phone: '7777700001', email: 'ops@dgiir.gov.in', role: Role.OPERATIONS, passwordHash: pwdHash }
  })

  await prisma.user.create({
    data: { name: 'Chief Minister', phone: '6666600001', email: 'cm@dgiir.gov.in', role: Role.CHIEF_MINISTER, passwordHash: pwdHash }
  })

  const confidences: number[] = []
  for(let i=0; i<42; i++) confidences.push(95)
  for(let i=0; i<12; i++) confidences.push(85)
  for(let i=0; i<6; i++) confidences.push(65)

  const statuses: ComplaintStatus[] = [
    ...Array(5).fill('PENDING'),
    ...Array(8).fill('UNDER_REVIEW'),
    ...Array(10).fill('ASSIGNED'),
    ...Array(12).fill('IN_PROGRESS'),
    ...Array(10).fill('RESOLVED'),
    ...Array(5).fill('VERIFICATION_PENDING'),
    ...Array(8).fill('CLOSED'),
    ...Array(2).fill('REOPENED')
  ] as ComplaintStatus[]

  const assignedStatuses = ['ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'VERIFICATION_PENDING', 'CLOSED', 'REOPENED']
  const officerQueue = [
    ...Array(12).fill(officers[0].id),
    ...Array(10).fill(officers[1].id),
    ...Array(8).fill(officers[2].id),
    ...Array(5).fill(officers[3].id),
    ...Array(2).fill(officers[4].id)
  ]

  const complaintsList = [
    ...Array(15).fill({ prefix: 'Water Crisis', desc: 'No water supply in Rohini', dist: 'North West', cat: 'Water Crisis', hrs: 48, keywords: ['water', 'crisis', 'rohini'] }),
    ...Array(10).fill({ prefix: 'Garbage Dump', desc: 'Overflowing garbage bins', dist: 'East', cat: 'Garbage Dump', hrs: 72, keywords: ['garbage', 'overflowing'] }),
    ...Array(8).fill({ prefix: 'Streetlight Failure', desc: 'Streetlights not working', dist: 'North', cat: 'Streetlight Failure', hrs: 48, keywords: ['streetlight', 'dark'] }),
    ...Array(8).fill({ prefix: 'Road Damage', desc: 'Potholes on the road', dist: 'South', cat: 'Road Damage', hrs: 120, keywords: ['road', 'damage'] }),
    ...Array(7).fill({ prefix: 'Drainage Issue', desc: 'Drain overflowing', dist: 'West', cat: 'Drainage Issue', hrs: 48, keywords: ['drainage', 'overflow'] }),
    ...Array(12).fill({ prefix: 'Unique Issue', desc: 'Unique localized complaint', dist: 'South East', cat: 'Unique Issue', hrs: 24, keywords: ['unique', 'issue'] }),
  ]

  let confIdx = 0
  let statusIdx = 0
  
  const createdComplaints = []

  for (let i = 0; i < complaintsList.length; i++) {
    const cInfo = complaintsList[i]
    const status = statuses[statusIdx++]
    const conf = confidences[confIdx++]
    const isFlagged = conf < 70

    let officerId = null
    if (assignedStatuses.includes(status) && officerQueue.length > 0) {
      officerId = officerQueue.shift()
    }

    const complaint = await prisma.complaint.create({
      data: {
        complaintNo: `CMP-DEMO-${1000 + i}`,
        title: `${cInfo.prefix} - Case ${i}`,
        description: cInfo.desc,
        status: status,
        priority: 'HIGH',
        address: `${cInfo.dist} area`,
        districtId: distMap[cInfo.dist],
        categoryId: catMap[cInfo.cat].id,
        departmentId: catMap[cInfo.cat].deptId,
        citizenId: citizens[i % citizens.length].id,
        officerId: officerId,
        createdAt: new Date(Date.now() - Math.random() * cInfo.hrs * 3600000),
        aiCategory: cInfo.cat,
        aiConfidence: conf,
        aiSummary: `AI Summary for ${cInfo.prefix}`,
        aiKeywords: cInfo.keywords,
        aiIsFlagged: isFlagged,
        aiDepartmentSuggestion: 'Known Department'
      }
    })
    createdComplaints.push(complaint)
  }

  const escalationReasons = ['Resource shortage', 'Multiple area impact', 'SLA breach', 'Resource shortage', 'SLA breach']
  for (let i = 0; i < 5; i++) {
    await prisma.escalation.create({
      data: {
        complaintId: createdComplaints[i + 15].id,
        escalatedFromId: officers[0].id,
        escalatedToId: opsUser.id,
        reason: escalationReasons[i],
      }
    })
  }

  const notifTypes: NotificationType[] = ['STATUS_UPDATE', 'ASSIGNMENT', 'SLA_BREACH', 'ESCALATION', 'SYSTEM_ALERT']
  for (let i = 0; i < 50; i++) {
    await prisma.notification.create({
      data: {
        userId: i % 2 === 0 ? opsUser.id : officers[0].id,
        type: notifTypes[i % notifTypes.length],
        title: `Notification ${i}`,
        message: `This is notification detail ${i}`,
      }
    })
  }

  console.log('Demo Seed completed successfully!')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(async () => { 
    await prisma.$disconnect() 
    process.exit(0)
  })
