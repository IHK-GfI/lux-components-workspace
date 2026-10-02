import { expect, test } from '@playwright/test';
import { selectOption } from './support/form-controls';
import { FormExamplePage } from './support/form-example';

/**
 * lux-lookup-label zeigt die Bezeichnung eines Schlüsseltabelleneintrags an.
 * Die Demo nutzt Tabelle 1002 aus dem Mock-Lookup-Service (mock-result.ts).
 */
let example: FormExamplePage;

test.beforeEach(async ({ page }) => {
  example = await FormExamplePage.open(page, 'lookup-label');
});

test('Kurzbezeichnung des voreingestellten Schlüssels', async ({ page }) => {
  await expect(page.locator('lux-lookup-label')).toHaveText('Deutschland');
});

test('Anderer Schlüssel lädt die passende Bezeichnung', async ({ page }) => {
  await example.options.setText('luxTableKey', '3');

  await expect(page.locator('lux-lookup-label')).toHaveText('Niederlande');
});

test('luxBezeichnung schaltet zwischen Kurz- und Langtext um', async ({ page }) => {
  const label = page.locator('lux-lookup-label');
  await example.options.setText('luxTableKey', '2');
  await expect(label).toHaveText('Bellux');

  await selectOption(example.options.card.locator('lux-select-ac'), 'lang');

  await expect(label).toHaveText('Belgien und Luxemburg');
});
