import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxInputAcComponent } from '../lux-input-ac/lux-input-ac.component';
import { LuxInputAcSuffixComponent } from '../lux-input-ac/lux-input-ac-subcomponents/lux-input-ac-suffix.component';
import { LuxSelectFilterDirective } from './lux-select-filter.directive';

@Component({
  selector: 'lux-select-panel-filter',
  templateUrl: './lux-select-panel-filter.component.html',
  styleUrls: ['./lux-select-panel-filter.component.scss'],
  imports: [LuxInputAcComponent, LuxInputAcSuffixComponent, LuxButtonComponent]
})
export class LuxSelectPanelFilterComponent implements OnInit, AfterViewInit, OnChanges {
  /**
   * Referenz auf die Filter-Directive.
   * Wenn gesetzt, wird die Directive direkt aufgerufen statt Events zu emittieren.
   */
  @Input() filterDirective?: LuxSelectFilterDirective;

  @Input() placeholder = 'Filter';
  @Input() filterValue = '';
  @Input() clearAriaLabel = 'Clear filter';

  @Output() filterChange = new EventEmitter<string>();
  @Output() escapePressed = new EventEmitter<KeyboardEvent>();
  @Output() arrowKeyPressed = new EventEmitter<KeyboardEvent>();

  @ViewChild('filterInput') filterInputComponent?: LuxInputAcComponent<string>;

  get filterInput(): ElementRef<HTMLInputElement> | undefined {
    return this.filterInputComponent?.inputElement as ElementRef<HTMLInputElement> | undefined;
  }

  /**
   * Gibt den aktuellen Filter-Wert zurück.
   * Wenn eine Directive gesetzt ist, wird deren Wert verwendet.
   */
  get currentFilterValue(): string {
    return this.filterDirective?.filterValue ?? this.filterValue;
  }

  ngOnInit(): void {
    // Registriere Input-Referenz bei Directive für Focus-Management
    if (this.filterDirective && this.filterInput) {
      this.filterDirective.setFilterInputRef(this.filterInput);
    }
  }

  ngAfterViewInit(): void {
    this.syncNativeInputAttributes();

    // Registriere Input-Referenz bei Directive nach View-Init
    if (this.filterDirective && this.filterInput) {
      this.filterDirective.setFilterInputRef(this.filterInput);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['placeholder']) {
      this.syncNativeInputAttributes();
    }
  }

  private syncNativeInputAttributes(): void {
    const nativeInput = this.filterInput?.nativeElement;
    if (nativeInput) {
      nativeInput.classList.add('lux-select-panel-filter-input');
      nativeInput.setAttribute('role', 'searchbox');
      nativeInput.setAttribute('aria-autocomplete', 'list');
      nativeInput.setAttribute('aria-label', this.placeholder);
    }
  }

  onInput(value: string): void {
    // Wenn Directive vorhanden, direkt aufrufen
    if (this.filterDirective) {
      this.filterDirective.onFilterInput(value ?? '');
    }
    // Event trotzdem emittieren für Rückwärtskompatibilität
    this.filterChange.emit(value ?? '');
  }

  onKeydown(event: KeyboardEvent): void {
    event.stopPropagation();

    // Wenn Directive vorhanden, Keyboard-Navigation delegieren
    if (this.filterDirective) {
      this.filterDirective.handleKeydown(event);
      return;
    }

    // Fallback: Events emittieren (Rückwärtskompatibilität)
    if (event.key === 'Escape') {
      this.escapePressed.emit(event);
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter') {
      this.arrowKeyPressed.emit(event);
    }
  }

  onClearMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onClear(event: Event): void {
    event.stopPropagation();

    // Wenn Directive vorhanden, Filter zurücksetzen
    if (this.filterDirective) {
      this.filterDirective.onFilterInput('');
    }

    this.filterChange.emit('');
    this.filterInput?.nativeElement.focus();
  }

  stopPanelEvent(event: Event): void {
    event.stopPropagation();
  }
}
