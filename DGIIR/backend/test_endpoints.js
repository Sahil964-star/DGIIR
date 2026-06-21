import { prisma } from './src/db/prisma.js';
async function run() {
    console.log("Testing Prisma...");
    try {
        await prisma.$connect();
        console.log("Prisma connected successfully");
    }
    catch (e) {
        console.error("Prisma connection failed", e);
    }
    const routes = [
        { method: 'POST', url: 'http://localhost:5000/api/v1/auth/request-otp', body: { phone: '9999999999' } },
        { method: 'POST', url: 'http://localhost:5000/api/v1/complaints', body: { title: 'Test', description: 'Test', categoryId: '1', departmentId: '1', latitude: 0, longitude: 0, address: 'Test' } },
        { method: 'GET', url: 'http://localhost:5000/api/v1/analytics/overview' },
        { method: 'GET', url: 'http://localhost:5000/api/v1/meta/districts' },
        { method: 'GET', url: 'http://localhost:5000/api/v1/notifications' },
        { method: 'GET', url: 'http://localhost:5000/api/v1/officer/workload' }
    ];
    for (const r of routes) {
        try {
            const resp = await fetch(r.url, {
                method: r.method,
                headers: { 'Content-Type': 'application/json' },
                body: r.body ? JSON.stringify(r.body) : undefined
            });
            const text = await resp.text();
            console.log(`[${r.method}] ${r.url} -> ${resp.status}`);
            if (resp.status >= 400) {
                console.log(`Response: ${text.substring(0, 100)}`);
            }
        }
        catch (e) {
            console.error(`[${r.method}] ${r.url} -> ERROR`, e.message);
        }
    }
    process.exit(0);
}
run();
//# sourceMappingURL=test_endpoints.js.map