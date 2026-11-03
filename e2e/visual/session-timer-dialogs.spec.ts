import { expect, Page, test } from '@playwright/test';
import { openExample, screenshotSoft } from './vrt-helper';

async function reachWarningThreshold(page: Page) {
  await page.getByRole('textbox', { name: 'Startzeit der Session in Sekunden' }).fill('121');
  await page.getByRole('button', { name: 'Zeit setzen' }).click();
  await page.clock.runFor(2000);
}

test('session-timer: verlängerbarer Dialog', async ({ page }) => {
  await openExample(page, 'session-timer');
  await reachWarningThreshold(page);

  const dialog = page.getByRole('dialog');
  const structure = dialog.locator('lux-dialog-structure[luxTagId="lux-session-timer-dialog-default"]');
  await expect(structure).toBeVisible();
  const icon = structure.locator('.lux-dialog-icon');
  await expect(icon).toBeVisible();
  const dialogBox = await structure.locator('.lux-dialog').boundingBox();
  const iconBox = await icon.boundingBox();
  expect(dialogBox).not.toBeNull();
  expect(iconBox).not.toBeNull();
  expect(Math.abs(iconBox!.x + iconBox!.width / 2 - (dialogBox!.x + dialogBox!.width / 2))).toBeLessThan(2);
  await screenshotSoft(page, dialog, 'session-timer-extendable.png');
});

test('session-timer: Session kann nicht verlängert werden', async ({ page }) => {
  await openExample(page, 'session-timer');
  const canExtendSession = page.getByRole('switch', { name: 'Session darf verlängert werden' });
  await canExtendSession.click();
  await expect(canExtendSession).not.toBeChecked();
  await reachWarningThreshold(page);

  const dialog = page.getByRole('dialog');
  await expect(dialog.locator('lux-dialog-structure[luxTagId="lux-session-timer-dialog-logout"]')).toBeVisible();
  await screenshotSoft(page, dialog, 'session-timer-not-extendable.png');
});
