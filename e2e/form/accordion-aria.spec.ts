import { expect, test } from '@playwright/test';
import { FormExamplePage } from './support/form-example';

test.describe('lux-accordion-aria', () => {
  test('Eingabefelder im Panel lassen sich mit der Tastatur bedienen', async ({ page }) => {
    const example = await FormExamplePage.open(page, 'accordion-aria');
    await example.options.setSwitch('Eingabefelder im Panel #1');

    const panel = page.locator('example-base-content lux-panel-aria').first();
    const header = panel.locator('.lux-expansion-panel-header-toggle');
    await expect(header).toHaveAttribute('aria-expanded', 'true');

    const input = panel.getByRole('textbox', { name: 'Einzeilige Eingabe' });
    await input.focus();
    await page.keyboard.type('Hallo');
    await page.keyboard.press('Space');
    await page.keyboard.type('Welt');
    await expect(input).toHaveValue('Hallo Welt');
    await page.keyboard.press('Home');
    await page.keyboard.type('A');
    await page.keyboard.press('End');
    await page.keyboard.press('Space');
    await page.keyboard.type('Ende');
    await expect(input).toHaveValue('AHallo Welt Ende');

    const textarea = panel.getByRole('textbox', { name: 'Mehrzeilige Eingabe' });
    await textarea.focus();
    await page.keyboard.type('Erste');
    await page.keyboard.press('Space');
    await page.keyboard.type('Zeile');
    await page.keyboard.press('Enter');
    await page.keyboard.type('Zweite');
    await expect(textarea).toHaveValue('Erste Zeile\nZweite');

    const cursorBefore = await textarea.evaluate((element: HTMLTextAreaElement) => element.selectionStart);
    await page.keyboard.press('ArrowUp');
    const cursorAfter = await textarea.evaluate((element: HTMLTextAreaElement) => element.selectionStart);
    expect(cursorAfter).toBeLessThan(cursorBefore);
    await page.keyboard.press('ArrowDown');
    await expect.poll(() => textarea.evaluate((element: HTMLTextAreaElement) => element.selectionStart)).toBe(cursorBefore);
    await expect(header).toHaveAttribute('aria-expanded', 'true');
  });

  test('Panel-Header reagieren weiterhin einmalig auf Maus und Tastatur', async ({ page }) => {
    await FormExamplePage.open(page, 'accordion-aria');
    const panel = page.locator('example-base-content lux-panel-aria').first();
    const header = panel.locator('.lux-expansion-panel-header-toggle');

    await expect(header).toHaveAttribute('aria-expanded', 'true');
    await header.focus();
    await page.keyboard.press('Space');
    await expect(header).toHaveAttribute('aria-expanded', 'false');
    await page.keyboard.press('Space');
    await expect(header).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Enter');
    await expect(header).toHaveAttribute('aria-expanded', 'false');
    await page.keyboard.press('Enter');
    await expect(header).toHaveAttribute('aria-expanded', 'true');
    await header.click();
    await expect(header).toHaveAttribute('aria-expanded', 'false');
    await header.click();
    await expect(header).toHaveAttribute('aria-expanded', 'true');

    const customAction = panel.locator('.lux-expansion-panel-header-custom').getByRole('button', { name: 'Speichern' });
    await customAction.evaluate((button) => {
      button.addEventListener('click', () => button.setAttribute('data-test-clicked', 'true'), { once: true });
    });
    await customAction.focus();
    await page.keyboard.press('Space');
    await expect(customAction).toHaveAttribute('data-test-clicked', 'true');
    await expect(header).toHaveAttribute('aria-expanded', 'true');
  });
});
