import { LiveAnnouncer } from '@angular/cdk/a11y';
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
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { LuxPageEvent, LuxPaginatorComponent } from '@ihk-gfi/lux-components/lux-paginator';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { debounce, distinctUntilChanged, merge, share, skip, take, timer } from 'rxjs';
import { LuxBadgeComponent } from '../../lux-common/lux-badge/lux-badge.component';
import { LuxLabelComponent } from '../../lux-common/lux-label/lux-label.component';
import { LuxInfiniteScrollDirective } from '../../lux-directives/lux-infinite-scroll/lux-infinite-scroll.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxMessageBoxComponent } from '../../lux-common/lux-message-box/lux-message-box.component';
import { ILuxMessage } from '../../lux-common/lux-message-box/lux-message-box-model/lux-message.interface';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxProgressComponent } from '../../lux-common/lux-progress/lux-progress.component';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxInputAcComponent } from '../../lux-form/lux-input-ac/lux-input-ac.component';
import { LuxInputAcPrefixComponent } from '../../lux-form/lux-input-ac/lux-input-ac-subcomponents/lux-input-ac-prefix.component';
import { LuxInputAcSuffixComponent } from '../../lux-form/lux-input-ac/lux-input-ac-subcomponents/lux-input-ac-suffix.component';
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
    LuxProgressComponent,
    LuxButtonComponent,
    LuxInputAcComponent,
    LuxInputAcPrefixComponent,
    LuxInputAcSuffixComponent
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
  private liveAnnouncer = inject(LiveAnnouncer);
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

  // viewChildren kann T nicht herleiten; der Keyboard-Controller castet zurück auf T.
  private readonly items = viewChildren(LuxListSelectItemComponent);
  private readonly keyboard = new LuxListSelectKeyboardController<T>(
    this.items,
    { toggleItem: (item) => this.toggleItem(item) },
    this.injector
  );
  protected editMode = this.keyboard.editMode;
  protected activeItemIndex = this.keyboard.activeItemIndex;
  // Eigener name pro Instanz, sonst teilen sich Radios instanzübergreifend den CDK-UniqueSelectionDispatcher.
  protected radioName = computed(() => `lux-list-select-radio-${this.uniqueId}`);

  // share(): Anzeige-Pipeline (toSignal) und Lade-Subscription im Konstruktor teilen sich denselben Debounce-Timer.
  private searchValue$ = toObservable(this.luxSearchValue);
  private debouncedSearch$ = this.searchValue$.pipe(
    debounce(() => timer(this.luxSearchDelay())),
    share()
  );
  protected debouncedSearch = toSignal(this.debouncedSearch$, { initialValue: '' });

  // Ist ein DAO gesetzt, kommen die angezeigten Daten ausschließlich vom Server; luxItems und Client-Filterung/-Slicing werden ignoriert.
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
  protected viewportLoading = computed(() => this.serverMode() && this.loading());

  constructor() {
    // Lade-Orchestrierung als RxJS-Subscriptions statt Effects: toObservable/takeUntilDestroyed
    // brauchen den Injection-Context, deshalb steht alles hier im Konstruktor.

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

    // skip(1) verwirft den Startwert (inkl. dessen entprelltem Nachzügler via distinctUntilChanged):
    // ein vorbelegter luxSearchValue soll keinen Doppel-Load auslösen.
    merge(this.searchValue$.pipe(take(1)), this.debouncedSearch$)
      .pipe(distinctUntilChanged(), skip(1), takeUntilDestroyed())
      .subscribe((search) => {
        this.luxPageIndex.set(0);
        if (this.luxHttpDao()) {
          this.dataSource.triggerLoad(0, search, false);
        }
      });

    // Baseline wird erst übernommen, wenn Paginierung/Infinite-Scroll/DAO aktiv sind ("relevant"),
    // sonst zählt eine vorbelegte Erstkonfiguration fälschlich als Laufzeit-Wechsel.
    let pageSizeBaseline: number | null = null;
    // Ändert sich DAO und luxPageSize in derselben Emission, lädt bereits die DAO-Subscription unten
    // neu - ein zusätzlicher Load hier wäre doppelt.
    let lastSeenDao = this.luxHttpDao();
    toObservable(
      computed(() => ({
        pageSize: this.luxPageSize(),
        dao: this.luxHttpDao(),
        relevant: !!this.luxHttpDao() || this.luxShowPagination() || this.luxInfiniteScroll()
      }))
    )
      .pipe(takeUntilDestroyed())
      .subscribe(({ pageSize, dao, relevant }) => {
        const daoChanged = dao !== lastSeenDao;
        lastSeenDao = dao;
        if (!relevant) {
          return;
        }
        if (pageSizeBaseline === null) {
          pageSizeBaseline = pageSize;
          return;
        }
        if (pageSize === pageSizeBaseline) {
          return;
        }
        pageSizeBaseline = pageSize;
        this.luxPageIndex.set(0);
        if (dao && !daoChanged) {
          this.dataSource.reset();
          this.dataSource.triggerLoad(0, this.debouncedSearch(), false);
        }
      });

    toObservable(this.luxHttpDao)
      .pipe(distinctUntilChanged(), takeUntilDestroyed())
      .subscribe((dao) => {
        if (!dao) {
          return;
        }
        this.dataSource.reset();
        this.luxPageIndex.set(0);
        this.dataSource.triggerLoad(0, this.luxSearchValue(), false);
      });

    // serverMode im Stream: wird der DAO erst nachträglich gesetzt, übernimmt die Subscription den
    // dann aktuellen Seitenindex als Ausgangsstand, statt den ersten Wechsel als Erstlauf zu verschlucken.
    let isFirstPageEmission = true;
    toObservable(computed(() => ({ page: this.luxPageIndex(), serverMode: this.serverMode() })))
      .pipe(takeUntilDestroyed())
      .subscribe(({ page, serverMode }) => {
        if (!serverMode) {
          return;
        }
        if (isFirstPageEmission) {
          isFirstPageEmission = false;
          this.dataSource.lastRequestedPage = page;
          return;
        }
        if (page === this.dataSource.lastRequestedPage) {
          return;
        }
        this.dataSource.triggerLoad(page, this.debouncedSearch(), false);
      });

    effect(() => {
      if (this.luxShowPagination() && this.luxInfiniteScroll()) {
        console.error(
          'lux-list-select: luxShowPagination und luxInfiniteScroll schließen sich gegenseitig aus. Es wird die Paginierung verwendet.'
        );
      }
    });

    // Muss als Letztes deklariert bleiben: die Ansage darf im Server-Modus erst nach dem
    // eingetroffenen Ergebnis kommen (effectiveIsLoading muss bereits aktuell sein).
    // Bewusst NICHT totalCount(): das liefert im Client-Modus bei gesetztem luxTotalItems die
    // Gesamtanzahl aller Items statt der tatsächlichen Trefferzahl der Suche.
    // Dedup-Guard verankert sich zusätzlich am Term: zwei unterschiedliche Suchen können zufällig
    // dieselbe Trefferzahl liefern, ein reiner Message-Vergleich würde die zweite Ansage unterdrücken.
    let lastAnnouncement: string | null = null;
    let lastAnnouncedTerm: string | null = null;
    effect(() => {
      const term = this.debouncedSearch();
      const count = this.serverMode() ? this.daoTotalCount() : this.filteredItems().length;
      if (!this.luxShowSearch() || term === '') {
        lastAnnouncement = null;
        lastAnnouncedTerm = null;
        return;
      }
      // Dedup-Zustand bleibt beim Laden erhalten, sonst würde die unveränderte Trefferzahl nach
      // jedem Seitenwechsel/Append erneut angesagt.
      if (this.effectiveIsLoading()) {
        return;
      }
      const message = this.tService.translate('luxc.list-select.search_results', { count });
      if (message !== lastAnnouncement || term !== lastAnnouncedTerm) {
        lastAnnouncement = message;
        lastAnnouncedTerm = term;
        this.liveAnnouncer.announce(message, 'polite');
      }
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

  // Methodennamen bleiben unverändert, damit das Template unangetastet bleibt.
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
      // Synchron mit dem Klick; triggerLoad merkt die Seite gegen einen doppelten Load durch die luxPageIndex-Subscription.
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
