const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
  MODULE_DEFINITIONS,
  parseFileBuffer,
  mapAndValidateRows,
  generateSampleTemplate,
  generateFailedRecordsExcel,
  recordImportHistory,
  getImportHistory,
  executeEventsImport
} = require('../services/universalImportService');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB max
  fileFilter: (req, file, cb) => {
    const ext = (file.originalname.split('.').pop() || '').toLowerCase();
    if (['xlsx', 'xls', 'csv'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file format. Please upload an Excel (.xlsx, .xls) or CSV (.csv) file.'));
    }
  }
});

/**
 * Download sample Excel template for module
 * GET /api/bulk-import/:module/template
 */
router.get('/:module/template', (req, res) => {
  try {
    const { module: modKey } = req.params;
    if (!MODULE_DEFINITIONS[modKey]) {
      return res.status(400).json({ success: false, message: `Invalid module: ${modKey}` });
    }

    const buffer = generateSampleTemplate(modKey);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Adilabad_${modKey}_sample_template.xlsx`);
    return res.send(buffer);
  } catch (err) {
    console.error('Template generation error:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate template: ' + err.message });
  }
});

/**
 * Upload and preview records for module
 * POST /api/bulk-import/:module/preview
 */
router.post('/:module/preview', upload.single('file'), async (req, res) => {
  try {
    const { module: modKey } = req.params;
    if (!MODULE_DEFINITIONS[modKey]) {
      return res.status(400).json({ success: false, message: `Invalid module: ${modKey}` });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const rawRows = parseFileBuffer(req.file.buffer, req.file.originalname);
    const parsed = mapAndValidateRows(modKey, rawRows);

    return res.json({
      success: true,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      module: modKey,
      moduleLabel: MODULE_DEFINITIONS[modKey].label,
      summary: {
        totalRecords: parsed.metrics.total,
        validRecords: parsed.metrics.valid,
        invalidRecords: parsed.metrics.invalid,
        duplicateRecords: parsed.metrics.duplicates,
        missingRequired: parsed.metrics.missingRequired
      },
      headers: parsed.headers,
      previewRows: parsed.mappedRows.slice(0, 50), // first 50 for fast preview
      allRows: parsed.mappedRows // complete mapped list for execution
    });
  } catch (err) {
    console.error('Preview error:', err);
    return res.status(400).json({ success: false, message: err.message || 'Failed to parse file.' });
  }
});

/**
 * Execute bulk import for module
 * POST /api/bulk-import/:module/execute
 */
router.post('/:module/execute', async (req, res) => {
  try {
    const { module: modKey } = req.params;
    if (!MODULE_DEFINITIONS[modKey]) {
      return res.status(400).json({ success: false, message: `Invalid module: ${modKey}` });
    }

    const {
      records = [],
      duplicateStrategy = 'skip',
      fileName = 'Import_File.xlsx',
      user = { id: 1, name: 'Admin' }
    } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: 'No records provided for import.' });
    }

    let importResult;

    // Special server-side execution for events (persisting directly to MySQL events table)
    if (modKey === 'events') {
      importResult = await executeEventsImport(records, duplicateStrategy);
    } else {
      // For submissionService modules: filter valid items and resolve duplicates
      let successCount = 0;
      let updatedCount = 0;
      let skippedCount = 0;
      let failedCount = 0;
      const failedList = [];
      const imported = [];

      for (const item of records) {
        const data = item.data || item;
        const errors = item.errors || [];
        const isDuplicate = item.isDuplicate;

        if (errors.length > 0) {
          failedCount++;
          failedList.push(item);
          continue;
        }

        if (isDuplicate) {
          if (duplicateStrategy === 'skip') {
            skippedCount++;
            continue;
          } else if (duplicateStrategy === 'update') {
            updatedCount++;
            imported.push({ ...data, action: 'updated' });
            continue;
          }
        }

        successCount++;
        imported.push({ ...data, action: 'created' });
      }

      importResult = {
        totalProcessed: records.length,
        successCount,
        updatedCount,
        skippedCount,
        failedCount,
        failedRecords: failedList,
        imported
      };
    }

    // Save history to bulk_imports table
    await recordImportHistory({
      module: modKey,
      fileName,
      uploadedBy: user.id || 1,
      uploaderName: user.name || 'Admin',
      totalRecords: importResult.totalProcessed,
      successfulRecords: importResult.successCount,
      updatedRecords: importResult.updatedCount,
      skippedRecords: importResult.skippedCount,
      failedRecords: importResult.failedCount,
      status: importResult.failedCount === 0 ? 'completed' : (importResult.successCount > 0 ? 'partial' : 'failed'),
      duplicateStrategy,
      failedData: importResult.failedRecords
    });

    return res.json({
      success: true,
      message: `Bulk import completed for ${MODULE_DEFINITIONS[modKey].label}!`,
      results: importResult
    });
  } catch (err) {
    console.error('Import execution error:', err);
    return res.status(500).json({ success: false, message: 'Import execution failed: ' + err.message });
  }
});

/**
 * Get import history for module
 * GET /api/bulk-import/:module/history
 */
router.get('/:module/history', async (req, res) => {
  try {
    const { module: modKey } = req.params;
    const history = await getImportHistory(modKey);
    return res.json({ success: true, data: history });
  } catch (err) {
    console.error('Error fetching import history:', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch history.' });
  }
});

/**
 * Download failed records Excel for module
 * POST /api/bulk-import/:module/failed-excel
 */
router.post('/:module/failed-excel', (req, res) => {
  try {
    const { module: modKey } = req.params;
    const { failedRecords = [] } = req.body;

    if (!Array.isArray(failedRecords) || failedRecords.length === 0) {
      return res.status(400).json({ success: false, message: 'No failed records provided.' });
    }

    const buffer = generateFailedRecordsExcel(modKey, failedRecords);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=Adilabad_${modKey}_failed_records.xlsx`);
    return res.send(buffer);
  } catch (err) {
    console.error('Error generating failed records Excel:', err);
    return res.status(500).json({ success: false, message: 'Failed to generate excel: ' + err.message });
  }
});

module.exports = router;
