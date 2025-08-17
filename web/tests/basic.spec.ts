import { test, expect } from '@playwright/test';

// Minimal smoke + interaction tests (mock data used when Supabase env is absent)

test('loads home and shows list header', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: '매물 목록' })).toBeVisible();
  // table should be present
  await expect(page.getByTestId('property-table')).toBeVisible();
});

test('search filters the list (debounced)', async ({ page }) => {
  await page.goto('/');
  const search = page.getByRole('textbox', { name: '검색어 입력' });
  await search.fill('동일');
  // expect at least one row to remain visible after debounce
  await expect(page.getByTestId('property-row').first()).toBeVisible();
});

test('clicking a row highlights it and reveals side detail panel', async ({ page }) => {
  await page.goto('/');
  const firstRow = page.getByTestId('property-row').first();
  await firstRow.click();
  // row should have selected state background
  await expect(firstRow).toHaveAttribute('aria-selected', 'true');
  // side panel hint should be replaced
  await expect(page.getByText('행을 클릭하면 상세가 표시됩니다').first()).toBeHidden({ timeout: 2000 });
});
