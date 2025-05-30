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

  constructor() {
    super();

    this.stateMatcher = new LuxLookupErrorStateMatcher(this);
  }

  ngAfterViewInit() {
    this.subscription = this.matSelect.openedChange.subscribe((open: boolean) => {
      if (open) {
        this.registerPanelScrollEvent(this.matSelect.panel.nativeElement);
      }
    });
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.subscription?.unsubscribe();
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
    panelElement.addEventListener('scroll', (event) => this.loadOnScroll(event));
  }

  /**
   * Stößt das Nachladen von Elementen an, wenn ein bestimmter Scrollwert erreicht wurde.
   * @param event - ScrollEvent
   */
  private loadOnScroll(event: Event) {
    const position = event.target as any;
    if (position && (position.scrollTop + position.clientHeight) / position.scrollHeight > 85 / 100) {
      this.updateDisplayedEntries();
    }
  }

  /**
   * Läd den nächsten Block Daten aus den Entries nach.
   */
  updateDisplayedEntries() {
    if (this.invisibleEntries.length > 0) {
      const start = 0;
      const end = Math.min(this.luxEntryBlockSize, this.invisibleEntries.length);
      this.displayedEntries.push(...this.invisibleEntries.splice(start, end));
    }
  }
}
