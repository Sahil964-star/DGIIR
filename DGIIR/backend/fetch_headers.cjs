const http = require('http');

function fetchHeaders(host, port, path) {
  return new Promise((resolve, reject) => {
    const req = http.get({ host, port, path }, (res) => {
      resolve({
        statusCode: res.statusCode,
        headers: res.headers,
      });
    });
    req.on('error', reject);
  });
}

(async () => {
  try {
    const result = await fetchHeaders('127.0.0.1', 5000, '/api/v1/docs/');
    console.log(JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Failed on 127.0.0.1:', err.message);
    try {
      const result2 = await fetchHeaders('localhost', 5000, '/api/v1/docs/');
      console.log(JSON.stringify(result2, null, 2));
    } catch (err2) {
      console.error('Failed on localhost:', err2.message);
    }
  }
})();
