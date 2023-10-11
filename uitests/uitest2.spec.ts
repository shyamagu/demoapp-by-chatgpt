import { test, expect } from '@playwright/test';

test('注文の受け付け', async ({ page }) => {
  // ページにアクセス
  await page.goto('https://sh-demo-by-chatgpt.azurewebsites.net/');
  //  await page.goto('http://localhost:3000/');

  // メニューを選択
  await page.selectOption('#menu_id', '1');
  // 数量を入力
  await page.fill('#quantity', '2');
  // 備考を入力
  await page.fill('#note', 'テイクアウト');

  // 注文するボタンをクリック
  await page.click('.order-form__button');

  // 注文が正しく保存されたことを確認
  const orderData = await page.locator('.order-table__data');
  await expect(await orderData.nth(0).textContent()).toBe('1');
  await expect(await orderData.nth(1).textContent()).toBe('ハンバーグ');
  await expect(await orderData.nth(2).textContent()).toBe('2');
  await expect(await orderData.nth(3).textContent()).toBe('テイクアウト');

});