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
  // share(): Anzeige-Pipeline (toSignal) und Lade-Orchestrierung (Subscription im Konstruktor)
  // teilen sich denselben Debounce-Timer und damit denselben Emissionszeitpunkt.
  private searchValue$ = toObservable(this.luxSearchValue);
  private debouncedSearch$ = this.searchValue$.pipe(
    debounce(() => timer(this.luxSearchDelay())),
    share()
  );
  protected debouncedSearch = toSignal(this.debouncedSearch$, { initialValue: '' });

  // DAO-Server-Modus (Hausmuster lux-table-data-source): Ist ein DAO gesetzt, kommen die angezeigten
  // Daten ausschließlich vom Server, luxItems und die Client-Filterung/-Slicing werden ignoriert.
  // Die komplette DAO-Orchestrierung (Laden, Fehlerbehandlung, Ladezustand) steckt in der DataSource,
  // die Wiring-Subscriptions unten stoßen sie nur an (siehe lux-list-select-data-source.ts).
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
    // Lade-Orchestrierung bewusst als RxJS-Subscriptions statt als Effects: Subscriptions tracken
    // keine Signale, dadurch entfallen sämtliche untracked-Klammern, und Signal-Writes sind im
    // Subscription-Kontext unstrittig. toObservable/takeUntilDestroyed brauchen den
    // Injection-Context, deshalb muss alles hier im Konstruktor stehen.

    // Single-Modus kappt eine Mehrfachauswahl auf das erste Element - auch bei einem Moduswechsel
    // zur Laufzeit, deshalb hängt die Subscription an beiden Werten. Bewusst ein computed-Paar statt
    // combineLatest: combineLatest würde bei einer Änderung beider Signale im selben
    // Change-Detection-Zyklus zuerst ein Zwischenpaar aus neuem Modus und ALTER Selektion liefern
    // und damit eine gerade erst gesetzte Einzelselektion durch das alte erste Element ersetzen
    // (Review-Finding). Der computed liefert beide Werte immer aus demselben Stand.
    toObservable(computed(() => ({ mode: this.luxMode(), selected: this.luxSelected() })))
      .pipe(takeUntilDestroyed())
      .subscribe(({ mode, selected }) => {
        if (mode === 'single' && selected.length > 1) {
          this.luxSelected.set([selected[0]]);
          this.onChange(this.luxSelected());
        }
      });

    // Suche: die erste Emission ist der beim ersten Change-Detection-Lauf anliegende (ggf.
    // vorbelegte) Suchwert. distinctUntilChanged schluckt dessen entprellten Nachzügler,
    // skip(1) den Startwert selbst - nur echte Änderungen setzen die Seite zurück und laden
    // im Server-Modus neu (sonst löst ein vorbelegter luxSearchValue einen Doppel-Load aus).
    merge(this.searchValue$.pipe(take(1)), this.debouncedSearch$)
      .pipe(distinctUntilChanged(), skip(1), takeUntilDestroyed())
      .subscribe((search) => {
        this.luxPageIndex.set(0);
        if (this.luxHttpDao()) {
          this.dataSource.triggerLoad(0, search, false);
        }
      });

    // Reagiert auf luxPageSize-Änderungen zur Laufzeit: Seite zurück auf 0, im Server-Modus mit neuer
    // Seitengröße neu laden (sonst rechnen Paginator und Infinite-Scroll-Folgeseiten mit alter Größe weiter).
    // Die Baseline wird erst übernommen, sobald Paginierung/Infinite-Scroll/DAO tatsächlich aktiv sind
    // ("relevant"): vorher hat luxPageSize keine sichtbare Wirkung, und eine kombinierte
    // Erstkonfiguration (z.B. luxPageIndex zusammen mit einem von 5 abweichenden luxPageSize im
    // selben Zyklus vorbelegt) darf nicht als Laufzeit-Wechsel missverstanden und der Seitenindex
    // dadurch nicht fälschlich zurückgesetzt werden.
    // Der computed bündelt die drei Werte, damit sie konsistent zum selben Change-Detection-Lauf
    // gelesen werden; die Merker kodieren Fachsemantik und bleiben deshalb erhalten.
    let pageSizeBaseline: number | null = null;
    // Merkt die zuletzt gesehene DAO-Referenz: ändert sich der DAO in derselben Emission, in der auch
    // luxPageSize sich ändert, übernimmt die DAO-Subscription (unten) den Load bereits eigenständig
    // (sie liest die aktuelle luxPageSize ohnehin frisch) - ein zusätzlicher Load hier wäre doppelt
    // (Review-Finding: unkoordinierter Doppel-Load bei gleichzeitigem DAO- und Seitengrößen-Wechsel).
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

    // Wechsel/Setzen des DAO resettet die bisher geladenen Daten und lädt Seite 0 neu.
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

    // Lädt auch bei programmatischer luxPageIndex-Änderung (nicht nur Paginator-Klick) nach.
    // lastRequestedPage verhindert einen doppelten Load, wenn derselbe Seitenwechsel bereits
    // synchron durch onPageChange oder eine der Subscriptions oberhalb ausgelöst wurde.
    // serverMode gehört mit in den Stream: wird der DAO erst nachträglich gesetzt, muss die
    // Subscription den dann aktuellen Seitenindex als Ausgangsstand übernehmen, statt den ersten
    // späteren Seitenwechsel als Erstlauf zu verschlucken.
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
    // eingetroffenen Ergebnis kommen, und das Server-Gate (effectiveIsLoading) greift nur, wenn
    // die Lade-Orchestrierung oberhalb den Ladezustand vorher gesetzt hat.
    // Screenreader-Ansage der Trefferzahl: reagiert auf den entprellten Suchterm UND auf die
    // gefilterte Trefferzahl, damit im Server-Modus erst das eingetroffene Ergebnis (statt des alten
    // Stands) angesagt wird. Bewusst NICHT totalCount(): im Client-Modus liefert das bei gesetztem
    // luxTotalItems die Gesamtanzahl aller Items (z.B. 100) statt der tatsächlichen Trefferzahl der
    // Suche - die Ansage muss sich immer auf das angezeigte Suchergebnis beziehen (Review-Finding).
    // Der Dedup-Guard verankert sich zusätzlich am Term (nicht nur an der Nachricht): zwei
    // unterschiedliche Suchen können zufällig dieselbe Trefferzahl liefern ("Anna" -> "Thomas", beide
    // 1 Treffer) - ein reiner Message-Vergleich würde die zweite Ansage sonst fälschlich unterdrücken
    // und der Nutzer bekäme kein Feedback, dass seine neue Suche überhaupt gelaufen ist (Review-Finding).
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
      // Während des Ladens (Server-Modus) noch nicht ansagen, aber den Dedup-Zustand NICHT
      // zurücksetzen: sonst löscht jeder Seitenwechsel/Append den zuletzt angesagten Stand und die
      // nach Eintreffen der Daten unveränderte Trefferzahl wird fälschlich erneut angesagt (Review-Finding).
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
