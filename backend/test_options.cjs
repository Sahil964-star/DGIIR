const http = require('http');

const req = http.request({
  host: '127.0.0.1',
  port: 5000,
  path: '/api/v1/auth/request-otp',
  method: 'OPTIONS',
  headers: {
    'Origin': 'http://localhost:5000',
    'Access-Control-Request-Method': 'POST',
    'Access-Control-Request-Headers': 'content-type'
  }
}, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log('HEADERS:', res.headers);
});
req.end();
