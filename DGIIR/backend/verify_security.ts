import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const BASE_URL = 'http://localhost:5000/api/v1';

async function generateOtp(phone: string, code = '123456') {
  const hash = await bcrypt.hash(code, 10);
  // delete previous
  await prisma.otpVerification.deleteMany({ where: { phone } });
  await prisma.otpVerification.create({
    data: {
      phone,
      otpHash: hash,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    },
  });
}

async function loginCitizen(phone: string) {
  await generateOtp(phone);
  const res = await fetch(`${BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, otp: '123456' }),
  });
  const data = await res.json() as any;
  const cookieHeader = res.headers.get('set-cookie');
  return {
    token: data?.data?.accessToken,
    userId: data?.data?.user?.id,
    cookie: cookieHeader,
    status: res.status,
  };
}

async function loginStaff(email: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'Password@123' }),
  });
  const data = await res.json() as any;
  const cookieHeader = res.headers.get('set-cookie');
  return {
    token: data?.data?.accessToken,
    userId: data?.data?.user?.id,
    cookie: cookieHeader,
    status: res.status,
  };
}

async function main() {
  console.log('--- STARTING RUNTIME SECURITY AUDIT ---');

  // Logins
  const citizen1 = await loginCitizen('5555555501');
  const citizen2 = await loginCitizen('5555555502');
  const officer1 = await loginStaff('officer1@dgiir.gov.in');
  const officer2 = await loginStaff('officer2@dgiir.gov.in');
  const ops1 = await loginStaff('ops1@dgiir.gov.in'); // Central district ops
  const ops2 = await loginStaff('ops2@dgiir.gov.in'); // New Delhi district ops
  const cm = await loginStaff('cm@dgiir.gov.in');
  const admin = await loginStaff('admin@dgiir.gov.in');

  console.log('Logins complete:');
  console.log(`Citizen 1: ${citizen1.userId} (Token: ${!!citizen1.token})`);
  console.log(`Citizen 2: ${citizen2.userId} (Token: ${!!citizen2.token})`);
  console.log(`Officer 1: ${officer1.userId} (Token: ${!!officer1.token})`);
  console.log(`Officer 2: ${officer2.userId} (Token: ${!!officer2.token})`);
  console.log(`Operations 1: ${ops1.userId} (Token: ${!!ops1.token})`);
  console.log(`Operations 2: ${ops2.userId} (Token: ${!!ops2.token})`);
  console.log(`CM: ${cm.userId} (Token: ${!!cm.token})`);
  console.log(`Admin: ${admin.userId} (Token: ${!!admin.token})`);

  // Find a complaint created by Citizen 1
  const c1Complaint = await prisma.complaint.findFirst({
    where: { citizenId: citizen1.userId },
  });
  // Find a complaint created by Citizen 2
  const c2Complaint = await prisma.complaint.findFirst({
    where: { citizenId: citizen2.userId },
  });

  console.log('\n--- RBAC AUDIT VERIFICATION ---');

  const results: any[] = [];

  // Helper to log audit result
  async function testRoute(name: string, url: string, method: string, token: string | undefined, body: any, expectedStatus: number) {
    const headers: any = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const res = await fetch(`${BASE_URL}${url}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    let data;
    try {
      data = await res.json();
    } catch (e) {
      data = null;
    }
    const passed = res.status === expectedStatus;
    results.push({ name, url, method, status: res.status, expectedStatus, passed, response: data });
    console.log(`Test: ${name} | URL: ${url} | Status: ${res.status} (Expected: ${expectedStatus}) -> ${passed ? 'PASS' : 'FAIL'}`);
  }

  // CITIZEN TESTS
  console.log('\n--- Citizen RBAC Tests ---');
  // Can view own complaints (Expected 200)
  await testRoute('Citizen - View own complaints', '/complaints', 'GET', citizen1.token, null, 200);
  
  // Can view own complaint by ID (Expected 200)
  if (c1Complaint) {
    await testRoute('Citizen - View own complaint by ID', `/complaints/${c1Complaint.id}`, 'GET', citizen1.token, null, 200);
    // Cannot view other citizen's complaint by ID (Expected 403)
    await testRoute('Citizen - Cannot view other citizen complaints', `/complaints/${c1Complaint.id}`, 'GET', citizen2.token, null, 403);
    
    // Cannot assign complaints (Expected 403)
    await testRoute('Citizen - Cannot assign complaints', `/complaints/${c1Complaint.id}/assign`, 'PATCH', citizen1.token, { officerId: officer1.userId }, 403);
    
    // Cannot update status directly (Expected 403)
    await testRoute('Citizen - Cannot update complaint status directly', `/complaints/${c1Complaint.id}/status`, 'PATCH', citizen1.token, { status: 'IN_PROGRESS' }, 403);
  }

  // Cannot access officer dashboard/my-complaints (Expected 403)
  await testRoute('Citizen - Cannot access officer complaints', '/officer/my-complaints', 'GET', citizen1.token, null, 403);
  // Cannot access operations analytics (Expected 403)
  await testRoute('Citizen - Cannot access operations analytics', '/analytics/operations/overview', 'GET', citizen1.token, null, 403);
  // Cannot access CM analytics (Expected 403)
  await testRoute('Citizen - Cannot access CM analytics', '/analytics/cm/overview', 'GET', citizen1.token, null, 403);

  // OFFICER TESTS
  console.log('\n--- Officer RBAC Tests ---');
  // Can access officer complaints (Expected 200)
  await testRoute('Officer - Can view assigned complaints', '/officer/my-complaints', 'GET', officer1.token, null, 200);
  
  // Find a complaint assigned to Officer 1
  const off1Complaint = await prisma.complaint.findFirst({
    where: { officerId: officer1.userId },
  });
  // Find a complaint assigned to Officer 2
  const off2Complaint = await prisma.complaint.findFirst({
    where: { officerId: officer2.userId },
  });

  if (off2Complaint) {
    // Cannot modify/update status of a complaint assigned to another officer (Expected 403)
    await testRoute('Officer - Cannot update status of another officer\'s complaint', `/complaints/${off2Complaint.id}/status`, 'PATCH', officer1.token, { status: 'IN_PROGRESS', comments: 'tampering' }, 403);
  }

  // Cannot access operations-only functions (Expected 403)
  await testRoute('Officer - Cannot access operations overview', '/analytics/operations/overview', 'GET', officer1.token, null, 403);
  // Cannot access CM analytics (Expected 403)
  await testRoute('Officer - Cannot access CM analytics', '/analytics/cm/overview', 'GET', officer1.token, null, 403);

  // OPERATIONS TESTS
  console.log('\n--- Operations RBAC Tests ---');
  if (c1Complaint) {
    // Can assign complaints (Expected 200)
    await testRoute('Operations - Can assign complaints', `/complaints/${c1Complaint.id}/assign`, 'PATCH', ops1.token, { officerId: officer1.userId }, 200);
  }
  // Cannot perform CM-only actions (Expected 403)
  await testRoute('Operations - Cannot access CM analytics', '/analytics/cm/overview', 'GET', ops1.token, null, 403);

  // CM & ADMIN TESTS
  console.log('\n--- CM & Admin RBAC Tests ---');
  // CM can access CM analytics (Expected 200)
  await testRoute('CM - Can access CM analytics', '/analytics/cm/overview', 'GET', cm.token, null, 200);
  // Admin can access CM analytics (Expected 200)
  await testRoute('Admin - Can access CM analytics', '/analytics/cm/overview', 'GET', admin.token, null, 200);

  console.log('\n--- OWNERSHIP AUDIT VERIFICATION ---');
  // 1. Citizen cannot fetch another citizen's complaint using direct ID manipulation
  if (c2Complaint) {
    await testRoute('Ownership 1 - Citizen cannot fetch another citizen\'s complaint', `/complaints/${c2Complaint.id}`, 'GET', citizen1.token, null, 403);
  }

  // 2. Officer cannot update a complaint not assigned to them
  if (off2Complaint) {
    await testRoute('Ownership 2 - Officer cannot update complaint not assigned', `/complaints/${off2Complaint.id}/status`, 'PATCH', officer1.token, { status: 'IN_PROGRESS', comments: 'hack' }, 403);
  }

  // 3. Officer cannot verify citizen resolutions (Expected 403)
  if (c1Complaint) {
    await testRoute('Ownership 3 - Officer cannot verify citizen resolution', `/complaints/${c1Complaint.id}/verify`, 'POST', officer1.token, { action: 'APPROVE', feedback: 'hack' }, 403);
  }

  // 4. Operations cannot bypass workflow transitions (Expected 400)
  const pendingComplaint = await prisma.complaint.findFirst({
    where: { status: 'PENDING' },
  });
  if (pendingComplaint) {
    await testRoute('Ownership 4 - Operations cannot bypass workflow (PENDING -> CLOSED)', `/complaints/${pendingComplaint.id}/status`, 'PATCH', ops1.token, { status: 'CLOSED', comments: 'illegal transition' }, 400);
  }

  // 5. Users cannot access records from unauthorized districts
  const newDelhiDist = await prisma.district.findFirst({ where: { name: 'New Delhi' } });
  const centralDist = await prisma.district.findFirst({ where: { name: 'Central' } });
  
  if (newDelhiDist && centralDist) {
    const ndComplaint = await prisma.complaint.findFirst({ where: { districtId: newDelhiDist.id } });
    if (ndComplaint) {
      await testRoute('Ownership 5 - Ops from Central district cannot view New Delhi complaint details', `/complaints/${ndComplaint.id}`, 'GET', ops1.token, null, 403);
    }
  }

  console.log('\n--- TOKEN SECURITY COOKIE INSPECTION ---');
  console.log('verifyOtp Cookie Header:', citizen1.cookie);
  const httpOnly = citizen1.cookie?.includes('HttpOnly') || false;
  const secure = citizen1.cookie?.includes('Secure') || false;
  const sameSite = citizen1.cookie?.includes('SameSite=Strict') || citizen1.cookie?.includes('SameSite=strict') || false;
  console.log(`Cookie Flags Check: HttpOnly=${httpOnly}, Secure=${secure}, SameSiteStrict=${sameSite}`);

  const expiredToken = jwt.sign({ id: citizen1.userId, role: 'CITIZEN' }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '-1s' });
  await testRoute('Token - Expired token handling', '/complaints', 'GET', expiredToken, null, 401);

  const logoutRes = await fetch(`${BASE_URL}/auth/logout`, { method: 'POST' });
  const logoutCookie = logoutRes.headers.get('set-cookie');
  console.log('Logout Cookie Header:', logoutCookie);

  console.log('\n--- INPUT VALIDATION AUDIT ---');
  if (c1Complaint) {
    await testRoute('Input - Missing officerId on assign', `/complaints/${c1Complaint.id}/assign`, 'PATCH', ops1.token, {}, 400);
  }

  await prisma.$disconnect();
}

main().catch(console.error);
