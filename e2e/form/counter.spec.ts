import { expect, test } from '@playwright/test';
import { formControl } from './support/form-controls';
import { EXAMPLE_WITHOUT_FORM, FormExamplePage } from './support/form-example';

/** Zeichenzähler und Längenbegrenzung über luxMaxLength (input-ac, textarea-ac). */
for (const spec of [formControl('input-ac'), formControl('textarea-ac')]) {
  test(`${spec.id}: luxMaxLength begrenzt die Eingabe und zeigt den Zähler im Fokus`, async ({ page }) => {
    const example = await FormExamplePage.open(page, spec.route);
    await example.options.setText('luxMaxLength', '10');

    const section = example.section(EXAMPLE_WITHOUT_FORM, spec.tag);
    const field = spec.field(section.control);
    const counter = section.control.locator('.lux-form-control-character-counter-authentic');

    await field.focus();
    await expect(counter).toHaveText('0/10');
    await page.keyboard.type('abc');
    await expect(counter).toHaveText('3/10');

    await page.keyboard.type('defghijkl');
    await expect(field).toHaveValue('abcdefghij');
    await expect(counter).toHaveText('10/10');

    await field.blur();
    await expect(counter).toHaveText('');
  });
}
