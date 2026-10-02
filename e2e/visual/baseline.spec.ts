import { expect, test } from '@playwright/test';
import { BASELINE_TABS, openBaselineTab } from './vrt-helper';

/**
 * Die Baseline-Seite prüft die Ausrichtung der Formularelemente
 * (Label, Required-Marker, Hint, Fehler) – wichtigste Seite für Layout-Regressionen.
 */
for (const tab of BASELINE_TABS) {
  test(`baseline/${tab.title}`, async ({ page }) => {
    await openBaselineTab(page, tab.title);

    await expect(page.locator('lux-app-content')).toHaveScreenshot(`baseline-${tab.title.toLowerCase()}.png`);
  });
}
