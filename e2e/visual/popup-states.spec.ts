import { expect, test } from '@playwright/test';
import { FormExamplePage } from '../form/support/form-example';
import { openStable, prepareScreenshot } from './vrt-helper';

/** Lange Wörter ohne Leerzeichen (Unterstriche sind keine Umbruchstellen), z. B. Dateinamen oder IDs. */
const LONG_TITLE = 'Antrag_Mustermann_Erika_2026_01_15_Gewerbeanmeldung';
const LONG_TEXT = 'Bitte prüfen Sie die Datei Antrag_Mustermann_Erika_2026_01_15_Anlage_Gewerbeanmeldung_final_v3.pdf vor dem Absenden.';

test('popup-states/langer-text-ohne-leerzeichen', async ({ page }) => {
  await openStable(page, '/components-overview/example/popup', page.locator('app-popup-example'));

  const options = FormExamplePage.forPage(page).options;
  await options.setText('Titel', LONG_TITLE);
  await options.setText('Text', LONG_TEXT);

  await page.locator('example-base-content').getByRole('button', { name: 'Info', exact: true }).click();
  const popup = page.getByRole('dialog', { name: LONG_TITLE });
  await expect(popup).toBeVisible();
  await expect(popup).toContainText(LONG_TEXT);

  // Kein Text darf über den Rahmen des Popups hinausragen. Gemessen werden die Textzeilen selbst,
  // denn die Boxen von Titel und Body bleiben auch bei überlaufendem Text so breit wie das Popup.
  const overflow = await popup.evaluate((element) => {
    const range = document.createRange();
    range.selectNodeContents(element);
    const right = element.getBoundingClientRect().right;
    return Math.max(0, ...Array.from(range.getClientRects(), (line) => Math.ceil(line.right - right)));
  });
  expect(overflow).toBe(0);

  await prepareScreenshot(page);
  await expect(page.locator('.lux-popup-panel')).toHaveScreenshot('popup-langer-text-ohne-leerzeichen.png');
});
