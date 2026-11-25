import { expect, Page, test } from '@playwright/test';
import { FormExamplePage } from '../form/support/form-example';
import { openExample, prepareScreenshot } from './vrt-helper';

/** Rand um die Snackbar im Screenshot, damit der Schatten der Nachrichten mit im Bild ist. */
const SHADOW_MARGIN = 16;

test.beforeEach(async ({ page }) => {
  await openExample(page, 'snackbar');
  // Dauer 0: Die Nachrichten bleiben stehen, unabhängig davon, wie lange der Test bis zum Screenshot braucht.
  await FormExamplePage.forPage(page).options.setText('duration', '0');
});

test('snackbar-states/eine-nachricht', async ({ page }) => {
  await page.getByRole('button', { name: 'Component-Snackbar', exact: true }).click();

  await expect(page.locator('.lux-snackbar-list > .lux-snackbar')).toHaveCount(1);
  await expect(page.locator('.lux-snackbar-more')).toHaveCount(0);

  await screenshotSnackbar(page, 'snackbar-eine-nachricht.png');
});

test('snackbar-states/weitere-nachrichten', async ({ page }) => {
  // Öffnet sechs Nachrichten unterschiedlichen Typs; mit dem Standard-Limit 1 ist nur die neueste sichtbar.
  await page.getByRole('button', { name: 'Mehrere Nachrichten', exact: true }).click();

  const messages = page.locator('.lux-snackbar-list > .lux-snackbar');
  const moreButton = page.locator('.lux-snackbar-more-button');
  await expect(messages).toHaveCount(1);
  await expect(moreButton).toHaveText('und 5 weitere Nachrichten');
  await screenshotSnackbar(page, 'snackbar-weitere-nachrichten.png');

  await moreButton.click();
  await expect(messages).toHaveCount(6);
  await expect(moreButton).toHaveText('Weniger anzeigen');
  await screenshotSnackbar(page, 'snackbar-weitere-nachrichten-aufgeklappt.png');
});

/**
 * Screenshot der Snackbar inklusive Schatten. Die Snackbar liegt in einem Overlay über der Seite, deshalb wird ein
 * Ausschnitt der Seite um den Snackbar-Container aufgenommen.
 */
async function screenshotSnackbar(page: Page, name: string) {
  await prepareScreenshot(page);
  const box = await page.locator('.lux-snackbar-container').boundingBox();
  if (!box) {
    throw new Error(`Ausschnitt für ${name} kann nicht bestimmt werden.`);
  }
  const viewport = page.viewportSize()!;
  const x = Math.max(0, Math.floor(box.x - SHADOW_MARGIN));
  const y = Math.max(0, Math.floor(box.y - SHADOW_MARGIN));
  const width = Math.min(viewport.width, Math.ceil(box.x + box.width + SHADOW_MARGIN)) - x;
  const height = Math.min(viewport.height, Math.ceil(box.y + box.height + SHADOW_MARGIN)) - y;
  await expect.soft(page).toHaveScreenshot(name, { clip: { x, y, width, height } });
}
