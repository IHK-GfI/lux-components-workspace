import { expect, test } from '@playwright/test';
import { FormExamplePage } from '../form/support/form-example';
import { openExample, screenshotSoft } from './vrt-helper';

test('menu-divider/extended', async ({ page }) => {
  await openExample(page, 'menu');
  await FormExamplePage.forPage(page).options.setText('luxMaximumExtended', '2');

  const menu = page.locator('example-base-content lux-menu').first();
  const buttons = menu.locator('.lux-menu-extended > lux-button.lux-menu-item');
  const divider = menu.locator('.lux-menu-extended > lux-divider.lux-menu-extended-divider');
  await expect(buttons).toHaveCount(2);
  await expect(buttons.nth(0)).toContainText('Registrierung');
  await expect(buttons.nth(1)).toContainText('FAQ');
  await expect(divider).toHaveCount(1);
  await expect(divider).toHaveAttribute('aria-hidden', 'true');
  await expect(divider.locator('mat-divider.mat-divider-vertical')).toHaveCount(1);
  await expect(divider).toHaveCSS('margin-left', '0px');
  await expect(buttons.nth(0).locator('xpath=following-sibling::*[1]')).toHaveClass(/lux-menu-extended-divider/);
  await expect(divider.locator('xpath=following-sibling::*[1]')).toContainText('FAQ');

  await screenshotSoft(page, menu, 'menu-divider-extended.png');

  await menu.locator('.lux-menu-trigger-default button').click();
  const panel = page.locator('.lux-menu-panel:not(.lux-menu-section-panel)');
  const panelDivider = panel.locator('mat-divider.lux-menu-item-divider');
  await expect(panelDivider).toHaveCount(1);
  await expect(panel.getByRole('menuitem', { name: 'Downloads' }).locator('xpath=following-sibling::*[1]')).toHaveClass(
    /lux-menu-item-divider/
  );
});

test('menu-divider/panel', async ({ page }) => {
  await openExample(page, 'menu');
  await FormExamplePage.forPage(page).options.setText('luxMaximumExtended', '0');

  const menu = page.locator('example-base-content lux-menu').first();
  await expect(menu.locator('.lux-menu-extended-divider')).toHaveCount(0);
  await menu.locator('.lux-menu-trigger-default button').click();

  const panel = page.locator('.lux-menu-panel:not(.lux-menu-section-panel)');
  const divider = panel.locator('mat-divider.lux-menu-item-divider');
  await expect(divider).toHaveCount(2);
  await expect(divider.nth(0)).toHaveAttribute('aria-hidden', 'true');
  await expect(divider.nth(1)).toHaveAttribute('aria-hidden', 'true');
  await expect(panel.getByRole('menuitem', { name: 'Registrierung' }).locator('xpath=following-sibling::*[1]')).toHaveClass(
    /lux-menu-item-divider/
  );
  await expect(divider.nth(0).locator('xpath=following-sibling::*[1]')).toContainText('FAQ');
  await expect(panel.getByRole('menuitem', { name: 'Downloads' }).locator('xpath=following-sibling::*[1]')).toHaveClass(
    /lux-menu-item-divider/
  );
  await expect(divider.nth(1).locator('xpath=following-sibling::*[1]')).toContainText('Extralanges Beispiellabel');

  await screenshotSoft(page, panel, 'menu-divider-panel.png');
});

test('menu-divider/zwischen-extended-und-panel', async ({ page }) => {
  await openExample(page, 'menu');
  await FormExamplePage.forPage(page).options.setText('luxMaximumExtended', '1');

  const menu = page.locator('example-base-content lux-menu').first();
  await expect(menu.locator('.lux-menu-extended > lux-button.lux-menu-item')).toHaveCount(1);
  await expect(menu.locator('.lux-menu-extended-divider')).toHaveCount(0);
  await menu.locator('.lux-menu-trigger-default button').click();
  const panel = page.locator('.lux-menu-panel:not(.lux-menu-section-panel)');
  await expect(panel.locator('mat-divider.lux-menu-item-divider')).toHaveCount(1);
  await expect(panel.getByRole('menuitem', { name: 'Downloads' }).locator('xpath=following-sibling::*[1]')).toHaveClass(
    /lux-menu-item-divider/
  );
});
