import { expect, Page, test } from '@playwright/test';
import { FormExamplePage } from '../form/support/form-example';
import { openStable, screenshotExampleCard } from './vrt-helper';

/**
 * Screenshots der Beispielkarte von lux-button in weiteren Zuständen.
 * Der Standardzustand ist bereits über examples.spec.ts abgedeckt.
 */
const STATES: Record<string, (example: FormExamplePage, page: Page) => Promise<void>> = {
  disabled: async (example, page) => {
    await example.options.setSwitch('luxDisabled', true);
    await expect(page.locator('#lux-button-0 button')).toBeDisabled();
  }
};

for (const [state, apply] of Object.entries(STATES)) {
  test(`button-states/${state}`, async ({ page }) => {
    await openStable(page, '/components-overview/example/button', page.locator('lux-card.example-base-container'));
    await apply(FormExamplePage.forPage(page), page);

    await screenshotExampleCard(page, `button-${state}.png`);
  });
}
