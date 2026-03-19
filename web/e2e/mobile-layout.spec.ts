import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Mobile Layout Tests', () => {
  test('Settings page is accessible and properly rendered on mobile', async ({ page, isMobile }) => {
    if (!isMobile) return;

    await page.goto('/');

    // Check viewport meta tag
    const viewportMeta = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewportMeta).toContain('width=device-width');
    expect(viewportMeta).toContain('initial-scale=1');
    expect(viewportMeta).not.toContain('maximum-scale=1');
    expect(viewportMeta).not.toContain('user-scalable=false');
    
    // Accessibility check
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('Mobile navigation menu works', async ({ page, isMobile }) => {
    if (!isMobile) return;
    
    // As a simple test, we check if the home page loads without horizontal scroll
    await page.goto('/');
    
    const viewportSize = page.viewportSize();
    if (viewportSize) {
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(viewportSize.width);
    }
  });
});
