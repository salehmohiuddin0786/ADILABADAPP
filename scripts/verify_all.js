const http = require('http');

async function testEndpoint(name, path, method = 'GET', body = null) {
  return new Promise((resolve) => {
    const postData = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 5010,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {})
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ name, status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 300, data: parsed });
        } catch {
          resolve({ name, status: res.statusCode, ok: res.statusCode >= 200 && res.statusCode < 300, raw: data.substring(0, 100) });
        }
      });
    });

    req.on('error', (err) => resolve({ name, ok: false, error: err.message }));
    if (postData) req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('--- RUNNING FULL SYSTEM VERIFICATION ---');
  
  const tests = [
    testEndpoint('Health Check', '/api/health'),
    testEndpoint('Advertisements API', '/api/advertisements?page=1&limit=5'),
    testEndpoint('Businesses API', '/api/businesses?page=1&limit=5'),
    testEndpoint('Rentals API', '/api/v1/rentals?page=1&limit=5'),
    testEndpoint('Rental Categories API', '/api/v1/rentals/categories'),
    testEndpoint('Submissions Counts API', '/api/submissions/counts'),
    testEndpoint('Submissions List API', '/api/submissions'),
    testEndpoint('Jobs Vertical API', '/api/jobs'),
    testEndpoint('Agriculture Vertical API', '/api/agriculture'),
    testEndpoint('Food Vertical API', '/api/food'),
    testEndpoint('Properties Vertical API', '/api/properties'),
    testEndpoint('Weddings Vertical API', '/api/weddings'),
    testEndpoint('Education Vertical API', '/api/education'),
    testEndpoint('Public Contact API', '/api/contact', 'POST', {
      name: 'Test Auditor',
      phone: '9876543210',
      category: 'General Inquiry',
      message: 'Automated full system audit test inquiry'
    })
  ];

  const results = await Promise.all(tests);
  let allPassed = true;
  for (const r of results) {
    if (r.ok) {
      console.log(`[PASS] ${r.name} (Status: ${r.status})`);
    } else {
      console.log(`[FAIL] ${r.name} (Status: ${r.status}, Error: ${r.error || JSON.stringify(r.data)})`);
      allPassed = false;
    }
  }

  console.log('\n--- VERIFICATION RESULT ---');
  console.log(allPassed ? 'ALL BACKEND API TESTS PASSED SUCCESSFULLY!' : 'SOME TESTS FAILED');
}

run();
