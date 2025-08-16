import { test, expect } from '@playwright/test';

// Minimal smoke test that loads the app and checks key UI elements
// Requires VITE_SUPABASE_URL/KEY to be set to harmless values. In CI we set dummy values.

test('loads home and shows list header', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '매물 목록' })).toBeVisible();
});
