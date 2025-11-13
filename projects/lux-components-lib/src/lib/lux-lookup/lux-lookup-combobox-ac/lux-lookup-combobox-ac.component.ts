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
    NgStyle
  ]
})
export class LuxLookupComboboxAcComponent<T = LuxLookupTableEntry> extends LuxLookupComponent<T> implements AfterViewInit, OnDestroy {
  /**
   * Wenn es weniger oder gleich viele selektierte Einträge sind, wird der höchste Index ermittelt und alle Optionen bis dahin geladen.
   * Wenn es mehr sind, werden alle Optionen nachgeladen, um Performance-Probleme beim Ermitteln des höchsten Index zu vermeiden.
   */
  private static readonly SELECTED_ENTRIES_THRESHOLD = 5;

  @Input() luxMultiple = false;
  @Input() luxEntryBlockSize = 25;
  @Input() luxWithEmptyEntry = true;
  @Input() luxNoLabels = false;
  @Input() luxNoTopLabel = false;
  @Input() luxNoBottomLabel = false;

  @ViewChild(MatSelect) matSelect!: MatSelect;

  stateMatcher: LuxLookupErrorStateMatcher;
  displayedEntries: LuxLookupTableEntry[] = [];
  invisibleEntries: LuxLookupTableEntry[] = [];
  subscription?: Subscription;
  private panelScrollHandler?: EventListener;
  private panelElement?: Element;

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
        // Panel ist beim ersten Öffnen evtl. noch nicht initialisiert
        setTimeout(() => {
          if (this.matSelect.panel) {
            this.registerPanelScrollEvent(this.matSelect.panel.nativeElement);
          }
        });
      } else {
        this.removePanelScrollEvent();
      }
    });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.subscription?.unsubscribe();
    this.removePanelScrollEvent();
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

    this.displayedEntries = [];
    this.invisibleEntries = [...entries];
    this.updateDisplayedEntries();
    this.ensureSelectedEntriesLoaded();
  }

  /**
   * Setzt den aktuellen Value-Wert auf den ausgewählten Wert.
   * @param selectChange
   */
  selected(selectChange: MatSelectChange) {
    this.luxValue = selectChange.value;
  }

  /**
   * Fügt beim Öffnen des Selects einen Scroll-Listener hinzu.
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
    const position = event.target as any;
    if (position && (position.scrollTop + position.clientHeight) / position.scrollHeight > 85 / 100) {
      this.updateDisplayedEntries();
    }
  }

  /**
   * Lädt den nächsten Block Daten aus den Entries nach.
   */
  updateDisplayedEntries(blockSize = this.luxEntryBlockSize) {
    if (this.invisibleEntries.length > 0) {
      const start = 0;
      const end = Math.min(blockSize, this.invisibleEntries.length);
      this.displayedEntries.push(...this.invisibleEntries.splice(start, end));
    }
  }

  /**
   * Stellt sicher, dass die selektierten Einträge in displayedEntries geladen sind.
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
   * Wrapper-Klick: Fokus setzen und Panel öffnen (falls erlaubt).
   * Vermeidet komplexe Template-Ausdrücke, verbessert Lesbarkeit.
   */
  onWrapperClick() {
    if (this.luxDisabled || this.luxReadonly) {
      return;
    }

    // Fokus setzen über das zugrunde liegende MatSelect
    try {
      this.matSelect?.focus();
    } catch {
      // Ignorieren falls nicht möglich
    }

    // Panel nur öffnen, wenn noch nicht offen
    if (this.matSelect && !this.matSelect.panelOpen) {
      if (!this.matSelect!.panelOpen) {
        this.matSelect!.open();
      }
    }
  }

  private ensureSingleSelectedEntryLoaded() {
    if (this.luxValue && this.invisibleEntries.length > 0) {
      // Prüfen, ob der selektierte Wert bereits in displayedEntries ist
      const selectedFound = this.displayedEntries.some((entry) => this.compareByKey(entry, this.luxValue as LuxLookupTableEntry));

      if (!selectedFound) {
        // Finde den Index des selektierten Eintrags
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
        // Prüfen, ob alle selektierten Werte bereits in displayedEntries sind
        const allSelectedFound = luxValueArray.every((selectedEntry: LuxLookupTableEntry) =>
          this.displayedEntries.some((entry) => this.compareByKey(entry, selectedEntry))
        );

        if (!allSelectedFound) {
          // Finde die Indizes der selektierten Einträge
          const newIndices = luxValueArray
            .map((selectedEntry: LuxLookupTableEntry) =>
              this.invisibleEntries.findIndex((entry) => this.compareByKey(entry, selectedEntry))
            )
            .filter((index) => index >= 0);

          // Lade die neuen Einträge basierend auf den Indizes
          if (newIndices.length > 0) {
            const maxIndex = Math.max(...newIndices);
            this.updateDisplayedEntries(maxIndex + 1);
          }
        }
      } else {
        // Bei zu vielen selektierten Einträgen alle auf einmal laden
        this.updateDisplayedEntries(this.invisibleEntries.length);
      }
    }
  }
}
