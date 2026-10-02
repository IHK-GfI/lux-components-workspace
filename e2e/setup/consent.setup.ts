import { expect, test as setup } from '@playwright/test';
import { STORAGE_STATE } from '../playwright.config';

/**
 * Bestätigt einmalig den Consent-Dialog der Demo-App (Cookie "lux-app-demo-consent")
 * und setzt das Theme fest auf "authentic". Der Zustand wird als storageState gespeichert,
 * damit alle Screenshot-Tests ohne Dialog starten.
 */
setup('consent bestätigen', async ({ page }) => {
  await page.goto('/home');

  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Alle akzeptieren' }).click();
  await expect(dialog).toHaveCount(0);

  await page.evaluate(() => localStorage.setItem('lux.app.theme.name', 'authentic'));

  await page.context().storageState({ path: STORAGE_STATE });
});
