import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  computed,
  contentChild,
  contentChildren,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  ChangeDetectionStrategy
} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxMenuItemComponent } from '../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-item.component';
import { LuxMenuTriggerComponent } from '../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-trigger.component';
import { LuxMenuComponent } from '../../lux-action/lux-menu/lux-menu.component';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxTooltipDirective } from '../../lux-directives/lux-tooltip/lux-tooltip.directive';
import { LuxChipsComponent } from '../../lux-form/lux-chips/lux-chips.component';
import { LuxChipComponent } from '../../lux-form/lux-chips/lux-chips-subcomponents/lux-chip.component';
import { LuxSelectComponent } from '../../lux-form/lux-select/lux-select.component';
import { LuxAccordionComponent } from '../../lux-layout/lux-accordion/lux-accordion.component';
import { LuxCardActionsComponent } from '../../lux-layout/lux-card/lux-card-subcomponents/lux-card-actions.component';
import { LuxCardContentExpandedComponent } from '../../lux-layout/lux-card/lux-card-subcomponents/lux-card-content-expanded.component';
import { LuxCardContentComponent } from '../../lux-layout/lux-card/lux-card-subcomponents/lux-card-content.component';
import { LuxCardInfoComponent } from '../../lux-layout/lux-card/lux-card-subcomponents/lux-card-info.component';
import { LuxCardComponent } from '../../lux-layout/lux-card/lux-card.component';
import { LuxPanelActionComponent } from '../../lux-layout/lux-panel/lux-panel-subcomponents/lux-panel-action.component';
import { LuxPanelContentComponent } from '../../lux-layout/lux-panel/lux-panel-subcomponents/lux-panel-content.component';
import { LuxPanelHeaderTitleComponent } from '../../lux-layout/lux-panel/lux-panel-subcomponents/lux-panel-header-title.component';
import { LuxPanelComponent } from '../../lux-layout/lux-panel/lux-panel.component';
import { LuxLookupComboboxComponent } from '../../lux-lookup/lux-lookup-combobox/lux-lookup-combobox.component';
import {
  DIALOG_WIDTH_SMALL_PX,
  ILuxDialogConfig,
  minWidth
} from '../../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-config.interface';
import { LuxDialogService } from '../../lux-popups/lux-dialog/lux-dialog.service';
import { LuxThemePalette } from '../../lux-util/lux-colors.enum';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxFilter } from '../lux-filter-base/lux-filter';
import { LuxFilterItem } from '../lux-filter-base/lux-filter-item';
import { LuxFilterItemDirective } from '../lux-filter-base/lux-filter-item.directive';
import { LuxFilterLoadDialogComponent } from '../lux-filter-dialog/lux-filter-load-dialog/lux-filter-load-dialog.component';
import { LuxFilterSaveDialogComponent } from '../lux-filter-dialog/lux-filter-save-dialog/lux-filter-save-dialog.component';
import { LuxFilterFormExtendedComponent } from './lux-filter-form-extended/lux-filter-form-extended.component';

@Component({
  selector: 'lux-filter-form',
  templateUrl: './lux-filter-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown.shift.enter)': 'onShiftEnter()'
  },
  imports: [
    LuxAccordionComponent,
    LuxPanelComponent,
    LuxPanelHeaderTitleComponent,
    NgTemplateOutlet,
    LuxPanelContentComponent,
    LuxPanelActionComponent,
    LuxCardComponent,
    LuxCardInfoComponent,
    LuxCardContentComponent,
    LuxCardContentExpandedComponent,
    LuxCardActionsComponent,
    FormsModule,
    ReactiveFormsModule,
    LuxButtonComponent,
    LuxTooltipDirective,
    LuxMenuComponent,
    LuxMenuItemComponent,
    LuxMenuTriggerComponent,
    NgClass,
    LuxChipsComponent,
    LuxAriaLabelDirective,
    LuxChipComponent,
    TranslocoPipe
  ]
})
export class LuxFilterFormComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly luxTitle = input('');
  readonly luxButtonRaised = input(false);
  readonly luxButtonFlat = input(false);
  readonly luxButtonFilterLabel = input('');
  readonly luxButtonFilterColor = input<LuxThemePalette>('primary');
  readonly luxButtonResetLabel = input('');
  readonly luxButtonResetColor = input<LuxThemePalette | undefined>(undefined);
  readonly luxButtonSaveLabel = input('');
  readonly luxButtonSaveColor = input<LuxThemePalette | undefined>(undefined);
  readonly luxButtonLoadLabel = input('');
  readonly luxButtonLoadColor = input<LuxThemePalette | undefined>(undefined);
  readonly luxButtonDialogSave = input<LuxThemePalette>('primary');
  readonly luxButtonDialogLoad = input<LuxThemePalette>('primary');
  readonly luxButtonDialogDelete = input<LuxThemePalette>('warn');
  readonly luxButtonDialogCancel = input<LuxThemePalette | undefined>(undefined);
  readonly luxButtonDialogClose = input<LuxThemePalette | undefined>(undefined);
  readonly luxDefaultFilterMessage = input('');
  readonly luxShowChips = input(true);
  readonly luxHideChipsBorder = input(false);
  readonly luxHideMenu = input(false);
  readonly luxStoredFilters = input<LuxFilter[]>([]);
  readonly luxDisableShortcut = input(false);
  readonly luxShowAsCard = input(false);
  readonly luxExpandedLabelOpen = input('');
  readonly luxExpandedLabelClose = input('');
  readonly luxShowSaveAction = input(true);
  readonly luxShowLoadAction = input(true);

  readonly luxFilterExpanded = model(false);
  readonly luxFilterValues = input<any>({});

  readonly luxOnSave = output<LuxFilter>();
  readonly luxOnLoad = output<string>();
  readonly luxOnFilter = output<string>();
  readonly luxOnDelete = output<LuxFilter>();
  readonly luxOnReset = output<void>();

  readonly formElementesQL = contentChildren(LuxFilterItemDirective, { descendants: true });
  readonly extendedOptions = contentChild(LuxFilterFormExtendedComponent);

  dialogConfig: ILuxDialogConfig = {
    width: minWidth(DIALOG_WIDTH_SMALL_PX),
    height: 'auto',
    panelClass: []
  };
  formElementes: LuxFilterItemDirective[] = [];
  filterForm: FormGroup;
  subscriptions: Subscription[] = [];
  readonly filterItems = signal<LuxFilterItem<any>[]>([]);
  readonly initComplete = signal(false);
  initFilterValue = null;
  readonly isMobile = signal(false);

  private dialogService = inject(LuxDialogService);
  private cdr = inject(ChangeDetectorRef);
  private mediaQuery = inject(LuxMediaQueryObserverService);
  private lastAppliedFilterValues: any = undefined;

  private readonly filterValuesSnapshot = computed(() => JSON.parse(JSON.stringify(this.luxFilterValues())));

  constructor() {
    this.filterForm = new FormGroup({});

    // Reagiert auf spätere Änderungen von luxFilterValues (nach Abschluss der Initialisierung).
    // Die initiale Anwendung übernimmt registerFilterItems(); der Reference-Guard verhindert
    // eine doppelte Verarbeitung unabhängig davon, ob dieser Effect vor oder nach dem
    // (deferred) setTimeout in registerFilterItems() zuerst läuft.
    effect(() => {
      const filter = this.luxFilterValues();
      if (filter === this.lastAppliedFilterValues) return;
      this.lastAppliedFilterValues = filter;

      if (!this.initComplete()) return;

      const newFilter = this.createFilterObject();
      this.filterForm.patchValue(newFilter);
      this.onFilter();
    });
  }

  ngOnInit(): void {
    this.initFilterValue = this.luxFilterValues();

    this.subscriptions.push(
      this.mediaQuery.getMediaQueryChangedAsObservable().subscribe((query) => {
        this.isMobile.set(query === 'xs' || query === 'sm');
      })
    );
  }

  ngAfterViewInit(): void {
    this.registerFilterItems(this.formElementesQL());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }

  openSaveDialog() {
    const dialogRef = this.dialogService.openComponent(LuxFilterSaveDialogComponent, this.dialogConfig, this);

    this.subscriptions.push(
      dialogRef.dialogClosed.subscribe((result: any) => {
        if (typeof result === 'string') {
          this.onSave(result);
        }
      })
    );
  }

  openLoadDialog() {
    const dialogRef = this.dialogService.openComponent(LuxFilterLoadDialogComponent, this.dialogConfig, this);

    this.subscriptions.push(
      dialogRef.dialogClosed.subscribe((result: any) => {
        if (typeof result === 'string') {
          this.onLoad(result);
        }
      })
    );
  }

  onDelete(filter: LuxFilter) {
    this.luxOnDelete.emit(filter);
  }

  onSave(filterName: string) {
    const newFilter = new LuxFilter();
    newFilter.name = filterName;
    newFilter.data = JSON.parse(JSON.stringify(this.filterForm.value));

    this.onFilter();

    this.luxOnSave.emit(newFilter);
  }

  onLoad(filtername: string) {
    // Hier werden sicherheitshalber alle Filter zurückgesetzt, für den Fall,
    // dass der Aufrufer nicht alle Filterwerte überschreibt. Vielleicht sind auch neue
    // Filterwerte hinzugekommen, etc.
    this.formElementes.forEach((item) => {
      this.filterForm.get(item.filterItem.binding)!.setValue(item.filterItem.defaultValues[0]);
    });

    // Filter zuklappen.
    this.luxFilterExpanded.set(false);

    // Hier wird nur ein Event mit dem zu ladenden Filternamen verschickt.
    // Der Empfänger hat jetzt die Aufgabe, die entsprechenden Filterdaten zu laden und
    // über luxFilterValues setzen.
    this.luxOnLoad.emit(filtername);
  }

  onReset() {
    // Hier werden alle Filter zurückgesetzt.
    this.formElementes.forEach((item) => {
      this.filterForm.get(item.filterItem.binding)!.setValue(item.filterItem.defaultValues[0]);
    });

    // Filtern...
    this.onFilter();

    // Chips aktualisieren
    this.updateFilterChips();

    // Die Interessenten darüber informieren, dass ein Filterreset durchgeführt wurde.
    this.luxOnReset.emit();
  }

  filterChipRemoved(indexRemoved: number) {
    // Ermittle den Filterchip, der entfernt werden soll.
    const filterItems = [...this.filterItems()];
    const removedFilterItem: LuxFilterItem<any> = filterItems.splice(indexRemoved, 1)[0];
    this.filterItems.set(filterItems);

    if (
      (removedFilterItem.component instanceof LuxSelectComponent || removedFilterItem.component instanceof LuxLookupComboboxComponent) &&
      removedFilterItem.component.luxMultiple()
    ) {
      // Fall: Multiselect
      // Kopie erstellen und nicht nur das bestehende Array manipulieren.
      const newSelected = [...this.filterForm.get(removedFilterItem.binding)!.value];
      // Gelöschten Wert entfernen.
      newSelected.splice(removedFilterItem.multiValueIndex, 1);
      // Das neue Array in das Formularcontrol setzen.
      this.filterForm.get(removedFilterItem.binding)!.setValue(newSelected);
    } else {
      // Fall: Wert (einfach)
      this.filterForm.get(removedFilterItem.binding)!.setValue(removedFilterItem.defaultValues[0]);
    }

    // Filtern...
    this.onFilter();
  }

  onShiftEnter() {
    // Alle eventuell noch offenen Popups/Panels der Formularelemente schließen.
    //
    // Beispielszenario:
    // Man navigiert im Filterformular über die Tabulator-Taste in ein
    // Autocomplete-Feld. Automatisch würde sich das Panel mit den vorhandenen
    // Optionen öffnen. Als Nächstes könnte man beim geöffneten Optionspanel
    // über die Tastenkombination "Shift + Enter" das Filtern auslösen. Das
    // Filterpanel würde sich nach dem Filtern schließen, aber das Optionspanel
    // des Autocomplete-Feld-Feldes würde stehen bleiben. Dasselbe Problem
    // besteht natürlich auch beim Datepicker, Timepicker, Select und den
    // Lookup-Komponenten. Aus diesem Grund werden hier zuerst alle geöffneten
    // Popups/Panels geschlossen. Im Anschluss wird wie gewohnt gefiltert.
    if (!this.luxDisableShortcut()) {
      this.formElementes.forEach((formComponent) => {
        if (formComponent) {
          if (formComponent.datepickerAuthentic && formComponent.datepickerAuthentic.matDatepicker) {
            formComponent.datepickerAuthentic.matDatepicker()?.close();
          } else if (formComponent.datetimepickerAuthentic && formComponent.datetimepickerAuthentic.dateTimeOverlayComponent) {
            formComponent.datetimepickerAuthentic.dateTimeOverlayComponent()?.close();
          } else if (formComponent.timepickerAuthentic && formComponent.timepickerAuthentic.matTimepicker) {
            formComponent.timepickerAuthentic.matTimepicker()?.close();
          } else if (formComponent.selectAuthentic && formComponent.selectAuthentic.matSelect) {
            formComponent.selectAuthentic.matSelect()?.close();
          } else if (formComponent.autoCompleteAuthentic) {
            formComponent.autoCompleteAuthentic.matAutoComplete()?.closePanel();
          } else if (formComponent.autoCompleteLookupAuthentic && formComponent.autoCompleteLookupAuthentic.matAutocompleteTrigger) {
            formComponent.autoCompleteLookupAuthentic.matAutocompleteTrigger()?.closePanel();
          } else if (formComponent.selectLookupAuthentic) {
            formComponent.selectLookupAuthentic.matSelect()?.close();
          }
        }
      });

      this.onFilter();
      this.cdr.detectChanges();
    }
  }

  onFilter() {
    this.onFilterIntern(true);
  }

  onFilterIntern(changeExpandState: boolean) {
    if (this.filterForm.valid) {
      if (changeExpandState) {
        // Filter zuklappen.
        this.luxFilterExpanded.set(false);
      }

      // Filterchips aktualisieren.
      this.updateFilterChips();

      // Die Interessenten darüber informieren, dass gefiltert werden soll.
      this.luxOnFilter.emit(JSON.parse(JSON.stringify(this.filterForm.value)));
    } else {
      LuxUtil.showValidationErrors(this.filterForm);
    }
  }

  registerFilterItems(filterItemDirectives: readonly LuxFilterItemDirective[]) {
    // An dieser Codestelle ist setTimeout nötig, wenn die Inhalte über eine LUX-Layout-Form-Row gesetzt werden.
    // D.h. initial gibt es keine Filteritems, aber dann werden die Filteritems über ngAfterContentInit hinzugefügt.
    setTimeout(() => {
      filterItemDirectives.forEach((item) => {
        this.filterForm.addControl(item.filterItem.binding, item.filterItem.component.formControl);
        this.formElementes.push(item);
      });

      this.filterForm.patchValue(this.luxFilterValues());

      // Der Filter ist jetzt vollständig. D.h. alle Formularelemente sind bekannt,
      // die zugehörigen Controls wurden erzeugt und die Werte gesetzt.
      // Jetzt ist die Initialisierung abgeschlossen und die Filterchips können
      // aktualisiert werden.
      this.initComplete.set(true);
      this.lastAppliedFilterValues = this.luxFilterValues();

      // Da die Initialisierung der Komponente verzögert stattfindet,
      // muss noch einmal geprüft werden, ob sich der initiale Filterwert
      // in der Zwischenzeit geändert hat.
      // Wenn sich der Filterwert geändert hat, muss das Filtern ausgelöst werden.
      // Wenn der Filterwert gleichgeblieben ist, müssen nur die Filterchips aktualisiert werden.
      if (this.luxFilterValues() !== this.initFilterValue) {
        this.onFilterIntern(false);
      } else {
        this.updateFilterChips();
      }
    });
  }

  private createFilterObject() {
    const newFilter: any = {};

    if (this.formElementes && this.filterValuesSnapshot()) {
      // Alle Filterfelder werden auf ihre Defaultwerte zurückgesetzt.
      //
      // Erklärung:
      // Dies ist nötig, da nicht zwangsweise alle Filterwerte übergeben
      // werden müssen. D.h. obwohl es 5 Filterelemente gibt,
      // werden vielleicht nur die Werte von 3 Filterfeldern
      // übergeben und somit blieben die Filterwerte der zwei
      // übrigen Filterfelder erhalten.
      this.formElementes.forEach((item) => {
        if (
          item &&
          item.filterItem &&
          item.filterItem.binding &&
          item.filterItem.defaultValues &&
          item.filterItem.defaultValues.length > 0
        ) {
          newFilter[item.filterItem.binding] = item.filterItem.defaultValues[0];
        }
      });

      // Überschreiben der Defaultwerte mit den aktuellen Filterwerten.
      Object.assign(newFilter, this.filterValuesSnapshot());
    }

    return newFilter;
  }

  private updateFilterChips() {
    if (this.initComplete()) {
      const newFilterItems: LuxFilterItem<any>[] = [];

      this.formElementes.forEach((formItem) => {
        if (formItem.filterItem && formItem.filterItem.binding && this.filterForm.get(formItem.filterItem.binding)) {
          const value = this.filterForm.get(formItem.filterItem.binding)!.value;

          if (
            !formItem.filterItem.component.formControl.disabled &&
            formItem.filterItem.defaultValues.findIndex((defaultValue) => defaultValue === value) === -1
          ) {
            if (Array.isArray(value)) {
              let i = 0;
              value.forEach((selected) => {
                const newFilterItem = new LuxFilterItem(
                  formItem.filterItem.label,
                  formItem.filterItem.binding,
                  formItem.filterItem.component
                );
                Object.assign(newFilterItem, formItem.filterItem);
                newFilterItem.value = newFilterItem.renderFn(newFilterItem, selected);
                newFilterItem.multiValueIndex = i++;
                newFilterItems.push(newFilterItem);
              });
            } else {
              formItem.filterItem.value = formItem.filterItem.renderFn(formItem.filterItem, value);
              newFilterItems.push(formItem.filterItem);
            }
          }
        }
      });

      this.filterItems.set(newFilterItems);
    }
  }
}
