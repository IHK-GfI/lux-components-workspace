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

  // FocusKeyManager (Vorbild lux-list) wird mit einem Signal konstruiert und passt sich dadurch
  // automatisch an Filterung/Paginierung/Infinite-Scroll an. Generic bleibt <unknown>, da
  // viewChildren den Typparameter T nicht herleiten kann; toggleItem() castet zurück auf T.
  private readonly items = viewChildren(LuxListSelectItemComponent);
  private readonly keyManager = new FocusKeyManager<LuxListSelectItemComponent<unknown>>(this.items, this.injector).skipPredicate(
    (item) => item.luxDisabled()
  );

  // Bearbeiten-Modus (Enter/F2 auf der Karte -> Detail-Button; ESC/F2 zurück). Außerhalb ist die
  // Liste ein einziger Tab-Stopp, innerhalb greift der Browser-Tab-Fokus auf die inneren Elemente.
  protected editMode = signal(false);
  // Reaktiver Zugriff auf den internen Zustand des FocusKeyManagers, wird an das aktive Item als
  // luxEditMode durchgereicht, damit nur dessen innere Elemente im Edit-Modus einen Tab-Stopp erhalten.
  protected activeItemIndex = computed(() => this.keyManager.activeItemIndex);
  // Ohne eigenen name teilen sich Radios instanzübergreifend den CDK-UniqueSelectionDispatcher,
  // wodurch eine Selektion in dieser Instanz die Checked-Optik einer anderen Instanz löschen würde.
  protected radioName = computed(() => `lux-list-select-radio-${this.uniqueId}`);

  // Entkoppelt Eingabe und Filterwirkung: Filterung/Events reagieren erst nach luxSearchDelay.
  private searchValue$ = toObservable(this.luxSearchValue);
  protected debouncedSearch = toSignal(this.searchValue$.pipe(debounce(() => timer(this.luxSearchDelay()))), { initialValue: '' });

  // DAO-Server-Modus (Hausmuster lux-table): Ist ein DAO gesetzt, kommen die angezeigten Daten
  // ausschließlich vom Server, luxItems und die Client-Filterung/-Slicing werden ignoriert.
  private loadTrigger$ = new Subject<{ page: number; filter: string; append: boolean }>();
  protected loading = signal(false);
  protected daoItems = signal<T[]>([]);
  protected daoTotalCount = signal(0);
  protected serverMode = computed(() => !!this.luxHttpDao());
  // Verhindert, dass der luxPageIndex-Effect einen Load erneut auslöst, der bereits synchron
  // durch onPageChange oder einen anderen Effect (Suche/DAO-Wechsel) angestoßen wurde.
  private lastRequestedPage: number | null = null;

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
    // Setzt das aktive Item zurück, sobald es durch Suche/Seitenwechsel/DAO-Reload aus der
    // items()-Liste verschwindet und damit zerstört ist - sonst würden onGridFocus/toggleActiveItem
    // auf die zerstörte Instanz zugreifen (NG0951). Der Signal-basierte FocusKeyManager synchronisiert
    // sich danach selbst mit der neuen Liste, ein Neu-Erzeugen wie bei lux-list ist nicht nötig.
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
      // Erster Lauf ist die Initialisierung, kein von außen vorgegebener luxPageIndex darf überschrieben werden.
      if (isFirstSearchRun) {
        isFirstSearchRun = false;
        return;
      }
      this.luxPageIndex.set(0);
      // untracked: DAO-Wechsel wird bereits vom eigenen Effect behandelt, dieser Effect soll nur auf Suche reagieren.
      if (untracked(() => this.luxHttpDao())) {
        this.triggerLoad(0, search, false);
      }
    });

    // Wechsel/Setzen des DAO resettet die bisher geladenen Daten und lädt Seite 0 neu.
    effect(() => {
      const dao = this.luxHttpDao();
      if (!dao) {
        return;
      }
      this.daoItems.set([]);
      this.luxPageIndex.set(0);
      this.triggerLoad(0, untracked(() => this.debouncedSearch()), false);
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
        this.lastRequestedPage = page;
        return;
      }
      if (page === this.lastRequestedPage) {
        return;
      }
      this.triggerLoad(page, untracked(() => this.debouncedSearch()), false);
    });

    // switchMap verwirft veraltete Requests (Race-Schutz), catchError im inneren Stream hält den
    // Trigger-Stream bei Fehlern am Leben.
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

  /** Einziger Ort, der einen DAO-Load anstößt; merkt sich die Seite in lastRequestedPage gegen doppelte Loads durch den luxPageIndex-Effect. */
  private triggerLoad(page: number, filter: string, append: boolean): void {
    this.lastRequestedPage = page;
    this.loadTrigger$.next({ page, filter, append });
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
   * Fokus-Handler des Grid-Containers (Vorbild lux-list): Beim Betreten von außen wird das zuletzt
   * aktive (oder mangels Vorgeschichte das erste) Item fokussiert; kommt der Fokus aus dem aktiven
   * Item selbst zurück, springt er nur auf die Karte zurück, der Edit-Modus bleibt aktiv.
   */
  protected onGridFocus(event: FocusEvent): void {
    const relatedTarget = event.relatedTarget as Node | null;
    const active = this.keyManager.activeItem;

    if (this.editMode() && active?.contains(relatedTarget)) {
      active.focus();
      return;
    }

    // Fokus kommt vom Grid-Container selbst zurück (Shift+Tab von der Karte, die tabindex=-1 hat):
    // außerhalb des Edit-Modus nichts tun, sonst würde active.focus() unten eine
    // Shift+Tab-Endlosschleife erzeugen und das Grid wäre rückwärts nicht verlassbar.
    if (!this.editMode() && relatedTarget && (event.currentTarget as HTMLElement).contains(relatedTarget)) {
      return;
    }

    if (active) {
      active.focus();
    } else {
      this.keyManager.setFirstItemActive();
    }
  }

  /** Beendet den Edit-Modus, wenn der Fokus die aktive Karte verlässt, ohne zum Grid-Container zu wandern (siehe onGridFocus). */
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

  /** Tastatur-Handler des Grid-Containers; im Edit-Modus delegiert er an handleEditModeKeydown. */
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

  /** Synchronisiert bei Klick den FocusKeyManager-Zustand ohne DOM-Fokus zu ändern; disabled Items werden nicht übernommen, da updateActiveItem das skipPredicate umgeht. */
  protected onItemActivated(index: number): void {
    const item = this.items()[index];
    if (item?.luxDisabled()) {
      return;
    }
    this.keyManager.updateActiveItem(index);
  }

  /** Betritt den Edit-Modus auf dem aktiven Item und fokussiert dessen erstes inneres Element; ohne fokussierbare Elemente passiert nichts. */
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
   * Tab-Zyklus- und ESC/F2-Logik im Edit-Modus (1:1 nach lux-list): Tab/Shift+Tab von der Karte
   * springt zum ersten/letzten inneren Element, Tab vom letzten Element zurück zur Karte (Edit-Modus
   * bleibt aktiv), ESC/F2 verlassen ihn vollständig.
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

  /** Toggelt die Selektion des aktuell im FocusKeyManager aktiven Items. */
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
      // Löst den Load synchron mit dem Klick aus, triggerLoad merkt die Seite gegen einen doppelten Load durch den luxPageIndex-Effect.
      this.triggerLoad(event.pageIndex, this.debouncedSearch(), false);
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
