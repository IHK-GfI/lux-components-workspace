import { expect, Locator, test } from '@playwright/test';
import { ExampleOptions, FormExamplePage } from '../form/support/form-example';
import { openExample, screenshotSoft } from './vrt-helper';

/**
 * Zustände der konfigurierbaren Testkarte auf der Card-Beispielseite.
 * Aufgenommen wird nur die erste Karte; der Standardzustand ist über examples.spec.ts abgedeckt.
 */
const STATES: Record<string, (options: ExampleOptions, card: Locator) => Promise<void>> = {
  'custom-header': (options) => options.setSwitch('luxCustomHeader anzeigen'),
  'titel-abgekuerzt': (options) => options.setSwitch('luxTitleLineBreak', false),
  'actions-links': (options) => options.select('luxAlign (Buttonausrichtung)', 'Links'),
  'ohne-content': (options) => options.setSwitch('lux-card-content ausblenden'),
  'ohne-actions': (options) => options.setSwitch('luxCardActions anzeigen', false),
  // luxDisabled greift nur ohne Card-Actions.
  disabled: async (options) => {
    await options.setSwitch('luxCardActions anzeigen', false);
    await options.setSwitch('luxDisabled');
  },
  ueberbreit: async (options, card) => {
    await options.setSwitch('Überbreiten Inhalt anzeigen');
    await expect(card.getByRole('button', { name: 'Fokussierbar am rechten Rand' })).toBeAttached();
  },
  'ueberbreit-scroll': async (options) => {
    await options.setSwitch('Überbreiten Inhalt anzeigen');
    await options.setSwitch('lux-card-scroll-content');
  }
};

function firstCard(example: FormExamplePage) {
  return example.page.locator('example-base-content lux-card').first();
}

for (const [state, apply] of Object.entries(STATES)) {
  test(`card-states/${state}`, async ({ page }) => {
    await openExample(page, 'card');
    const example = FormExamplePage.forPage(page);
    await apply(example.options, firstCard(example));

    await screenshotSoft(page, firstCard(example), `card-${state}.png`);
  });
}

test('card-states/erweiterbar', async ({ page }) => {
  await openExample(page, 'card');
  const example = FormExamplePage.forPage(page);
  const card = firstCard(example);
  await example.options.setSwitch('luxCardContentExpanded aktivieren');

  const open = card.getByRole('button', { name: 'Mehr Inhalt Anzeigen' });
  await expect(open).toBeVisible();
  await screenshotSoft(page, card, 'card-erweiterbar-zu.png');

  await open.click();
  await expect(card.getByRole('heading', { name: 'H6 - Lorem ipsum' })).toBeVisible();
  await expect(card.getByRole('button', { name: 'Weniger Inhalt Anzeigen' })).toBeVisible();
  await screenshotSoft(page, card, 'card-erweiterbar-auf.png');
});
