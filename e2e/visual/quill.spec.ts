import { expect, Locator, Page, test } from '@playwright/test';
import { openStable, prepareScreenshot, screenshotSoft } from './vrt-helper';

/**
 * Zustände des Rich-Text-Editors lux-quill (Toolbar, Formate, Überschriften, Fehler, Disabled,
 * Readonly, Link-Dialog). Grundlage ist das erste Beispiel ("ohne Reactive-Form") der Demo-Seite.
 */
test.describe('lux-quill', () => {
  async function openQuill(page: Page): Promise<Locator> {
    const quill = page.locator('lux-quill').first();
    await openStable(page, '/components-overview/example/quill', quill.locator('.ql-editor'));
    return quill;
  }

  async function toggle(page: Page, name: string) {
    await page.getByRole('switch', { name, exact: true }).click();
  }

  /** Setzt den Cursor an den Anfang des n-ten Blocks (Absatz oder Listeneintrag) im Editor. */
  async function placeCursor(quill: Locator, blockIndex: number) {
    await quill.locator('.ql-editor > *, .ql-editor li').nth(blockIndex).click({ position: { x: 2, y: 2 } });
  }

  test('quill/document', async ({ page }) => {
    const quill = await openQuill(page);

    await screenshotSoft(page, quill, 'quill-document.png');
  });

  test('quill/formatiert', async ({ page }) => {
    const quill = await openQuill(page);
    const editor = quill.locator('.ql-editor');

    // Überschrift 1 für den ersten Absatz
    await placeCursor(quill, 0);
    await quill.locator('.lux-quill-toolbar-heading').click();
    await page.getByRole('menuitemradio', { name: 'Überschrift 1' }).click();
    await expect(editor.locator('h1.lux-quill-heading-1')).toHaveCount(1);

    // Zweiten Listeneintrag einrücken und ein Wort fett setzen
    await editor.locator('li').nth(1).click();
    await page.keyboard.press('Tab');
    await expect(editor.locator('li.ql-indent-1')).toHaveCount(1);

    await placeCursor(quill, 1);
    await page.keyboard.press('Home');
    await page.keyboard.press('Shift+Control+ArrowRight');
    await page.keyboard.press('Control+b');
    await expect(editor.locator('strong')).toHaveCount(1);

    await screenshotSoft(page, quill, 'quill-formatiert.png');
  });

  test('quill/ueberschriften-menue', async ({ page }) => {
    const quill = await openQuill(page);

    await placeCursor(quill, 0);
    await quill.locator('.lux-quill-toolbar-heading').click();
    const menu = page.locator('.lux-quill-heading-menu');
    await expect(menu).toBeVisible();

    await page.mouse.move(0, 0);
    await expect.soft(menu).toHaveScreenshot('quill-ueberschriften-menue.png');
  });

  test('quill/kommentar', async ({ page }) => {
    const quill = await openQuill(page);

    await page.getByRole('combobox', { name: 'luxPreset' }).click();
    await page.getByRole('option', { name: 'comment (Kommentar)' }).click();
    await expect(quill.locator('.lux-quill-toolbar-heading')).toHaveCount(0);

    await screenshotSoft(page, quill, 'quill-kommentar.png');
  });

  test('quill/zustaende', async ({ page }) => {
    const quill = await openQuill(page);
    const editor = quill.locator('.ql-editor');

    // Fehler: Pflichtfeld leeren und verlassen
    await toggle(page, 'luxRequired');
    await editor.click();
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Delete');
    await prepareScreenshot(page);
    await expect(quill.locator('mat-error')).toBeVisible();
    await screenshotSoft(page, quill, 'quill-fehler.png');

    // Disabled
    await toggle(page, 'luxRequired');
    await toggle(page, 'luxDisabled');
    await expect(editor).toHaveAttribute('aria-disabled', 'true');
    await screenshotSoft(page, quill, 'quill-disabled.png');

    // Readonly
    await toggle(page, 'luxDisabled');
    await toggle(page, 'readonly');
    await expect(editor).toHaveAttribute('aria-readonly', 'true');
    await screenshotSoft(page, quill, 'quill-readonly.png');
  });

  test('quill/link-dialog', async ({ page }) => {
    const quill = await openQuill(page);

    await placeCursor(quill, 0);
    await page.keyboard.press('Home');
    await page.keyboard.press('Shift+Control+ArrowRight');
    await quill.locator('.lux-quill-toolbar-link').click();

    const dialog = page.locator('mat-dialog-container');
    await expect(dialog.getByRole('textbox', { name: /Adresse \(URL\)/ })).toBeFocused();
    await dialog.getByRole('textbox', { name: /Adresse \(URL\)/ }).fill('www.ihk.de');

    await prepareScreenshot(page);
    await expect.soft(dialog).toHaveScreenshot('quill-link-dialog.png');

    await dialog.getByRole('button', { name: 'Übernehmen' }).click();
    await expect(quill.locator('.ql-editor a[href="https://www.ihk.de"]')).toHaveCount(2);
  });
});
