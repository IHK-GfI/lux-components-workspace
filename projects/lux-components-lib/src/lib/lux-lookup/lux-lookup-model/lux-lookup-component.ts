import { Directive, OnDestroy, OnInit, inject, input, output } from '@angular/core';
import { ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LuxComponentsConfigParameters } from '../../lux-components-config/lux-components-config-parameters.interface';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxValidationErrors } from '../../lux-form/lux-form-model/lux-form-component-base.class';
import { LuxFormLegacyValueBase } from '../../lux-form/lux-form-model/lux-form-legacy/lux-form-legacy-value-base.class';
import { LuxLookupHandlerService } from '../lux-lookup-service/lux-lookup-handler.service';
import { LuxLookupService } from '../lux-lookup-service/lux-lookup.service';
import { LuxBehandlungsOptionenUngueltige, LuxLookupParameters } from './lux-lookup-parameters';
import { LuxLookupTableEntry } from './lux-lookup-table-entry';

/**
 * Der Typ für die Lookup-Vergleichsfunktionen.
 */
export type LuxLookupCompareFn<T = LuxLookupTableEntry> = (a: T, b: T) => number;

/**
 * Diese Vergleichsfunktion sortiert die Schlüsseltabelleneinträge nach ihrem Schlüssel.
 * @param a Erster Schlüsseltabelleneintrag.
 * @param b Zweiter Schlüsseltabelleneintrag.
 */
export const luxLookupCompareKeyFn: LuxLookupCompareFn = (a: LuxLookupTableEntry, b: LuxLookupTableEntry) => {
  let aText = a?.key ?? '';
  let bText = b?.key ?? '';

  aText = aText.padStart(20, '0');
  bText = bText.padStart(20, '0');

  return aText.localeCompare(bText);
};

/**
 * Diese Vergleichsfunktion sortiert die Schlüsseltabelleneinträge nach ihrem Kurztext.
 * @param a Erster Schlüsseltabelleneintrag.
 * @param b Zweiter Schlüsseltabelleneintrag.
 */
export const luxLookupCompareKurzTextFn: LuxLookupCompareFn = (a: LuxLookupTableEntry, b: LuxLookupTableEntry) => {
  const aText = a?.kurzText ?? '';
  const bText = b?.kurzText ?? '';

  return aText.localeCompare(bText);
};

/**
 * Diese Vergleichsfunktion sortiert die Schlüsseltabelleneinträge nach ihrem Langtext1.
 * @param a Erster Schlüsseltabelleneintrag.
 * @param b Zweiter Schlüsseltabelleneintrag.
 */
export const luxLookupCompareLangText1Fn: LuxLookupCompareFn = (a: LuxLookupTableEntry, b: LuxLookupTableEntry) => {
  const aText = a?.langText1 ?? '';
  const bText = b?.langText1 ?? '';

  return aText.localeCompare(bText);
};

/**
 * Diese Vergleichsfunktion sortiert die Schlüsseltabelleneinträge nach ihrem Langtext2.
 * @param a Erster Schlüsseltabelleneintrag.
 * @param b Zweiter Schlüsseltabelleneintrag.
 */
export const luxLookupCompareLangText2Fn: LuxLookupCompareFn = (a: LuxLookupTableEntry, b: LuxLookupTableEntry) => {
  const aText = a?.langText2 ?? '';
  const bText = b?.langText2 ?? '';

  return aText.localeCompare(bText);
};

@Directive()
export abstract class LuxLookupComponent<T> extends LuxFormLegacyValueBase<T> implements OnInit, OnDestroy {
  readonly luxLookupId = input('');
  readonly luxTableNo = input('');
  readonly luxRenderProp = input<any>();
  readonly luxRenderPropNoPropertyLabel = input('---');
  readonly luxBehandlungUngueltige = input(LuxBehandlungsOptionenUngueltige.ausgrauen);
  readonly luxParameters = input<LuxLookupParameters | undefined>(undefined);
  readonly luxCustomStyles = input<object | null | undefined>(undefined);
  readonly luxCustomInvalidStyles = input<object | null | undefined>(undefined);
  readonly luxCompareFn = input<LuxLookupCompareFn | undefined>(undefined);

  readonly luxDataLoaded = output<boolean>();
  readonly luxDataLoadedAsArray = output<T[]>();

  entries: LuxLookupTableEntry[] = [];
  apiPath = LuxComponentsConfigService.DEFAULT_CONFIG.lookupServiceUrl;
  subscriptions: Subscription[] = [];

  protected lookupService = inject(LuxLookupService);
  protected lookupHandler = inject(LuxLookupHandlerService);
  protected configService = inject(LuxComponentsConfigService);

  override ngOnInit() {
    super.ngOnInit();

    if (!this.luxParameters()) {
      throw Error(`The lookup component with the table number ${this.luxTableNo()} has no LookupParameter.`);
    }

    if (!this.luxLookupId()) {
      throw Error(`The lookup component with the table number ${this.luxTableNo()} has no LookupId.`);
    }

    this.lookupHandler.addLookupElement(this.luxLookupId());

    const lookupElementObs = this.lookupHandler.getLookupElementObsv(this.luxLookupId());
    if (!lookupElementObs) {
      throw Error(`Observable "${this.luxLookupId()}" not found."`);
    }

    this.subscriptions.push(
      lookupElementObs.subscribe(() => {
        this.fetchLookupData();
      })
    );

    this.subscriptions.push(
      this.configService.config.subscribe((newConfig: LuxComponentsConfigParameters) => {
        this.apiPath = newConfig.lookupServiceUrl ?? LuxComponentsConfigService.DEFAULT_CONFIG.lookupServiceUrl;

        this.lookupHandler.reloadData(this.luxLookupId());
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Gibt zurueck, ob die RenderProperty eine Funktion ist oder nicht.
   * @returns boolean
   */
  isRenderPropAFunction(): boolean {
    return typeof this.luxRenderProp() === 'function';
  }

  /**
   * Gibt zurück ob sich das entsprechende Element in der Liste ungültiger Elemente befindet.
   * @param LuxLookupTableEntry entry
   * @param entry
   * @returns boolean
   */
  isUngueltig(entry: LuxLookupTableEntry) {
    let isUngueltig = false;

    if (entry) {
      const nowFormatted = new Date().toISOString().slice(0, 10).replace(/-/g, '');

      if (entry.gueltigkeitVon) {
        isUngueltig = nowFormatted < entry.gueltigkeitVon;
      }

      if (!isUngueltig && entry.gueltigkeitBis) {
        isUngueltig = nowFormatted > entry.gueltigkeitBis;
      }
    }

    return isUngueltig;
  }

  /**
   * Gibt zurück ob ungültige Einträge angezeigt werden sollen.
   * @returns boolean
   */
  showUngueltige() {
    return (
      this.luxBehandlungUngueltige() === LuxBehandlungsOptionenUngueltige.ausgrauen ||
      this.luxBehandlungUngueltige() === LuxBehandlungsOptionenUngueltige.anzeigen
    );
  }

  /**
   * Gibt zurück ob ungültige Einträge deaktiviert werden sollen.
   * @returns boolean
   */
  disableUngueltige() {
    return this.luxBehandlungUngueltige() === LuxBehandlungsOptionenUngueltige.ausgrauen;
  }

  /**
   * Gibt die mitgegebenen Styles abhaengig ob das Element invalid ist zurueck.
   * @param boolean invalid
   * @param invalid
   * @returns LuxLookupOptionStyle
   */
  getStyles(invalid: boolean | undefined) {
    if (invalid) {
      return this.luxCustomInvalidStyles() ? this.luxCustomInvalidStyles() : {};
    }
    return this.luxCustomStyles() ? this.luxCustomStyles() : {};
  }

  /**
   * @override
   * @param value
   * @param errors
   */
  override errorMessageModifier(value: any, errors: LuxValidationErrors): string | undefined {
    if (errors['ungueltig']) {
      return this.tService.translate(`luxc.lookup.error_message.invalid`);
    }
    return undefined;
  }

  /**
   * Jede Wertänderung (intern wie extern) läuft hier zusammen - übernimmt hier die Prüfung auf
   * ungültige Einträge, die früher LuxLookupErrorStateMatcher.isErrorState() erledigte (dort an
   * [errorStateMatcher]/NgControl gekoppelt, das ohne [formControl] nicht mehr automatisch läuft).
   *
   * Reentrancy-geschützt (emitValueChangeRunning): syncUngueltigValidator() ruft
   * formControl.updateValueAndValidity() OHNE {emitEvent:false} auf, was auch valueChanges erneut
   * feuert (nicht nur statusChanges) - ohne diesen Guard würde das sofort wieder emitValueChange()
   * aufrufen und in einer Endlosschleife enden (siehe LuxDatepickerComponent.processValueChange()
   * für dasselbe Muster bei einem anderen Auslöser). Ableitende Klassen mit eigener
   * updateValueAndValidity()-Synchronisation (siehe LuxLookupAutocompleteComponent) prüfen denselben
   * Guard an ihrem eigenen emitValueChange()-Einstiegspunkt.
   */
  override emitValueChange(value: T) {
    if (this.emitValueChangeRunning) {
      return;
    }

    try {
      this.emitValueChangeRunning = true;
      this.syncUngueltigValidator();
      super.emitValueChange(value);
    } finally {
      this.emitValueChangeRunning = false;
    }
  }

  /**
   * Prüft, ob der aktuelle Wert (ein oder mehrere Einträge) einen ungültigen Eintrag enthält, und
   * setzt/entfernt den "ungueltig"-Fehler entsprechend. Registriert den Validator beim ersten Aufruf
   * einmalig (addValidators mit einer stabilen Funktionsreferenz ist idempotent). Der Aufrufer
   * (emitValueChange()) trägt die Reentrancy-Absicherung.
   */
  protected syncUngueltigValidator() {
    if (!this.formControl) {
      return;
    }

    if (!this.ungueltigValidatorRegistered) {
      this.ungueltigValidatorRegistered = true;
      this.formControl.addValidators(this.ungueltigValidator);
    }

    this.formControl.updateValueAndValidity();
  }

  /**
   * Schützt vor rekursiven emitValueChange()-Aufrufen, ausgelöst durch ein formControl.
   * updateValueAndValidity() innerhalb von emitValueChange() selbst (siehe syncUngueltigValidator()
   * bzw. LuxLookupAutocompleteComponent.syncNoResultValidator()). Geteilt (protected) statt privat,
   * damit ableitende Klassen an ihrem eigenen emitValueChange()-Einstiegspunkt denselben Schutz
   * nutzen, statt eine eigene, redundante Guard-Variable anzulegen.
   */
  protected emitValueChangeRunning = false;

  private ungueltigValidatorRegistered = false;

  private readonly ungueltigValidator: ValidatorFn = (control) => {
    const value = control.value;
    if (value === null || value === undefined) {
      return null;
    }

    const isEntryUngueltig = (entry: any) => !!entry?.isUngueltig;
    const invalid = Array.isArray(value) ? value.some(isEntryUngueltig) : isEntryUngueltig(value);

    return invalid ? { ungueltig: 'true' } : null;
  };

  getLabel(entry: any): string {
    if (this.isRenderPropAFunction()) {
      return this.luxRenderProp()(entry);
    }

    const renderProp = this.luxRenderProp();
    if (Object.hasOwn(entry, renderProp as string) && entry[renderProp as string]) {
      return entry[renderProp as string];
    } else {
      return this.luxRenderPropNoPropertyLabel();
    }
  }

  /**
   * Holt die Lookup-Table Daten vom Backend
   */
  protected fetchLookupData() {
    const parameters = this.luxParameters();
    if (!parameters) {
      throw Error('LuxParameters not found!');
    }

    const backendRequest = this.lookupService.getLookupTable(this.luxTableNo(), parameters, this.apiPath);
    this.subscriptions.push(
      backendRequest.subscribe(
        (entries: LuxLookupTableEntry[]) => {
          this.setLookupData(entries);
          this.luxDataLoaded.emit(true);
          this.luxDataLoadedAsArray.emit(entries as any);
        },
        () => {
          this.luxDataLoaded.emit(false);
        }
      )
    );
  }

  /**
   * Setzt die aktuellen Werte auf die mitgegebenen Entries.
   * @param entries
   */
  protected setLookupData(entries: LuxLookupTableEntry[]) {
    this.entries = entries;

    const compareFn = this.luxCompareFn();
    if (this.entries && compareFn) {
      this.entries.sort(compareFn);
    }

    if (this.entries) {
      // Merken welche Einträge ungültig sind, um bei vielen Informationen
      // nicht die ganzen Funktionsaufrufe zu haben
      this.entries.forEach((entry: LuxLookupTableEntry) => {
        entry.isUngueltig = this.isUngueltig(entry);
      });
    }
  }
}
