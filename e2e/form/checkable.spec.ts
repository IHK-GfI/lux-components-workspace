import { expect, test } from '@playwright/test';
import { formControl } from './support/form-controls';
import { EXAMPLES, FormExamplePage } from './support/form-example';

/** Bedienung per Tastatur für checkbox und toggle. */
for (const spec of [formControl('checkbox'), formControl('toggle')]) {
  for (const heading of EXAMPLES) {
    test(`${spec.id} – ${heading}: Leertaste schaltet um`, async ({ page }) => {
      const example = await FormExamplePage.open(page, spec.route);
      const section = example.section(heading, spec.tag);

      await spec.field(section.control).focus();
      await page.keyboard.press('Space');
      await expect.poll(() => section.value()).toBe(true);

      await page.keyboard.press('Space');
      await expect.poll(() => section.value()).toBe(false);
    });
  }
}
