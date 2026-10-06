import { expect, test } from '@playwright/test';
import { formControl } from './support/form-controls';
import { EXAMPLE_IN_FORM, EXAMPLE_WITHOUT_FORM, FormExamplePage } from './support/form-example';

/** Bedienung per Tastatur für checkbox-ac und toggle-ac. */
for (const spec of [formControl('checkbox-ac'), formControl('toggle-ac')]) {
  for (const heading of [EXAMPLE_WITHOUT_FORM, EXAMPLE_IN_FORM]) {
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
