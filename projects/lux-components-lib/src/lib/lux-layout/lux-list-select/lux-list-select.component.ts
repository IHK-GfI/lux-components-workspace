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
  untracked,
  viewChildren
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { LuxPageEvent, LuxPaginatorComponent } from '@ihk-gfi/lux-components/lux-paginator';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { debounce, timer } from 'rxjs';
import { LuxBadgeComponent } from '../../lux-common/lux-badge/lux-badge.component';
import { LuxLabelComponent } from '../../lux-common/lux-label/lux-label.component';
import { LuxInfiniteScrollDirective } from '../../lux-directives/lux-infinite-scroll/lux-infinite-scroll.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxMessageBoxComponent } from '../../lux-common/lux-message-box/lux-message-box.component';
import { ILuxMessage } from '../../lux-common/lux-message-box/lux-message-box-model/lux-message.interface';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxProgressComponent } from '../../lux-common/lux-progress/lux-progress.component';
import { LuxListSelectItemComponent } from './lux-list-select-subcomponents/lux-list-select-item.component';
import { ILuxListSelectHttpDao } from './lux-list-select-model/lux-list-select-http-dao.interface';
import { LuxListSelectMode } from './lux-list-select-model/lux-list-select-types';
import { LuxListSelectKeyboardController } from './lux-list-select-keyboard-controller';
import { LuxListSelectDataSource } from './lux-list-select-data-source';

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
    LuxProgressComponent
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

  private tService = inject(TranslocoService);
  private readonly injector = inject(Injector);
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

  // Generic bleibt <unknown>, da viewChildren den Typparameter T nicht herleiten kann;
  // der Keyboard-Controller castet in toggleActiveItem() zurück auf T.
  private readonly items = viewChildren(LuxListSelectItemComponent);
  private readonly keyboard = new LuxListSelectKeyboardController<T>(
    this.items,
    { toggleItem: (item) => this.toggleItem(item) },
    this.injector
  );
  // Bearbeiten-Modus und aktiver Item-Index des Keyboard-Controllers, an das Template durchgereicht
  // (siehe lux-list-select-keyboard-controller.ts für die komplette Grid-Tastatur-/Fokuslogik).
  protected editMode = this.keyboard.editMode;
  protected activeItemIndex = this.keyboard.activeItemIndex;
  // Ohne eigenen name teilen sich Radios instanzübergreifend den CDK-UniqueSelectionDispatcher,
  // wodurch eine Selektion in dieser Instanz die Checked-Optik einer anderen Instanz löschen würde.
  protected radioName = computed(() => `lux-list-select-radio-${this.uniqueId}`);

  // Entkoppelt Eingabe und Filterwirkung: Filterung/Events reagieren erst nach luxSearchDelay.
  private searchValue$ = toObservable(this.luxSearchValue);
  protected debouncedSearch = toSignal(this.searchValue$.pipe(debounce(() => timer(this.luxSearchDelay()))), { initialValue: '' });

  // DAO-Server-Modus (Hausmuster lux-table-data-source): Ist ein DAO gesetzt, kommen die angezeigten
  // Daten ausschließlich vom Server, luxItems und die Client-Filterung/-Slicing werden ignoriert.
  // Die komplette DAO-Orchestrierung (Laden, Fehlerbehandlung, Ladezustand) steckt in der DataSource,
  // die Wiring-Effects unten stoßen sie nur an (siehe lux-list-select-data-source.ts).
  private readonly dataSource = new LuxListSelectDataSource<T>(this.luxHttpDao, this.luxPageSize, this.injector);
  protected loading = this.dataSource.loading;
  protected daoItems = this.dataSource.daoItems;
  protected daoTotalCount = this.dataSource.daoTotalCount;
  protected serverMode = computed(() => !!this.luxHttpDao());

  protected listLabel = computed(() => this.luxLabel() ?? this.tService.translate('luxc.list-select.arialabel'));
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
      (item) => this.getLabel(item).toLowerCase().includes(term) || (this.getSubLabel(item) ?? '').toLowerCase().includes(term)
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

  constructor() {
    effect(() => {
      if (this.luxMode() === 'single' && this.luxSelected().length > 1) {
        this.luxSelected.set([this.luxSelected()[0]]);
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

    let isFirstSearchRun = true;
    effect(() => {
      const search = this.debouncedSearch();
      // Erster Lauf ist die Initialisierung, kein von außen vorgegebener luxPageIndex darf überschrieben werden.
      if (isFirstSearchRun) {
        isFirstSearchRun = false;
        return;
      }
      this.luxPageIndex.set(0);
      // untracked: DAO-Wechsel wird bereits vom eigenen Effect behandelt, dieser Effect soll nur auf Suche reagieren.
      if (untracked(() => this.luxHttpDao())) {
        this.dataSource.triggerLoad(0, search, false);
      }
    });

    // Wechsel/Setzen des DAO resettet die bisher geladenen Daten und lädt Seite 0 neu.
    effect(() => {
      const dao = this.luxHttpDao();
      if (!dao) {
        return;
      }
      this.dataSource.reset();
      this.luxPageIndex.set(0);
      this.dataSource.triggerLoad(
        0,
        untracked(() => this.debouncedSearch()),
        false
      );
    });

    // Lädt auch bei programmatischer luxPageIndex-Änderung (nicht nur Paginator-Klick) nach.
    // lastRequestedPage verhindert einen doppelten Load, wenn derselbe Seitenwechsel bereits
    // synchron durch onPageChange oder einen der Effects oberhalb ausgelöst wurde.
    let isFirstPageRun = true;
    effect(() => {
      const page = this.luxPageIndex();
      if (!this.serverMode()) {
        return;
      }
      if (isFirstPageRun) {
        isFirstPageRun = false;
        this.dataSource.lastRequestedPage = page;
        return;
      }
      if (page === this.dataSource.lastRequestedPage) {
        return;
      }
      this.dataSource.triggerLoad(
        page,
        untracked(() => this.debouncedSearch()),
        false
      );
    });
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

  // Grid-Tastatur-/Fokus-Handler delegieren an den Keyboard-Controller (siehe
  // lux-list-select-keyboard-controller.ts); Methodennamen bleiben unverändert, damit das Template
  // unangetastet bleibt.
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
    if (this.luxHttpDao()) {
      // Löst den Load synchron mit dem Klick aus, triggerLoad merkt die Seite gegen einen doppelten Load durch den luxPageIndex-Effect.
      this.dataSource.triggerLoad(event.pageIndex, this.debouncedSearch(), false);
    }
  }

  onScrolled() {
    this.luxScrolled.emit();
    if (this.luxHttpDao() && !this.loading() && this.daoItems().length < this.daoTotalCount()) {
      const nextPage = Math.floor(this.daoItems().length / this.luxPageSize());
      this.dataSource.loadMore(nextPage, this.debouncedSearch());
    }
  }

  protected onSearchInput(event: Event) {
    this.luxSearchValue.set((event.target as HTMLInputElement).value);
  }

  protected onSearchClear() {
    this.luxSearchValue.set('');
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
