import { expect, test } from '@playwright/test';
import { FORM_CONTROLS } from './support/form-controls';
import { EXAMPLE_IN_FORM, EXAMPLE_WITHOUT_FORM, ExampleSection, FormExamplePage } from './support/form-example';

/**
 * Komponentenübergreifende Tests für alle Form-Controls,
 * jeweils für das Beispiel ohne und mit Reactive-Form.
 */

/** Objekte (z. B. Lookup-Einträge) werden nur in den angegebenen Feldern verglichen. */
async function expectEnteredValue(section: ExampleSection, expected: unknown) {
  if (expected !== null && typeof expected === 'object') {
    await expect.poll(() => section.value()).toMatchObject(expected);
  } else {
    await expect.poll(() => section.value()).toEqual(expected);
  }
}
for (const spec of FORM_CONTROLS) {
  test.describe(spec.id, () => {
    let example: FormExamplePage;

    test.beforeEach(async ({ page }) => {
      example = await FormExamplePage.open(page, spec.route);
      await example.options.useValidatorErrorMessages();
    });

    for (const heading of [EXAMPLE_WITHOUT_FORM, EXAMPLE_IN_FORM]) {
      if (!spec.noRequiredOption) {
        test(`${heading}: Required-Marker`, async () => {
          const marker = spec.requiredMarker(example.section(heading, spec.tag).control);
          await expect(marker).toHaveCount(0);

          await example.options.setSwitch('luxRequired', true);
          await expect(marker).toBeVisible();

          await example.options.setSwitch('luxRequired', false);
          await expect(marker).toHaveCount(0);
        });

        // Keine Vorbedingung "noch kein Fehler": Das erste Beispiel hat luxAutofocus und ist
        // nach der Bedienung des Konfigurations-Panels bereits "touched".
        test(`${heading}: Required-Fehlermeldung`, async () => {
          const section = example.section(heading, spec.tag);
          await example.options.setSwitch('luxRequired', true);

          await spec.leaveEmpty(section.control);

          await expect(section.error).toHaveText(spec.requiredMessage());
          await expect(section.wrapper).toHaveClass(/lux-form-control-error-authentic/);
        });

        // aria-invalid wird bewusst nicht geprüft: Angular Material setzt es bei leeren
        // Pflichtfeldern absichtlich nicht (aria-required reicht dort aus).
        test(`${heading}: Fehlermeldung per aria-describedby verknüpft`, async () => {
          const reason = spec.knownBugs?.errorNotDescribedby;
          test.fail(!!reason, reason);

          const section = example.section(heading, spec.tag);
          await example.options.setSwitch('luxRequired', true);
          await spec.leaveEmpty(section.control);
          await expect(section.error).toBeVisible();

          const errorId = await section.error.getAttribute('id');
          await expect(spec.field(section.control)).toHaveAttribute('aria-describedby', new RegExp(`(^|\\s)${errorId}(\\s|$)`));
        });
      }

      test(`${heading}: Werte eintragen`, async () => {
        const section = example.section(heading, spec.tag);

        await spec.enterValue(section.control);

        await expectEnteredValue(section, spec.enteredValue);
        if (heading === EXAMPLE_IN_FORM) {
          await expect.poll(async () => (await section.formState()).dirty).toBe(true);
        }
      });

      test(`${heading}: Disabled über luxDisabled`, async () => {
        const section = example.section(heading, spec.tag);
        const field = spec.field(section.control);

        await example.options.setSwitch('luxDisabled', true);
        await expect(field).toBeDisabled();
        await expect(section.wrapper).toHaveClass(/lux-form-control-disabled-authentic/);

        await example.options.setSwitch('luxDisabled', false);
        await expect(field).toBeEnabled();
        await spec.enterValue(section.control);
        await expectEnteredValue(section, spec.enteredValue);
      });

      test(`${heading}: Readonly`, async () => {
        const reason = spec.knownBugs?.readonlyChangeable;
        test.fail(!!reason, reason);

        const section = example.section(heading, spec.tag);
        const before = await section.value();

        await example.options.setSwitch('luxReadonly', true);
        await expect(section.wrapper).toHaveClass(/lux-form-control-readonly-authentic/);
        await spec.tryChangeAsUser(section.control);

        // Kurz warten, damit eine (fälschliche) Änderung Zeit hätte, in der Wertanzeige anzukommen.
        await section.control.page().waitForTimeout(300);
        expect(await section.value()).toEqual(before);
      });

      test(`${heading}: Accessible Name`, async () => {
        const section = example.section(heading, spec.tag);
        await expect(section.root.getByRole(spec.role, { name: spec.label, exact: true })).toBeVisible();

        // Auch ohne sichtbare Labels muss das Control seinen Namen behalten (#267).
        if ((await example.options.switch('luxNoLabels').count()) === 0) {
          test.info().annotations.push({ type: 'Hinweis', description: 'Beispielseite hat keinen Schalter luxNoLabels' });
          return;
        }
        await example.options.setSwitch('luxNoLabels', true);
        await expect(section.root.getByRole(spec.role, { name: spec.label, exact: true })).toBeAttached();
      });
    }

    test(`${EXAMPLE_IN_FORM}: Disabled über FormControl.disable()`, async () => {
      const section = example.section(EXAMPLE_IN_FORM, spec.tag);
      const field = spec.field(section.control);

      await example.options.disableViaForm();
      await expect(field).toBeDisabled();
      // [(luxDisabled)] ist zweiseitig gebunden – der Schalter muss nachziehen.
      await expect(example.options.switch('luxDisabled')).toBeChecked();

      await example.options.enableViaForm();
      await expect(field).toBeEnabled();
      await expect(example.options.switch('luxDisabled')).not.toBeChecked();
    });
  });
}
