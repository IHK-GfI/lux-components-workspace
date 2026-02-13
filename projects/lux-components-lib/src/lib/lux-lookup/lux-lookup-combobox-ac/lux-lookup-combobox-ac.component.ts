import { NgClass, NgStyle } from '@angular/common';
import { AfterViewInit, Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { Subscription } from 'rxjs';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxAriaLabelledbyDirective } from '../../lux-directives/lux-aria/lux-aria-labelledby.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxFormControlWrapperComponent } from '../../lux-form/lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxSelectFilterHelper } from '../../lux-form/lux-select-filter/lux-select-filter.helper';
import { LuxSelectPanelFilterComponent } from '../../lux-form/lux-select-filter/lux-select-panel-filter.component';
import { LuxLookupComponent } from '../lux-lookup-model/lux-lookup-component';
import { LuxLookupErrorStateMatcher } from '../lux-lookup-model/lux-lookup-error-state-matcher';
import { LuxLookupTableEntry } from '../lux-lookup-model/lux-lookup-table-entry';

@Component({
  selector: 'lux-lookup-combobox-ac',
  templateUrl: './lux-lookup-combobox-ac.component.html',
  styleUrls: ['./lux-lookup-combobox-ac.component.scss'],
  imports: [
    LuxFormControlWrapperComponent,
    ReactiveFormsModule,
    NgClass,
    MatSelect,
    LuxTagIdDirective,
    LuxAriaDescribedbyDirective,
    LuxAriaLabelledbyDirective,
    MatOption,
    NgStyle,
    LuxSelectPanelFilterComponent
  ]
})
export class LuxLookupComboboxAcComponent<T = LuxLookupTableEntry> extends LuxLookupComponent<T> implements AfterViewInit, OnDestroy {
  /**
   * Wenn es weniger oder gleich viele selektierte Eintr�ge sind, wird der h�chste Index ermittelt und alle Optionen bis dahin geladen.
   * Wenn es mehr sind, werden alle Optionen nachgeladen, um Performance-Probleme beim Ermitteln des h�chsten Index zu vermeiden.
   */
  private static readonly SELECTED_ENTRIES_THRESHOLD = 5;

  @Input() luxMultiple = false;
  @Input() luxEntryBlockSize = 25;
  @Input() luxWithEmptyEntry = true;
  @Input() luxEnableFilter = false;
  @Input() luxFilterPlaceholder = 'Filter';
  @Input() luxNoLabels = false;
  @Input() luxNoTopLabel = false;
  @Input() luxNoBottomLabel = false;

  @ViewChild(MatSelect) matSelect!: MatSelect;
  @ViewChild(LuxSelectPanelFilterComponent) panelFilter?: LuxSelectPanelFilterComponent;

  stateMatcher: LuxLookupErrorStateMatcher;
  displayedEntries: LuxLookupTableEntry[] = [];
  filteredEntries: LuxLookupTableEntry[] = [];
  invisibleEntries: LuxLookupTableEntry[] = [];
  subscription?: Subscription;
  private filterHelper = new LuxSelectFilterHelper();
  private entryFilterCache = new Map<LuxLookupTableEntry, string>();
  private panelScrollHandler?: EventListener;
  private panelElement?: Element;

  get filterValue(): string {
    return this.filterHelper.filterValue;
  }

  set filterValue(value: string) {
    this.filterHelper.filterValue = value;
  }

  constructor() {
    super();

    this.stateMatcher = new LuxLookupErrorStateMatcher(this);
  }

  override notifyFormValueChanged(formValue: any): void {
    super.notifyFormValueChanged(formValue);
    this.ensureSelectedEntriesLoaded();
  }

  ngAfterViewInit() {
    this.subscription = this.matSelect.openedChange.subscribe((open: boolean) => {
      if (open) {
        // Panel ist beim ersten �ffnen evtl. noch nicht initialisiert.
        setTimeout(() => {
          if (this.matSelect.panel) {
            this.registerPanelScrollEvent(this.matSelect.panel.nativeElement);
          }
        });

        if (this.luxEnableFilter) {
          this.filterHelper.focusFilterInput(this.panelFilter?.filterInput);
        }
      } else {
        this.removePanelScrollEvent();
        this.clearFilter();
      }
    });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.subscription?.unsubscribe();
    this.removePanelScrollEvent();
    this.filterHelper.clearFocus();
  }

  /**
   * Vergleicht die Optionen anhand der Key-Werte
   * @param value1
   * @param value2
   * @returns boolean
   */
  compareByKey(value1: LuxLookupTableEntry, value2: LuxLookupTableEntry) {
    const key1 = value1 ? value1.key : -1;
    const key2 = value2 ? value2.key : -2;

    return key1 === key2;
  }

  override setLookupData(entries: LuxLookupTableEntry[]) {
    super.setLookupData(entries);

    this.rebuildEntryFilterCache(entries);
    this.displayedEntries = [];
    this.filteredEntries = [];
    this.invisibleEntries = [...entries];
    this.updateDisplayedEntries();
    this.ensureSelectedEntriesLoaded();
    this.refreshFilteredEntries();
  }

  /**
   * Setzt den aktuellen Value-Wert auf den ausgew�hlten Wert.
   * @param selectChange
   */
  selected(selectChange: MatSelectChange) {
    this.luxValue = selectChange.value;
  }

  onFilterInput(value: string) {
    this.filterValue = value;

    if (this.isFilterActive() && this.invisibleEntries.length > 0) {
      this.updateDisplayedEntries(this.invisibleEntries.length);
    }

    this.refreshFilteredEntries();
  }

  onFilterKeydown(event: KeyboardEvent) {
    this.filterHelper.handleFilterKeydown(event, this.matSelect);
  }

  /**
   * F�gt beim �ffnen des Selects einen Scroll-Listener hinzu.
   * @param panelElement
   */
  private registerPanelScrollEvent(panelElement: Element) {
    if (this.panelElement !== panelElement) {
      this.removePanelScrollEvent();
      this.panelElement = panelElement;
      this.panelScrollHandler = (event: Event) => this.loadOnScroll(event);
      this.panelElement.addEventListener('scroll', this.panelScrollHandler);
    }
  }

  private removePanelScrollEvent() {
    if (this.panelElement && this.panelScrollHandler) {
      this.panelElement.removeEventListener('scroll', this.panelScrollHandler);
      this.panelElement = undefined;
      this.panelScrollHandler = undefined;
    }
  }

  private loadOnScroll(event: Event) {
    if (this.isFilterActive()) {
      return;
    }

    const position = event.target as any;
    if (position && (position.scrollTop + position.clientHeight) / position.scrollHeight > 85 / 100) {
      this.updateDisplayedEntries();
    }
  }

  /**
   * L�dt den n�chsten Block Daten aus den Entries nach.
   */
  updateDisplayedEntries(blockSize = this.luxEntryBlockSize) {
    if (this.invisibleEntries.length > 0) {
      const start = 0;
      const end = Math.min(blockSize, this.invisibleEntries.length);
      this.displayedEntries.push(...this.invisibleEntries.splice(start, end));
    }

    this.refreshFilteredEntries();
  }

  /**
   * Stellt sicher, dass die selektierten Eintr�ge in displayedEntries geladen sind.
   * Wenn nicht, werden sie nachgeladen.
   */
  ensureSelectedEntriesLoaded() {
    if (Array.isArray(this.luxValue)) {
      this.ensureMultipleSelectedEntriesLoaded();
    } else {
      this.ensureSingleSelectedEntryLoaded();
    }
  }

  /**
   * Wrapper-Klick: Fokus setzen und Panel �ffnen (falls erlaubt).
   * Vermeidet komplexe Template-Ausdr�cke, verbessert Lesbarkeit.
   */
  onWrapperClick() {
    this.filterHelper.handleWrapperClick(this.matSelect, this.luxDisabled, this.luxReadonly);
  }

  private ensureSingleSelectedEntryLoaded() {
    if (this.luxValue && this.invisibleEntries.length > 0) {
      // Pr�fen, ob der selektierte Wert bereits in displayedEntries ist.
      const selectedFound = this.displayedEntries.some((entry) => this.compareByKey(entry, this.luxValue as LuxLookupTableEntry));

      if (!selectedFound) {
        // Finde den Index des selektierten Eintrags.
        const newIndex = this.invisibleEntries.findIndex((entry) => this.compareByKey(entry, this.luxValue as LuxLookupTableEntry));
        if (newIndex >= 0) {
          this.updateDisplayedEntries(newIndex + 1);
        }
      }
    }
  }

  private ensureMultipleSelectedEntriesLoaded() {
    const luxValueArray = this.luxValue as LuxLookupTableEntry[];
    if (luxValueArray.length > 0 && this.invisibleEntries.length > 0) {
      if (luxValueArray.length <= LuxLookupComboboxAcComponent.SELECTED_ENTRIES_THRESHOLD) {
        // Pr�fen, ob alle selektierten Werte bereits in displayedEntries sind.
        const allSelectedFound = luxValueArray.every((selectedEntry: LuxLookupTableEntry) =>
          this.displayedEntries.some((entry) => this.compareByKey(entry, selectedEntry))
        );

        if (!allSelectedFound) {
          // Finde die Indizes der selektierten Eintr�ge.
          const newIndices = luxValueArray
            .map((selectedEntry: LuxLookupTableEntry) => this.invisibleEntries.findIndex((entry) => this.compareByKey(entry, selectedEntry)))
            .filter((index) => index >= 0);

          // Lade die neuen Eintr�ge basierend auf den Indizes.
          if (newIndices.length > 0) {
            const maxIndex = Math.max(...newIndices);
            this.updateDisplayedEntries(maxIndex + 1);
          }
        }
      } else {
        // Bei zu vielen selektierten Eintr�gen alle auf einmal laden.
        this.updateDisplayedEntries(this.invisibleEntries.length);
      }
    }
  }

  private clearFilter() {
    this.filterHelper.clearFilter();
    this.refreshFilteredEntries();
  }

  isFilterActive() {
    return this.luxEnableFilter && this.filterHelper.isFilterActive();
  }

  private rebuildEntryFilterCache(entries: LuxLookupTableEntry[]): void {
    this.entryFilterCache.clear();
    entries.forEach((entry) => {
      this.entryFilterCache.set(entry, this.normalizeEntry(entry));
    });
  }

  private normalizeEntry(entry: LuxLookupTableEntry): string {
    const key = entry?.key ?? '';
    const label = this.getLabel(entry);
    return `${key} ${label}`.toLocaleLowerCase();
  }

  private refreshFilteredEntries(): void {
    if (!this.isFilterActive()) {
      this.filteredEntries = [...this.displayedEntries];
      return;
    }

    this.filteredEntries = this.displayedEntries.filter((entry) => {
      const cachedLabel = this.entryFilterCache.get(entry) ?? this.normalizeEntry(entry);
      return this.filterHelper.matchesFilter(cachedLabel, this.filterValue);
    });
  }
}
