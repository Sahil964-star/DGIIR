import { PrismaClient, Role, Priority, ComplaintStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
async function main() {
    console.log('Seeding database (Small Seed)...');
    // Clear existing
    await prisma.complaintEvent.deleteMany();
    await prisma.complaint.deleteMany();
    await prisma.slaConfiguration.deleteMany();
    await prisma.category.deleteMany();
    await prisma.department.deleteMany();
    await prisma.user.deleteMany();
    await prisma.district.deleteMany();
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
    ];
    const createdDistricts = [];
    for (const d of districts) {
        createdDistricts.push(await prisma.district.create({ data: d }));
    }
    // 2. Seed Departments and Categories
    const departmentsWithCategories = [
        { name: 'Delhi Jal Board', code: 'DJB', categories: ['Water Leakage', 'No Water Supply'] },
        { name: 'Public Works Department', code: 'PWD', categories: ['Potholes on Main Roads', 'Streetlight Malfunction'] },
        { name: 'Municipal Corporation of Delhi', code: 'MCD', categories: ['Garbage Dump Clearance', 'Stray Animal Menace'] },
    ];
    const createdCategories = [];
    for (const dept of departmentsWithCategories) {
        const dbDept = await prisma.department.create({ data: { name: dept.name, code: dept.code } });
        for (const catName of dept.categories) {
            const cat = await prisma.category.create({ data: { name: catName, departmentId: dbDept.id } });
            createdCategories.push(cat);
            // SLA Config
            await prisma.slaConfiguration.create({
                data: {
                    categoryId: cat.id,
                    resolveHours: 48,
                    escalationTarget: 'OPERATIONS',
                    priorityRules: { HIGH: 24, MEDIUM: 48, LOW: 72 },
                }
            });
        }
    }
    // 3. Seed Users
    const passwordHash = await bcrypt.hash('Password@123', 10);
    const createdCitizens = [];
    const createdOfficers = [];
    // Super Admin
    await prisma.user.create({ data: { email: 'admin@dgiir.gov.in', phone: '9999999999', passwordHash, name: 'Super Admin', role: Role.SUPER_ADMIN } });
    // CM
    await prisma.user.create({ data: { email: 'cm@dgiir.gov.in', phone: '8888888888', passwordHash, name: 'Chief Minister', role: Role.CHIEF_MINISTER } });
    // Operations (2)
    await prisma.user.create({ data: { email: 'ops1@dgiir.gov.in', phone: '7777777777', passwordHash, name: 'Operations Lead 1', role: Role.OPERATIONS, districtId: createdDistricts[0].id } });
    await prisma.user.create({ data: { email: 'ops2@dgiir.gov.in', phone: '7777777776', passwordHash, name: 'Operations Lead 2', role: Role.OPERATIONS, districtId: createdDistricts[1].id } });
    // Officers (5)
    for (let i = 1; i <= 5; i++) {
        createdOfficers.push(await prisma.user.create({ data: { email: `officer${i}@dgiir.gov.in`, phone: `666666666${i}`, passwordHash, name: `Field Officer ${i}`, role: Role.FIELD_OFFICER, districtId: createdDistricts[i % districts.length].id } }));
    }
    // Citizens (20)
    for (let i = 1; i <= 20; i++) {
        createdCitizens.push(await prisma.user.create({ data: { phone: `55555555${i < 10 ? '0' + i : i}`, passwordHash, name: `Citizen ${i}`, role: Role.CITIZEN, districtId: createdDistricts[i % districts.length].id } }));
    }
    // 4. Seed 50 Complaints
    for (let i = 1; i <= 50; i++) {
        const citizen = createdCitizens[i % 20];
        const category = createdCategories[i % createdCategories.length];
        await prisma.complaint.create({
            data: {
                complaintNo: `CMP-SEED-${1000 + i}`,
                title: `Seed Complaint ${i}`,
                description: `This is a seeded complaint description for ${category.name}`,
                status: i % 5 === 0 ? 'CLOSED' : (i % 3 === 0 ? 'IN_PROGRESS' : 'PENDING'),
                priority: i % 4 === 0 ? 'HIGH' : 'MEDIUM',
                districtId: citizen.districtId,
                categoryId: category.id,
                departmentId: category.departmentId,
                citizenId: citizen.id,
                officerId: i % 3 === 0 ? createdOfficers[i % 5].id : null,
                address: `Test Address ${i}, Delhi`,
                createdAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000), // Random time past 10 days
            }
        });
    }
    console.log('Database seeded successfully!');
}
main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
//# sourceMappingURL=seed.js.map