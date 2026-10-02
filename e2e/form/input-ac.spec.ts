import { expect, test } from '@playwright/test';
import { formControl } from './support/form-controls';
import { EXAMPLE_IN_FORM, EXAMPLE_WITHOUT_FORM, FormExamplePage } from './support/form-example';
import { luxMessage } from './support/lux-messages';

const spec = formControl('input-ac');
let example: FormExamplePage;

test.beforeEach(async ({ page }) => {
  example = await FormExamplePage.open(page, spec.route);
  await example.options.useValidatorErrorMessages();
});

test('luxRequired und Validatoren am FormControl greifen gemeinsam (#240)', async () => {
  const section = example.section(EXAMPLE_IN_FORM, spec.tag);
  const field = spec.field(section.control);
  await example.options.setSwitch('luxRequired', true);
  await example.options.setSwitch('Zusatz-Validatoren auf FormControl setzen (minLength(3), maxLength(10))', true);

  await field.fill('ab');
  await field.blur();
  await expect(section.error).toHaveText(luxMessage('util.error_message.minlength', { minlength: 3 }));

  await field.fill('abcdefghijk');
  await field.blur();
  await expect(section.error).toHaveText(luxMessage('util.error_message.maxlength', { maxlength: 10 }));

  await field.fill('');
  await field.blur();
  await expect(section.error).toHaveText(spec.requiredMessage());

  await field.fill('abcd');
  await field.blur();
  await expect(section.error).toHaveCount(0);
  await expect.poll(async () => (await section.formState()).valid).toBe(true);
});

test('luxClearable leert die Eingabe', async () => {
  const section = example.section(EXAMPLE_WITHOUT_FORM, spec.tag);
  const field = spec.field(section.control);
  await example.options.setSwitch('luxClearable', true);

  await field.fill('abc');
  await expect.poll(() => section.value()).toBe('abc');

  await section.control.getByRole('button', { name: luxMessage('input.clear.btn.arialabel') }).click();

  await expect(field).toHaveValue('');
  await expect.poll(() => section.value()).toBeFalsy();
});
