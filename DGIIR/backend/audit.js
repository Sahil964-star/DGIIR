const BASE_URL = 'http://localhost:5000/api/v1';

async function run() {
  console.log('Running API verification...');
  
  // 1. Unauthenticated endpoints
  const health = await fetch('http://localhost:5000/health');
  console.log('GET /health:', health.status);

  const reqOtp = await fetch(`${BASE_URL}/auth/request-otp`, { method: 'POST', body: JSON.stringify({}), headers: { 'Content-Type': 'application/json'} });
  console.log('POST /auth/request-otp (Missing Body):', reqOtp.status);
  
  const login = await fetch(`${BASE_URL}/auth/login`, { method: 'POST', body: JSON.stringify({email: 'admin@dgiir.gov.in', password: 'Password@123'}), headers: { 'Content-Type': 'application/json'} });
  const loginData = await login.json();
  console.log('POST /auth/login (Valid Body):', login.status);
  
  const token = loginData.data?.accessToken;

  // 2. Authenticated endpoints
  const me = await fetch(`${BASE_URL}/auth/me`, { headers: { 'Authorization': `Bearer ${token}` } });
  console.log('GET /auth/me:', me.status);

  const complaints = await fetch(`${BASE_URL}/complaints`, { headers: { 'Authorization': `Bearer ${token}` } });
  console.log('GET /complaints:', complaints.status);
  
  const cmOverview = await fetch(`${BASE_URL}/analytics/cm/overview`, { headers: { 'Authorization': `Bearer ${token}` } });
  console.log('GET /analytics/cm/overview:', cmOverview.status);
  
  const opsSla = await fetch(`${BASE_URL}/analytics/operations/sla`, { headers: { 'Authorization': `Bearer ${token}` } });
  console.log('GET /analytics/operations/sla:', opsSla.status);

  const metaDist = await fetch(`${BASE_URL}/meta/districts`);
  console.log('GET /meta/districts:', metaDist.status);

}

run().catch(console.error);
