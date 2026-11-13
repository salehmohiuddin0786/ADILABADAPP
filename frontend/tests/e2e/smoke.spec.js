const { test, expect } = require('@playwright/test');

test.describe('Adilabad App — Core Hyperlocal Navigation & Responsiveness', () => {
  test('Homepage loads with verified Adilabad branding and search', async ({ page }) => {
    await page.goto('/');

    // Check title and primary brand presence
    await expect(page).toHaveTitle(/Adilabad App/i);
    await expect(page.locator('text=AdilabadApp').first()).toBeVisible();

    // Verify presence of hero sections and search
    const searchForm = page.locator('form');
    await expect(searchForm.first()).toBeVisible();

    // Verify key categories are displayed
    await expect(page.locator('text=Electronics').first()).toBeVisible();
    await expect(page.locator('text=Property').first()).toBeVisible();
  });

  test('Advertisements page displays verified listings and filters', async ({ page }) => {
    await page.goto('/advertisements');
    await expect(page.locator('h1')).toContainText(/Advertisements/i);

    // Verify listing cards render
    const cards = page.locator('article, div[class*="rounded-2xl"]').filter({ hasText: /Call|Details|WhatsApp/i });
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test('Business Directory loads with verified businesses', async ({ page }) => {
    await page.goto('/businesses');
    await expect(page.locator('text=Business Directory').first()).toBeVisible();
  });

  test('Owner Portal login loads and authenticates successfully', async ({ page }) => {
    await page.goto('/owner/login');
    await expect(page.locator('text=Adilabad Owner Portal').first()).toBeVisible();

    // Click Sign In with demo credentials
    await page.click('button:has-text("Sign In to Owner Center")');

    // Should redirect to /owner/dashboard
    await page.waitForURL('**/owner/dashboard');
    await expect(page.locator('text=Commercial Management Dashboard').first()).toBeVisible();

    // Test Owner Panel links - zero 404s!
    const testLinks = [
      '/owner/verification',
      '/owner/businesses',
      '/owner/advertisements',
      '/owner/rentals',
      '/owner/rental-requests',
      '/owner/booking-calendar',
      '/owner/analytics',
      '/owner/settings'
    ];

    for (const href of testLinks) {
      const response = await page.goto(href);
      expect(response.status()).toBe(200);
      await expect(page.locator('text=404')).toHaveCount(0);
    }
  });

  test('Mobile viewport displays sticky bottom navigation', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile test only');
    await page.goto('/');

    // Verify mobile bottom navigation exists and is visible
    const bottomNav = page.locator('nav[aria-label="Mobile Navigation"]');
    await expect(bottomNav).toBeVisible();

    // Verify key 1-tap touch navigation items
    await expect(bottomNav.locator('text=Home')).toBeVisible();
    await expect(bottomNav.locator('text=Ads')).toBeVisible();
    await expect(bottomNav.locator('text=Directory')).toBeVisible();
    await expect(bottomNav.locator('text=Events')).toBeVisible();
  });
});
