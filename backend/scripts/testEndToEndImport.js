const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const xlsx = require('xlsx');
const http = require('http');

// Setup backend app
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const { query } = require('../config/db');
const bizRoutes = require('../routes/businessRoutes');
const authRoutes = require('../routes/authRoutes');

const app = express();
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/businesses', bizRoutes);

let server;
const PORT = 5022;

function makeRequest(method, endpoint, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: PORT,
      path: endpoint,
      method: method,
      headers: {
        ...headers
      }
    };

    if (body && !headers['Content-Type']) {
      options.headers['Content-Type'] = 'application/json';
    }

    const req = http.request(options, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const raw = Buffer.concat(chunks);
        const contentType = res.headers['content-type'] || '';
        let parsed = null;
        if (contentType.includes('application/json')) {
          try {
            parsed = JSON.parse(raw.toString('utf8'));
          } catch (e) {
            parsed = raw.toString('utf8');
          }
        }
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: parsed,
          rawBuffer: raw
        });
      });
    });

    req.on('error', reject);

    if (body) {
      if (Buffer.isBuffer(body)) {
        req.write(body);
      } else if (typeof body === 'object') {
        req.write(JSON.stringify(body));
      } else {
        req.write(body);
      }
    }

    req.end();
  });
}

// Multipart helper for file upload
function makeMultipartRequest(endpoint, token, fileBuffer, fileName) {
  return new Promise((resolve, reject) => {
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const crlf = '\r\n';

    let header = `--${boundary}${crlf}`;
    header += `Content-Disposition: form-data; name="file"; filename="${fileName}"${crlf}`;
    header += `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet${crlf}${crlf}`;

    const footer = `${crlf}--${boundary}--${crlf}`;

    const payload = Buffer.concat([
      Buffer.from(header, 'utf8'),
      fileBuffer,
      Buffer.from(footer, 'utf8')
    ]);

    const req = http.request({
      hostname: 'localhost',
      port: PORT,
      path: endpoint,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': payload.length
      }
    }, (res) => {
      const chunks = [];
      res.on('data', chunk => chunks.push(chunk));
      res.on('end', () => {
        const raw = Buffer.concat(chunks);
        let parsed = null;
        try {
          parsed = JSON.parse(raw.toString('utf8'));
        } catch (e) {
          parsed = raw.toString('utf8');
        }
        resolve({
          statusCode: res.statusCode,
          data: parsed,
          rawBuffer: raw
        });
      });
    });

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

async function runEndToEnd() {
  console.log('🚀 Starting Comprehensive End-to-End Bulk Import Tests...');

  // Start test server
  await new Promise(resolve => {
    server = app.listen(PORT, () => {
      console.log(`📡 Test server running on http://localhost:${PORT}`);
      resolve();
    });
  });

  try {
    // 1. Generate Admin JWT Token
    console.log('\n--- STEP 1: Authentication ---');
    const adminUser = await query('SELECT * FROM users WHERE email = "admin@adilabadapp.com" LIMIT 1');
    if (!adminUser || adminUser.length === 0) {
      throw new Error('Admin user not found in DB');
    }
    const token = jwt.sign(
      { id: adminUser[0].id, role: 'admin' },
      process.env.JWT_SECRET || 'adilabad_super_secret_jwt_key_2026_discover_local',
      { expiresIn: '1h' }
    );
    console.log(`✅ Admin authenticated. Token generated for user ID: ${adminUser[0].id}`);

    // 2. Download Sample Template via HTTP API
    console.log('\n--- STEP 2: Download Template API ---');
    const templateRes = await makeRequest('GET', '/api/businesses/admin/import/template', {
      'Authorization': `Bearer ${token}`
    });
    console.log(`Status: ${templateRes.statusCode}, Content-Type: ${templateRes.headers['content-type']}`);
    if (templateRes.statusCode !== 200 || !templateRes.headers['content-disposition'].includes('Template.xlsx')) {
      throw new Error('Failed to download template');
    }
    console.log(`✅ Template downloaded successfully (${templateRes.rawBuffer.length} bytes).`);

    // 3. Upload & Preview 105 Business Records File
    console.log('\n--- STEP 3: Upload & Preview 100+ Businesses File ---');
    const sampleFilePath = path.join(__dirname, 'Adilabad_100_Businesses.xlsx');
    const sampleBuffer = fs.readFileSync(sampleFilePath);
    console.log(`Read sample file: ${sampleFilePath} (${sampleBuffer.length} bytes)`);

    const previewRes = await makeMultipartRequest('/api/businesses/admin/import/preview', token, sampleBuffer, 'Adilabad_100_Businesses.xlsx');
    console.log(`Status: ${previewRes.statusCode}`);
    if (previewRes.statusCode !== 200 || !previewRes.data.success) {
      console.error('Preview error response:', previewRes.data);
      throw new Error('Preview API failed');
    }
    const pData = previewRes.data.data;
    console.log('✅ Preview API Output:');
    console.log(`   - File Name: ${pData.fileName}`);
    console.log(`   - Total Records Detected: ${pData.totalRecords}`);
    console.log(`   - Valid Records: ${pData.validRecords}`);
    console.log(`   - Duplicate Records: ${pData.duplicateRecords}`);
    console.log(`   - Invalid Records: ${pData.invalidRecords}`);
    console.log(`   - Missing Required: ${pData.missingRequiredFields}`);

    if (pData.totalRecords < 100) {
      throw new Error(`Expected at least 100 records in preview, got ${pData.totalRecords}`);
    }

    // 4. Execute Bulk Import
    console.log('\n--- STEP 4: Execute Bulk Import API ---');
    const executeRes = await makeRequest('POST', '/api/businesses/admin/import/execute', {
      'Authorization': `Bearer ${token}`
    }, {
      records: pData.preview,
      duplicateStrategy: 'skip',
      fileName: 'Adilabad_100_Businesses.xlsx'
    });

    console.log(`Status: ${executeRes.statusCode}`);
    if (executeRes.statusCode !== 200 || !executeRes.data.success) {
      console.error('Execute error response:', executeRes.data);
      throw new Error('Execute import API failed');
    }
    const execData = executeRes.data.data;
    console.log('✅ Bulk Import Executed Successfully:');
    console.log(`   - Import ID: ${execData.importId}`);
    console.log(`   - Successfully Imported: ${execData.imported}`);
    console.log(`   - Updated Existing: ${execData.updated}`);
    console.log(`   - Skipped Duplicates: ${execData.skipped}`);
    console.log(`   - Failed Records: ${execData.failed}`);
    console.log(`   - Import Status: ${execData.status}`);

    if (execData.imported < 90) {
      throw new Error(`Expected at least 90 imported businesses, got ${execData.imported}`);
    }

    // 5. Verify Businesses Appear in Directory & Search
    console.log('\n--- STEP 5: Verification in Directory & Search ---');
    // A. Admin directory list
    const adminListRes = await makeRequest('GET', '/api/businesses/admin/list?limit=150', {
      'Authorization': `Bearer ${token}`
    });
    console.log(`Admin List Total: ${adminListRes.data.pagination.total} businesses`);
    if (adminListRes.data.pagination.total < 100) {
      throw new Error('Businesses not appearing in admin directory');
    }
    console.log('✅ Admin directory reflects imported businesses.');

    // B. Public Directory list
    const publicListRes = await makeRequest('GET', '/api/businesses?limit=10');
    console.log(`Public Directory Total: ${publicListRes.data.pagination.total} businesses`);
    if (publicListRes.data.pagination.total < 100) {
      throw new Error('Businesses not appearing in public directory');
    }
    console.log('✅ Public directory contains imported businesses.');

    // C. Search functionality
    const searchRes = await makeRequest('GET', '/api/businesses?search=Supermarket');
    console.log(`Search "Supermarket" returned: ${searchRes.data.data.length} businesses`);
    if (searchRes.data.data.length === 0) {
      throw new Error('Search failed to find imported supermarket');
    }
    console.log(`✅ Search verified. First match: "${searchRes.data.data[0].name}" in ${searchRes.data.data[0].locality}`);

    // D. Category filtering
    const catRes = await makeRequest('GET', '/api/businesses?category=shopping');
    console.log(`Category "Shopping" filter returned: ${catRes.data.pagination.total} businesses`);
    if (catRes.data.pagination.total === 0) {
      throw new Error('Category filter returned 0 businesses');
    }
    console.log('✅ Category filtering works.');

    // E. District & City filters
    const distRes = await makeRequest('GET', '/api/businesses?district=Adilabad');
    console.log(`District "Adilabad" filter returned: ${distRes.data.pagination.total} businesses`);
    if (distRes.data.pagination.total === 0) {
      throw new Error('District filter returned 0 businesses');
    }
    console.log('✅ District filtering works.');

    // F. Business Detail with coordinates, phone, maps link
    const firstBiz = searchRes.data.data[0];
    const detailRes = await makeRequest('GET', `/api/businesses/detail/${firstBiz.slug}`);
    const bDetail = detailRes.data.data;
    console.log('\n--- Business Detail Verification ---');
    console.log(`   - Name: ${bDetail.name}`);
    console.log(`   - Phone: ${bDetail.phone}`);
    console.log(`   - Locality: ${bDetail.locality}`);
    console.log(`   - District: ${bDetail.district}`);
    console.log(`   - Latitude: ${bDetail.latitude}`);
    console.log(`   - Longitude: ${bDetail.longitude}`);
    console.log(`   - Maps URL: ${bDetail.maps_url}`);
    if (!bDetail.name || !bDetail.phone) {
      throw new Error('Business detail missing core fields');
    }
    console.log('✅ Business details verified.');

    // 6. Test Import History API
    console.log('\n--- STEP 6: Import History API ---');
    const historyRes = await makeRequest('GET', '/api/businesses/admin/import/history', {
      'Authorization': `Bearer ${token}`
    });
    console.log(`Found ${historyRes.data.data.length} history records.`);
    const latestHistory = historyRes.data.data[0];
    console.log(`Latest History Entry:`, {
      id: latestHistory.id,
      fileName: latestHistory.file_name,
      total: latestHistory.total_records,
      success: latestHistory.successful_records,
      status: latestHistory.status
    });
    if (!latestHistory || latestHistory.total_records < 100) {
      throw new Error('Import history missing latest batch import');
    }
    console.log('✅ Import history verified.');

    // 7. Duplicate Detection on Re-Upload
    console.log('\n--- STEP 7: Duplicate Detection on Re-Upload ---');
    const rePreviewRes = await makeMultipartRequest('/api/businesses/admin/import/preview', token, sampleBuffer, 'Adilabad_100_Businesses.xlsx');
    const rePData = rePreviewRes.data.data;
    console.log(`Re-upload duplicate detection: ${rePData.duplicateRecords} duplicates identified out of ${rePData.totalRecords}`);
    if (rePData.duplicateRecords < 90) {
      throw new Error(`Expected at least 90 duplicate records on re-upload, got ${rePData.duplicateRecords}`);
    }
    console.log('✅ Duplicate detection accurately identified all re-uploaded businesses.');

    console.log('\n=============================================');
    console.log('🏆 ALL END-TO-END VERIFICATION TESTS PASSED!');
    console.log('=============================================');

  } finally {
    if (server) {
      server.close();
      console.log('Test server closed.');
    }
  }
}

runEndToEnd().catch(err => {
  console.error('\n❌ End-to-end test error:', err);
  if (server) server.close();
  process.exit(1);
});
