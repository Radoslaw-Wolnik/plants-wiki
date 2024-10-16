import { test, expect } from '@playwright/test';

test('homepage has correct title and links', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle('Plant Wiki');

  const getStartedLink = page.locator('text=Get Started');
  await expect(getStartedLink).toHaveAttribute('href', '/register');

  const loginLink = page.locator('text=Login');
  await expect(loginLink).toHaveAttribute('href', '/login');
});