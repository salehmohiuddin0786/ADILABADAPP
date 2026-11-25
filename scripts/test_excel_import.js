const http = require('http');
const { query } = require('../backend/config/db');
const jwt = require('../backend/node_modules/jsonwebtoken');
require('../backend/node_modules/dotenv').config({ path: './backend/.env' });

function fetchBuf(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, buf: Buffer.concat(chunks) }));
    }).on('error', reject);
  });
}

async function testAll() {
  const [admin] = await query('SELECT id, email FROM users WHERE role_id = 1 LIMIT 1');
  const token = jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // 1. Test template download on port 5010
  const r5010 = await fetchBuf('http://localhost:5010/api/businesses/admin/import/template?token=' + encodeURIComponent(token));
  console.log('Template 5010 -> Status:', r5010.status, 'Bytes:', r5010.buf.length, 'Type:', r5010.headers['content-type']);

  // 2. Test template download on port 3010 (proxy rewrite)
  const r3010 = await fetchBuf('http://localhost:3010/api/businesses/admin/import/template?token=' + encodeURIComponent(token));
  console.log('Template 3010 -> Status:', r3010.status, 'Bytes:', r3010.buf.length, 'Type:', r3010.headers['content-type']);

  // 3. Test multipart Excel upload to preview
  const boundary = '----AdilabadTestBoundary12345';
  const header = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="test.xlsx"\r\nContent-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet\r\n\r\n`;
  const footer = `\r\n--${boundary}--\r\n`;
  const body = Buffer.concat([Buffer.from(header), r5010.buf, Buffer.from(footer)]);

  const previewRes = await new Promise((resolve, reject) => {
    const req = http.request('http://localhost:5010/api/businesses/admin/import/preview', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'multipart/form-data; boundary=' + boundary,
        'Content-Length': body.length
      }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(d) }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });

  console.log('Preview -> Status:', previewRes.status, 'Success:', previewRes.body.success, 'Records:', previewRes.body.data?.totalRecords, 'Valid:', previewRes.body.data?.validRecords);

  // 4. Test execute import with skip duplicates
  const execRes = await new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      records: previewRes.body.data.preview,
      duplicateStrategy: 'skip',
      fileName: 'test.xlsx'
    });
    const req = http.request('http://localhost:5010/api/businesses/admin/import/execute', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(d) }));
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });

  console.log('Execute -> Status:', execRes.status, 'Body:', JSON.stringify(execRes.body));
  process.exit(0);
}

testAll().catch(e => { console.error(e); process.exit(1); });
