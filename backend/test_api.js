import http from 'http';

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/v1/auth/request-otp',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
}, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log('HEADERS:');
  console.log(res.headers);
  
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(JSON.stringify({ phone: '5555555502' }));
req.end();
