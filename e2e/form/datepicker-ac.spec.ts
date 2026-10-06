import { expect, test } from '@playwright/test';
import { formControl } from './support/form-controls';
import { EXAMPLE_IN_FORM, EXAMPLE_WITHOUT_FORM, FormExamplePage } from './support/form-example';
import { luxMessage } from './support/lux-messages';

/**
 * Datepicker-Tests. Sie laufen zusätzlich in den Projekten "form-tz-*" mit anderen
 * Zeitzonen des Browsers – der ISO-Wert und die Anzeige müssen überall derselbe Kalendertag bleiben.
 */
const spec = formControl('datepicker-ac');

let example: FormExamplePage;

test.beforeEach(async ({ page }) => {
  example = await FormExamplePage.open(page, spec.route);
  await example.options.useValidatorErrorMessages();
});

for (const input of ['1.2.2026', '01.02.2026', '01022026']) {
  test(`Eingabeformat "${input}"`, async () => {
    const section = example.section(EXAMPLE_WITHOUT_FORM, spec.tag);
    const field = spec.field(section.control);

    await field.fill(input);
    await field.blur();

    await expect.poll(() => section.value()).toBe('2026-02-01T00:00:00.000Z');
    await expect(field).toHaveValue('01.02.2026');
    await expect(section.error).toHaveCount(0);
  });
}

test('Auswahl des Monatsersten im Kalender (#196)', async ({ page }) => {
  // Der Kalender öffnet im Monat des Startwerts – der erwartete Monatserste wird daraus abgeleitet,
  // damit der Test nicht vom konkreten Beispieldatum abhängt.
  const section = example.section(EXAMPLE_IN_FORM, spec.tag);
  const [year, month] = String(await section.value()).split('-');

  await section.control.locator('mat-datepicker-toggle button').click();
  const calendar = page.locator('mat-calendar');
  await expect(calendar).toBeVisible();
  await calendar
    .locator('.mat-calendar-body-cell')
    .filter({ hasText: /^\s*1\s*$/ })
    .first()
    .click();

  await expect(calendar).toBeHidden();
  await expect.poll(() => section.value()).toBe(`${year}-${month}-01T00:00:00.000Z`);
  await expect(spec.field(section.control)).toHaveValue(`01.${month}.${year}`);
});

for (const input of ['abc', '1.2.26']) {
  test(`Ungültige Eingabe "${input}"`, async () => {
    const section = example.section(EXAMPLE_WITHOUT_FORM, spec.tag);
    const field = spec.field(section.control);

    await field.fill(input);
    await field.blur();

    await expect(section.error).toHaveText(luxMessage('datepicker.error_message.invalid'));
    await expect.poll(() => section.value()).toBeNull();
  });
}

test('luxMinDate und luxMaxDate', async () => {
  await example.options.openTab('Erweitert');
  await example.options.setText('luxMinDate', '10.06.2020');
  await example.options.setText('luxMaxDate', '20.06.2020');
  await example.options.openTab('Allgemein');

  const section = example.section(EXAMPLE_WITHOUT_FORM, spec.tag);
  const field = spec.field(section.control);

  await field.fill('01.06.2020');
  await field.blur();
  await expect(section.error).toHaveText(luxMessage('datepicker.error_message.min'));

  await field.fill('25.06.2020');
  await field.blur();
  await expect(section.error).toHaveText(luxMessage('datepicker.error_message.max'));

  await field.fill('15.06.2020');
  await field.blur();
  await expect(section.error).toHaveCount(0);
  await expect.poll(() => section.value()).toBe('2020-06-15T00:00:00.000Z');
});

test('Readonly deaktiviert den Kalender-Button', async () => {
  const section = example.section(EXAMPLE_WITHOUT_FORM, spec.tag);
  const toggle = section.control.locator('mat-datepicker-toggle button');
  await expect(toggle).toBeEnabled();

  await example.options.setSwitch('luxReadonly', true);

  await expect(toggle).toBeDisabled();
});
