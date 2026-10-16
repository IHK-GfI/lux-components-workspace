import { expect, test } from '@playwright/test';
import { openStable, screenshotSoft } from './vrt-helper';

test('progress-variants/progressbar-text-positions', async ({ page }) => {
  const sample = page.locator('.lux-app-data-bg').first();
  await openStable(page, '/components-overview/example/progress', page.locator('lux-progress').first());
  await screenshotSoft(page, sample, 'progressbar-default.png');

  const showText = page.getByRole('switch', { name: 'Fortschrittstext anzeigen', exact: true });
  await showText.click();
  await expect(showText).toBeChecked();

  const muted = page.getByRole('switch', { name: 'Muted (dekorativ)', exact: true });
  await muted.click();
  await expect(muted).toBeChecked();

  await page.getByRole('textbox', { name: 'luxText', exact: true }).fill('35 von 50 Aufgaben erledigt');
  const textPosition = page.getByRole('combobox', { name: 'luxTextPosition', exact: true });

  for (const position of ['bottom', 'left', 'top']) {
    await textPosition.click();
    await page.getByRole('option', { name: position, exact: true }).click();
    await screenshotSoft(page, sample, `progressbar-${position}-muted.png`);
  }
});

test('progress-variants/spinner-muted-percentage', async ({ page }) => {
  const sample = page.locator('.lux-app-data-bg').first();
  await openStable(page, '/components-overview/example/spinner', page.locator('lux-progress').first());
  await screenshotSoft(page, sample, 'spinner-default.png');

  const showText = page.getByRole('switch', { name: 'Prozentwert anzeigen', exact: true });
  await showText.click();
  await expect(showText).toBeChecked();

  const muted = page.getByRole('switch', { name: 'Muted (dekorativ)', exact: true });
  await muted.click();
  await expect(muted).toBeChecked();

  await screenshotSoft(page, sample, 'spinner-muted-percentage.png');
});
