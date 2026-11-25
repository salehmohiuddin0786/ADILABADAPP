const http = require('http');

const API_BASE = 'http://localhost:5010/api';

function request(endpoint, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + endpoint);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('====================================================');
  console.log('ADILABAD APP — AUTHENTICATION & SECURITY TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passed++;
    } else {
      console.error(`[FAIL] ${message}`);
      failed++;
    }
  }

  // TEST 1: Unauthenticated access to /auth/me
  console.log('--- TEST 1: Unauthenticated Protected Route Access ---');
  const res1 = await request('/auth/me');
  assert(res1.status === 401, `Access without token returned 401 (Received: ${res1.status})`);
  assert(res1.data && res1.data.success === false, 'Response payload contains success: false');

  // TEST 2: Unauthenticated access to /auth/profile
  console.log('\n--- TEST 2: Unauthenticated Profile Update Attempt ---');
  const res2 = await request('/auth/profile', { method: 'PUT' }, { name: 'Hacker' });
  assert(res2.status === 401, `Unauthenticated profile update returned 401 (Received: ${res2.status})`);

  // TEST 3: Login with Admin Credentials
  console.log('\n--- TEST 3: Legitimate Login & Token Issuance ---');
  // First, verify an admin exists in DB or test login
  const { query } = require('../backend/config/db');
  const [adminUser] = await query("SELECT u.id, u.email FROM users u WHERE u.role_id = 1 LIMIT 1");
  console.log('Found Admin in DB:', adminUser?.email);

  // We can generate a test token or log in
  const bcrypt = require('../backend/node_modules/bcryptjs');
  const jwt = require('../backend/node_modules/jsonwebtoken');
  const testHash = await bcrypt.hash('TestAdmin@2026', 10);
  await query('UPDATE users SET password_hash = ? WHERE id = ?', [testHash, adminUser.id]);

  const loginRes = await request('/auth/login', { method: 'POST' }, {
    email: adminUser.email,
    password: 'TestAdmin@2026'
  });

  assert(loginRes.status === 200, `Login returned 200 OK (Received: ${loginRes.status})`);
  assert(loginRes.data.success === true && !!loginRes.data.token, 'Received valid JWT token and success status');

  const token = loginRes.data.token;

  // TEST 4: Authenticated /auth/me
  console.log('\n--- TEST 4: Authenticated Profile Fetch ---');
  const meRes = await request('/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert(meRes.status === 200, `Fetched profile returned 200 OK (Received: ${meRes.status})`);
  assert(meRes.data.user && meRes.data.user.email === adminUser.email, `Returned user matches logged in user (${meRes.data.user?.email})`);

  // TEST 5: Profile Update & Privilege Escalation Immunity
  console.log('\n--- TEST 5: Profile Update & Immunity to Role Tampering ---');
  const updateRes = await request('/auth/profile', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` }
  }, {
    name: 'Adilabad Super Admin Verified',
    phone: '+91 94401 99999',
    role: 'super_hacker_role',
    role_id: 99
  });
  assert(updateRes.status === 200, `Update profile returned 200 OK (Received: ${updateRes.status})`);
  assert(updateRes.data.user.name === 'Adilabad Super Admin Verified', 'Profile name updated successfully in DB');
  assert(updateRes.data.user.role === 'admin', 'Role remained "admin" — Privilege escalation successfully prevented!');

  // TEST 6: Server-side Logout & Revoked Token Check
  console.log('\n--- TEST 6: Server-Side Token Invalidation & Blacklist ---');
  const logoutRes = await request('/auth/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` }
  });
  assert(logoutRes.status === 200, `Logout endpoint returned 200 OK (Received: ${logoutRes.status})`);
  assert(logoutRes.data.message.includes('Session invalidated'), 'Logout message confirms token revocation');

  // Verify that the token can NO LONGER be used
  const postLogoutRes = await request('/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  assert(postLogoutRes.status === 401, `Access with revoked token returns 401 (Received: ${postLogoutRes.status})`);
  assert(postLogoutRes.data.message.includes('Session has been invalidated'), 'Error message confirms session has been invalidated');

  // TEST 7: Invalid Login Credentials
  console.log('\n--- TEST 7: Invalid Login Rejection ---');
  const failLogin = await request('/auth/login', { method: 'POST' }, {
    email: adminUser.email,
    password: 'WrongPassword123!'
  });
  assert(failLogin.status === 401, `Invalid password returned 401 (Received: ${failLogin.status})`);

  console.log('\n====================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Test execution error:', err);
  process.exit(1);
});
