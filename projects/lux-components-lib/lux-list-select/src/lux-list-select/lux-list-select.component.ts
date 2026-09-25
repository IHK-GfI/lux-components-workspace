import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  effect,
  inject,
  input,
  Injector,
  model,
  output,
  signal,
  TemplateRef,
  viewChildren
} from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { LuxPageEvent, LuxPaginatorComponent } from '@ihk-gfi/lux-components/lux-paginator';
import { translateSignal, TranslocoPipe } from '@jsverse/transloco';
import { ILuxMessage, LuxBadgeComponent, LuxIconComponent, LuxInfiniteScrollDirective, LuxInputAcComponent, LuxInputAcPrefixComponent, LuxLabelComponent, LuxMessageBoxComponent, LuxProgressComponent, LuxTagIdDirective } from '@ihk-gfi/lux-components';
import { LuxListSelectItemComponent } from './lux-list-select-subcomponents/lux-list-select-item.component';
import { ILuxListSelectHttpDao } from './lux-list-select-model/lux-list-select-http-dao.interface';
import { LuxListSelectMode, LuxListSelectSize } from './lux-list-select-model/lux-list-select-types';
import { LuxListSelectKeyboardController } from './lux-list-select-keyboard-controller';
import { LuxListSelectDataSource } from './lux-list-select-data-source';
import { announceSearchResults } from './lux-list-select-search-announcer';

@Component({
  selector: 'lux-list-select',
  templateUrl: './lux-list-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxListSelectItemComponent,
    NgTemplateOutlet,
    MatCheckbox,
    LuxBadgeComponent,
    LuxLabelComponent,
    TranslocoPipe,
    LuxPaginatorComponent,
    LuxInfiniteScrollDirective,
    LuxTagIdDirective,
    LuxMessageBoxComponent,
    LuxIconComponent,
    LuxProgressComponent,
    LuxInputAcComponent,
    LuxInputAcPrefixComponent
  ],
  host: {
    class: 'lux-list-select'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: LuxListSelectComponent,
      multi: true
    }
  ]
})
export class LuxListSelectComponent<T = unknown> implements ControlValueAccessor {
  private static nextUniqueId = 0;

  private readonly injector = inject(Injector);
  private readonly uniqueId = LuxListSelectComponent.nextUniqueId++;

  readonly luxMode = input<LuxListSelectMode>('multi');
  readonly luxSize = input<LuxListSelectSize>('default');
  readonly luxItems = input<T[]>([]);
  readonly luxTitleProp = input('title');
  readonly luxSubTitleProp = input('subTitle');
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
  readonly luxErrorMessage = input<string | null>(null);
  readonly luxShowSearch = input(false);
  readonly luxSearchDelay = input(300);
  readonly luxHttpDao = input<ILuxListSelectHttpDao<T> | undefined>(undefined);

  readonly luxSelected = model<T[]>([]);
  readonly luxPageIndex = model(0);
  readonly luxSearchValue = model('');
  readonly luxDetailClicked = output<T>();
  readonly luxPageChange = output<LuxPageEvent>();
  readonly luxScrolled = output<void>();

  readonly contentTemplate = contentChild<TemplateRef<unknown>>(TemplateRef);

  private onChange: (value: T[]) => void = () => {};
  private onTouched: () => void = () => {};
  private cvaDisabled = signal(false);

  // viewChildren kann T nicht herleiten; der Keyboard-Controller castet zurück auf T.
  private readonly items = viewChildren(LuxListSelectItemComponent);
  private readonly keyboard = new LuxListSelectKeyboardController<T>(
    this.items,
    { toggleItem: (item) => this.toggleItem(item) },
    this.injector
  );
  protected innerNavigation = this.keyboard.innerNavigation;
  protected activeItemIndex = this.keyboard.activeItemIndex;
  // Eigener name pro Instanz, sonst teilen sich Radios instanzübergreifend den CDK-UniqueSelectionDispatcher.
  protected radioName = computed(() => `lux-list-select-radio-${this.uniqueId}`);

  // Ist ein DAO gesetzt, kommen die angezeigten Daten ausschließlich vom Server; luxItems und Client-Filterung/-Slicing werden ignoriert.
  private readonly dataSource = new LuxListSelectDataSource<T>(
    {
      httpDao: this.luxHttpDao,
      pageSize: this.luxPageSize,
      pageIndex: this.luxPageIndex,
      showPagination: this.luxShowPagination,
      infiniteScroll: this.luxInfiniteScroll,
      searchValue: this.luxSearchValue,
      searchDelay: this.luxSearchDelay
    },
    this.injector
  );
  protected debouncedSearch = this.dataSource.filter;
  protected loading = this.dataSource.loading;
  protected daoItems = this.dataSource.daoItems;
  protected daoTotalCount = this.dataSource.daoTotalCount;
  protected serverMode = computed(() => !!this.luxHttpDao());

  private defaultListLabel = translateSignal('luxc.list-select.arialabel');
  protected listLabel = computed(() => this.luxLabel() ?? this.defaultListLabel());
  protected filteredItems = computed(() => {
    const items = this.luxItems();
    if (!this.luxShowSearch()) {
      return items;
    }
    const term = this.debouncedSearch().toLowerCase();
    if (term === '') {
      return items;
    }
    return items.filter(
      (item) => this.getTitle(item).toLowerCase().includes(term) || (this.getSubTitle(item) ?? '').toLowerCase().includes(term)
    );
  });
  protected displayedItems = computed(() => {
    if (this.serverMode()) {
      return this.daoItems();
    }
    const filtered = this.filteredItems();
    if (!this.paginationActive()) {
      return filtered;
    }
    const start = this.luxPageIndex() * this.luxPageSize();
    return filtered.slice(start, start + this.luxPageSize());
  });
  protected totalCount = computed(() => (this.serverMode() ? this.daoTotalCount() : (this.luxTotalItems() ?? this.filteredItems().length)));
  protected effectiveIsLoading = computed(() => (this.serverMode() ? this.loading() : this.luxIsLoading()));
  protected enabledItems = computed(() => this.displayedItems().filter((item) => !this.isItemDisabled(item)));
  protected allSelected = computed(() => {
    const enabled = this.enabledItems();
    return enabled.length > 0 && enabled.every((item) => this.isSelected(item));
  });
  protected partiallySelected = computed(() => {
    const enabled = this.enabledItems();
    const selectedCount = enabled.filter((item) => this.isSelected(item)).length;
    return selectedCount > 0 && selectedCount < enabled.length;
  });
  protected counterLabelId = computed(() => `${this.luxTagId() ?? 'lux-list-select'}-counter-${this.uniqueId}`);
  protected paginationActive = computed(() => this.luxShowPagination());
  protected infiniteScrollActive = computed(() => this.luxInfiniteScroll() && !this.luxShowPagination());
  protected componentDisabled = computed(() => this.luxDisabled() || this.cvaDisabled());
  protected errorMessages = computed<ILuxMessage[]>(() => {
    const message = this.luxErrorMessage();
    return message ? [{ text: message, iconName: 'lux-interface-alert-warning-triangle', color: 'yellow' }] : [];
  });
  protected viewportLoading = computed(() => this.serverMode() && this.loading());

  constructor() {
    // Bewusst ein computed-Paar statt combineLatest: combineLatest würde bei gleichzeitiger Änderung
    // beider Signale zuerst ein Zwischenpaar aus neuem Modus und alter Selektion liefern.
    toObservable(computed(() => ({ mode: this.luxMode(), selected: this.luxSelected() })))
      .pipe(takeUntilDestroyed())
      .subscribe(({ mode, selected }) => {
        if (mode === 'single' && selected.length > 1) {
          this.luxSelected.set([selected[0]]);
          this.onChange(this.luxSelected());
        }
      });

    effect(() => {
      if (this.luxShowPagination() && this.luxInfiniteScroll()) {
        console.error(
          'lux-list-select: luxShowPagination und luxInfiniteScroll schließen sich gegenseitig aus. Es wird die Paginierung verwendet.'
        );
      }
    });

    // Bewusst die Trefferzahl der Suche und nicht totalCount(): das wäre bei gesetztem luxTotalItems die Gesamtanzahl.
    announceSearchResults(
      {
        active: this.luxShowSearch,
        term: this.debouncedSearch,
        count: computed(() => (this.serverMode() ? this.daoTotalCount() : this.filteredItems().length)),
        loading: this.effectiveIsLoading
      },
      this.injector
    );
  }

  isSelected(item: T): boolean {
    const compare = this.luxCompareWith();
    return this.luxSelected().some((selected) => compare(selected, item));
  }

  toggleItem(item: T) {
    if (this.componentDisabled() || this.isItemDisabled(item)) {
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
    this.onChange(this.luxSelected());
    this.onTouched();
  }

  protected onGridFocus(event: FocusEvent): void {
    this.keyboard.onGridFocus(event);
  }

  protected onGridFocusOut(event: FocusEvent): void {
    this.keyboard.onGridFocusOut(event);
  }

  protected onGridKeydown(event: KeyboardEvent): void {
    this.keyboard.onGridKeydown(event);
  }

  protected onItemActivated(index: number): void {
    this.keyboard.onItemActivated(index);
  }

  onSelectAllChange(checked: boolean) {
    if (this.componentDisabled()) {
      return;
    }
    const compare = this.luxCompareWith();
    const pageItems = this.enabledItems();
    if (checked) {
      this.luxSelected.update((selected) => [...selected, ...pageItems.filter((item) => !selected.some((entry) => compare(entry, item)))]);
    } else {
      this.luxSelected.update((selected) => selected.filter((entry) => !pageItems.some((item) => compare(entry, item))));
    }
    this.onChange(this.luxSelected());
    this.onTouched();
  }

  onPageChange(event: LuxPageEvent) {
    this.luxPageChange.emit(event);
  }

  onScrolled() {
    this.luxScrolled.emit();
    this.dataSource.loadNextPage();
  }

  writeValue(value: T[] | null): void {
    let normalized = Array.isArray(value) ? value : [];
    if (this.luxMode() === 'single' && normalized.length > 1) {
      normalized = [normalized[0]];
    }
    this.luxSelected.set(normalized);
  }

  registerOnChange(fn: (value: T[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.cvaDisabled.set(isDisabled);
  }

  protected getTitle(item: T): string {
    const value = (item as Record<string, unknown>)[this.luxTitleProp()];
    return value !== undefined && value !== null ? String(value) : '';
  }

  protected getSubTitle(item: T): string | null {
    const value = (item as Record<string, unknown>)[this.luxSubTitleProp()];
    return value !== undefined && value !== null ? String(value) : null;
  }

  protected isItemDisabled(item: T): boolean {
    return (item as Record<string, unknown>)[this.luxDisabledProp()] === true;
  }
}
