const xlsx = require('xlsx');
const path = require('path');
const importService = require('../services/businessImportService');
const { query } = require('../config/db');

async function runTest() {
  console.log('🧪 Starting Business Import Service automated test...');

  // 1. Test Template Generation
  console.log('1. Testing generateSampleTemplate()...');
  const templateBuf = importService.generateSampleTemplate();
  if (!templateBuf || templateBuf.length === 0) {
    throw new Error('Template buffer is empty');
  }
  const wb = xlsx.read(templateBuf, { type: 'buffer' });
  if (!wb.SheetNames.includes('Businesses') || !wb.SheetNames.includes('Instructions')) {
    throw new Error('Template missing expected sheets');
  }
  console.log('   ✅ Template generated successfully with Businesses & Instructions sheets. Size:', templateBuf.length, 'bytes');

  // 2. Test Parsing & Preview
  console.log('2. Testing parseAndPreview() on sample template...');
  const preview = await importService.parseAndPreview(templateBuf, 'Adilabad_Sample.xlsx');
  console.log('   Preview summary:');
  console.log(`   - Total records: ${preview.totalRecords}`);
  console.log(`   - Valid records: ${preview.validRecords}`);
  console.log(`   - Invalid records: ${preview.invalidRecords}`);
  console.log(`   - Duplicate records: ${preview.duplicateRecords}`);
  console.log(`   - Missing required fields: ${preview.missingRequiredFields}`);

  if (preview.totalRecords < 5 || preview.validRecords < 5) {
    throw new Error('Sample template rows did not parse as valid');
  }
  console.log('   ✅ Preview and validation succeeded.');

  // 3. Test Invalid Record Detection
  console.log('3. Testing invalid record handling...');
  const testWb = xlsx.utils.book_new();
  const invalidRows = [
    {
      'Business Name': '', // missing
      'Category': 'Shopping'
    },
    {
      'Business Name': 'Test Bad Cat Shop',
      'Category': 'NonExistentCategory123',
      'Phone': '123' // bad phone
    },
    {
      'Business Name': 'Valid Test Shop 1',
      'Category': 'Shopping',
      'Phone': '9440112345',
      'Email': 'invalid-email'
    }
  ];
  const testWs = xlsx.utils.json_to_sheet(invalidRows);
  xlsx.utils.book_append_sheet(testWb, testWs, 'Sheet1');
  const invalidBuf = xlsx.write(testWb, { type: 'buffer', bookType: 'xlsx' });

  const invalidPreview = await importService.parseAndPreview(invalidBuf, 'invalid_test.xlsx');
  console.log(`   Invalid test preview: ${invalidPreview.invalidRecords} invalid detected out of ${invalidPreview.totalRecords}.`);
  if (invalidPreview.invalidRecords !== 3) {
    throw new Error(`Expected 3 invalid rows, got ${invalidPreview.invalidRecords}`);
  }
  console.log('   ✅ Invalid records detected accurately with error descriptions:');
  invalidPreview.preview.forEach(p => {
    console.log(`      Row ${p.rowNumber}: ${p.errors.join('; ')}`);
  });

  // 4. Test Bulk Import Execution
  console.log('4. Testing executeBulkImport()...');
  const importResult = await importService.executeBulkImport({
    records: preview.preview,
    duplicateStrategy: 'skip',
    fileName: 'Adilabad_Sample.xlsx',
    user: { id: 1, name: 'Adilabad Admin' }
  });

  console.log(`   Import Execution Result:`);
  console.log(`   - Import ID: ${importResult.importId}`);
  console.log(`   - Imported: ${importResult.imported}`);
  console.log(`   - Updated: ${importResult.updated}`);
  console.log(`   - Skipped: ${importResult.skipped}`);
  console.log(`   - Failed: ${importResult.failed}`);
  console.log(`   - Status: ${importResult.status}`);

  if (importResult.imported === 0) {
    throw new Error('Bulk import failed to insert valid records');
  }
  console.log('   ✅ Bulk import execution succeeded.');

  // 5. Test Duplicate Detection (running preview again after inserting)
  console.log('5. Testing duplicate detection on existing businesses...');
  const dupPreview = await importService.parseAndPreview(templateBuf, 'Adilabad_Sample.xlsx');
  console.log(`   After import, duplicate count: ${dupPreview.duplicateRecords}`);
  if (dupPreview.duplicateRecords === 0) {
    throw new Error('Duplicate detection failed to catch newly inserted businesses');
  }
  console.log('   ✅ Duplicate businesses correctly identified.');

  // 6. Test Update Strategy on Duplicates
  console.log('6. Testing duplicate strategy "update"...');
  const updateResult = await importService.executeBulkImport({
    records: dupPreview.preview,
    duplicateStrategy: 'update',
    fileName: 'Adilabad_Sample_Update.xlsx',
    user: { id: 1, name: 'Adilabad Admin' }
  });
  console.log(`   Update result: ${updateResult.updated} updated.`);
  if (updateResult.updated === 0) {
    throw new Error('Update strategy failed to update duplicate records');
  }
  console.log('   ✅ Duplicate update strategy succeeded.');

  // 7. Verify Data in MySQL
  console.log('7. Verifying inserted data in MySQL businesses table...');
  const checkBiz = await query(`
    SELECT id, name, slug, phone, category_id, locality, city, district, pincode, latitude, longitude, maps_url
    FROM businesses
    WHERE name = 'Tirumala Supermarket & Provisions'
    LIMIT 1
  `);
  if (!checkBiz || checkBiz.length === 0) {
    throw new Error('Inserted business not found in database');
  }
  console.log('   Found business in DB:', checkBiz[0]);
  console.log('   ✅ Data persistence verified.');

  // 8. Test Import History
  console.log('8. Verifying import history in business_imports table...');
  const imports = await query('SELECT * FROM business_imports ORDER BY created_at DESC LIMIT 5');
  console.log(`   Found ${imports.length} import history records.`);
  console.log('   Latest import record:', {
    id: imports[0].id,
    fileName: imports[0].file_name,
    total: imports[0].total_records,
    imported: imports[0].successful_records,
    status: imports[0].status
  });
  console.log('   ✅ Import history verified.');

  console.log('\n🎉 ALL BUSINESS IMPORT SERVICE TESTS PASSED SUCCESSFULLY!');
  process.exit(0);
}

runTest().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
