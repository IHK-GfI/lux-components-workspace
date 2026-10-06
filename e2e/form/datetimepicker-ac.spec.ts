import { expect, test } from '@playwright/test';
import { formControl } from './support/form-controls';
import { EXAMPLE_WITHOUT_FORM, FormExamplePage } from './support/form-example';
import { luxMessage } from './support/lux-messages';

/**
 * Datetimepicker-Tests. Sie laufen zusätzlich in den Projekten "form-tz-*" mit anderen
 * Zeitzonen des Browsers. Der Datetimepicker arbeitet mit UTC: Eingabe und Anzeige
 * entsprechen in jeder Zeitzone der UTC-Uhrzeit des Werts.
 */
const spec = formControl('datetimepicker-ac');
let example: FormExamplePage;

test.beforeEach(async ({ page }) => {
  example = await FormExamplePage.open(page, spec.route);
  await example.options.useValidatorErrorMessages();
});

test('Eingabe "01.02.2026, 13:45"', async () => {
  const section = example.section(EXAMPLE_WITHOUT_FORM, spec.tag);
  const field = spec.field(section.control);

  await field.fill('01.02.2026, 13:45');
  await field.blur();

  await expect.poll(() => section.value()).toBe('2026-02-01T13:45:00.000Z');
  await expect(field).toHaveValue('01.02.2026, 13:45');
  await expect(section.error).toHaveCount(0);
});

test('Ungültige Eingabe', async () => {
  const section = example.section(EXAMPLE_WITHOUT_FORM, spec.tag);
  const field = spec.field(section.control);

  await field.fill('abc');
  await field.blur();

  await expect(section.error).toHaveText(luxMessage('datetimepicker.error_message.invalid'));
  await expect.poll(() => section.value()).toBeFalsy();
});

test('Readonly deaktiviert den Kalender-Button', async () => {
  const section = example.section(EXAMPLE_WITHOUT_FORM, spec.tag);
  const toggle = section.control.getByRole('button');
  await expect(toggle).toBeEnabled();

  await example.options.setSwitch('luxReadonly', true);

  await expect(toggle).toBeDisabled();
});
