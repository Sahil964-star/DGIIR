import 'dotenv/config';
async function runTest() {
    console.log('--- PHASE 4: COMPLAINT LIFECYCLE TEST ---\n');
    const BASE_URL = 'http://localhost:5000/api/v1';
    // We need an auth token for Citizen
    const { prisma } = await import('./src/db/prisma.ts');
    const bcrypt = await import('bcryptjs');
    const hash = await bcrypt.default.hash('123456', 10);
    // Inject OTP directly into DB
    await prisma.otpVerification.create({
        data: {
            phone: '5555555501',
            otpHash: hash,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60)
        }
    });
    const verifyRes = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            phone: '5555555501',
            otp: '123456',
            name: 'Test Citizen Lifecycle',
            email: 'testlife@example.com',
            districtId: 'some-uuid-if-needed'
        })
    });
    const verifyData = await verifyRes.json();
    const citizenToken = verifyData?.data?.accessToken;
    const citizenId = verifyData?.data?.user?.id;
    console.log('Got Citizen Token:', !!citizenToken);
    // Operations Token (login via email)
    const opsRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'ops1@dgiir.gov.in', password: 'Password@123' })
    });
    const opsData = await opsRes.json();
    const opsToken = opsData?.data?.accessToken;
    console.log('Got Operations Token:', !!opsToken);
    // Officer Token
    const offRes = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'officer1@dgiir.gov.in', password: 'Password@123' })
    });
    const offData = await offRes.json();
    const offToken = offData?.data?.accessToken;
    const offId = offData?.data?.user?.id;
    console.log('Got Officer Token:', !!offToken);
    console.log('\nSTEP 1: Citizen (Create)');
    // We need a category and district
    const cats = await fetch(`${BASE_URL}/meta/categories`).then(r => r.json());
    const dists = await fetch(`${BASE_URL}/meta/districts`).then(r => r.json());
    const catId = cats?.data?.categories?.[0]?.id;
    const distId = dists?.data?.districts?.[0]?.id;
    if (!catId || !distId) {
        console.log('Missing category or district data in DB');
        await prisma.$disconnect();
        return;
    }
    const createRes = await fetch(`${BASE_URL}/complaints`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${citizenToken}`
        },
        body: JSON.stringify({
            categoryId: catId,
            districtId: distId,
            title: 'Water pipe leak in neighborhood',
            description: 'Major leak on Main St.',
            address: '123 Main St, New Delhi'
        })
    });
    const createData = await createRes.json();
    const complaintId = createData?.data?.complaint?.id;
    console.log('Create Response:', createRes.status, createData);
    console.log('PASS/FAIL:', createRes.status === 201 ? 'PASS' : 'FAIL');
    if (!complaintId) {
        await prisma.$disconnect();
        return;
    }
    console.log('\nSTEP 2: Operations (Assign)');
    const assignRes = await fetch(`${BASE_URL}/complaints/${complaintId}/assign`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${opsToken}`
        },
        body: JSON.stringify({
            officerId: offId,
            priority: 'HIGH',
            etaHours: 48
        })
    });
    const assignData = await assignRes.json();
    console.log('Assign Response:', assignRes.status, assignData);
    console.log('PASS/FAIL:', assignRes.status === 200 ? 'PASS' : 'FAIL');
    console.log('\nSTEP 3a: Officer (Start Progress)');
    const startRes = await fetch(`${BASE_URL}/complaints/${complaintId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${offToken}`
        },
        body: JSON.stringify({
            status: 'IN_PROGRESS'
        })
    });
    const startData = await startRes.json();
    console.log('Start Response:', startRes.status, startData);
    console.log('\nSTEP 3b: Officer (Update Status)');
    const updateRes = await fetch(`${BASE_URL}/complaints/${complaintId}/status`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${offToken}`
        },
        body: JSON.stringify({
            status: 'RESOLVED',
            resolutionNotes: 'Pipe repaired.'
        })
    });
    const updateData = await updateRes.json();
    console.log('Update Response:', updateRes.status, updateData);
    console.log('PASS/FAIL:', updateRes.status === 200 ? 'PASS' : 'FAIL');
    console.log('\nSTEP 4: Citizen (Verify Resolution)');
    const verifyCompRes = await fetch(`${BASE_URL}/complaints/${complaintId}/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${citizenToken}`
        },
        body: JSON.stringify({
            action: 'APPROVE',
            feedback: 'Excellent work'
        })
    });
    const verifyCompData = await verifyCompRes.json();
    console.log('Verify Response:', verifyCompRes.status, verifyCompData);
    console.log('PASS/FAIL:', verifyCompRes.status === 200 ? 'PASS' : 'FAIL');
    await prisma.$disconnect();
}
runTest().catch(console.error);
//# sourceMappingURL=verify_lifecycle.js.map