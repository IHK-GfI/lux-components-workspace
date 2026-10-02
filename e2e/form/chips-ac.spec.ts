import { expect, Locator, test } from '@playwright/test';
import { wrapperRequiredMarker } from './support/form-controls';
import { FormExamplePage } from './support/form-example';

/**
 * lux-chips-ac. Die Beispielseite hat keine Wertanzeige – geprüft werden die sichtbaren Chips.
 * Reihenfolge der Chips-Controls auf der Seite:
 *   0 = ohne Reactive-Form, ohne Group
 *   1 = ohne Reactive-Form, mit Group
 *   2 = in Reactive-Form (mit Group)
 */
let example: FormExamplePage;
let chips: Locator;
let chipsInForm: Locator;

test.beforeEach(async ({ page }) => {
  example = await FormExamplePage.open(page, 'chips-ac');
  const all = page.locator('example-base-content lux-chips-ac');
  chips = all.nth(0);
  chipsInForm = all.nth(2);
});

const chip = (control: Locator, label: string) => control.getByRole('row', { name: `${label} entfernen` });
const input = (control: Locator) => control.getByRole('combobox');

test('Chip per Eingabe hinzufügen', async ({ page }) => {
  // fill() setzt den Wert ohne Tastaturereignisse – die Chips reagieren auf echtes Tippen.
  await input(chips).pressSequentially('Mein Chip');
  await page.keyboard.press('Enter');

  await expect(chip(chips, 'Mein Chip')).toBeVisible();
  await expect(input(chips)).toHaveValue('');
});

test('Chip aus den Vorschlägen hinzufügen', async ({ page }) => {
  await input(chips).click();
  await page.getByRole('option', { name: 'Neuer Chip #1', exact: true }).click();

  await expect(chip(chips, 'Neuer Chip #1')).toBeVisible();

  // Bereits gewählte Vorschläge werden nicht erneut angeboten.
  await page.keyboard.press('Escape');
  await input(chips).click();
  await expect(page.getByRole('option', { name: 'Neuer Chip #2', exact: true })).toBeVisible();
  await expect(page.getByRole('option', { name: 'Neuer Chip #1', exact: true })).toHaveCount(0);
});

test('Chip entfernen', async () => {
  await chip(chips, 'Chip #1').getByRole('button', { name: 'entfernen' }).click();

  await expect(chip(chips, 'Chip #1')).toHaveCount(0);
  await expect(chip(chips, 'Chip #2')).toBeVisible();
});

test('luxStrict lässt nur Vorschläge zu', async ({ page }) => {
  await example.options.setSwitch('luxStrict', true);

  await input(chips).pressSequentially('Unbekannt');
  await page.keyboard.press('Enter');
  await expect(chip(chips, 'Unbekannt')).toHaveCount(0);

  await input(chips).fill('');
  await input(chips).click();
  await page.getByRole('option', { name: 'Neuer Chip #2', exact: true }).click();
  await expect(chip(chips, 'Neuer Chip #2')).toBeVisible();
});

test('Chip in Reactive-Form hinzufügen', async ({ page }) => {
  await input(chipsInForm).pressSequentially('Formular-Chip');
  await page.keyboard.press('Enter');

  await expect(chip(chipsInForm, 'Formular-Chip')).toBeVisible();
});

test('luxRequired zeigt das Sternchen', async () => {
  const marker = wrapperRequiredMarker(chips);
  await expect(marker).toHaveCount(0);

  await example.options.setSwitch('luxRequired', true);

  await expect(marker).toBeVisible();
});

test('luxDisabled sperrt Eingabe und Entfernen', async () => {
  await example.options.setSwitch('luxDisabled', true);

  await expect(input(chips)).toBeDisabled();
  await expect(chip(chips, 'Chip #1').getByRole('button', { name: 'entfernen' })).toBeDisabled();

  await example.options.setSwitch('luxDisabled', false);
  await expect(input(chips)).toBeEnabled();
});
