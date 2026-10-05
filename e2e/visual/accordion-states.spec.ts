import { expect, Locator, test } from '@playwright/test';
import { ExampleOptions, FormExamplePage } from '../form/support/form-example';
import { openExample, screenshotSoft } from './vrt-helper';

/**
 * Auf-/Zuklappen und Konfigurationen von lux-accordion und lux-accordion-aria.
 * Beide Beispielseiten bieten dieselben Optionen; die Aria-Variante zusätzlich Custom-Header.
 * Jeweils 4 Panels sind im Ausgangszustand alle aufgeklappt.
 */
const ACCORDIONS = [
  { id: 'accordion', tag: 'lux-accordion' },
  { id: 'accordion-aria', tag: 'lux-accordion-aria' }
] as const;

/** Header-Button eines Panels; \b grenzt "Panel #1" von z. B. "Panel #10" ab. */
function header(accordion: Locator, nr: number) {
  return accordion.getByRole('button', { name: new RegExp(`^Panel #${nr}\\b`) });
}

async function expectExpanded(accordion: Locator, expanded: number[]) {
  for (const nr of [1, 2, 3, 4]) {
    await expect(header(accordion, nr)).toHaveAttribute('aria-expanded', String(expanded.includes(nr)));
  }
}

type StateFn = (options: ExampleOptions, accordion: Locator) => Promise<void>;

const COMMON_STATES: Record<string, StateFn> = {
  'alle-zu': async (options, accordion) => {
    await options.setSwitch('Alle aufklappen', false);
    await expectExpanded(accordion, []);
  },
  'panel-2-auf': async (options, accordion) => {
    await options.setSwitch('Alle aufklappen', false);
    await header(accordion, 2).click();
    await expectExpanded(accordion, [2]);
  },
  // Ohne luxMulti schließt das Öffnen eines Panels das zuvor geöffnete.
  einzeln: async (options, accordion) => {
    await options.setSwitch('luxMulti', false);
    await header(accordion, 1).click();
    await expectExpanded(accordion, [1]);
    await header(accordion, 3).click();
    await expectExpanded(accordion, [3]);
  },
  // luxMode klappt die Panels kurz zu und per setTimeout wieder auf.
  flat: async (options, accordion) => {
    await options.radio('flat');
    await expectExpanded(accordion, [1, 2, 3, 4]);
  },
  'toggle-vorne': (options) => options.radio('before'),
  disabled: (options) => options.setSwitch('luxDisabled'),
  'ohne-toggle': (options) => options.setSwitch('luxHideToggle'),
  'lange-labels': (options) => options.setSwitch('activateLongLabels'),
  ...Object.fromEntries(
    ['accent', 'warn', 'neutral'].map((color): [string, StateFn] => [`farbe-${color}`, (options) => options.select('luxColor', color)])
  )
};

const ARIA_STATES: Record<string, StateFn> = {
  'ohne-custom-header': (options) => options.setSwitch('Alle Custom-Header ausblenden')
};

for (const { id, tag } of ACCORDIONS) {
  const states = id === 'accordion-aria' ? { ...COMMON_STATES, ...ARIA_STATES } : COMMON_STATES;

  for (const [state, apply] of Object.entries(states)) {
    test(`accordion-states/${id}/${state}`, async ({ page }) => {
      await openExample(page, id);
      const accordion = page.locator(`example-base-content ${tag}`);
      await apply(FormExamplePage.forPage(page).options, accordion);

      await screenshotSoft(page, accordion, `${id}-${state}.png`);
    });
  }
}
