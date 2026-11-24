const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const {
  MODULE_DEFINITIONS,
  generateSampleTemplate,
  mapAndValidateRows,
  parseFileBuffer,
  executeEventsImport,
  recordImportHistory,
  getImportHistory
} = require('../services/universalImportService');

async function runTests() {
  console.log('=== STARTING UNIVERSAL BULK IMPORT TEST SUITE ===\n');

  const modules = ['services', 'properties', 'jobs', 'buy-sell', 'rentals', 'offers', 'events'];
  let passedCount = 0;

  for (const mod of modules) {
    console.log(`[TEST] Module: ${mod.toUpperCase()}`);

    // 1. Generate template
    const templateBuffer = generateSampleTemplate(mod);
    if (!templateBuffer || templateBuffer.length === 0) {
      throw new Error(`Failed to generate template for ${mod}`);
    }
    console.log(`  ✓ Sample template generated (${templateBuffer.length} bytes)`);

    // 2. Parse sample template back into raw rows
    const parsedRows = parseFileBuffer(templateBuffer, `${mod}_template.xlsx`);
    if (!parsedRows || parsedRows.length === 0) {
      throw new Error(`Failed to parse sample template back for ${mod}`);
    }
    console.log(`  ✓ Parsed sample template rows: ${parsedRows.length}`);

    // 3. Validate rows
    const validation = mapAndValidateRows(mod, parsedRows);
    console.log(`  ✓ Validation summary:`, validation.metrics);
    if (validation.metrics.valid === 0) {
      throw new Error(`Expected at least 1 valid row in sample template for ${mod}`);
    }

    // 4. Test duplicate detection by duplicating first row
    const rowsWithDup = [...parsedRows, parsedRows[0]];
    const dupValidation = mapAndValidateRows(mod, rowsWithDup);
    if (dupValidation.metrics.duplicates === 0) {
      throw new Error(`Duplicate detection failed for ${mod}`);
    }
    console.log(`  ✓ Duplicate detection verified (Found ${dupValidation.metrics.duplicates} duplicates)`);

    // 5. Test history recording
    const historyRes = await recordImportHistory({
      module: mod,
      fileName: `test_${mod}_batch.xlsx`,
      uploadedBy: 1,
      uploaderName: 'Super Admin Test',
      totalRecords: validation.metrics.total,
      successfulRecords: validation.metrics.valid,
      updatedRecords: 0,
      skippedRecords: 0,
      failedRecords: 0,
      status: 'completed',
      duplicateStrategy: 'skip'
    });
    if (!historyRes.success) {
      throw new Error(`Failed to record history for ${mod}: ${historyRes.error}`);
    }
    console.log(`  ✓ Import history recorded (ID: ${historyRes.id})`);

    // 6. Test history retrieval
    const historyList = await getImportHistory(mod);
    if (!historyList || historyList.length === 0) {
      throw new Error(`Failed to retrieve history for ${mod}`);
    }
    console.log(`  ✓ Import history retrieved: ${historyList.length} records found`);

    passedCount++;
    console.log(`  ⭐ ${mod.toUpperCase()} TEST PASSED!\n`);
  }

  // Special test: Events execution into MySQL
  console.log('[TEST] Executing sample Events import into MySQL events table...');
  const sampleEvents = MODULE_DEFINITIONS.events.sampleData.map((d, i) => ({
    rowNumber: i + 2,
    data: {
      title: `${d['Event Title']} (E2E Test ${Date.now()})`,
      venue: d['Venue'],
      event_date: d['Event Date'],
      event_time: d['Event Time'],
      organizer: d['Organizer'],
      phone: d['Phone'],
      address: d['Address'],
      description: d['Description'],
      status: 'published'
    },
    errors: [],
    isDuplicate: false
  }));

  const eventsExecResult = await executeEventsImport(sampleEvents, 'skip');
  console.log('Events Import Result:', eventsExecResult);
  if (eventsExecResult.successCount !== sampleEvents.length) {
    throw new Error(`Expected ${sampleEvents.length} events imported, got ${eventsExecResult.successCount}`);
  }
  console.log('  ✓ Events MySQL import verified!\n');

  console.log(`=== ALL ${passedCount} MODULE TESTS PASSED PERFECTLY! ===`);
  process.exit(0);
}

runTests().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
