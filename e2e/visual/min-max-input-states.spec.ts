import { expect, Locator, Page, test } from '@playwright/test';
import { FormExamplePage } from '../form/support/form-example';
import { openExample, screenshotSoft } from './vrt-helper';

/**
 * Zustände von lux-min-max-input mit Meldung. Der Seiten-Screenshot in examples.spec.ts
 * zeigt nur den Ausgangszustand ohne Meldung.
 */

/** Die Beispielseite hat drei Gruppen: Zahl, Zeitraum (Datum) und Reactive Form. */
function group(page: Page, index: number) {
  return page.locator('example-base-content lux-min-max-input').nth(index);
}

/** Füllt ein Feld der Gruppe und verlässt es, erst dann prüft die Komponente. */
async function leaveWith(group: Locator, label: string, value: string) {
  const field = group.getByLabel(label, { exact: true });
  await field.fill(value);
  await field.blur();
}

test('min-max-input-states/bereichsmeldung', async ({ page }) => {
  await openExample(page, 'min-max-input');
  const numbers = group(page, 0);

  await leaveWith(numbers, 'Von', '200');
  await leaveWith(numbers, 'Bis', '100');

  await expect(numbers.getByRole('status')).toHaveText('Bis darf nicht kleiner als 200 sein.');
  await expect(numbers.getByLabel('Bis', { exact: true })).toHaveAttribute('aria-invalid', 'true');
  await expect(numbers.getByLabel('Von', { exact: true })).toHaveAttribute('aria-invalid', 'false');
  await screenshotSoft(page, numbers, 'min-max-input-bereichsmeldung.png');
});

test('min-max-input-states/grenzmeldung', async ({ page }) => {
  await openExample(page, 'min-max-input');
  const numbers = group(page, 0);

  // Die Demo setzt luxBounds.min = 0.
  await leaveWith(numbers, 'Von', '-5');

  await expect(numbers.getByRole('status')).toHaveText('Von: Der Wert muss mindestens 0 sein.');
  await screenshotSoft(page, numbers, 'min-max-input-grenzmeldung.png');
});

test('min-max-input-states/datum', async ({ page }) => {
  await openExample(page, 'min-max-input');
  const dates = group(page, 1);

  await leaveWith(dates, 'Von', '10.05.2026');
  await leaveWith(dates, 'Bis', '01.05.2026');

  await expect(dates.getByRole('status')).toHaveText('Bis darf nicht kleiner als 10.05.26 sein.');
  await screenshotSoft(page, dates, 'min-max-input-datum.png');
});

test('min-max-input-states/disabled', async ({ page }) => {
  await openExample(page, 'min-max-input');
  const card = page.locator('lux-card.example-base-container');

  await FormExamplePage.forPage(page).options.setSwitch('luxDisabled');

  await expect(card.getByLabel('Von', { exact: true }).first()).toBeDisabled();
  await screenshotSoft(page, card, 'min-max-input-disabled.png');
});
