import { expect, test } from '@playwright/test';
import { openStable, screenshotSoft } from './vrt-helper';

test('button-toggle-wrap/mobile-demo', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 760 });
  const toggles = page.locator('.example-base-content lux-button-toggle');
  await openStable(page, '/components-overview/example/button-toggle', toggles.first());

  await expect(toggles).toHaveCount(4);
  for (const [index, toggle] of (await toggles.all()).entries()) {
    const buttons = toggle.locator('mat-button-toggle');
    await expect(buttons).toHaveCount(index % 2 === 0 ? 3 : 4);
    for (const button of await buttons.all()) {
      await expect(button).toBeVisible();
      const box = await button.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(320);
    }
  }

  const content = page.locator('lux-app-content');
  await expect.poll(() => content.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
});

test('button-toggle-wrap/auto-vertical', async ({ page }) => {
  const exampleArea = page.locator('.example-base-content');
  const toggle = exampleArea.locator('lux-button-toggle').first();
  await page.setViewportSize({ width: 320, height: 760 });
  await openStable(page, '/components-overview/example/button-toggle', toggle);
  await toggle.evaluate((element) => {
    element.style.display = 'block';
    element.style.width = '180px';
  });

  const group = toggle.locator('mat-button-toggle-group');
  await expect(group).toHaveClass(/lux-button-toggle-vertical/);

  const groupBox = await group.boundingBox();
  expect(groupBox).not.toBeNull();
  for (const button of await toggle.locator('mat-button-toggle').all()) {
    const buttonBox = await button.boundingBox();
    expect(buttonBox).not.toBeNull();
    expect(buttonBox!.x).toBeGreaterThanOrEqual(groupBox!.x - 1);
    expect(buttonBox!.x + buttonBox!.width).toBeLessThanOrEqual(groupBox!.x + groupBox!.width + 1);
  }

  await screenshotSoft(page, group, 'button-toggle-wrapped.png');
});
