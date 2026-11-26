import { expect, test as setup } from '@playwright/test';
import { STORAGE_STATE, STORAGE_STATE_GREEN } from '../playwright.config';

/**
 * Bestätigt einmalig den Consent-Dialog der Demo-App (Cookie "lux-app-demo-consent")
 * und legt je Theme einen storageState ab, in dem das Theme fest gesetzt ist
 * ("authentic" bzw. "green"). So starten alle Screenshot-Tests ohne Dialog im richtigen Theme.
 */
setup('consent bestätigen', async ({ page }) => {
  await page.goto('/home');

  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Alle akzeptieren' }).click();
  await expect(dialog).toHaveCount(0);

  for (const [theme, path] of [
    ['authentic', STORAGE_STATE],
    ['green', STORAGE_STATE_GREEN]
  ] as const) {
    await page.evaluate((name) => localStorage.setItem('lux.app.theme.name', name), theme);
    await page.context().storageState({ path });
  }
});
