import { expect, test } from '@playwright/test';
import { formControl } from './support/form-controls';
import { EXAMPLE_WITHOUT_FORM, FormExamplePage } from './support/form-example';
import { luxMessage } from './support/lux-messages';

/**
 * Timepicker-Tests. Sie laufen zusätzlich in den Projekten "form-tz-*" mit anderen
 * Zeitzonen des Browsers. Die Uhrzeit hat keine Zeitzone: Das Beispiel steht auf "14:30"
 * und zeigt in jeder Zeitzone 14:30 an.
 */
const spec = formControl('timepicker');
let example: FormExamplePage;

test.beforeEach(async ({ page }) => {
  example = await FormExamplePage.open(page, spec.route);
  await example.options.useValidatorErrorMessages();
});

test('Startwert wird ohne Zeitzone angezeigt', async () => {
  const section = example.section(EXAMPLE_WITHOUT_FORM, spec.tag);

  await expect(spec.field(section.control)).toHaveValue('14:30');
  await expect.poll(() => section.value()).toBe('14:30');
});

for (const input of ['09:15', '9:15']) {
  test(`Eingabe "${input}"`, async () => {
    const section = example.section(EXAMPLE_WITHOUT_FORM, spec.tag);
    const field = spec.field(section.control);

    await field.fill(input);
    await field.blur();

    await expect.poll(() => section.value()).toBe('09:15');
    await expect(field).toHaveValue('09:15');
    await expect(section.error).toHaveCount(0);
  });
}

test('Ungültige Uhrzeit "25:00"', async () => {
  const section = example.section(EXAMPLE_WITHOUT_FORM, spec.tag);
  const field = spec.field(section.control);

  await field.fill('25:00');
  await field.blur();

  await expect(section.error).toHaveText(luxMessage('timepicker.error_message.invalid'));
});

test('Readonly deaktiviert den Button für die Zeitauswahl', async () => {
  const section = example.section(EXAMPLE_WITHOUT_FORM, spec.tag);
  const toggle = section.control.getByRole('button');
  await expect(toggle).toBeEnabled();

  await example.options.setSwitch('luxReadonly', true);

  await expect(toggle).toBeDisabled();
});
