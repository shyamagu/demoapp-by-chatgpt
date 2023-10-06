import { test, expect } from '@playwright/test';

test('initial page load', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Expect the title to be "注文一覧"
  await expect(page).toHaveTitle('注文一覧');

  // Expect the table to have the correct headers
  const headers = await page.$$eval('.order-table__header', (elements) =>
    elements.map((el) => el.textContent)
  );
  expect(headers).toEqual([
    '注文番号',
    'メニュー名',
    '数量',
    '備考',
    'ステータス',
    '操作',
  ]);

  // Expect the form to have the correct labels
  const labels = await page.$$eval('.order-form__label', (elements) =>
    elements.map((el) => el.textContent)
  );
  expect(labels).toEqual(['メニュー', '数量', '備考']);

  // Expect the submit button to have the correct text
  const buttonText = await page.$eval('.order-form__button', (el) => el.textContent);
  expect(buttonText).toBe('注文する');
});