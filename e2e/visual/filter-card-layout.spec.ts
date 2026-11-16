import { expect, test } from '@playwright/test';
import { openStable, screenshotSoft } from './vrt-helper';

for (const width of [1440, 800]) {
  test(`filter-card/expanded-layout-${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const card = page.locator('lux-filter-form lux-card').first();
    await openStable(page, '/components-overview/example/filter', card);

    await card.getByRole('button', { name: 'Mehr Optionen', exact: true }).click();
    const expanded = card.locator('lux-card-content-expanded');
    await expect(expanded).toBeVisible();
    await card.locator('.lux-card-content-expanded').evaluate(async (element) => {
      await Promise.all(element.getAnimations().map((animation) => animation.finished));
    });

    const grid = expanded.locator('.lux-grid').first();
    const datepicker = await grid.locator('lux-datepicker[luxName="filter_datepicker_combined_ac"]').boundingBox();
    const timepicker = await grid.locator('lux-timepicker[luxName="filter_timepicker_combined_ac"]').boundingBox();
    const select = await grid.locator('lux-select[luxControlBinding="singleSelect"]').boundingBox();
    const multiSelect = await grid.locator('lux-select[luxControlBinding="multiSelect"]').boundingBox();
    const gridBox = await grid.boundingBox();
    expect(datepicker).not.toBeNull();
    expect(timepicker).not.toBeNull();
    expect(select).not.toBeNull();
    expect(multiSelect).not.toBeNull();
    expect(gridBox).not.toBeNull();

    for (const field of [datepicker!, timepicker!]) {
      expect(field.x).toBeGreaterThanOrEqual(gridBox!.x - 1);
      expect(field.x + field.width).toBeLessThanOrEqual(gridBox!.x + gridBox!.width + 1);
    }
    const bottom = Math.max(datepicker!.y + datepicker!.height, timepicker!.y + timepicker!.height);
    expect(select!.y).toBeGreaterThanOrEqual(bottom - 1);
    expect(multiSelect!.y).toBeGreaterThanOrEqual(bottom - 1);

    if (width === 1440) {
      await screenshotSoft(page, expanded, 'filter-card-expanded.png');
    }
  });
}
