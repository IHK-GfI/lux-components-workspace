import { expect, Page, test } from '@playwright/test';
import { clickAtCenter, formControl, selectOption } from './support/form-controls';
import { EXAMPLE_IN_FORM, EXAMPLE_WITHOUT_FORM, FormExamplePage } from './support/form-example';

const spec = formControl('select-ac');
const EXAMPLE_MULTISELECT = 'Beispiel mit Multiselect (ohne Reactive-Form)';
const FIRST_OPTION =
  'Argentinien, Bolivien, Chile, Costa Rica, Dominikanische Republik, Ecuador, El Salvador, Guatemala, Honduras, Kolumbien, Kuba, Mexiko';
let example: FormExamplePage;

test.beforeEach(async ({ page }) => {
  example = await FormExamplePage.open(page, spec.route);
  await example.options.useValidatorErrorMessages();
});

const optionLabels = (page: Page) => page.getByRole('listbox').getByRole('option');

test('Auswahl wird im Select angezeigt', async () => {
  const section = example.section(EXAMPLE_WITHOUT_FORM, spec.tag);

  await selectOption(section.control, 'Albanien');

  await expect(spec.field(section.control)).toContainText('Albanien');
  await expect.poll(() => section.value()).toEqual({ label: 'Albanien', value: 2 });
});

for (const keepOptionOrder of [false, true]) {
  test(`Mehrfachauswahl: Reihenfolge der Optionen mit luxKeepOptionOrder=${keepOptionOrder} (#259)`, async ({ page }) => {
    await example.options.setSwitch('luxKeepOptionOrder', keepOptionOrder);
    const section = example.section(EXAMPLE_MULTISELECT, spec.tag);

    await selectOption(section.control, 'Deutschland');
    await page.keyboard.press('Escape');
    await expect(page.getByRole('listbox')).toBeHidden();
    await expect.poll(() => section.value()).toEqual([{ label: 'Deutschland', value: 8 }]);

    await spec.field(section.control).click();
    // Ohne Flag werden ausgewählte Optionen nach oben sortiert, mit Flag bleibt die Reihenfolge.
    await expect(optionLabels(page).first()).toHaveText(keepOptionOrder ? FIRST_OPTION : 'Deutschland');
  });
}

test('Filter schränkt die Optionen ein', async ({ page }) => {
  const section = example.section(EXAMPLE_WITHOUT_FORM, spec.tag);

  await spec.field(section.control).click();
  await page.getByRole('listbox').getByPlaceholder('Filter').fill('Schw');

  await expect(optionLabels(page)).toHaveText(['Schweden', 'Schweiz']);
});

test('Readonly öffnet kein Panel', async ({ page }) => {
  const section = example.section(EXAMPLE_WITHOUT_FORM, spec.tag);
  await example.options.setSwitch('luxReadonly', true);

  // Echter Mausklick: Playwrights click() würde auf ein klickbares Element warten.
  await clickAtCenter(spec.field(section.control));

  await expect(page.getByRole('listbox')).toBeHidden();
});

test('Aktion "Fehler anzeigen" zeigt die Pflichtfeld-Meldungen', async () => {
  await example.options.button('Fehler anzeigen').click();

  for (const heading of [EXAMPLE_WITHOUT_FORM, EXAMPLE_MULTISELECT, EXAMPLE_IN_FORM]) {
    await expect(example.section(heading, spec.tag).error).toHaveText(spec.requiredMessage());
  }
});

test('Aktion "Werte resetten" leert die Auswahl', async () => {
  const section = example.section(EXAMPLE_WITHOUT_FORM, spec.tag);
  await selectOption(section.control, 'Albanien');
  await expect.poll(() => section.value()).toEqual({ label: 'Albanien', value: 2 });

  await example.options.button('Werte resetten').click();

  await expect.poll(() => section.value()).toBeFalsy();
  await expect(spec.field(section.control)).not.toContainText('Albanien');
});
