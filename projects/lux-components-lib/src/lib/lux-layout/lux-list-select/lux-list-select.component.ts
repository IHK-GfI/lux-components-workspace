import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, contentChild, effect, inject, input, model, output, TemplateRef } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatRadioGroup } from '@angular/material/radio';
import { LuxPageEvent, LuxPaginatorComponent } from '@ihk-gfi/lux-components/lux-paginator';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { LuxBadgeComponent } from '../../lux-common/lux-badge/lux-badge.component';
import { LuxLabelComponent } from '../../lux-common/lux-label/lux-label.component';
import { LuxInfiniteScrollDirective } from '../../lux-directives/lux-infinite-scroll/lux-infinite-scroll.directive';
import { LuxListSelectItemComponent } from './lux-list-select-subcomponents/lux-list-select-item.component';
import { LuxListSelectMode } from './lux-list-select-model/lux-list-select-types';

@Component({
  selector: 'lux-list-select',
  templateUrl: './lux-list-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxListSelectItemComponent,
    MatRadioGroup,
    NgTemplateOutlet,
    MatCheckbox,
    LuxBadgeComponent,
    LuxLabelComponent,
    TranslocoPipe,
    LuxPaginatorComponent,
    LuxInfiniteScrollDirective
  ],
  host: {
    class: 'lux-list-select'
  }
})
export class LuxListSelectComponent<T = unknown> {
  private static nextUniqueId = 0;

  private tService = inject(TranslocoService);
  private readonly uniqueId = LuxListSelectComponent.nextUniqueId++;

  readonly luxMode = input<LuxListSelectMode>('multi');
  readonly luxItems = input<T[]>([]);
  readonly luxLabelProp = input('label');
  readonly luxSubLabelProp = input('subLabel');
  readonly luxDisabledProp = input('disabled');
  readonly luxCompareWith = input<(a: T, b: T) => boolean>((a, b) => a === b);
  readonly luxLabel = input<string | undefined>(undefined);
  readonly luxDisabled = input(false);
  readonly luxTagId = input<string | undefined>(undefined);
  readonly luxShowDetailButton = input(false);
  readonly luxDetailIconName = input('lux-interface-arrows-expand-5');
  readonly luxTotalItems = input<number | null>(null);
  readonly luxSelectAllLabel = input<string | undefined>(undefined);
  readonly luxShowCounter = input(true);
  readonly luxShowPagination = input(false);
  readonly luxPageSize = input(5);
  readonly luxInfiniteScroll = input(false);
  readonly luxIsLoading = input(false);
  readonly luxMaxHeight = input<string | null>(null);

  readonly luxSelected = model<T[]>([]);
  readonly luxPageIndex = model(0);
  readonly luxDetailClicked = output<T>();
  readonly luxPageChange = output<LuxPageEvent>();
  readonly luxScrolled = output<void>();

  readonly contentTemplate = contentChild<TemplateRef<unknown>>(TemplateRef);

  protected listLabel = computed(() => this.luxLabel() ?? this.tService.translate('luxc.list-select.arialabel'));
  protected totalCount = computed(() => this.luxTotalItems() ?? this.luxItems().length);
  protected enabledItems = computed(() => this.luxItems().filter((item) => !this.isItemDisabled(item)));
  protected allSelected = computed(() => {
    const enabled = this.enabledItems();
    return enabled.length > 0 && enabled.every((item) => this.isSelected(item));
  });
  protected partiallySelected = computed(() => this.luxSelected().length > 0 && !this.allSelected());
  protected counterLabelId = computed(() => `${this.luxTagId() ?? 'lux-list-select'}-counter-${this.uniqueId}`);
  protected paginationActive = computed(() => this.luxShowPagination());
  protected infiniteScrollActive = computed(() => this.luxInfiniteScroll() && !this.luxShowPagination());

  constructor() {
    effect(() => {
      if (this.luxMode() === 'single' && this.luxSelected().length > 1) {
        this.luxSelected.set([this.luxSelected()[0]]);
      }
    });

    effect(() => {
      if (this.luxShowPagination() && this.luxInfiniteScroll()) {
        console.error('lux-list-select: luxShowPagination und luxInfiniteScroll schließen sich gegenseitig aus. Es wird die Paginierung verwendet.');
      }
    });
  }

  isSelected(item: T): boolean {
    const compare = this.luxCompareWith();
    return this.luxSelected().some((selected) => compare(selected, item));
  }

  toggleItem(item: T) {
    if (this.luxDisabled() || this.isItemDisabled(item)) {
      return;
    }
    if (this.luxMode() === 'single') {
      if (!this.isSelected(item)) {
        this.luxSelected.set([item]);
      }
    } else {
      const compare = this.luxCompareWith();
      if (this.isSelected(item)) {
        this.luxSelected.update((selected) => selected.filter((entry) => !compare(entry, item)));
      } else {
        this.luxSelected.update((selected) => [...selected, item]);
      }
    }
  }

  onSelectAllChange(checked: boolean) {
    if (this.luxDisabled()) {
      return;
    }
    this.luxSelected.set(checked ? [...this.enabledItems()] : []);
  }

  onPageChange(event: LuxPageEvent) {
    this.luxPageChange.emit(event);
  }

  onScrolled() {
    this.luxScrolled.emit();
  }

  protected getLabel(item: T): string {
    const value = (item as Record<string, unknown>)[this.luxLabelProp()];
    return value !== undefined && value !== null ? String(value) : '';
  }

  protected getSubLabel(item: T): string | null {
    const value = (item as Record<string, unknown>)[this.luxSubLabelProp()];
    return value !== undefined && value !== null ? String(value) : null;
  }

  protected isItemDisabled(item: T): boolean {
    return (item as Record<string, unknown>)[this.luxDisabledProp()] === true;
  }
}
