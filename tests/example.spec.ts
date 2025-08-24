import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Visa Transaction Analyzer/);
});

test('has main navigation', async ({ page }) => {
  await page.goto('/');

  // Expect the main heading to be visible
  const heading = page.getByRole('heading', { name: /Visa Transaction Analyzer/ });
  await expect(heading).toBeVisible();
});

test('search form is functional', async ({ page }) => {
  await page.goto('/');

  // Check if search form elements are present
  const agentSelect = page.locator('select[name="agentType"]');
  const transactionInput = page.locator('input[name="transactionId"]');
  const searchButton = page.getByRole('button', { name: /Search/i });

  await expect(agentSelect).toBeVisible();
  await expect(transactionInput).toBeVisible();
  await expect(searchButton).toBeVisible();
});

test('theme toggle works', async ({ page }) => {
  await page.goto('/');

  // Find and click the theme toggle
  const themeToggle = page.getByRole('button', { name: /Toggle theme/i });
  await expect(themeToggle).toBeVisible();
  
  // Click to open dropdown
  await themeToggle.click();
  
  // Check if theme options are visible
  const darkModeOption = page.getByRole('menuitem', { name: /Dark/i });
  await expect(darkModeOption).toBeVisible();
});