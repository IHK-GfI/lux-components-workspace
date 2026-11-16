import { expect, Locator, Page } from '@playwright/test';

/**
 * Treiber für die Beispielseiten der Form-Controls (/components-overview/example/*).
 *
 * Die Tests laufen gegen die Demo-App. Alle Selektoren auf deren Aufbau
 * (Beispielbereiche, Konfigurations-Panel, Wertanzeige) liegen deshalb hier,
 * damit Umbauten an der Demo nur an einer Stelle nachgezogen werden müssen.
 */

/** Beispielbereiche der Form-Controls (Testtitel). Die Überschriften auf der Seite stehen in HEADINGS. */
export const EXAMPLE_SIGNAL_FORM = 'Signal Form';
export const EXAMPLE_WITHOUT_FORM = 'Freistehend';
export const EXAMPLE_IN_FORM = 'Reactive-Form';
export const EXAMPLE_DEPRECATED = 'Freistehend (veraltet)';

/** Alle Beispielbereiche, die jede Form-Control-Seite hat. */
export const EXAMPLES = [EXAMPLE_SIGNAL_FORM, EXAMPLE_WITHOUT_FORM, EXAMPLE_IN_FORM, EXAMPLE_DEPRECATED];

/** Beispielbereiche, deren Wertanzeige auch den Formularzustand (Valid, Dirty, Touched) zeigt. */
export const FORM_EXAMPLES = [EXAMPLE_SIGNAL_FORM, EXAMPLE_IN_FORM];

/**
 * Überschriften der Beispielbereiche, z. B. "Signal Form — [formField]".
 * "Freistehend" meint die aktuelle API ([(value)] bzw. [(checked)]),
 * "Freistehend (veraltet)" die frühere ([(luxValue)], [(luxChecked)] bzw. [(luxSelected)]).
 */
const HEADINGS: Record<string, RegExp> = {
  [EXAMPLE_SIGNAL_FORM]: /^Signal Form — \[formField\]$/,
  [EXAMPLE_WITHOUT_FORM]: /^Freistehend — \[\((value|checked)\)\]$/,
  // formControlName: lux-quill bindet als ControlValueAccessor (ohne luxControlBinding).
  [EXAMPLE_IN_FORM]: /^Reactive-Form — (luxControlBinding|formControlName)$/,
  [EXAMPLE_DEPRECATED]: /^Freistehend — \[\((luxValue|luxChecked|luxSelected)\)\]( @deprecated)?$/
};

export class FormExamplePage {
  readonly options: ExampleOptions;

  private constructor(readonly page: Page) {
    this.options = new ExampleOptions(page);
  }

  /** Treiber für eine bereits geöffnete Beispielseite (z. B. nach openStable() in den Screenshot-Tests). */
  static forPage(page: Page) {
    return new FormExamplePage(page);
  }

  static async open(page: Page, route: string) {
    await page.goto(`/components-overview/example/${route}`);
    await expect(page.locator('.example-base-content > router-outlet + *')).toBeVisible();
    await page.waitForLoadState('networkidle');
    return new FormExamplePage(page);
  }

  /**
   * Beispielbereich `heading` (EXAMPLE_* oder eine andere, exakte Überschrift) mit dem Control mit dem Tag `tag`.
   */
  section(heading: string | RegExp, tag: string) {
    return new ExampleSection(this.page, heading, tag);
  }
}

/** Ein Beispielbereich: h3-Überschrift, das Control und die Wertanzeige darunter. */
export class ExampleSection {
  readonly root: Locator;
  readonly control: Locator;

  constructor(page: Page, heading: string | RegExp, tag: string) {
    const name = typeof heading === 'string' && HEADINGS[heading] ? HEADINGS[heading] : heading;
    this.root = page.locator('example-base-content > div').filter({ has: page.getByRole('heading', { name, exact: true }) });
    this.control = this.root.locator(tag).first();
  }

  get wrapper() {
    return this.control.locator('.lux-form-control-wrapper');
  }

  get label() {
    return this.control.locator('label.lux-form-label-authentic');
  }

  get error() {
    return this.control.locator('mat-error');
  }

  get hint() {
    return this.control.locator('mat-hint');
  }

  /** Aktueller Wert aus der Anzeige "Wert:" (example-value, example-form-value bzw. example-signal-form-value). */
  async value(): Promise<unknown> {
    const text = await this.cell('example-value, example-form-value, example-signal-form-value', 'Wert:');
    return parseDisplayedValue(text);
  }

  /** Zustand des Formulars aus example-form-value bzw. example-signal-form-value. */
  async formState() {
    const read = async (label: string) => (await this.cell('example-form-value, example-signal-form-value', label)) === 'true';
    return { valid: await read('Valid:'), dirty: await read('Dirty:'), touched: await read('Touched:') };
  }

  private async cell(host: string, label: string) {
    const labelCell = this.root.locator(host).getByText(label, { exact: true });
    return (await labelCell.locator('xpath=following-sibling::div[1]').innerText()).trim();
  }
}

type TabTitle = 'Allgemein' | 'Erweitert';

/** Das Konfigurations-Panel ("Konfiguration") rechts neben den Beispielen. */
export class ExampleOptions {
  readonly card: Locator;

  constructor(page: Page) {
    this.card = page.locator('lux-card.example-base-options');
  }

  switch(name: string) {
    return this.card.getByRole('switch', { name, exact: true });
  }

  /** Setzt einen Schalter im Panel. Liegt er nicht auf dem aktuellen Tab, wird der Tab gewechselt. */
  async setSwitch(name: string, checked = true) {
    const toggle = this.switch(name);
    await this.reveal(toggle);
    if ((await toggle.isChecked()) !== checked) {
      await toggle.click();
    }
    await expect(toggle).toBeChecked({ checked });
  }

  /**
   * Setzt den Text eines Eingabefelds im Panel (Label = Property-Name, z. B. "luxMaxLength").
   * Liegt das Feld nicht auf dem aktuellen Tab, wird der Tab gewechselt.
   */
  async setText(label: string, value: string) {
    const field = this.card.getByLabel(label, { exact: true });
    await this.reveal(field);
    await field.fill(value);
    await field.blur();
  }

  /** Wählt in einem lux-select des Panels die Option mit dem angezeigten Text `option`. */
  async select(label: string, option: string) {
    const field = this.card.getByRole('combobox', { name: label, exact: true });
    await this.reveal(field);
    await field.click();
    await this.card.page().getByRole('option', { name: option, exact: true }).click();
    await expect(field).toContainText(option);
  }

  /** Wählt einen Radio-Button (lux-radio) im Panel. */
  async radio(name: string) {
    const radio = this.card.getByRole('radio', { name, exact: true });
    await this.reveal(radio);
    await radio.click();
    await expect(radio).toBeChecked();
  }

  /**
   * Wechselt bei Bedarf auf den Tab ("Allgemein" bzw. "Erweitert"), auf dem `field` liegt.
   * Der Inhalt des inaktiven Tabs ist nicht im DOM und erscheint nach einem Wechsel erst verzögert.
   * Deshalb wird zuerst auf den Inhalt des aktiven Tabs gewartet und erst dann entschieden.
   */
  private async reveal(field: Locator) {
    if ((await this.card.getByRole('tab').count()) === 0) {
      return;
    }
    const active = (await this.card.getByRole('tab', { selected: true }).innerText()).trim() as TabTitle;
    await expect(this.tabContent(active)).toBeVisible();
    if (await field.isVisible()) {
      return;
    }
    await this.openTab(active === 'Allgemein' ? 'Erweitert' : 'Allgemein');
    await expect(field).toBeVisible();
  }

  button(name: string) {
    return this.card.getByRole('button', { name, exact: true });
  }

  /** Wechselt den Tab und wartet, bis dessen (erst dann eingehängter) Inhalt sichtbar ist. */
  async openTab(title: TabTitle) {
    const tab = this.card.getByRole('tab', { name: title, exact: true });
    await tab.click();
    await expect(tab).toHaveAttribute('aria-selected', 'true');
    await expect(this.tabContent(title)).toBeVisible();
  }

  private tabContent(title: TabTitle) {
    return this.card.locator(title === 'Allgemein' ? 'example-base-simple-options' : 'example-base-advanced-options');
  }

  /**
   * Die Demo setzt standardmäßig eine feste Fehlermeldung (luxErrorMessage), die jeden
   * Validierungsfehler überdeckt. Ist das Feld leer, zeigt das Control wieder die
   * eigentliche Meldung des Validators an.
   */
  async useValidatorErrorMessages() {
    await this.openTab('Erweitert');
    await this.setSwitch('luxErrorMessage verwenden', true);
    const field = this.card.getByRole('textbox', { name: 'luxErrorMessage', exact: true });
    await field.fill('');
    await expect(field).toHaveValue('');
    await this.openTab('Allgemein');
  }

  /** Deaktiviert das Reactive-Form-Control über FormControl.disable(). */
  async disableViaForm() {
    await this.card.getByRole('button', { name: 'Disable', exact: true }).click();
  }

  /** Aktiviert das Reactive-Form-Control über FormControl.enable(). */
  async enableViaForm() {
    await this.card.getByRole('button', { name: 'Enable', exact: true }).click();
  }
}

/** Die Wertanzeige nutzt die json-Pipe, ggf. gefolgt von einem Suffix wie "(ISO-Datum)". */
function parseDisplayedValue(text: string): unknown {
  for (const candidate of [text, text.replace(/\s*\([^)]*\)$/, '')]) {
    try {
      return JSON.parse(candidate);
    } catch {
      // nächsten Kandidaten versuchen
    }
  }
  return text;
}
