const http = require('http');

const req = http.request({
  host: '127.0.0.1',
  port: 5000,
  path: '/api/v1/auth/request-otp',
  method: 'POST',
  headers: {
    'Origin': 'http://localhost:5000',
    'Content-Type': 'application/json'
  }
}, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log('HEADERS:', res.headers);
  res.setEncoding('utf8');
  res.on('data', chunk => console.log('BODY:', chunk));
});
req.write('{"phone": "5555555502"}');
req.end();
