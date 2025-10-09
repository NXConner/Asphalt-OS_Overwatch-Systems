import { test, expect } from '@playwright/test';

test('homepage shows basic shell', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Asphalt OS/i);
});
