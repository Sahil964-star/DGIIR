// prisma/demo-seed.ts
import { PrismaClient } from '@prisma/client';
// In a real scenario, this would use Faker.js to generate 5000 realistic complaints 
// and insert them using prisma.createMany for analytics testing.
// Keeping it simple for the snippet.
const prisma = new PrismaClient();
async function main() {
    console.log('Starting Demo Seed (Large Scale)...');
    // Add 1000 complaints generation logic here
    console.log('Demo Seed completed!');
}
main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
//# sourceMappingURL=demo-seed.js.map