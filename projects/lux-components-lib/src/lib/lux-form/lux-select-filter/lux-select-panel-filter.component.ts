import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  input,
  untracked,
  viewChild
} from '@angular/core';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxInputAcSuffixComponent } from '../lux-input-ac/lux-input-ac-subcomponents/lux-input-ac-suffix.component';
import { LuxInputAcComponent } from '../lux-input-ac/lux-input-ac.component';
import { LuxSelectFilterDirective } from './lux-select-filter.directive';

@Component({
  selector: 'lux-select-panel-filter',
  templateUrl: './lux-select-panel-filter.component.html',
  styleUrls: ['./lux-select-panel-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxInputAcComponent, LuxInputAcSuffixComponent, LuxButtonComponent]
})
export class LuxSelectPanelFilterComponent implements AfterViewInit {
  readonly filterDirective = input.required<LuxSelectFilterDirective>();

  readonly placeholder = input('Filter');
  readonly filterValue = input('');
  readonly clearAriaLabel = input('Clear filter');

  readonly filterInputComponent = viewChild<LuxInputAcComponent<string>>('filterInput');

  get currentFilterValue(): string {
    return this.filterDirective()?.filterValue ?? this.filterValue();
  }

  readonly filterInput = computed(() => this.filterInputComponent()?.inputElement() as ElementRef<HTMLInputElement> | undefined);

  constructor() {
    effect(() => {
      this.placeholder();
      this.filterInput();

      untracked(() => this.syncNativeInputAttributes());
    });

    effect(() => {
      this.filterDirective();
      this.filterInput();

      untracked(() => this.syncDirectiveBindings());
    });

    effect(() => {
      this.filterValue();
      this.filterDirective();

      untracked(() => this.syncFilterValueToDirective());
    });
  }

  ngAfterViewInit(): void {
    this.syncNativeInputAttributes();
    this.syncDirectiveBindings();
  }

  onInput(value: string): void {
    this.filterDirective().onFilterInput(value ?? '');
  }

  onKeydown(event: KeyboardEvent): void {
    const handled = this.filterDirective().handleKeydown(event);
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
    this.filterDirective().onFilterInput('');
    this.filterInput()?.nativeElement.focus({ preventScroll: true });
  }

  stopPanelEvent(event: Event): void {
    event.stopPropagation();
  }

  private syncDirectiveBindings(): void {
    const filterInput = this.filterInput();

    if (filterInput) {
      this.filterDirective().setFilterInputRef(filterInput);
    }
  }

  private syncFilterValueToDirective(): void {
    const nextValue = this.filterValue() ?? '';
    if (nextValue === this.filterDirective().filterValue) {
      return;
    }

    this.filterDirective().onFilterInput(nextValue);
  }

  private syncNativeInputAttributes(): void {
    const nativeInput = this.filterInput()?.nativeElement;
    if (nativeInput) {
      nativeInput.classList.add('lux-select-panel-filter-input');
      nativeInput.setAttribute('role', 'searchbox');
      nativeInput.setAttribute('aria-autocomplete', 'list');
      nativeInput.setAttribute('aria-label', this.placeholder());
    }
  }
}
