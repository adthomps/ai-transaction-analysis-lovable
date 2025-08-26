import { test, expect } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

// This test assumes your app runs at http://localhost:8080
// Adjust the URL if needed

test.describe('Example Transactions ADA & Color Contrast', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8080');
    await injectAxe(page);
  });

  test('should have no accessibility violations in Example Transactions', async ({ page }) => {
    // Check the Example Transactions sidebar
    await checkA11y(page, 'aside', {
      detailedReport: true,
      runOnly: ['color-contrast', 'wcag21aa', 'wcag21aaa'],
    });
  });

  test('transaction IDs should have sufficient color contrast', async ({ page }) => {
    // Check each transaction ID for color contrast
    const ids = await page.$$('[aria-label^="Example transaction"] .font-mono');
    for (const id of ids) {
      const color = await id.evaluate(el => window.getComputedStyle(el).color);
      // Simple check: color should not be too close to background
      expect(color).not.toBe('rgb(255, 255, 255)'); // Not white on white
      expect(color).not.toBe('rgb(24, 24, 27)'); // Not dark on dark
    }
  });
});
