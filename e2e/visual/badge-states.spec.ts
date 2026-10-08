import { expect, test } from '@playwright/test';
import { FormExamplePage } from '../form/support/form-example';
import { openStable, prepareScreenshot } from './vrt-helper';

test('badge-states/muted', async ({ page }) => {
  const card = page.locator('lux-card.example-base-container');
  await openStable(page, '/components-overview/example/badge', card);

  await FormExamplePage.forPage(page).options.setSwitch('luxMuted');
  await expect(card.locator('lux-badge .lux-badge-muted')).toHaveCount(10);

  await prepareScreenshot(page);
  await expect(card).toHaveScreenshot('badge-muted.png', { threshold: 0 });
});
