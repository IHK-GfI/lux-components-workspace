import { FocusKeyManager } from '@angular/cdk/a11y';
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
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { LuxPageEvent, LuxPaginatorComponent } from '@ihk-gfi/lux-components/lux-paginator';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { catchError, debounce, EMPTY, finalize, Subject, switchMap, tap, timer } from 'rxjs';
import { LuxBadgeComponent } from '../../lux-common/lux-badge/lux-badge.component';
import { LuxLabelComponent } from '../../lux-common/lux-label/lux-label.component';
import { LuxInfiniteScrollDirective } from '../../lux-directives/lux-infinite-scroll/lux-infinite-scroll.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxMessageBoxComponent } from '../../lux-common/lux-message-box/lux-message-box.component';
import { ILuxMessage } from '../../lux-common/lux-message-box/lux-message-box-model/lux-message.interface';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxProgressComponent } from '../../lux-common/lux-progress/lux-progress.component';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxListSelectItemComponent } from './lux-list-select-subcomponents/lux-list-select-item.component';
import { ILuxListSelectHttpDao } from './lux-list-select-model/lux-list-select-http-dao.interface';
import { LuxListSelectMode } from './lux-list-select-model/lux-list-select-types';

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

  // Grid-Tastaturnavigation (Vorbild lux-list): Die gerenderten Item-Komponenten dienen dem
  // FocusKeyManager als Fokus-Ziele; der Manager wird mit einem Signal konstruiert und passt
  // sich dadurch automatisch an Filterung/Paginierung/Infinite-Scroll an (kein manuelles Neu-Erzeugen nötig).
  // Generic bleibt bewusst <unknown> (viewChildren kann den Typparameter T der Hauptkomponente nicht
  // herleiten); der konkrete Item-Wert wird erst beim Aufruf von toggleItem() auf T gecastet.
  private readonly items = viewChildren(LuxListSelectItemComponent);
  private readonly keyManager = new FocusKeyManager<LuxListSelectItemComponent<unknown>>(this.items, this.injector).skipPredicate(
    (item) => item.luxDisabled()
  );

  // Bearbeiten-Modus (Enter/F2 auf der Karte -> Detail-Button; ESC/F2 zurück auf die Karte).
  // Invariante wie bei lux-list: außerhalb des Edit-Modus ist die Liste ein einziger Tab-Stopp,
  // innerhalb greift der Browser-Tab-Fokus normal auf die (temporär erreichbaren) inneren Elemente zu.
  protected editMode = signal(false);
  // activeItemIndex() liest den internen Signal-Getter des FocusKeyManagers und ist dadurch
  // reaktiv - wird an das jeweils aktive Item als luxEditMode durchgereicht (siehe Template),
  // damit nur dessen innere Elemente im Edit-Modus einen Tab-Stopp erhalten.
  protected activeItemIndex = computed(() => this.keyManager.activeItemIndex);
  // Eindeutiger name für die Radio-Buttons im Single-Modus: Ohne name greift der CDK-weite
  // UniqueSelectionDispatcher instanzübergreifend (namenlose Radios teilen sich einen impliziten
  // Namen), wodurch die Selektion in einer lux-list-select-Instanz die visuelle Checked-Optik
  // einer anderen Instanz auf derselben Seite löschen würde.
  protected radioName = computed(() => `lux-list-select-radio-${this.uniqueId}`);

  // Suchbegriff wird bei jedem Tastendruck ins Model geschrieben; die Filterung/Events reagieren
  // erst nach Ablauf von luxSearchDelay auf die Änderung (Entkopplung von Eingabe und Filterwirkung).
  private searchValue$ = toObservable(this.luxSearchValue);
  protected debouncedSearch = toSignal(this.searchValue$.pipe(debounce(() => timer(this.luxSearchDelay()))), { initialValue: '' });

  // DAO-Server-Modus (Hausmuster lux-table): Ist ein DAO gesetzt, werden luxItems und die interne
  // Client-Filterung/-Slicing ignoriert, die angezeigten Daten kommen ausschließlich vom Server.
  private loadTrigger$ = new Subject<{ page: number; filter: string; append: boolean }>();
  protected loading = signal(false);
  protected daoItems = signal<T[]>([]);
  protected daoTotalCount = signal(0);
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
    // Bereinigt den FocusKeyManager, sobald das bisher aktive Item durch Suche/Seitenwechsel/
    // DAO-Reload aus der (neuen) items()-Liste verschwindet - dessen Komponenteninstanz ist dann
    // bereits zerstört. Ohne diese Bereinigung würde onGridFocus/toggleActiveItem auf die
    // zerstörte Instanz zugreifen (NG0951) bzw. still ein Item der vorherigen Liste selektieren.
    // Vorbild lux-list: dort übernimmt das der luxItems.changes-Handler (Edit-Modus verlassen,
    // Manager neu erzeugen); hier reicht das Zurücksetzen auf "kein aktives Item" (-1), da der
    // Signal-basierte FocusKeyManager sich selbst mit der neuen Liste synchronisiert.
    effect(() => {
      const currentItems = this.items();
      const active = this.keyManager.activeItem;
      if (active && !currentItems.includes(active)) {
        this.editMode.set(false);
        this.keyManager.updateActiveItem(-1);
      }
    });

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
      // Der erste Effect-Lauf ist die Initialisierung und keine echte Suchänderung, ein von außen
      // vorgegebener luxPageIndex darf dadurch nicht überschrieben werden.
      if (isFirstSearchRun) {
        isFirstSearchRun = false;
        return;
      }
      this.luxPageIndex.set(0);
      // luxHttpDao() untracked lesen: DAO-Wechsel selbst wird bereits vom eigenen Effect behandelt,
      // dieser Effect soll ausschließlich auf Suchänderungen reagieren.
      if (untracked(() => this.luxHttpDao())) {
        this.loadTrigger$.next({ page: 0, filter: search, append: false });
      }
    });

    // DAO-Server-Modus: Wechsel/Setzen des DAO resettet die bisher geladenen Daten und lädt Seite 0
    // mit dem aktuell gültigen Suchbegriff neu.
    effect(() => {
      const dao = this.luxHttpDao();
      if (!dao) {
        return;
      }
      this.daoItems.set([]);
      this.luxPageIndex.set(0);
      this.loadTrigger$.next({ page: 0, filter: untracked(() => this.debouncedSearch()), append: false });
    });

    // Trigger-Stream für DAO-Requests: switchMap verwirft veraltete Requests (Race-Schutz), catchError
    // im inneren Stream sorgt dafür, dass der Trigger-Stream bei Fehlern lebendig bleibt.
    this.loadTrigger$
      .pipe(
        switchMap((trigger) => {
          const dao = this.luxHttpDao();
          if (!dao) {
            return EMPTY;
          }
          this.loading.set(true);
          return dao.loadData({ page: trigger.page, pageSize: this.luxPageSize(), filter: trigger.filter }).pipe(
            tap((result) => {
              this.daoItems.update((current) => (trigger.append ? [...current, ...result.items] : result.items));
              this.daoTotalCount.set(result.totalCount);
            }),
            catchError((error) => {
              console.error('lux-list-select: Fehler beim Laden der DAO-Daten.', error);
              return EMPTY;
            }),
            finalize(() => this.loading.set(false))
          );
        }),
        takeUntilDestroyed()
      )
      .subscribe();
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

  /**
   * Fokus-Handler des Grid-Containers (Vorbild lux-list): Beim Betreten des Containers von außen
   * wird das zuletzt aktive (oder mangels Vorgeschichte das erste) Item fokussiert. Kommt der Fokus
   * dagegen aus dem aktiven Item selbst (z.B. Shift+Tab vom Detail-Button im Edit-Modus zurück auf
   * den Container), springt der Fokus lediglich auf die Karte zurück - der Edit-Modus bleibt aktiv.
   */
  protected onGridFocus(event: FocusEvent): void {
    const relatedTarget = event.relatedTarget as Node | null;
    const active = this.keyManager.activeItem;

    if (this.editMode() && active?.contains(relatedTarget)) {
      active.focus();
      return;
    }

    if (active) {
      active.focus();
    } else {
      this.keyManager.setFirstItemActive();
    }
  }

  /**
   * Beendet den Edit-Modus, wenn der Fokus die aktive Karte verlässt, ohne dass er zum
   * Grid-Container selbst wandert (der Container-Fall wird bereits von onGridFocus behandelt).
   */
  protected onGridFocusOut(event: FocusEvent): void {
    if (!this.editMode()) {
      return;
    }
    const active = this.keyManager.activeItem;
    if (!active) {
      return;
    }
    const relatedTarget = event.relatedTarget as Node | null;
    const isMovingToGrid = relatedTarget === event.currentTarget;
    const isLeavingActiveItem = !active.contains(relatedTarget);
    if (isLeavingActiveItem && !isMovingToGrid) {
      this.exitEditMode(false);
    }
  }

  /**
   * Tastatur-Handler des Grid-Containers. Außerhalb des Edit-Modus: Pfeiltasten/Home/End navigieren
   * über den FocusKeyManager, Space/Enter/F2 selektieren bzw. betreten den Edit-Modus. Innerhalb des
   * Edit-Modus behandelt handleEditModeKeydown die Tab-Zyklus- und ESC/F2-Logik (1:1 nach lux-list).
   */
  protected onGridKeydown(event: KeyboardEvent): void {
    if (this.editMode()) {
      this.handleEditModeKeydown(event);
      return;
    }

    if (LuxUtil.isKeySpace(event)) {
      this.toggleActiveItem();
      event.preventDefault();
    } else if (LuxUtil.isKeyEnter(event)) {
      if (this.luxShowDetailButton()) {
        this.enterEditMode();
      } else {
        this.toggleActiveItem();
      }
      event.preventDefault();
    } else if (event.key === 'F2') {
      this.enterEditMode();
      event.preventDefault();
    } else if (LuxUtil.isKeyArrowUp(event)) {
      this.keyManager.setPreviousItemActive();
      event.preventDefault();
    } else if (LuxUtil.isKeyArrowDown(event)) {
      this.keyManager.setNextItemActive();
      event.preventDefault();
    } else if (LuxUtil.isKeyHome(event)) {
      this.keyManager.setFirstItemActive();
      event.preventDefault();
    } else if (LuxUtil.isKeyEnd(event)) {
      this.keyManager.setLastItemActive();
      event.preventDefault();
    }
  }

  /**
   * Wird beim Klick auf ein Item ausgelöst und synchronisiert lediglich den internen
   * FocusKeyManager-Zustand (updateActiveItem - ohne DOM-Fokus zu verändern), damit
   * anschließende Pfeiltasten-Navigation beim geklickten Item weitermacht. Disabled Items werden
   * dabei nicht als aktives Item übernommen (updateActiveItem umgeht sonst das skipPredicate).
   */
  protected onItemActivated(index: number): void {
    const item = this.items()[index];
    if (item?.luxDisabled()) {
      return;
    }
    this.keyManager.updateActiveItem(index);
  }

  /**
   * Betritt den Edit-Modus auf dem aktiven Item (Enter bei sichtbarem Detail-Button, F2) und
   * fokussiert dessen erstes inneres Element. Ohne fokussierbare innere Elemente passiert nichts
   * (analog zu lux-list: kein Edit-Modus ohne interaktiven Inhalt).
   */
  private enterEditMode(): void {
    const active = this.keyManager.activeItem;
    if (!active) {
      return;
    }
    const focusable = active.getFocusableElements();
    if (focusable.length === 0) {
      return;
    }
    this.editMode.set(true);
    focusable[0].focus();
  }

  /**
   * Beendet den Edit-Modus.
   * @param moveFocusToRow Wenn true (Standard bei ESC/F2), wird der Fokus auf die Karte zurückgesetzt.
   */
  private exitEditMode(moveFocusToRow: boolean): void {
    if (!this.editMode()) {
      return;
    }
    this.editMode.set(false);
    if (moveFocusToRow) {
      this.keyManager.activeItem?.focus();
    }
  }

  /**
   * Tab-Zyklus- und ESC/F2-Logik im Edit-Modus, 1:1 nach lux-list: Tab/Shift+Tab von der Karte
   * springt zum ersten/letzten inneren Element, Tab vom letzten inneren Element zurück zur Karte
   * (Edit-Modus bleibt aktiv). ESC/F2 verlassen den Edit-Modus vollständig. Kehrt der Fokus per
   * Tab auf die Karte zurück (z.B. Shift+Tab vom Detail-Button), bleiben Space/Pfeiltasten/Home/End
   * auf Zeilenebene nutzbar - lux-list bricht den Edit-Modus dabei implizit über focusActiveItem()
   * ab, sobald tatsächlich navigiert wird (siehe lux-list.component.ts focus()).
   */
  private handleEditModeKeydown(event: KeyboardEvent): void {
    if (LuxUtil.isKeyEscape(event)) {
      this.exitEditMode(true);
      event.preventDefault();
      return;
    }
    if (event.key === 'F2') {
      this.exitEditMode(true);
      event.preventDefault();
      return;
    }

    const active = this.keyManager.activeItem;
    if (!active) {
      return;
    }
    const focusIsOnRow = (event.target as HTMLElement) === active.cardElementRef;

    if (event.key === 'Tab') {
      const focusableElements = active.getFocusableElements();
      if (focusIsOnRow) {
        if (focusableElements.length > 0) {
          (event.shiftKey ? focusableElements[focusableElements.length - 1] : focusableElements[0]).focus();
          event.preventDefault();
        }
      } else if (
        !event.shiftKey &&
        focusableElements.length > 0 &&
        document.activeElement === focusableElements[focusableElements.length - 1]
      ) {
        active.focus();
        event.preventDefault();
      }
      return;
    }

    if (!focusIsOnRow) {
      return;
    }
    if (LuxUtil.isKeySpace(event)) {
      this.toggleActiveItem();
      event.preventDefault();
    } else if (LuxUtil.isKeyArrowUp(event)) {
      this.editMode.set(false);
      this.keyManager.setPreviousItemActive();
      event.preventDefault();
    } else if (LuxUtil.isKeyArrowDown(event)) {
      this.editMode.set(false);
      this.keyManager.setNextItemActive();
      event.preventDefault();
    } else if (LuxUtil.isKeyHome(event)) {
      this.editMode.set(false);
      this.keyManager.setFirstItemActive();
      event.preventDefault();
    } else if (LuxUtil.isKeyEnd(event)) {
      this.editMode.set(false);
      this.keyManager.setLastItemActive();
      event.preventDefault();
    }
  }

  /**
   * Toggelt die Selektion des aktuell im FocusKeyManager aktiven Items (Space, bzw. Enter ohne
   * sichtbaren Detail-Button).
   */
  private toggleActiveItem(): void {
    const active = this.keyManager.activeItem;
    if (active) {
      this.toggleItem(active.luxItem() as T);
    }
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
      this.loadTrigger$.next({ page: event.pageIndex, filter: this.debouncedSearch(), append: false });
    }
  }

  onScrolled() {
    this.luxScrolled.emit();
    if (this.luxHttpDao() && !this.loading() && this.daoItems().length < this.daoTotalCount()) {
      const nextPage = Math.floor(this.daoItems().length / this.luxPageSize());
      this.loadTrigger$.next({ page: nextPage, filter: this.debouncedSearch(), append: true });
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
