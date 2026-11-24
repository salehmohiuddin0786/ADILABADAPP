const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Admin Panel — Business Directory Bulk Import End-to-End', () => {
  test('Complete flow: Open modal, upload 100+ Excel, preview validation, execute import, verify directory', async ({ page }) => {
    test.setTimeout(60000);

    // 1. Visit Admin Businesses Page
    await page.goto('http://localhost:3010/admin/businesses');
    await expect(page.locator('h2:has-text("Businesses")')).toBeVisible();

    // 2. Verify "Import Businesses" button is present and clickable
    const importBtn = page.locator('button:has-text("Import Businesses")');
    await expect(importBtn).toBeVisible();
    await importBtn.click();

    // 3. Verify Import Modal opened
    await expect(page.locator('h2:has-text("Excel/CSV Bulk Import")')).toBeVisible();
    await expect(page.locator('button:has-text("Download Sample Excel Template")')).toBeVisible();
    await expect(page.locator('text=Drag & drop your Excel or CSV file here')).toBeVisible();

    // 4. Attach Excel File
    const sampleFilePath = path.resolve(__dirname, '../../../backend/scripts/Adilabad_100_Businesses.xlsx');
    const fileInput = page.locator('input#excel-file-input');
    await fileInput.setInputFiles(sampleFilePath);

    // 5. Verify selected file card appears
    await expect(page.locator('p:has-text("Adilabad_100_Businesses.xlsx")')).toBeVisible();

    // 6. Click "Upload and Preview"
    const uploadPreviewBtn = page.locator('button:has-text("Upload and Preview")');
    await expect(uploadPreviewBtn).toBeEnabled();
    await uploadPreviewBtn.click();

    // 7. Verify Preview & Validation Table loads
    await expect(page.getByRole('heading', { name: 'Duplicate Records Handling' })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Total Rows', { exact: true })).toBeVisible();
    await expect(page.getByText('Valid Records', { exact: true })).toBeVisible();
    await expect(page.getByText('Duplicates', { exact: true })).toBeVisible();

    // Verify preview table has rows
    const tableRows = page.locator('table tbody tr');
    await expect(tableRows.first()).toBeVisible();
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(10);

    // 8. Select Duplicate Handling Policy (Skip Duplicates)
    const skipRadio = page.locator('input[value="skip"]');
    await expect(skipRadio).toBeChecked();

    // 9. Click "Import Businesses"
    const executeBtn = page.locator('button:has-text("Import Businesses")').last();
    await expect(executeBtn).toBeEnabled();
    await executeBtn.click();

    // 10. Verify Import Results Summary screen
    await expect(page.locator('h3:has-text("Bulk Import Process Completed!")')).toBeVisible({ timeout: 25000 });
    await expect(page.locator('button:has-text("View Imported Businesses")')).toBeVisible();
    await expect(page.getByText('Total Processed', { exact: true })).toBeVisible();

    // 11. Click "View Imported Businesses" to close modal and refresh table
    await page.locator('button:has-text("View Imported Businesses")').evaluate(el => el.click());
    await page.waitForTimeout(500);
    if (await page.locator('h2:has-text("Excel/CSV Bulk Import")').isVisible()) {
      await page.locator('button[aria-label="Close"]').first().click();
    }
    await expect(page.locator('h2:has-text("Excel/CSV Bulk Import")')).not.toBeVisible();

    // 12. Verify directory table has populated businesses
    const dirRows = page.locator('table tbody tr');
    await expect(dirRows.first()).toBeVisible();
    const dirCount = await dirRows.count();
    expect(dirCount).toBeGreaterThan(0);

    // 13. Test Search inside Business Directory
    const searchInput = page.locator('input[placeholder*="Search business name"]');
    await searchInput.scrollIntoViewIfNeeded();
    await searchInput.fill('Sri');
    await page.locator('button:has-text("Search")').click();
    await page.waitForTimeout(1000);
    await expect(page.locator('table tbody tr').first()).toBeVisible();

    // 14. Check Import History tab in modal
    await importBtn.scrollIntoViewIfNeeded();
    await importBtn.click();
    await expect(page.locator('h2:has-text("Excel/CSV Bulk Import")')).toBeVisible();
    await page.locator('button:has-text("History")').first().click();

    await expect(page.locator('h4:has-text("Import History Log")')).toBeVisible();
    await expect(page.locator('table tbody tr').first()).toBeVisible();
    await expect(page.locator('text=Completed').first()).toBeVisible();

    // Close modal
    await page.locator('button[aria-label="Close"]').first().click();
    await expect(page.locator('h2:has-text("Excel/CSV Bulk Import")')).not.toBeVisible();
  });
});
