import {
  BACKSPACE,
  DELETE,
  DOWN_ARROW,
  END,
  ENTER,
  ESCAPE,
  F2,
  HOME,
  LEFT_ARROW,
  PAGE_DOWN,
  PAGE_UP,
  RIGHT_ARROW,
  SPACE,
  TAB,
  UP_ARROW
} from '@angular/cdk/keycodes';
import { HttpRequest } from '@angular/common/http';
import { isDevMode } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormArray, UntypedFormGroup, ValidationErrors } from '@angular/forms';
import type { ValidationError } from '@angular/forms/signals';
import { TranslocoService } from '@jsverse/transloco';
import {
  LuxLocalDate,
  LuxLocalTime,
  addDaysToLocalDate,
  compareLocalDate,
  dayOfWeekOf,
  formatLocalDate,
  formatLocalDateTime,
  formatLocalTime,
  formatV21,
  localDateOf,
  localTimeOf,
  parseLocalDate,
  parseLocalDateTime,
  parseLocalTime,
  parseV21
} from './lux-local-date';

const MIDNIGHT: LuxLocalTime = { hour: 0, minute: 0 };
const V21_TIME_DATE: LuxLocalDate = { year: 1970, month: 1, day: 1 };

export class LuxUtil {
  /**
   * Diese Methode wirft einen Fehler, wenn der Wert nicht gesetzt wurde.
   * @param name Ein Name.
   * @param value Ein Wert.
   */
  public static assertNonNull(name: string, value: any) {
    if (value === undefined || value === null) {
      throw Error(`${name} should be initialized.`);
    }
  }

  /**
   * Liest aus einem Objekt ein bestimmtes Feld aus.
   * Lässt sich auch über mehrere Unterobjekte verschachteln.
   * Beispiele für propertyNamePath:
   * "value"
   * "unterobjekt1.unterobjekt2.value"
   * @param el
   * @param propertyNamePath
   * @returns any
   */
  public static readPropertyValueFromObject(el: any, propertyNamePath: string): any {
    let result = null;
    if (el && propertyNamePath) {
      const splitProperties = propertyNamePath.split('.');

      if (splitProperties.length > 0) {
        let tempObject = el;

        for (const property of splitProperties) {
          tempObject = tempObject[property];
        }
        result = tempObject;
      } else {
        result = el[propertyNamePath];
      }
    }
    return result;
  }

  /**
   * Gibt eine von verschiedenen vordefinierten Fehlernachrichten passend zu den
   * vorhandenen Fehlern der übergebenen FormControl zurück.
   * @param tService Der TranslocoService.
   * @param formControl
   * @returns string
   */
  public static getErrorMessage(tService: TranslocoService, formControl: FormControl<any>): string {
    return formControl ? LuxUtil.getErrorMessageForErrors(tService, formControl.errors) : '';
  }

  /**
   * Wie getErrorMessage(), aber direkt auf einem ValidationErrors-Objekt statt auf einem FormControl.
   * Signal Forms kennt kein FormControl mehr - die Fehler einer LUX-FormComponent werden über
   * LuxUtil.toLegacyValidationErrors() in diese Form gebracht.
   * @param tService Der TranslocoService.
   * @param errors Die Fehler oder null.
   * @returns string
   */
  public static getErrorMessageForErrors(tService: TranslocoService, errors: ValidationErrors | null): string {
    if (!errors) {
      return '';
    }

    if (errors['required']) {
      return tService.translate('luxc.util.error_message.required');
    }

    if (errors['minlength']) {
      return tService.translate('luxc.util.error_message.minlength', { minlength: errors['minlength'].requiredLength });
    }

    if (errors['maxlength']) {
      return tService.translate('luxc.util.error_message.maxlength', { maxlength: errors['maxlength'].requiredLength });
    }

    if (errors['email']) {
      return tService.translate('luxc.util.error_message.email');
    }

    if (errors['min']) {
      return tService.translate('luxc.util.error_message.min', { min: errors['min'].min });
    }

    if (errors['max']) {
      return tService.translate('luxc.util.error_message.max', { max: errors['max'].max });
    }

    if (errors['pattern']) {
      const pattern = errors['pattern'].requiredPattern;
      // requiredPattern ist entweder "^...$" (Validators.pattern(string)) oder der String eines
      // RegExp-Literals inkl. Slashes und optionalen Flags (Validators.pattern(RegExp) bzw. der
      // pattern()-Validator aus Signal Forms). Im zweiten Fall müssen Slashes UND Flags entfernt
      // werden, sonst bleiben sie in der angezeigten Fehlermeldung sichtbar.
      const regexLiteral = /^\/(.*)\/[a-z]*$/.exec(pattern);
      return tService.translate('luxc.util.error_message.pattern', {
        pattern: regexLiteral ? regexLiteral[1] : pattern.substring(1, pattern.length - 1)
      });
    }

    return '';
  }

  /**
   * Übersetzt die Fehlerliste aus Signal Forms in das klassische ValidationErrors-Objekt.
   *
   * Damit bleiben die bestehenden Signaturen von luxErrorCallback und errorMessageModifier
   * unverändert gültig. Die Schlüssel folgen bewusst der alten Reactive-Forms-Schreibweise
   * (minlength/maxlength statt minLength/maxLength), weil bestehende Callbacks genau darauf prüfen.
   *
   * @param errors Die Fehler aus Signal Forms.
   * @returns Das ValidationErrors-Objekt oder null, wenn es keine Fehler gibt.
   */
  public static toLegacyValidationErrors(errors: readonly ValidationError.WithOptionalFieldTree[]): ValidationErrors | null {
    if (!errors || errors.length === 0) {
      return null;
    }

    const result: ValidationErrors = {};

    for (const error of errors) {
      const details = error as unknown as Record<string, unknown>;

      switch (error.kind) {
        case 'minLength':
          result['minlength'] = { requiredLength: details['minLength'] };
          break;
        case 'maxLength':
          result['maxlength'] = { requiredLength: details['maxLength'] };
          break;
        case 'min':
          result['min'] = { min: details['min'] };
          break;
        case 'max':
          result['max'] = { max: details['max'] };
          break;
        case 'pattern':
          result['pattern'] = { requiredPattern: String(details['pattern']) };
          break;
        default:
          // required, email, parse, standardSchema und alle eigenen kinds: Der Fehler selbst ist
          // der Wert, damit ein Callback z.B. auf errors['meinFehler'].message zugreifen kann.
          result[error.kind] = error;
          break;
      }
    }

    return result;
  }

  /**
   * Prüft, ob der übergebene Wert ein JS-Datum ist.
   * @param value
   * @returns boolean
   */
  public static isDate(value: any) {
    return value instanceof Date && !isNaN(value.valueOf());
  }

  /**
   * Prüft, ob der Wert ein Datum ohne Zeitzone ist, wie es lux-datepicker annimmt: "yyyy-MM-dd", z.B. "2029-05-26".
   * Toleriert wird auch Mitternacht ohne Zeitzone ("2029-05-26T00:00" bzw. "2029-05-26T00:00:00",
   * z.B. Java LocalDateTime für ein reines Datum).
   * @param value ein beliebiger Wert.
   */
  public static isLocalDate(value: unknown): value is string {
    return parseLocalDate(value) !== null;
  }

  /**
   * Prüft, ob der Wert eine Uhrzeit ohne Zeitzone ist, wie sie lux-timepicker annimmt: "HH:mm", z.B. "14:30".
   * Toleriert werden Sekunden ":00" ("14:30:00").
   * @param value ein beliebiger Wert.
   */
  public static isLocalTime(value: unknown): value is string {
    return parseLocalTime(value) !== null;
  }

  /**
   * Prüft, ob der Wert Datum und Uhrzeit ohne Zeitzone sind, wie sie lux-datepicker und lux-timepicker mit gemeinsamem
   * Wert annehmen: "yyyy-MM-ddTHH:mm", z.B. "2029-05-26T14:30". Toleriert werden Sekunden ":00".
   * @param value ein beliebiger Wert.
   */
  public static isLocalDateTime(value: unknown): value is string {
    return parseLocalDateTime(value) !== null;
  }

  /**
   * Liefert den heutigen Tag aus Sicht des Nutzers (lokale Zeitzone) als "yyyy-MM-dd".
   */
  public static todayAsLocalDate(): string {
    return formatLocalDate(localDateOf(new Date()));
  }

  /**
   * Liefert den lokalen Tag eines Date-Objekts als "yyyy-MM-dd", z.B. für die Migration von Date-Werten.
   * Beispiel: new Date(2029, 4, 26) => "2029-05-26" (in jeder Zeitzone).
   * @param date ein Date-Objekt.
   * @returns den Tag oder null, wenn date null, undefined oder ein ungültiges Date ist.
   */
  public static toLocalDate(date: Date | null | undefined): string | null {
    return LuxUtil.isDate(date) ? formatLocalDate(localDateOf(date as Date)) : null;
  }

  /**
   * Liefert die lokale Uhrzeit eines Date-Objekts als "HH:mm". Sekunden entfallen.
   * Beispiel: new Date(2029, 4, 26, 14, 30) => "14:30" (in jeder Zeitzone).
   * @param date ein Date-Objekt.
   * @returns die Uhrzeit oder null, wenn date null, undefined oder ein ungültiges Date ist.
   */
  public static toLocalTime(date: Date | null | undefined): string | null {
    return LuxUtil.isDate(date) ? formatLocalTime(localTimeOf(date as Date)) : null;
  }

  /**
   * Liefert Datum und Uhrzeit eines Date-Objekts aus Sicht des Nutzers als "yyyy-MM-ddTHH:mm". Sekunden entfallen.
   * Damit wird z.B. ein Zeitpunkt aus dem Backend für Datepicker und Timepicker mit gemeinsamem Wert umgerechnet:
   * In Deutschland ergibt new Date("2029-05-26T12:30:00Z") den Wert "2029-05-26T14:30".
   * Anders als fromV21DateTime() rechnet die Funktion in die Zeitzone des Nutzers um.
   * @param date ein Date-Objekt.
   * @returns Datum und Uhrzeit oder null, wenn date null, undefined oder ein ungültiges Date ist.
   */
  public static toLocalDateTime(date: Date | null | undefined): string | null {
    return LuxUtil.isDate(date) ? formatLocalDateTime({ date: localDateOf(date as Date), time: localTimeOf(date as Date) }) : null;
  }

  /**
   * Addiert Tage zu einem Datum ohne Zeitzone, z.B. addDays("2029-02-28", 1) => "2029-03-01".
   * @param localDate ein Datum (siehe isLocalDate).
   * @param days die Anzahl der Tage als ganze Zahl, auch negativ.
   * @returns das Datum als "yyyy-MM-dd" oder null, wenn localDate null oder undefined ist.
   * @throws Error, wenn localDate kein Datum ohne Zeitzone oder days keine ganze Zahl ist.
   */
  public static addDays(localDate: string | null | undefined, days: number): string | null {
    if (localDate == null) {
      return null;
    }

    if (!Number.isInteger(days)) {
      throw new Error(`LuxUtil.addDays(): Erwartet eine ganze Zahl, erhalten '${days}'.`);
    }

    return formatLocalDate(addDaysToLocalDate(LuxUtil.requireLocalDate(localDate, 'addDays'), days));
  }

  /**
   * Vergleicht zwei Daten ohne Zeitzone.
   * @param first ein Datum (siehe isLocalDate).
   * @param second ein Datum (siehe isLocalDate).
   * @returns eine negative Zahl, wenn first vor second liegt, 0 bei gleichem Tag, sonst eine positive Zahl.
   * @throws Error, wenn einer der Werte kein Datum ohne Zeitzone ist (auch bei null).
   */
  public static compareLocalDates(first: string, second: string): number {
    return compareLocalDate(LuxUtil.requireLocalDate(first, 'compareLocalDates'), LuxUtil.requireLocalDate(second, 'compareLocalDates'));
  }

  /**
   * Liefert den Wochentag eines Datums ohne Zeitzone, z.B. für einen luxCustomFilter.
   * @param localDate ein Datum (siehe isLocalDate).
   * @returns 0 = Sonntag bis 6 = Samstag (wie Date.getDay()) oder null, wenn localDate null oder undefined ist.
   * @throws Error, wenn localDate kein Datum ohne Zeitzone ist.
   */
  public static getDayOfWeek(localDate: string | null | undefined): number | null {
    return localDate == null ? null : dayOfWeekOf(LuxUtil.requireLocalDate(localDate, 'getDayOfWeek'));
  }

  /**
   * Führt Datum und Uhrzeit zusammen, z.B. combineDateTime("2029-05-26", "14:30") => "2029-05-26T14:30".
   * @param localDate ein Datum (siehe isLocalDate).
   * @param localTime eine Uhrzeit (siehe isLocalTime).
   * @returns "yyyy-MM-ddTHH:mm" oder null, wenn einer der Werte null oder undefined ist.
   * @throws Error, wenn ein Wert kein Datum bzw. keine Uhrzeit ohne Zeitzone ist.
   */
  public static combineDateTime(localDate: string | null | undefined, localTime: string | null | undefined): string | null {
    if (localDate == null || localTime == null) {
      return null;
    }

    return formatLocalDateTime({
      date: LuxUtil.requireLocalDate(localDate, 'combineDateTime'),
      time: LuxUtil.requireLocalTime(localTime, 'combineDateTime')
    });
  }

  /**
   * Trennt Datum und Uhrzeit, z.B. splitDateTime("2029-05-26T14:30") => { date: "2029-05-26", time: "14:30" }.
   * @param localDateTime Datum und Uhrzeit (siehe isLocalDateTime).
   * @returns Datum und Uhrzeit oder null, wenn localDateTime null oder undefined ist.
   * @throws Error, wenn localDateTime nicht Datum und Uhrzeit ohne Zeitzone sind.
   */
  public static splitDateTime(localDateTime: string | null | undefined): { date: string; time: string } | null {
    if (localDateTime == null) {
      return null;
    }

    const dateTime = parseLocalDateTime(localDateTime);
    if (!dateTime) {
      throw new Error(`LuxUtil.splitDateTime(): Erwartet 'yyyy-MM-ddTHH:mm', erhalten '${localDateTime}'.`);
    }

    return { date: formatLocalDate(dateTime.date), time: formatLocalTime(dateTime.time) };
  }

  /**
   * Nur für das Format von Version 21, rechnet keine Zeitzone um.
   * Liest ein Datum im v21-Format (UTC-Mitternacht), z.B. "2029-05-26T00:00:00.000Z" => "2029-05-26".
   * Für Anwendungen, deren Backend noch das v21-Format liefert (siehe Update-Guide v22).
   *
   * Angenommen wird nur genau UTC-Mitternacht, Millisekunden optional ("2029-05-26T00:00:00Z").
   * Der Tag ist der UTC-Tag. Es gibt keine Heuristik.
   * @param value ein Datum im v21-Format.
   * @returns "yyyy-MM-dd", null bei null, undefined oder "". Jeder andere Wert wird unverändert zurückgegeben
   * (im Dev-Modus mit Warnung in der Konsole), damit die Komponente ihn sichtbar als Fehler anzeigt.
   */
  public static fromV21Date(value: string | null | undefined): string | null {
    return LuxUtil.convertDateValue(value, 'fromV21Date', "'yyyy-MM-ddT00:00:00.000Z'", (v) => {
      const dateTime = parseV21(v);
      return dateTime && dateTime.time.hour === 0 && dateTime.time.minute === 0 ? formatLocalDate(dateTime.date) : null;
    });
  }

  /**
   * Nur für das Format von Version 21, rechnet keine Zeitzone um.
   * Schreibt ein Datum im v21-Format (UTC-Mitternacht), z.B. "2029-05-26" => "2029-05-26T00:00:00.000Z".
   * @param value ein Datum (siehe isLocalDate).
   * @returns "yyyy-MM-ddT00:00:00.000Z", null bei null, undefined oder "". Jeder andere Wert wird unverändert
   * zurückgegeben (im Dev-Modus mit Warnung in der Konsole).
   */
  public static toV21Date(value: string | null | undefined): string | null {
    return LuxUtil.convertDateValue(value, 'toV21Date', "'yyyy-MM-dd'", (v) => {
      const date = parseLocalDate(v);
      return date && formatV21({ date, time: MIDNIGHT });
    });
  }

  /**
   * Nur für das Format von Version 21, rechnet keine Zeitzone um.
   * Liest eine Uhrzeit im v21-Format, z.B. "1970-01-01T14:30:00.000Z" => "14:30".
   * Stunden und Minuten sind die UTC-Werte, die Sekunden müssen 00 sein. Der Datumsteil wird ignoriert.
   * @param value eine Uhrzeit im v21-Format.
   * @returns "HH:mm", null bei null, undefined oder "". Jeder andere Wert wird unverändert zurückgegeben
   * (im Dev-Modus mit Warnung in der Konsole).
   */
  public static fromV21Time(value: string | null | undefined): string | null {
    return LuxUtil.convertDateValue(value, 'fromV21Time', "'yyyy-MM-ddTHH:mm:00.000Z'", (v) => {
      const dateTime = parseV21(v);
      return dateTime && formatLocalTime(dateTime.time);
    });
  }

  /**
   * Nur für das Format von Version 21, rechnet keine Zeitzone um.
   * Schreibt eine Uhrzeit im v21-Format, z.B. "14:30" => "1970-01-01T14:30:00.000Z".
   * @param value eine Uhrzeit (siehe isLocalTime).
   * @returns "1970-01-01THH:mm:00.000Z", null bei null, undefined oder "". Jeder andere Wert wird unverändert
   * zurückgegeben (im Dev-Modus mit Warnung in der Konsole).
   */
  public static toV21Time(value: string | null | undefined): string | null {
    return LuxUtil.convertDateValue(value, 'toV21Time', "'HH:mm'", (v) => {
      const time = parseLocalTime(v);
      return time && formatV21({ date: V21_TIME_DATE, time });
    });
  }

  /**
   * Nur für das Format von Version 21, rechnet keine Zeitzone um.
   * Liest Datum und Uhrzeit im v21-Format, z.B. "2029-05-26T14:30:00.000Z" => "2029-05-26T14:30".
   * Datum und Uhrzeit sind die UTC-Werte, die Sekunden müssen 00 sein. Einen echten Zeitpunkt rechnet
   * toLocalDateTime(new Date(value)) in die Zeitzone des Nutzers um.
   * @param value Datum und Uhrzeit im v21-Format.
   * @returns "yyyy-MM-ddTHH:mm", null bei null, undefined oder "". Jeder andere Wert wird unverändert zurückgegeben
   * (im Dev-Modus mit Warnung in der Konsole).
   */
  public static fromV21DateTime(value: string | null | undefined): string | null {
    return LuxUtil.convertDateValue(value, 'fromV21DateTime', "'yyyy-MM-ddTHH:mm:00.000Z'", (v) => {
      const dateTime = parseV21(v);
      return dateTime && formatLocalDateTime(dateTime);
    });
  }

  /**
   * Nur für das Format von Version 21, rechnet keine Zeitzone um.
   * Schreibt Datum und Uhrzeit im v21-Format, z.B. "2029-05-26T14:30" => "2029-05-26T14:30:00.000Z".
   * Einen echten Zeitpunkt liefert new Date(value).toISOString().
   * @param value Datum und Uhrzeit (siehe isLocalDateTime).
   * @returns "yyyy-MM-ddTHH:mm:00.000Z", null bei null, undefined oder "". Jeder andere Wert wird unverändert
   * zurückgegeben (im Dev-Modus mit Warnung in der Konsole).
   */
  public static toV21DateTime(value: string | null | undefined): string | null {
    return LuxUtil.convertDateValue(value, 'toV21DateTime', "'yyyy-MM-ddTHH:mm'", (v) => {
      const dateTime = parseLocalDateTime(v);
      return dateTime && formatV21(dateTime);
    });
  }

  /**
   * Zeigt die Validierungsfehler der einzelnen FormControls innerhalb der FormGroup an.
   * Wenn innerhalb der übergebenen FormGroup weitere Formgroups enthalten sind, werden
   * diese ebenfalls validiert.
   * @param formGroup
   */
  public static showValidationErrors(formGroup: FormGroup | UntypedFormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormGroup || control instanceof UntypedFormGroup) {
        this.showValidationErrors(control);
      } else if (control instanceof FormArray || control instanceof UntypedFormArray) {
        control.controls.forEach((current) => {
          if (current instanceof FormGroup || current instanceof UntypedFormGroup) {
            this.showValidationErrors(current);
          } else if (current) {
            control.markAsTouched({ onlySelf: true });
          }
        });
      } else if (control) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  /**
   * Diese Methode scrollt zu der übergebenen Id.
   * @param id Eine Element-Id (z.B. <tag id="myId">...)
   */
  public static goTo(id: string): void {
    const element = document.querySelector('#' + id);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView();
      });
    }
  }

  /**
   * Diese Methode scrollt zum übergebenen Selector.
   * @param selector Ein Selector. Sollte kein Selector übergeben werden, wird nach oben vom Inhaltsbereich gescrollt.
   */
  public static goToTop(selector = 'div.lux-app-content-container') {
    const element = document.querySelector(selector);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView();
      });
    }
  }

  /**
   * Diese Methode verhindert, dass ein Event weiterverarbeitet wird.
   * @param event Ein beliebiges Event.
   */
  public static stopEventPropagation(event: Event) {
    if (event) {
      if (event.stopPropagation) {
        event.stopPropagation();
      } else {
        console.log('Die Funktion "event.stopPropagation()" wird nicht unterstützt.');
      }
    }
  }

  public static isNumber(toCheck: any): boolean {
    return !Number.isNaN(+toCheck);
  }

  public static base64ToArrayBuffer(data: string) {
    const binaryString = window.atob(data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  /**
   * Diese Methode liefert true zurück, wenn es sich um die ArrowLeft-Taste handelt, false sonst.
   * @param event Ein beliebiges KeyboardEvent
   */
  public static isKeyArrowLeft(event: KeyboardEvent) {
    const key = this.getKey(event);

    return key === 'ArrowLeft' || key === LEFT_ARROW;
  }

  /**
   * Diese Methode liefert true zurück, wenn es sich um die ArrowUp-Taste handelt, false sonst.
   * @param event Ein beliebiges KeyboardEvent
   */
  public static isKeyArrowUp(event: KeyboardEvent) {
    const key = this.getKey(event);

    return key === 'ArrowUp' || key === UP_ARROW;
  }

  /**
   * Diese Methode liefert true zurück, wenn es sich um die ArrowRight-Taste handelt, false sonst.
   * @param event Ein beliebiges KeyboardEvent
   */
  public static isKeyArrowRight(event: KeyboardEvent) {
    const key = this.getKey(event);

    return key === 'ArrowRight' || key === RIGHT_ARROW;
  }

  /**
   * Diese Methode liefert true zurück, wenn es sich um die ArrowDown-Taste handelt, false sonst.
   * @param event Ein beliebiges KeyboardEvent
   */
  public static isKeyArrowDown(event: KeyboardEvent) {
    const key = this.getKey(event);

    return key === 'ArrowDown' || key === DOWN_ARROW;
  }

  /**
   * Diese Methode liefert true zurück, wenn es sich um die Home-Taste handelt, false sonst.
   * @param event Ein beliebiges KeyboardEvent
   */
  public static isKeyHome(event: KeyboardEvent) {
    const key = this.getKey(event);

    return key === 'Home' || key === HOME;
  }

  /**
   * Diese Methode liefert true zurück, wenn es sich um die End-Taste handelt, false sonst.
   * @param event Ein beliebiges KeyboardEvent
   */
  public static isKeyEnd(event: KeyboardEvent) {
    const key = this.getKey(event);

    return key === 'End' || key === END;
  }

  /**
   * Diese Methode liefert true zurück, wenn es sich um die PageDown-Taste handelt, false sonst.
   * @param event Ein beliebiges KeyboardEvent
   */
  public static isKeyPageDown(event: KeyboardEvent) {
    const key = this.getKey(event);

    return key === 'PageDown' || key === PAGE_DOWN;
  }

  /**
   * Diese Methode liefert true zurück, wenn es sich um die PageUp-Taste handelt, false sonst.
   * @param event Ein beliebiges KeyboardEvent
   */
  public static isKeyPageUp(event: KeyboardEvent) {
    const key = this.getKey(event);

    return key === 'PageUp' || key === PAGE_UP;
  }

  /**
   * Diese Methode liefert true zurück, wenn es sich um die Enter-Taste handelt, false sonst.
   * @param event Ein beliebiges KeyboardEvent
   */
  public static isKeyEnter(event: KeyboardEvent) {
    const key = this.getKey(event);

    return key === 'Enter' || key === ENTER;
  }

  /**
   * Diese Methode liefert true zurück, wenn es sich um die Tab-Taste handelt, false sonst.
   * @param event Ein beliebiges KeyboardEvent
   */
  public static isKeyTab(event: KeyboardEvent) {
    const key = this.getKey(event);

    return key === 'Tab' || key === TAB;
  }

  /**
   * Diese Methode liefert true zurück, wenn es sich um die Backspace-Taste handelt, false sonst.
   * @param event Ein beliebiges KeyboardEvent
   */
  public static isKeyBackspace(event: KeyboardEvent) {
    const key = this.getKey(event);

    return key === 'Backspace' || key === BACKSPACE;
  }

  /**
   * Diese Methode liefert true zurück, wenn es sich um die Space-Taste handelt, false sonst.
   * @param event Ein beliebiges KeyboardEvent
   */
  public static isKeySpace(event: KeyboardEvent) {
    const key = this.getKey(event);

    return key === 'Space' || key === 'Spacebar' || key === ' ' || key === SPACE;
  }

  /**
   * Diese Methode liefert true zurück, wenn es sich um die Delete-Taste handelt, false sonst.
   * @param event Ein beliebiges KeyboardEvent
   */
  public static isKeyDelete(event: KeyboardEvent) {
    const key = this.getKey(event);

    return key === 'Delete' || key === 'Del' || key === DELETE;
  }

  /**
   * Diese Methode liefert true zurück, wenn es sich um die Escape-Taste handelt, false sonst.
   * @param event Ein beliebiges KeyboardEvent
   */
  public static isKeyEscape(event: KeyboardEvent) {
    const key = this.getKey(event);

    return key === 'Escape' || key === 'Esc' || key === ESCAPE;
  }

  /**
   * Diese Methode liefert true zurück, wenn es sich um die F2-Taste handelt, false sonst.
   * @param event Ein beliebiges KeyboardEvent
   */
  public static isKeyF2(event: KeyboardEvent) {
    const key = this.getKey(event);

    return key === 'F2' || key === F2;
  }

  private static getKey(event: KeyboardEvent): string | number {
    return event.key || event.keyCode;
  }

  /**
   * Entfernt nicht-ASCII-Chars aus dem String (Beim IE wichtig, dieser fügt gerne versteckte Steuerzeichen
   * in Input-Feldern an die Strings).
   * @param dateString
   */
  public static stringWithoutASCIIChars(dateString: string): string {
    const exp = new RegExp('[^A-Za-z 0-9.,?"!@#$%^&*()-_=+;:<>\\/\\\\|}{\\[\\]`~]*', 'g');
    return dateString.replace(exp, '');
  }

  /**
   * Diese Methode liefert für die akzeptierten Dateitypen einen I18N-Nachrichtenteil zurück.
   *
   * Beispiel: acceptTypes = .pdf,.txt,.png
   * de = PDF, TXT oder PNG
   * en = PDF, TXT or PNG
   * @param tService Der TranslocoService.
   * @param acceptTypes Die akzeptierten Dateitypen (z.b. .pdf,.txt).
   */
  public static getAcceptTypesAsMessagePart(tService: TranslocoService, acceptTypes: string): string {
    let message = '';

    if (acceptTypes) {
      let newAccept = acceptTypes;
      newAccept = newAccept.replace(/\./g, '');
      newAccept = newAccept.replace(/\*/g, '');

      let typesArr = newAccept.split(',');
      typesArr = typesArr.map((str) => str.trim().toUpperCase());

      for (let i = 0; i < typesArr.length; i++) {
        message += typesArr[i].toUpperCase();

        if (i === typesArr.length - 2) {
          message += tService.translate('luxc.file.upload.file.type.concat');
        } else if (typesArr.length > 1 && i < typesArr.length - 2) {
          message += ', ';
        }
      }
    }

    return message;
  }

  /**
   * Diese Methode prüft, ob es sich um einen Asset-Request handelt. Dies ist der Fall wenn in der URL "/assets/" vorkommt.
   * @param request
   */

  public static checkIfRequestIsAssetRequest(request: HttpRequest<any>): boolean {
    return request.url.includes('/assets/');
  }

  private static requireLocalDate(value: string, functionName: string): LuxLocalDate {
    const date = parseLocalDate(value);
    if (!date) {
      throw new Error(`LuxUtil.${functionName}(): Erwartet 'yyyy-MM-dd', erhalten '${value}'.`);
    }
    return date;
  }

  private static requireLocalTime(value: string, functionName: string): LuxLocalTime {
    const time = parseLocalTime(value);
    if (!time) {
      throw new Error(`LuxUtil.${functionName}(): Erwartet 'HH:mm', erhalten '${value}'.`);
    }
    return time;
  }

  /**
   * Gemeinsamer Rahmen der Umrechnungen zum bzw. vom v21-Format: null, undefined und "" ergeben null. Ein Wert, der
   * nicht passt, wird unverändert zurückgegeben, damit die Komponente ihn sichtbar als Fehler anzeigt, statt dass
   * z.B. das Laden einer Seite abbricht.
   */
  private static convertDateValue(
    value: string | null | undefined,
    functionName: string,
    expected: string,
    convert: (value: string) => string | null
  ): string | null {
    if (value == null || value === '') {
      return null;
    }

    const result = convert(value);
    if (result === null) {
      if (isDevMode()) {
        console.warn(
          `LuxUtil.${functionName}(): Erwartet ${expected}, erhalten '${value}'. ` +
            'Der Wert wird unverändert zurückgegeben (siehe Update-Guide v22).'
        );
      }
      return value;
    }

    return result;
  }
}
