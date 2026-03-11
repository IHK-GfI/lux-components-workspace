import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
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
export class LuxSelectPanelFilterComponent implements AfterViewInit, OnChanges {
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

  ngAfterViewInit(): void {
    this.syncNativeInputAttributes();
    this.syncDirectiveBindings();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['placeholder']) {
      this.syncNativeInputAttributes();
    }

    if (changes['filterDirective']) {
      this.syncDirectiveBindings();
    }

    if (changes['filterValue'] || changes['filterDirective']) {
      this.syncFilterValueToDirective();
    }
  }

  private syncDirectiveBindings(): void {
    if (this.filterDirective && this.filterInput) {
      this.filterDirective.setFilterInputRef(this.filterInput);
    }
  }

  private syncFilterValueToDirective(): void {
    if (!this.filterDirective) {
      return;
    }

    const nextValue = this.filterValue ?? '';
    if (nextValue === this.filterDirective.filterValue) {
      return;
    }

    this.filterDirective.onFilterInput(nextValue);
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
    if (this.filterDirective) {
      this.filterDirective.onFilterInput(value ?? '');
    }

    this.filterChange.emit(value ?? '');
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.filterDirective) {
      const handled = this.filterDirective.handleKeydown(event);
      if (handled || event.key !== 'Escape') {
        event.stopPropagation();
      }

      return;
    }

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
