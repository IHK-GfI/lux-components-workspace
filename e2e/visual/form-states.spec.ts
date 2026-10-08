import { expect, Locator, Page, test } from '@playwright/test';
import { fitViewportToContent, openBaselineTab } from './vrt-helper';

/**
 * Zustandsmatrix der Form-Controls auf der Baseline-Seite:
 * Fehler, Disabled, Readonly und Dense – inklusive der Varianten ohne Labels.
 */

async function switchOn(scope: Locator, name: string) {
  const toggle = scope.getByRole('switch', { name, exact: true });
  await toggle.click();
  await expect(toggle).toBeChecked();
}

/** Klappt in der Card "Formularkomponenten" den Bereich mit den Varianten ohne Labels auf. */
async function expandLabelVariants(content: Locator) {
  const card = content.locator('lux-card.baseline');
  await card.getByRole('button', { name: 'Mehr', exact: true }).click();
  await expect(card.getByRole('button', { name: 'Weniger', exact: true })).toBeVisible();
  await expect(content.getByRole('heading', { name: 'Komponenten ohne Top- und Bottom-Label' })).toBeVisible();
  await card.locator('.lux-card-content-expanded').evaluate(async (element) => {
    await Promise.all(element.getAnimations().map((animation) => animation.finished));
  });
}

async function screenshotContent(page: Page, name: string) {
  await page.waitForLoadState('networkidle');
  await fitViewportToContent(page);
  await expect(page.locator('lux-app-content')).toHaveScreenshot(name);
}

const BASELINE_STATES = [
  { name: 'default', switches: [] },
  { name: 'fehler', switches: ['Fehler anzeigen'] },
  { name: 'deaktiviert', switches: ['Deaktivieren'] },
  { name: 'readonly', switches: ['Readonly'] },
  { name: 'dense', switches: ['Denseformat anzeigen'] },
  { name: 'dense-fehler', switches: ['Denseformat anzeigen', 'Fehler anzeigen'] }
];

for (const state of BASELINE_STATES) {
  test(`form-states/baseline/${state.name}`, async ({ page }) => {
    const content = await openBaselineTab(page, 'Baseline');
    await expandLabelVariants(content);
    for (const name of state.switches) {
      await switchOn(content.locator('lux-card.baseline-options'), name);
    }

    await screenshotContent(page, `baseline-${state.name}.png`);
  });
}

const CARD_STATES = [
  { name: 'disabled', radio: 'Disabled' },
  { name: 'readonly', radio: 'Readonly' },
  { name: 'fehler', checkbox: 'Fehler-Status anzeigen' }
];

for (const state of CARD_STATES) {
  test(`form-states/card/${state.name}`, async ({ page }) => {
    const content = await openBaselineTab(page, 'Card');
    if (state.radio) {
      const radio = content.getByRole('radio', { name: state.radio, exact: true });
      await radio.click();
      await expect(radio).toBeChecked();
    }
    if (state.checkbox) {
      const checkbox = content.getByRole('checkbox', { name: state.checkbox, exact: true });
      await checkbox.click();
      await expect(checkbox).toBeChecked();
    }

    await screenshotContent(page, `card-${state.name}.png`);
  });
}

test('form-states/baseline/fokus', async ({ page }) => {
  const content = await openBaselineTab(page, 'Baseline');
  await content.getByRole('textbox', { name: 'Textarea', exact: true }).first().focus();

  await expect(content.locator('lux-card.baseline')).toHaveScreenshot('baseline-fokus.png');
});
