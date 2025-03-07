import { Directive, EventEmitter, Input, OnDestroy, OnInit, Output, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { LuxComponentsConfigParameters } from '../../lux-components-config/lux-components-config-parameters.interface';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxFormComponentBase, LuxValidationErrors } from '../../lux-form/lux-form-model/lux-form-component-base.class';
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
export abstract class LuxLookupComponent<T> extends LuxFormComponentBase<T> implements OnInit, OnDestroy {
  LuxBehandlungsOptionenUngueltige = LuxBehandlungsOptionenUngueltige;

  protected lookupService = inject(LuxLookupService);
  protected lookupHandler = inject(LuxLookupHandlerService);

  entries: LuxLookupTableEntry[] = [];
  apiPath = LuxComponentsConfigService.DEFAULT_CONFIG.lookupServiceUrl;

  @Input() luxPlaceholder = '';
  @Input() luxLookupId!: string;
  @Input() luxTableNo!: string;
  @Input() luxRenderProp: any;
  @Input() luxRenderPropNoPropertyLabel = '---';
  @Input() luxBehandlungUngueltige: LuxBehandlungsOptionenUngueltige = LuxBehandlungsOptionenUngueltige.ausgrauen;
  @Input() luxParameters?: LuxLookupParameters;
  @Input() luxCustomStyles?: object | null;
  @Input() luxCustomInvalidStyles?: object | null;
  @Input() luxCompareFn?: LuxLookupCompareFn;
  @Input() luxTagId?: string;
  @Output() luxDataLoaded = new EventEmitter<boolean>();
  @Output() luxDataLoadedAsArray: EventEmitter<T[]> = new EventEmitter<T[]>();
  @Output() luxValueChange = new EventEmitter<T>();

  subscriptions: Subscription[] = [];

  get luxValue(): T {
    return this.getValue();
  }

  @Input() set luxValue(value: T) {
    this.setValue(value);
  }

  override ngOnInit() {
    super.ngOnInit();

    if (!this.luxParameters) {
      throw Error(`The lookup component with the table number ${this.luxTableNo} has no LookupParameter.`);
    }

    if (!this.luxLookupId) {
      throw Error(`The lookup component with the table number ${this.luxTableNo} has no LookupId.`);
    }

    this.lookupHandler.addLookupElement(this.luxLookupId);

    const lookupElementObs = this.lookupHandler.getLookupElementObsv(this.luxLookupId);
    if (!lookupElementObs) {
      throw Error(`Observable "${this.luxLookupId}" not found."`);
    }

    this.subscriptions.push(
      lookupElementObs.subscribe(() => {
        this.fetchLookupData();
      })
    );

    this.subscriptions.push(
      this.configService.config.subscribe((newConfig: LuxComponentsConfigParameters) => {
        this.apiPath = newConfig.lookupServiceUrl ?? LuxComponentsConfigService.DEFAULT_CONFIG.lookupServiceUrl;

        this.lookupHandler.reloadData(this.luxLookupId);
      })
    );
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Gibt zurueck, ob die RenderProperty eine Funktion ist oder nicht.
   * @returns boolean
   */
  isRenderPropAFunction(): boolean {
    return typeof this.luxRenderProp === 'function';
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
      this.luxBehandlungUngueltige === this.LuxBehandlungsOptionenUngueltige.ausgrauen ||
      this.luxBehandlungUngueltige === this.LuxBehandlungsOptionenUngueltige.anzeigen
    );
  }

  /**
   * Gibt zurück ob ungültige Einträge deaktiviert werden sollen.
   * @returns boolean
   */
  disableUngueltige() {
    return this.luxBehandlungUngueltige === this.LuxBehandlungsOptionenUngueltige.ausgrauen;
  }

  /**
   * Gibt die mitgegebenen Styles abhaengig ob das Element invalid ist zurueck.
   * @param boolean invalid
   * @param invalid
   * @returns LuxLookupOptionStyle
   */
  getStyles(invalid: boolean | undefined) {
    if (invalid) {
      return this.luxCustomInvalidStyles ? this.luxCustomInvalidStyles : {};
    }
    return this.luxCustomStyles ? this.luxCustomStyles : {};
  }

  /**
   * @override
   * @param value
   * @param errors
   */
  override errorMessageModifier(value: any, errors: LuxValidationErrors): string | undefined {
    if (errors['ungueltig']) {
      return $localize`:@@luxc.lookup.error_message.invalid:Der ausgewählte Wert ist ungültig.`;
    }
    return undefined;
  }

  getLabel(entry: any): string {
    if (this.isRenderPropAFunction()) {
      return this.luxRenderProp(entry);
    }

    if (Object.hasOwn(entry, this.luxRenderProp as string) && entry[this.luxRenderProp as string]) {
      return entry[this.luxRenderProp as string];
    } else {
      return this.luxRenderPropNoPropertyLabel;
    }
  }

  /**
   * Holt die Lookup-Table Daten vom Backend
   */
  protected fetchLookupData() {
    if (!this.luxParameters) {
      throw Error('LuxParameters not found!');
    }

    const backendRequest = this.lookupService.getLookupTable(this.luxTableNo, this.luxParameters, this.apiPath);
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

    if (this.entries && this.luxCompareFn) {
      this.entries.sort(this.luxCompareFn);
    }

    if (this.entries) {
      // Merken welche Einträge ungültig sind, um bei vielen Informationen
      // nicht die ganzen Funktionsaufrufe zu haben
      this.entries.forEach((entry: LuxLookupTableEntry) => {
        entry.isUngueltig = this.isUngueltig(entry);
      });
    }
  }

  override notifyFormValueChanged(formValue: any) {
    this.luxValueChange.emit(formValue);
  }
}
