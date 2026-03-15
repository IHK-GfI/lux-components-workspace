import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
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
  @Input({ required: true }) filterDirective!: LuxSelectFilterDirective;

  @Input() placeholder = 'Filter';
  @Input() filterValue = '';
  @Input() clearAriaLabel = 'Clear filter';

  @ViewChild('filterInput') filterInputComponent?: LuxInputAcComponent<string>;

  get filterInput(): ElementRef<HTMLInputElement> | undefined {
    return this.filterInputComponent?.inputElement as ElementRef<HTMLInputElement> | undefined;
  }

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
    if (this.filterInput) {
      this.filterDirective.setFilterInputRef(this.filterInput);
    }
  }

  private syncFilterValueToDirective(): void {
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
    this.filterDirective.onFilterInput(value ?? '');
  }

  onKeydown(event: KeyboardEvent): void {
    const handled = this.filterDirective.handleKeydown(event);
    if (handled || event.key !== 'Escape') {
      event.stopPropagation();
    }
  }

  onClearMouseDown(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onClear(event: Event): void {
    event.stopPropagation();
    this.filterDirective.onFilterInput('');
    this.filterInput?.nativeElement.focus({ preventScroll: true });
  }

  stopPanelEvent(event: Event): void {
    event.stopPropagation();
  }
}
