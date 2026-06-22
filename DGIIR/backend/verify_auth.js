async function runTest() {
    console.log('--- AUDIT 1: REFRESH TOKEN RUNTIME VERIFICATION ---\n');
    let accessToken = '';
    let cookieHeader = '';
    const BASE_URL = 'http://localhost:5000/api/v1';
    // 1. Request OTP
    console.log('STEP 1: Request OTP');
    const reqOtpRes = await fetch(`${BASE_URL}/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: '9999999998' })
    });
    const reqOtpData = await reqOtpRes.json();
    console.log('Response:', reqOtpRes.status, reqOtpData);
    const pass1 = reqOtpRes.status === 200;
    console.log('PASS/FAIL:', pass1 ? 'PASS' : 'FAIL', '\n');
    // Hack: Inject a known OTP hash for '123456' into the database for this phone number
    // Instead of complex DB connection in JS, I'll use a small node script execution inline or just use Prisma client.
    console.log('Injecting known OTP hash into DB...');
    const { prisma } = await import('./src/db/prisma.ts');
    const bcrypt = await import('bcryptjs');
    const hash = await bcrypt.default.hash('123456', 10);
    await prisma.otpVerification.updateMany({
        where: { phone: '9999999998', isUsed: false },
        data: { otpHash: hash }
    });
    await prisma.$disconnect();
    // 2. Verify OTP and get tokens
    console.log('STEP 2: Verify OTP (Access Token & Refresh Token issuance)');
    const verifyRes = await fetch(`${BASE_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            phone: '9999999998',
            otp: '123456',
            name: 'Test Citizen',
            email: 'test@example.com',
            districtId: 'some-uuid-if-needed'
        })
    });
    const verifyData = await verifyRes.json();
    console.log('Response:', verifyRes.status, verifyData);
    accessToken = verifyData?.data?.accessToken;
    // Extract Set-Cookie
    const setCookie = verifyRes.headers.get('set-cookie');
    if (setCookie) {
        cookieHeader = setCookie.split(';')[0];
    }
    const pass2 = verifyRes.status === 200 && !!accessToken && !!cookieHeader;
    console.log('Cookie received:', !!cookieHeader);
    console.log('PASS/FAIL:', pass2 ? 'PASS' : 'FAIL', '\n');
    if (!pass2)
        return;
    // 3. Authenticated request
    console.log('STEP 3: Authenticated request (/auth/me)');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` }
    });
    const meData = await meRes.json();
    console.log('Response:', meRes.status, meData);
    const pass3 = meRes.status === 200;
    console.log('PASS/FAIL:', pass3 ? 'PASS' : 'FAIL', '\n');
    // 4. Test Access token expiry
    console.log('STEP 4: Access token expiry (simulated by invalid token)');
    const expRes = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer invalid.token.here` }
    });
    const expData = await expRes.json();
    console.log('Response:', expRes.status, expData);
    const pass4 = expRes.status === 401;
    console.log('PASS/FAIL:', pass4 ? 'PASS' : 'FAIL', '\n');
    // 5 & 6. Refresh endpoint invocation & New access token issuance
    console.log('STEP 5 & 6: Refresh endpoint invocation');
    const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': cookieHeader
        }
    });
    const refreshData = await refreshRes.json();
    console.log('Response:', refreshRes.status, refreshData);
    const pass5 = refreshRes.status === 200 && !!refreshData?.data?.accessToken;
    console.log('New Access Token issued:', !!refreshData?.data?.accessToken);
    console.log('PASS/FAIL:', pass5 ? 'PASS' : 'FAIL', '\n');
    // 8. Refresh failure logout flow
    console.log('STEP 8: Refresh failure flow (invalid refresh token)');
    const failRefreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Cookie': 'refreshToken=invalid'
        }
    });
    const failRefreshData = await failRefreshRes.json();
    console.log('Response:', failRefreshRes.status, failRefreshData);
    const pass8 = failRefreshRes.status === 401 || failRefreshRes.status === 403;
    console.log('PASS/FAIL:', pass8 ? 'PASS' : 'FAIL', '\n');
}
runTest().catch(console.error);
export {};
//# sourceMappingURL=verify_auth.js.map