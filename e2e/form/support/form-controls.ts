import { Locator } from '@playwright/test';
import { luxMessage } from './lux-messages';

/** Beschreibung eines Form-Controls für die komponentenübergreifenden Tests. */
export interface FormControlSpec {
  /** Name im Testtitel, z. B. "input-ac". */
  id: string;
  /** Route unter /components-overview/example/. */
  route: string;
  /** Tag des Controls, z. B. "lux-input-ac". */
  tag: string;
  /** ARIA-Rolle des Elements, das den Namen (Label) trägt. */
  role: 'textbox' | 'combobox' | 'checkbox' | 'switch' | 'radiogroup' | 'slider';
  /** Label, das die Beispielseite standardmäßig setzt. */
  label: string;
  /** Die Beispielseite hat keinen Schalter luxRequired – die Required-Tests entfallen. */
  noRequiredOption?: boolean;
  /** Erwartete Meldung, wenn das Pflichtfeld leer verlassen wird. */
  requiredMessage: () => string;
  /** Das bedienbare Element im Control (input, combobox, ...). */
  field: (control: Locator) => Locator;
  /** Leert das Control (falls nötig) und verlässt es wieder, sodass es "touched" ist. */
  leaveEmpty: (control: Locator) => Promise<void>;
  /** Trägt einen Wert wie ein Benutzer ein. */
  enterValue: (control: Locator) => Promise<void>;
  /**
   * Wert, der danach in der Wertanzeige der Beispielseite erwartet wird.
   * Objekte werden per toMatchObject verglichen, es reichen also die relevanten Felder.
   */
  enteredValue: unknown;
  /**
   * Versucht, den Wert so zu ändern, wie es ein Benutzer könnte (ohne auf Erfolg zu warten) –
   * für Readonly. Nur Wege, die auch ein echter Benutzer hat: Ist das Element per Tab
   * nicht erreichbar, wird nicht programmatisch fokussiert, sondern mit der Maus geklickt.
   */
  tryChangeAsUser: (control: Locator) => Promise<void>;
  /** Das sichtbare Required-Sternchen. */
  requiredMarker: (control: Locator) => Locator;
  /** Bekannte Fehler der Komponente – die betroffenen Tests werden mit test.fail() markiert. */
  knownBugs?: {
    /** Fehlermeldung ist nicht per aria-describedby mit dem bedienbaren Element verknüpft. */
    errorNotDescribedby?: string;
    /** Wert lässt sich trotz luxReadonly ändern. */
    readonlyChangeable?: string;
  };
}

/** Sternchen im Top-Label von lux-form-control-wrapper. */
export const wrapperRequiredMarker = (control: Locator) =>
  control.locator('label.lux-form-label-authentic span[aria-hidden="true"]', { hasText: '*' });

/** Sternchen direkt hinter dem Label (Checkbox/Toggle, Label steht neben dem Bedienelement). */
const inlineRequiredMarker = (labelSelector: string) => (control: Locator) => control.locator(labelSelector).filter({ hasText: /\*\s*$/ });

type FieldFn = (control: Locator) => Locator;

const focusAndBlur = (field: FieldFn) => async (control: Locator) => {
  await field(control).focus();
  await field(control).blur();
};

const clearAndBlur = (field: FieldFn) => async (control: Locator) => {
  await field(control).fill('');
  await field(control).blur();
};

/** Wie clearAndBlur, schließt aber vorher das Vorschlags-Panel – blur() allein schließt ein mat-autocomplete nicht. */
const clearCloseAndBlur = (field: FieldFn) => async (control: Locator) => {
  await field(control).fill('');
  await field(control).press('Escape');
  await field(control).blur();
};

const fillAndBlur = (field: FieldFn, text: string) => async (control: Locator) => {
  await field(control).fill(text);
  await field(control).blur();
};

const typeByKeyboard = (field: FieldFn, text: string) => async (control: Locator) => {
  await field(control).focus();
  await control.page().keyboard.type(text);
};

const pressKeys =
  (field: FieldFn, ...keys: string[]) =>
  async (control: Locator) => {
    await field(control).focus();
    for (const key of keys) {
      await control.page().keyboard.press(key);
    }
  };

/** Echter Mausklick auf die Mitte des Elements – ohne Playwright-Prüfungen, die pointer-events: none umgehen würden. */
export async function clickAtCenter(element: Locator) {
  const box = await element.boundingBox();
  if (!box) {
    throw new Error('Element hat keine Bounding-Box');
  }
  await element.page().mouse.click(box.x + box.width / 2, box.y + box.height / 2);
}

const clickFieldAtCenter = (field: FieldFn) => (control: Locator) => clickAtCenter(field(control));

/** Öffnet das Panel eines Selects/Autocompletes und wählt die Option mit dem Label `label`. */
export async function selectOption(control: Locator, label: string) {
  await comboboxField(control).click();
  await control.page().getByRole('option', { name: label, exact: true }).click();
}

/** Tippt `text` in ein Autocomplete und wählt die Option mit dem Label `label`. */
const typeAndSelect = (text: string, label: string) => async (control: Locator) => {
  await comboboxField(control).pressSequentially(text);
  await control.page().getByRole('option', { name: label, exact: true }).click();
};

const inputField: FieldFn = (control) => control.locator('input').first();
const datetimeField: FieldFn = (control) => control.getByRole('textbox');
const radioField: FieldFn = (control) => control.getByRole('radio', { name: 'Option #2' });
const textareaField: FieldFn = (control) => control.locator('textarea');
const comboboxField: FieldFn = (control) => control.getByRole('combobox');
const checkboxField: FieldFn = (control) => control.locator('input[type="checkbox"]');
const sliderField: FieldFn = (control) => control.getByRole('slider');
const switchField: FieldFn = (control) => control.getByRole('switch');

export const FORM_CONTROLS: FormControlSpec[] = [
  {
    id: 'input-ac',
    route: 'input-ac',
    tag: 'lux-input-ac',
    role: 'textbox',
    label: 'Label',
    requiredMessage: () => luxMessage('util.error_message.required'),
    field: inputField,
    leaveEmpty: clearAndBlur(inputField),
    enterValue: fillAndBlur(inputField, 'Hallo'),
    enteredValue: 'Hallo',
    tryChangeAsUser: typeByKeyboard(inputField, 'xyz'),
    requiredMarker: wrapperRequiredMarker
  },
  {
    id: 'textarea-ac',
    route: 'textarea-ac',
    tag: 'lux-textarea-ac',
    role: 'textbox',
    label: 'Label',
    requiredMessage: () => luxMessage('util.error_message.required'),
    field: textareaField,
    leaveEmpty: clearAndBlur(textareaField),
    enterValue: fillAndBlur(textareaField, 'Hallo'),
    enteredValue: 'Hallo',
    tryChangeAsUser: typeByKeyboard(textareaField, 'xyz'),
    requiredMarker: wrapperRequiredMarker
  },
  {
    id: 'datepicker-ac',
    route: 'datepicker-ac',
    tag: 'lux-datepicker-ac',
    role: 'textbox',
    label: 'Label',
    requiredMessage: () => luxMessage('datepicker.error_message.empty'),
    field: inputField,
    leaveEmpty: clearAndBlur(inputField),
    enterValue: fillAndBlur(inputField, '01.02.2026'),
    enteredValue: '2026-02-01T00:00:00.000Z',
    tryChangeAsUser: typeByKeyboard(inputField, '9'),
    requiredMarker: wrapperRequiredMarker
  },
  {
    id: 'select-ac',
    route: 'select-ac',
    tag: 'lux-select-ac',
    role: 'combobox',
    label: 'Label',
    requiredMessage: () => luxMessage('util.error_message.required'),
    field: comboboxField,
    leaveEmpty: focusAndBlur(comboboxField),
    enterValue: (control) => selectOption(control, 'Albanien'),
    enteredValue: { label: 'Albanien', value: 2 },
    // Das Select ist auch bei Readonly per Tab erreichbar. Bei einem geschlossenen
    // mat-select wählt ArrowDown direkt die nächste Option.
    tryChangeAsUser: pressKeys(comboboxField, 'ArrowDown', 'Enter', 'Escape'),
    requiredMarker: wrapperRequiredMarker
  },
  {
    id: 'checkbox-ac',
    route: 'checkbox-ac',
    tag: 'lux-checkbox-ac',
    role: 'checkbox',
    label: 'Labeltext',
    requiredMessage: () => luxMessage('form-checkable-base.error_message.required'),
    field: checkboxField,
    leaveEmpty: focusAndBlur(checkboxField),
    enterValue: (control) => checkboxField(control).click(),
    enteredValue: true,
    // Bei Readonly ist die Checkbox per Tab nicht erreichbar (tabIndex -1) – bleibt die Maus.
    tryChangeAsUser: clickFieldAtCenter(checkboxField),
    requiredMarker: inlineRequiredMarker('mat-checkbox label')
  },
  {
    id: 'toggle-ac',
    route: 'toggle-ac',
    tag: 'lux-toggle-ac',
    role: 'switch',
    label: 'Label',
    requiredMessage: () => luxMessage('form-checkable-base.error_message.required'),
    field: switchField,
    leaveEmpty: focusAndBlur(switchField),
    enterValue: (control) => switchField(control).click(),
    enteredValue: true,
    // Bei Readonly ist der Toggle per Tab nicht erreichbar (tabIndex -1) – bleibt die Maus.
    tryChangeAsUser: clickFieldAtCenter(switchField),
    requiredMarker: inlineRequiredMarker('mat-slide-toggle label')
  },
  {
    id: 'autocomplete-ac',
    route: 'autocomplete-ac',
    tag: 'lux-autocomplete-ac',
    role: 'combobox',
    label: 'Label',
    requiredMessage: () => luxMessage('util.error_message.required'),
    field: comboboxField,
    leaveEmpty: clearCloseAndBlur(comboboxField),
    enterValue: (control) => selectOption(control, 'Gruppenaufgaben'),
    enteredValue: { label: 'Gruppenaufgaben', value: 'B' },
    tryChangeAsUser: pressKeys(comboboxField, 'G', 'r', 'u', 'ArrowDown', 'Enter', 'Escape'),
    requiredMarker: wrapperRequiredMarker
  },
  {
    id: 'radio-ac',
    route: 'radio-button-ac',
    tag: 'lux-radio-ac',
    role: 'radiogroup',
    label: 'Label',
    requiredMessage: () => luxMessage('util.error_message.required'),
    // "Option #1" ist im Beispiel deaktiviert, deshalb wird mit "Option #2" gearbeitet.
    field: radioField,
    leaveEmpty: focusAndBlur(radioField),
    enterValue: (control) => radioField(control).click(),
    enteredValue: { label: 'Option #2', value: 2 },
    tryChangeAsUser: clickFieldAtCenter(radioField),
    requiredMarker: wrapperRequiredMarker
  },
  {
    id: 'datetimepicker-ac',
    route: 'datetimepicker-ac',
    tag: 'lux-datetimepicker-ac',
    role: 'textbox',
    label: 'Label',
    requiredMessage: () => luxMessage('datetimepicker.error_message.empty'),
    field: datetimeField,
    leaveEmpty: clearAndBlur(datetimeField),
    enterValue: fillAndBlur(datetimeField, '01.02.2026, 13:45'),
    enteredValue: '2026-02-01T13:45:00.000Z',
    tryChangeAsUser: typeByKeyboard(datetimeField, '9'),
    requiredMarker: wrapperRequiredMarker
  },
  {
    id: 'timepicker',
    route: 'timepicker',
    tag: 'lux-timepicker',
    role: 'combobox',
    label: 'Label',
    requiredMessage: () => luxMessage('timepicker.error_message.empty'),
    field: comboboxField,
    leaveEmpty: clearCloseAndBlur(comboboxField),
    // Beide Beispiele stehen auf dem 18.06.2026, 14:30 UTC – geändert wird nur die Uhrzeit.
    enterValue: fillAndBlur(comboboxField, '09:15'),
    enteredValue: '2026-06-18T09:15:00.000Z',
    tryChangeAsUser: typeByKeyboard(comboboxField, '1'),
    requiredMarker: wrapperRequiredMarker
  },
  {
    id: 'lookup-combobox-ac',
    route: 'lookup-combobox-ac',
    tag: 'lux-lookup-combobox-ac',
    role: 'combobox',
    label: 'Label',
    requiredMessage: () => luxMessage('util.error_message.required'),
    field: comboboxField,
    leaveEmpty: focusAndBlur(comboboxField),
    enterValue: (control) => selectOption(control, 'Deutschland'),
    enteredValue: { key: '4', kurzText: 'Deutschland' },
    tryChangeAsUser: pressKeys(comboboxField, 'ArrowDown', 'Enter', 'Escape'),
    requiredMarker: wrapperRequiredMarker
  },
  {
    id: 'lookup-autocomplete-ac',
    route: 'lookup-autocomplete-ac',
    tag: 'lux-lookup-autocomplete-ac',
    role: 'combobox',
    label: 'Label',
    requiredMessage: () => luxMessage('util.error_message.required'),
    field: comboboxField,
    leaveEmpty: clearCloseAndBlur(comboboxField),
    enterValue: typeAndSelect('Deut', 'Deutschland'),
    enteredValue: { key: '4', kurzText: 'Deutschland' },
    tryChangeAsUser: pressKeys(comboboxField, 'D', 'e', 'u', 'ArrowDown', 'Enter', 'Escape'),
    requiredMarker: wrapperRequiredMarker
  },
  {
    id: 'slider-ac',
    route: 'slider-ac',
    tag: 'lux-slider-ac',
    role: 'slider',
    label: 'Label',
    noRequiredOption: true,
    requiredMessage: () => luxMessage('util.error_message.required'),
    field: sliderField,
    leaveEmpty: focusAndBlur(sliderField),
    // Beide Beispiele starten bei 0 (Schrittweite 1).
    enterValue: pressKeys(sliderField, 'ArrowRight'),
    enteredValue: 1,
    // Bei Readonly ist der Slider per Tab nicht erreichbar – ein Klick in die Mitte würde auf 50 springen.
    tryChangeAsUser: clickFieldAtCenter(sliderField),
    requiredMarker: wrapperRequiredMarker
  }
];

export function formControl(id: string): FormControlSpec {
  const spec = FORM_CONTROLS.find((s) => s.id === id);
  if (!spec) {
    throw new Error(`Unbekanntes Form-Control "${id}"`);
  }
  return spec;
}
