import AxeBuilder from '@axe-core/playwright';
import { expect, Locator, Page, test } from '@playwright/test';
import { EXAMPLE_IN_FORM, EXAMPLE_WITHOUT_FORM, FormExamplePage } from './support/form-example';

/**
 * Verhalten und Barrierefreiheit von lux-quill im echten Browser: Tastaturbedienung (Einrücken,
 * keine Tastaturfalle, Toolbar), Formularanbindung und axe-Scans der wichtigsten Zustände.
 * lux-quill ist nicht Teil von FORM_CONTROLS, weil das Label kein <label>-Element ist
 * (contenteditable lässt sich nicht per "for" verknüpfen).
 */
const WCAG_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const ROUTE = 'quill';
const TAG = 'lux-quill';

async function open(page: Page) {
  const example = await FormExamplePage.open(page, ROUTE);
  await expect(page.locator(`${TAG} .ql-editor`).first()).toBeVisible();
  return example;
}

function editorOf(control: Locator) {
  return control.getByRole('textbox', { name: 'Nachricht' });
}

async function expectNoViolations(page: Page) {
  const results = await new AxeBuilder({ page }).include('lux-card.example-base-container').withTags(WCAG_TAGS).analyze();
  expect(results.passes.length).toBeGreaterThan(0);
  const violations = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.map((n) => n.target.join(' ')).join(' | ')}`);
  expect(violations).toEqual([]);
}

test.describe('lux-quill', () => {
  test('quill – Tab rückt ein, Shift+Tab rückt aus', async ({ page }) => {
    const example = await open(page);
    const section = example.section(EXAMPLE_WITHOUT_FORM, TAG);
    const editor = editorOf(section.control);

    await editor.locator('li').nth(1).click();
    await page.keyboard.press('Tab');
    await expect(editor.locator('li.ql-indent-1')).toHaveCount(1);
    await expect(editor).toBeFocused();
    expect(await section.value()).toContain('<ul><li>Punkt eins<ul><li>Punkt zwei</li></ul></li></ul>');

    await page.keyboard.press('Shift+Tab');
    await expect(editor.locator('li.ql-indent-1')).toHaveCount(0);
  });

  test('quill – Escape und Tab verlassen den Editor (keine Tastaturfalle)', async ({ page }) => {
    const example = await open(page);
    const editor = editorOf(example.section(EXAMPLE_WITHOUT_FORM, TAG).control);

    await editor.locator('p').first().click();
    await page.keyboard.press('Escape');
    await page.keyboard.press('Tab');

    await expect(editor).not.toBeFocused();
    await expect(editor.locator('.ql-indent-1')).toHaveCount(0);
  });

  test('quill – Toolbar per Tastatur bedienbar', async ({ page }) => {
    const example = await open(page);
    const control = example.section(EXAMPLE_WITHOUT_FORM, TAG).control;
    const toolbar = control.getByRole('toolbar', { name: 'Formatierung' });

    // Die Toolbar ist ein einziger Tab-Stopp vor dem Editor. Im Editor rückt Shift+Tab aus,
    // erst nach Escape wechselt der Fokus zurück in die Toolbar.
    await editorOf(control).locator('p').first().click();
    await page.keyboard.press('Home');
    await page.keyboard.press('Shift+End');
    await page.keyboard.press('Escape');
    await page.keyboard.press('Shift+Tab');
    await expect(toolbar.getByRole('button', { name: /Textstil/ })).toBeFocused();

    await page.keyboard.press('ArrowRight');
    const bold = toolbar.getByRole('button', { name: 'Fett', exact: true });
    await expect(bold).toBeFocused();
    await page.keyboard.press('Enter');

    await expect(editorOf(control).locator('p strong')).toHaveText('Sehr geehrte Damen und Herren,');
    await expect(bold).toHaveAttribute('aria-pressed', 'true');
  });

  test('quill – Überschrift per Menü und Link per Strg+K', async ({ page }) => {
    const example = await open(page);
    const section = example.section(EXAMPLE_WITHOUT_FORM, TAG);
    const editor = editorOf(section.control);

    await editor.locator('p').first().click();
    await section.control.getByRole('button', { name: /Textstil/ }).click();
    await page.getByRole('menuitemradio', { name: 'Überschrift 2' }).click();
    expect(await section.value()).toContain('<h2 class="lux-quill-heading-2">Sehr geehrte Damen und Herren,</h2>');

    await editor.locator('h2').click();
    await page.keyboard.press('End');
    await page.keyboard.press('Shift+Home');
    await page.keyboard.press('Control+k');
    const dialog = page.getByRole('dialog');
    await dialog.getByRole('textbox', { name: /Adresse \(URL\)/ }).fill('mailto:info@ihk.de');
    await dialog.getByRole('button', { name: 'Übernehmen' }).click();

    await expect(dialog).toHaveCount(0);
    expect(await section.value()).toContain('<a href="mailto:info@ihk.de"');
  });

  test('quill – Reactive Form: Wert, dirty und touched', async ({ page }) => {
    const example = await open(page);
    const section = example.section(EXAMPLE_IN_FORM, TAG);
    const editor = editorOf(section.control);

    expect(await section.formState()).toEqual({ valid: true, dirty: false, touched: false });

    await editor.locator('p').first().click();
    await page.keyboard.press('End');
    await page.keyboard.type(' Test');
    await editor.blur();

    expect(await section.value()).toContain('<p>Sehr geehrte Damen und Herren, Test</p>');
    expect(await section.formState()).toEqual({ valid: true, dirty: true, touched: true });
  });

  test('quill – Pflichtfeld: Fehler nach dem Verlassen, per aria-describedby verknüpft', async ({ page }) => {
    const example = await open(page);
    await example.options.setSwitch('luxRequired', true);
    const section = example.section(EXAMPLE_WITHOUT_FORM, TAG);
    const editor = editorOf(section.control);

    await editor.click();
    await page.keyboard.press('Control+a');
    await page.keyboard.press('Delete');
    await editor.blur();

    await expect(section.error).toBeVisible();
    await expect(editor).toHaveAttribute('aria-invalid', 'true');
    const errorId = await section.error.getAttribute('id');
    await expect(editor).toHaveAttribute('aria-describedby', new RegExp(`\\b${errorId}\\b`));
  });

  test('quill – luxDisabled-Schalter und Enable/Disable des Formulars sind synchron', async ({ page }) => {
    const example = await open(page);
    const standalone = editorOf(example.section(EXAMPLE_WITHOUT_FORM, TAG).control);
    const inForm = editorOf(example.section(EXAMPLE_IN_FORM, TAG).control);
    const toggle = example.options.switch('luxDisabled');

    // Schalter deaktiviert beide Beispiele (auch das FormControl).
    await example.options.setSwitch('luxDisabled', true);
    await expect(standalone).toHaveAttribute('aria-disabled', 'true');
    await expect(inForm).toHaveAttribute('aria-disabled', 'true');
    await expect(example.options.button('Enable')).toBeEnabled();

    // Enable am Formular aktiviert wieder beide und setzt den Schalter zurück.
    await example.options.enableViaForm();
    await expect(toggle).not.toBeChecked();
    await expect(standalone).not.toHaveAttribute('aria-disabled', 'true');
    await expect(inForm).not.toHaveAttribute('aria-disabled', 'true');

    // Disable am Formular wirkt ebenfalls auf Schalter und beide Beispiele.
    await example.options.disableViaForm();
    await expect(toggle).toBeChecked();
    await expect(standalone).toHaveAttribute('aria-disabled', 'true');
    await expect(inForm).toHaveAttribute('aria-disabled', 'true');
  });

  test('quill – Readonly: Inhalt nicht änderbar, aber fokussierbar', async ({ page }) => {
    const example = await open(page);
    await example.options.setSwitch('readonly', true);
    const section = example.section(EXAMPLE_WITHOUT_FORM, TAG);
    const editor = editorOf(section.control);
    const before = await section.value();

    await editor.focus();
    await expect(editor).toBeFocused();
    await page.keyboard.type('x');

    expect(await section.value()).toEqual(before);
    await expect(section.control.getByRole('toolbar')).toHaveCount(0);
  });

  const STATES: { name: string; apply: (example: FormExamplePage, page: Page) => Promise<void> }[] = [
    { name: 'Default', apply: async () => {} },
    {
      name: 'Required mit Fehler',
      apply: async (example, page) => {
        await example.options.setSwitch('luxRequired', true);
        const section = example.section(EXAMPLE_WITHOUT_FORM, TAG);
        await editorOf(section.control).click();
        await page.keyboard.press('Control+a');
        await page.keyboard.press('Delete');
        await editorOf(section.control).blur();
        await expect(section.error).toBeVisible();
      }
    },
    { name: 'Disabled', apply: (example) => example.options.setSwitch('luxDisabled', true) },
    { name: 'Readonly', apply: (example) => example.options.setSwitch('readonly', true) },
    { name: 'Kommentar-Preset', apply: (example) => example.options.select('luxPreset', 'comment (Kommentar)') }
  ];

  for (const state of STATES) {
    test(`quill – axe: ${state.name}`, async ({ page }) => {
      const example = await open(page);
      await state.apply(example, page);
      await expectNoViolations(page);
    });
  }
});
