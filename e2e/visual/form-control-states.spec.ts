import { expect, Page, test } from '@playwright/test';
import { FORM_CONTROLS, FormControlSpec } from '../form/support/form-controls';
import { EXAMPLE_IN_FORM, EXAMPLE_WITHOUT_FORM, FormExamplePage } from '../form/support/form-example';
import { fitViewportToContent, openStable } from './vrt-helper';

/**
 * Screenshots der Beispielkarte jedes Form-Controls in den Zuständen
 * Fehler, Disabled und Readonly. Die Zustände werden über denselben Treiber
 * wie in den Verhaltenstests (e2e/form) hergestellt.
 */
const STATES: { name: string; apply: (example: FormExamplePage, spec: FormControlSpec) => Promise<void> }[] = [
  {
    name: 'fehler',
    apply: async (example, spec) => {
      await example.options.useValidatorErrorMessages();
      await example.options.setSwitch('luxRequired', true);
      for (const heading of [EXAMPLE_WITHOUT_FORM, EXAMPLE_IN_FORM]) {
        const section = example.section(heading, spec.tag);
        await spec.leaveEmpty(section.control);
        await expect(section.error).toBeVisible();
      }
    }
  },
  { name: 'disabled', apply: (example) => example.options.setSwitch('luxDisabled', true) },
  { name: 'readonly', apply: (example) => example.options.setSwitch('luxReadonly', true) }
];

type StateFn = (example: FormExamplePage, page: Page) => Promise<void>;

/** Zu große Datei in jedes Datei-Control der Seite laden, damit die Fehlermeldung erscheint. */
const fileTooLarge =
  (tag: string): StateFn =>
  async (example, page) => {
    await example.options.setText('luxMaxSizeMB', '1');
    const controls = page.locator(`example-base-content ${tag}`);
    for (let i = 0; i < (await controls.count()); i++) {
      await controls
        .nth(i)
        .locator('input[type="file"]')
        .first()
        .setInputFiles({ name: 'gross.txt', mimeType: 'text/plain', buffer: Buffer.alloc(2 * 1024 * 1024, 'a') });
    }
    await expect(page.getByRole('progressbar')).toHaveCount(0);
  };

const switchOn =
  (name: string): StateFn =>
  (example) =>
    example.options.setSwitch(name, true);

/** Controls, deren Beispielseiten nicht in FORM_CONTROLS passen, mit eigenen Zuständen. */
const OTHER_CONTROLS: { id: string; route: string; states: Record<string, StateFn> }[] = [
  { id: 'chips-ac', route: 'chips-ac', states: { disabled: switchOn('luxDisabled'), required: switchOn('luxRequired') } },
  ...(
    [
      ['file-input-ac', 'lux-file-input-ac'],
      ['file-list', 'lux-file-list'],
      ['file-upload', 'lux-file-upload']
    ] as const
  ).map(([id, tag]) => ({
    id,
    route: id,
    states: { fehler: fileTooLarge(tag), disabled: switchOn('luxDisabled'), readonly: switchOn('luxReadonly') }
  }))
];

async function screenshotExampleCard(page: Page, name: string) {
  // Fokus und Maus aus der Beispielkarte nehmen, damit kein Hover-/Fokuszustand im Bild landet.
  await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  await page.mouse.move(0, 0);
  await page.waitForLoadState('networkidle');
  await fitViewportToContent(page);
  await expect(page.locator('lux-card.example-base-container')).toHaveScreenshot(name);
}

for (const control of OTHER_CONTROLS) {
  for (const [state, apply] of Object.entries(control.states)) {
    test(`form-control-states/${control.id}/${state}`, async ({ page }) => {
      await openStable(page, `/components-overview/example/${control.route}`, page.locator('lux-card.example-base-container'));
      await apply(FormExamplePage.forPage(page), page);

      await screenshotExampleCard(page, `${control.id}-${state}.png`);
    });
  }
}

for (const spec of FORM_CONTROLS) {
  // Ohne Schalter luxRequired lässt sich der Fehlerzustand nicht herstellen.
  for (const state of STATES.filter((s) => !(spec.noRequiredOption && s.name === 'fehler'))) {
    test(`form-control-states/${spec.id}/${state.name}`, async ({ page }) => {
      await openStable(page, `/components-overview/example/${spec.route}`, page.locator('lux-card.example-base-container'));
      await state.apply(FormExamplePage.forPage(page), spec);

      await screenshotExampleCard(page, `${spec.id}-${state.name}.png`);
    });
  }
}
