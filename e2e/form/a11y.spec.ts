import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { FORM_CONTROLS, FormControlSpec } from './support/form-controls';
import { EXAMPLE_IN_FORM, EXAMPLE_WITHOUT_FORM, FormExamplePage } from './support/form-example';

/**
 * axe-Scan der Beispielkarte je Form-Control in den wichtigsten Zuständen.
 * Geprüft wird gegen WCAG 2.2 A/AA.
 */
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const STATES: { name: string; apply: (example: FormExamplePage, spec: FormControlSpec) => Promise<void> }[] = [
  { name: 'Default', apply: async () => {} },
  {
    name: 'Required mit Fehler',
    apply: async (example, spec) => {
      await example.options.setSwitch('luxRequired', true);
      for (const heading of [EXAMPLE_WITHOUT_FORM, EXAMPLE_IN_FORM]) {
        const section = example.section(heading, spec.tag);
        await spec.leaveEmpty(section.control);
        await expect(section.error).toBeVisible();
      }
    }
  },
  { name: 'Disabled', apply: (example) => example.options.setSwitch('luxDisabled', true) },
  { name: 'Readonly', apply: (example) => example.options.setSwitch('luxReadonly', true) }
];

for (const spec of FORM_CONTROLS) {
  // Ohne Schalter luxRequired lässt sich der Fehlerzustand nicht herstellen.
  for (const state of STATES.filter((s) => !(spec.noRequiredOption && s.name === 'Required mit Fehler'))) {
    test(`${spec.id} – ${state.name}`, async ({ page }) => {
      const example = await FormExamplePage.open(page, spec.route);
      await example.options.useValidatorErrorMessages();
      await state.apply(example, spec);
      // Nicht scannen, solange ein Auswahl-Panel (z. B. des Autocompletes) noch schließt.
      await expect(page.getByRole('listbox')).toHaveCount(0);

      const results = await new AxeBuilder({ page }).include('lux-card.example-base-container').withTags(WCAG_TAGS).analyze();
      // Schutz vor einem leeren Scan (z. B. wenn der Selektor nichts trifft).
      expect(results.passes.length).toBeGreaterThan(0);

      const violations = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`);
      expect(violations).toEqual([]);
    });
  }
}
