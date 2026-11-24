const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Admin Panel — Universal Bulk Import for Services & Other Modules', () => {

  test('Services: Complete flow (Modal, Excel Upload, Preview, Duplicate Policy, Import, Directory Verification)', async ({ page }) => {
    test.setTimeout(60000);

    // 1. Visit Admin Services Page
    await page.goto('http://localhost:3010/admin/services');
    await expect(page.locator('h2:has-text("Services Directory")')).toBeVisible();

    // 2. Verify "Import Services" button is present and clickable
    const importBtn = page.locator('button:has-text("Import Services")');
    await expect(importBtn).toBeVisible();
    await importBtn.click();

    // 3. Verify Universal Bulk Import Modal opened
    await expect(page.locator('h2:has-text("Excel / CSV Bulk Import — Services Directory")')).toBeVisible();
    await expect(page.locator('button:has-text("Download Sample Template")')).toBeVisible();
    await expect(page.locator('text=Drag and drop your spreadsheet here')).toBeVisible();

    // 4. Attach Excel File
    const sampleFilePath = path.resolve(__dirname, '../../../backend/scripts/Adilabad_Test_Services.xlsx');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(sampleFilePath);

    // 5. Verify selected file details card appears
    await expect(page.locator('h4:has-text("Adilabad_Test_Services.xlsx")')).toBeVisible();

    // 6. Click "Upload and Preview"
    const uploadPreviewBtn = page.locator('button:has-text("Upload and Preview")');
    await expect(uploadPreviewBtn).toBeEnabled();
    await uploadPreviewBtn.click();

    // 7. Verify Preview & Validation Table loads
    await expect(page.getByText('Duplicate Handling Policy')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText('Total Detected', { exact: true })).toBeVisible();
    await expect(page.getByText('Valid Records', { exact: true })).toBeVisible();

    // Verify preview table has rows
    const tableRows = page.locator('table tbody tr');
    await expect(tableRows.first()).toBeVisible();
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThanOrEqual(2);

    // 8. Verify Duplicate Handling radio buttons
    const skipRadio = page.locator('input[name="duplicateStrategy"][value="skip"]');
    await expect(skipRadio).toBeChecked();

    // 9. Click "Confirm & Import Services Directory"
    const executeBtn = page.locator('button:has-text("Confirm & Import Services Directory")');
    await expect(executeBtn).toBeEnabled();
    await executeBtn.click();

    // 10. Verify Import Results Summary screen
    await expect(page.locator('h3:has-text("Bulk Import Successfully Completed!")')).toBeVisible({ timeout: 25000 });
    await expect(page.locator('button:has-text("View Imported Services Directory")')).toBeVisible();
    await expect(page.getByText('Processed', { exact: true })).toBeVisible();
    await expect(page.getByText('Imported', { exact: true })).toBeVisible();

    // 11. Click "View Imported Services Directory" and verify modal closes and listings appear
    const viewBtn = page.locator('button:has-text("View Imported Services Directory")');
    await viewBtn.click();
    await expect(page.locator('h2:has-text("Excel / CSV Bulk Import — Services Directory")')).not.toBeVisible();

    // 12. Verify imported service appears in the list / search
    const searchInput = page.locator('input[placeholder*="Search service title"]');
    await searchInput.fill('Solar');
    await expect(page.locator('text=Adilabad Inverter Battery & Solar Power Solutions')).toBeVisible();
  });

  test('Properties: Verify Import Properties button and modal trigger', async ({ page }) => {
    await page.goto('http://localhost:3010/admin/properties');
    await expect(page.locator('h2:has-text("Commercial & Real Estate")')).toBeVisible();

    const importBtn = page.locator('button:has-text("Import Properties")');
    await expect(importBtn).toBeVisible();
    await importBtn.click();

    await expect(page.locator('h2:has-text("Excel / CSV Bulk Import — Property Listings")')).toBeVisible();
    await expect(page.locator('button:has-text("Download Sample Template")')).toBeVisible();
  });

  test('Buy & Sell: Verify Import Buy & Sell button and modal trigger', async ({ page }) => {
    await page.goto('http://localhost:3010/admin/buy-sell');
    await expect(page.locator('h2:has-text("Buy & Sell Marketplace")')).toBeVisible();

    const importBtn = page.locator('button:has-text("Import Buy & Sell")');
    await expect(importBtn).toBeVisible();
    await importBtn.click();

    await expect(page.locator('h2:has-text("Excel / CSV Bulk Import — Buy & Sell Marketplace")')).toBeVisible();
    await expect(page.locator('button:has-text("Download Sample Template")')).toBeVisible();
  });

  test('Offers: Verify Import Offers button and modal trigger', async ({ page }) => {
    await page.goto('http://localhost:3010/admin/offers');
    await expect(page.locator('h2:has-text("Special Offers & Discounts")')).toBeVisible();

    const importBtn = page.locator('button:has-text("Import Offers")');
    await expect(importBtn).toBeVisible();
    await importBtn.click();

    await expect(page.locator('h2:has-text("Excel / CSV Bulk Import — Offers & Deals")')).toBeVisible();
    await expect(page.locator('button:has-text("Download Sample Template")')).toBeVisible();
  });

  test('Jobs: Verify Import Jobs button and modal trigger', async ({ page }) => {
    await page.goto('http://localhost:3010/admin/jobs');
    await expect(page.locator('h2:has-text("Job Vacancies & Careers")')).toBeVisible();

    const importBtn = page.locator('button:has-text("Import Jobs")');
    await expect(importBtn).toBeVisible();
    await importBtn.click();

    await expect(page.locator('h2:has-text("Excel / CSV Bulk Import — Job Vacancies")')).toBeVisible();
    await expect(page.locator('button:has-text("Download Sample Template")')).toBeVisible();
  });

  test('Rentals: Verify Import Rentals button and modal trigger', async ({ page }) => {
    await page.goto('http://localhost:3010/admin/rentals');
    await expect(page.locator('h2:has-text("Rental Catalog & Fleet")')).toBeVisible();

    const importBtn = page.locator('button:has-text("Import Rentals")');
    await expect(importBtn).toBeVisible();
    await importBtn.click();

    await expect(page.locator('h2:has-text("Excel / CSV Bulk Import — Rental Equipment & Tools")')).toBeVisible();
    await expect(page.locator('button:has-text("Download Sample Template")')).toBeVisible();
  });

  test('Events: Verify Import Events button and modal trigger', async ({ page }) => {
    await page.goto('http://localhost:3010/admin/events');
    await expect(page.locator('h2:has-text("Events")')).toBeVisible();

    const importBtn = page.locator('button:has-text("Import Events")');
    await expect(importBtn).toBeVisible();
    await importBtn.click();

    await expect(page.locator('h2:has-text("Excel / CSV Bulk Import — Events & Expos")')).toBeVisible();
    await expect(page.locator('button:has-text("Download Sample Template")')).toBeVisible();
  });

});
