import { animate, state, style, transition, trigger } from '@angular/animations';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DoCheck,
  ElementRef,
  Injector,
  OnDestroy,
  OnInit,
  ViewContainerRef,
  contentChild,
  inject,
  input,
  model,
  output,
  viewChild,
  viewChildren
} from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TranslocoPipe } from '@jsverse/transloco';
import { ReplaySubject, tap } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxInfiniteScrollDirective } from '../../lux-directives/lux-infinite-scroll/lux-infinite-scroll.directive';
import { LuxCustomTagIdDirective } from '../../lux-directives/lux-tag-id/lux-custom-tag-id.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxPropertyFromObjectPipe } from '../../lux-pipes/lux-property-from-object/lux-property-from-object.pipe';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxCardContentComponent } from '../lux-card/lux-card-subcomponents/lux-card-content.component';
import { LuxCardCustomHeaderComponent } from '../lux-card/lux-card-subcomponents/lux-card-custom-header.component';
import { LuxCardComponent } from '../lux-card/lux-card.component';
import { LuxListItemContentComponent } from '../lux-list/lux-list-subcomponents/lux-list-item-content.component';
import { LuxListItemCustomHeaderComponent } from '../lux-list/lux-list-subcomponents/lux-list-item-custom-header.component';
import { LuxListItemIconComponent } from '../lux-list/lux-list-subcomponents/lux-list-item-icon.component';
import { LuxListItemComponent } from '../lux-list/lux-list-subcomponents/lux-list-item.component';
import { LuxListComponent } from '../lux-list/lux-list.component';
import { LuxTabsComponent } from '../lux-tabs/lux-tabs.component';
import { LuxDetailHeaderComponent } from './lux-detail-header/lux-detail-header.component';
import { LuxDetailViewComponent } from './lux-detail-view/lux-detail-view.component';
import { LuxDetailWrapperComponent } from './lux-detail-view/lux-detail-wrapper.component';
import { LuxMasterFooterComponent } from './lux-master-footer/lux-master-footer.component';
import { LuxMasterHeaderComponent } from './lux-master-header/lux-master-header.component';
import { LuxMasterListComponent } from './lux-master-list/lux-master-list.component';

@Component({
  selector: 'lux-master-detail, lux-master-detail-ac',
  templateUrl: './lux-master-detail.component.html',
  styleUrls: ['./lux-master-detail.component.scss'],
  animations: [
    trigger('masterIsLoadingChanged', [
      state('true', style({ opacity: 1 })),
      state('false', style({ opacity: 0 })),
      transition('1 => 0', animate('0.5s')),
      transition('0 => 1', animate('1s'))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    LuxTagIdDirective,
    LuxCustomTagIdDirective,
    LuxMasterHeaderComponent,
    LuxListComponent,
    LuxInfiniteScrollDirective,
    LuxListItemComponent,
    LuxListItemIconComponent,
    NgTemplateOutlet,
    LuxListItemContentComponent,
    MatProgressSpinner,
    LuxCardComponent,
    LuxCardContentComponent,
    LuxButtonComponent,
    LuxIconComponent,
    LuxPropertyFromObjectPipe,
    TranslocoPipe,
    LuxCardCustomHeaderComponent,
    LuxListItemCustomHeaderComponent
  ]
})
export class LuxMasterDetailComponent<T = any> implements OnInit, AfterContentInit, AfterViewInit, DoCheck, OnDestroy {
  readonly luxEmptyIconMaster = input('lux-interface-alert-information-circle');
  readonly luxEmptyLabelMaster = input('');
  readonly luxEmptyIconDetail = input('lux-interface-alert-information-circle');
  readonly luxEmptyLabelDetail = input('');
  readonly luxEmptyIconMasterSize = input('5x');
  readonly luxEmptyIconDetailSize = input('5x');
  readonly luxMasterSpinnerDelay = input(1000);
  readonly luxTagIdMaster = input<string | undefined>(undefined);
  readonly luxTagIdDetail = input<string | undefined>(undefined);
  readonly luxTitleLineBreak = input(false);
  readonly luxMasterListLabel = input('');
  readonly luxMasterIsLoading = input(false);
  readonly luxCompareWith = input<(o1: T, o2: T) => boolean>((o1: T, o2: T) => o1 === o2);
  readonly luxDefaultDetailHeader = input(true);
  readonly luxOpen = model(true);
  readonly luxSelectedDetail = model<T | null>(null);
  readonly luxMasterList = input<any[]>([]);

  luxScrolled = output<void>();

  private masterSimpleQuery = contentChild(LuxMasterListComponent);
  private detailViewQuery = contentChild(LuxDetailViewComponent);
  private masterFooterQuery = contentChild(LuxMasterFooterComponent, { read: ElementRef });
  private detailHeaderQuery = contentChild(LuxDetailHeaderComponent, { read: ElementRef });
  readonly luxMasterQueryList = viewChildren(LuxListComponent, { read: ElementRef });
  readonly luxMasterListItemQueryList = viewChildren(LuxListItemComponent);
  private masterHeaderQuery = viewChild(LuxMasterHeaderComponent, { read: ElementRef });
  private masterHeaderComponentQuery = viewChild(LuxMasterHeaderComponent);
  readonly luxMasterEntryElementRef = viewChild(LuxListItemComponent, { read: ElementRef });
  private tabsComponentQuery = contentChild(LuxTabsComponent);
  readonly masterSpinnerCard = viewChild('masterSpinnerCard', { read: ElementRef });
  readonly detailFrame = viewChild('detailContainer', { read: ElementRef });
  readonly detailEmpty = viewChild('detailEmpty', { read: ElementRef });
  readonly detailViewContainerRef = viewChild.required('detailViewContainerRef', { read: ViewContainerRef });
  private masterContainerQuery = viewChild('masterContainer', { read: ElementRef });

  get masterSimple(): LuxMasterListComponent | undefined {
    return this.masterSimpleQuery();
  }

  get detailView(): LuxDetailViewComponent | undefined {
    return this.detailViewQuery();
  }

  get masterFooter(): ElementRef | undefined {
    return this.masterFooterQuery();
  }

  get detailHeader(): ElementRef | undefined {
    return this.detailHeaderQuery();
  }

  get masterHeader(): ElementRef | undefined {
    return this.masterHeaderQuery();
  }

  get masterHeaderComponent(): LuxMasterHeaderComponent | undefined {
    return this.masterHeaderComponentQuery();
  }

  get tabsComponent(): LuxTabsComponent | undefined {
    return this.tabsComponentQuery();
  }

  get masterContainer(): ElementRef | undefined {
    return this.masterContainerQuery();
  }

  isMobile: boolean;
  isMedium: boolean;
  detailContext = { $implicit: {} };
  showMasterHeader?: boolean;
  // Enthält die Position des aktuell selektierten Elements
  selectedPosition = -1;

  // Flag, das bestimmt, ob die Empty-Anzeigen der Masterliste anhand der Detail-Ansicht ausgerichtet werden
  alignEmptyIndicators = true;

  private injector = inject(Injector);
  private cdr = inject(ChangeDetectorRef);
  private liveAnnouncer = inject(LiveAnnouncer);
  private mediaObserver = inject(LuxMediaQueryObserverService);
  private masterListLength = 0;
  private maxItemsVisible?: number;
  private updateDetail$ = new ReplaySubject<any>(1);
  private subscriptions: { unsubscribe(): void }[] = [];
  // Hält fest, welches Detail aktuell tatsächlich gerendert ist. Getrennt von luxSelectedDetail(),
  // weil dessen Wert bei einer VON AUSSEN gesetzten Selektion bereits aktualisiert ist, BEVOR
  // handleDetailUpdate() die Änderung verarbeitet - ein Vergleich gegen luxSelectedDetail() würde
  // in diesem Fall immer "keine Änderung" ergeben und die Detail-Ansicht bliebe leer.
  private renderedDetail: any = undefined;

  constructor() {
    this.subscriptions.push(
      toObservable(this.luxSelectedDetail, { injector: this.injector }).subscribe((value) => {
        this.updateDetail$.next(value);
      })
    );

    this.isMobile = this.mediaObserver.isXS() || this.mediaObserver.isSM();
    this.isMedium = this.mediaObserver.isMD();
    this.subscriptions.push(
      this.mediaObserver.getMediaQueryChangedAsObservable().subscribe(() => {
        this.isMobile = this.mediaObserver.isXS() || this.mediaObserver.isSM();
        this.isMedium = this.mediaObserver.isMD();
        this.cdr.markForCheck();
      })
    );
  }

  ngOnInit() {
    this.handleMasterListUpdate();
  }

  ngDoCheck() {
    // Wurde ein Element in die Masterliste gepusht oder entfernt?
    if (this.luxMasterList() && this.luxMasterList().length !== this.masterListLength) {
      if (this.luxMasterList().length > this.masterListLength) {
        this.announcePossibleInfiniteScrolling();
      }

      // Wenn ja, dass selektierte Detail neu rendern
      this.masterListLength = this.luxMasterList().length;
      this.updateDetail$.next(this.luxMasterList()[this.selectedPosition]);

      this.announcePossibleInfiniteScrolling();
    }

    // Ausrichtung der Empty-Indikatoren der Masterliste prüfen
    if (!this.isMobile && (!this.luxMasterList() || this.luxMasterList().length === 0)) {
      this.checkEmptyIndicatorAlignment();
    }
  }

  ngAfterContentInit() {
    LuxUtil.assertNonNull('detailView', this.detailView);
  }

  ngAfterViewInit() {
    LuxUtil.assertNonNull('detailViewContainerRef', this.detailViewContainerRef());
    this.showMasterHeader = this.masterHeaderComponent?.headerContentContainer().nativeElement.children.length > 0;
    this.handleDetailUpdate();
    this.handleMasterQueryList();
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Wenn in der LuxList ein neuer Selected-Wert gepusht wird, diesen abfangen und
   * ein neues Detail auswählen.
   * @param index
   */
  onSelectedChange(index: number) {
    if (index > -1) {
      this.selectedPosition = index;

      this.updateDetail$.next(this.luxMasterList()[index]);

      if (this.isMobile) {
        this.onCloseMaster();
      }
    }
  }

  onOpenMaster() {
    this.luxOpen.set(true);
  }

  onCloseMaster() {
    this.luxOpen.set(false);
  }

  /**
   * Bestimmt, ob die Masterliste auf- oder eingeklappt ist.
   * @param open
   */
  toggleList(open: boolean) {
    if (open) {
      this.onOpenMaster();
    } else {
      this.onCloseMaster();
    }

    if (this.tabsComponent) {
      this.tabsComponent.rerenderTabs();
    }
  }

  /**
   * Prüft, ob die Detailansicht gerade für den User sichtbar ist.
   * @returns boolean
   */
  isDetailInvisible(): boolean {
    return this.isMobile && this.luxOpen();
  }

  onInfiniteScrollingLoad() {
    this.luxScrolled.emit();
  }

  /**
   * Kapselung von der übergebenen luxCompareWith-Funktion.
   * Fängt undefinierte Objekte ab und returned stattdessen false.
   * @param o1
   * @param o2
   */
  compareObjects(o1: T | null, o2: T | null): boolean {
    if (o1 === o2) {
      return true;
    }
    if (!o1 || !o2) {
      return false;
    }
    return this.luxCompareWith()(o1, o2);
  }

  /**
   * Kümmert sich um Änderungen an der HTML-Node der Master-Liste.
   * Rückt dabei das selektierte Element in den Fokus und berechnet wie viele Elemente
   * gerade in der Liste sichtbar sein können (für das Durchschalten mit Pfeiltasten benötigt).
   */
  private handleMasterQueryList() {
    this.subscriptions.push(
      toObservable(this.luxMasterQueryList, { injector: this.injector }).subscribe((masterListElements: readonly ElementRef[]) => {
        const firstElement = masterListElements[0];
        if (firstElement) {
          const { nativeElement } = firstElement;
          this.maxItemsVisible = Math.floor(nativeElement.offsetHeight / nativeElement.offsetHeight);
        }
        // Der Abschnitt hier fängt den Fall ab, dass z.B. das LuxMasterList-Array selbst angepasst wird (z.B. durch Array.reverse).
        // Das sorgt dafür, dass das visuell selektierte Element auch das passende zur Detail-View ist.
        const newSelectedPosition: number = this.luxMasterList().indexOf(this.luxSelectedDetail());
        if (newSelectedPosition !== this.selectedPosition) {
          setTimeout(() => {
            this.selectedPosition = newSelectedPosition;
          });
        }
      })
    );
  }

  /**
   * Kümmert sich um Änderungen an dem selektierten Detail.
   * Dabei werden mehrere Zuweisungen an das Detail über throttleTime gebündelt und nur das Aktuellste genommen.
   * Anschließend wird die Komponente angewiesen das neue Detail-Objekt zu rendern.
   */
  private handleDetailUpdate() {
    this.subscriptions.push(
      this.updateDetail$.asObservable().subscribe((detail: any) => {
        // Gegen das zuletzt tatsächlich GERENDERTE Detail vergleichen, nicht gegen luxSelectedDetail() -
        // siehe Kommentar bei der Deklaration von renderedDetail.
        if (this.compareObjects(this.renderedDetail, detail)) {
          return;
        }
        this.renderedDetail = detail;

        const detailViewContainerRef = this.detailViewContainerRef();

        if (!detail) {
          detailViewContainerRef.clear();
          this.setNewDetail(detail);
        } else {
          detailViewContainerRef.clear();

          const detailView = this.detailView;
          if (!detailView) {
            return;
          }

          this.detailContext = { $implicit: detail };

          // Den Detail-Wrapper erzeugen und abfangen, wann die Nodes geladen worden sind
          const childRef = detailViewContainerRef.createComponent(LuxDetailWrapperComponent);
          const instance = childRef.instance;
          childRef.setInput('luxDetailContext', this.detailContext);
          childRef.setInput('luxDetailTemplate', detailView.tempRef());
          this.subscriptions.push(
            instance.luxDetailRendered.subscribe(() => {
              this.setNewDetail(detail);
            })
          );
          // Die Detailansicht nach dem Wechsel wieder nach oben scrollen lassen
          detailViewContainerRef.element.nativeElement.parentNode.scrollTop = 0;

          this.cdr.detectChanges();
        }
      })
    );
  }

  /**
   * Wird aufgerufen, nachdem ein neues Detail-Template gerendert wurde (oder die Detail-Ansicht
   * geleert wurde) und aktualisiert luxSelectedDetail sowie die abhängige Position/Fokussierung
   * entsprechend. handleDetailUpdate() ruft dies nur bei einer tatsächlich NEUEN Auswahl auf (siehe
   * renderedDetail dort) - die eigentliche Positions-/Fokus-Logik muss daher hier immer laufen.
   * Nur das luxSelectedDetail.set() selbst bleibt bedingt, um bei einer von außen gesetzten
   * Selektion (bei der luxSelectedDetail() bereits den neuen Wert hat) keinen redundanten,
   * unnötigen Signal-Write auszulösen.
   * @param detail
   */
  private setNewDetail(detail: any) {
    if (!this.compareObjects(this.luxSelectedDetail(), detail)) {
      this.luxSelectedDetail.set(detail);
    }
    this.selectedPosition = this.luxMasterList().indexOf(detail);
    // Die Master-Liste fokussieren (die Liste gibt es nur einmal, weil wir auf Changes hören, ist sie aber in einer QueryList)
    this.luxMasterQueryList()[0]?.nativeElement.focus();

    if (this.isMobile && this.luxMasterList().length !== 0) {
      this.luxOpen.set(false);
    }
    this.cdr.detectChanges();
  }

  /**
   * Kümmert sich um den Fall, dass die Master-Liste selbst sich ändert.
   */
  private handleMasterListUpdate() {
    this.subscriptions.push(
      toObservable(this.luxMasterList, { injector: this.injector })
        .pipe(
          // Workaround um ExpressionChanged-Fehler zu vermeiden
          delay(0),
          tap(() => {
            if (!this.luxMasterList() || this.luxMasterList().length === 0) {
              this.updateDetail$.next(null);
            }
          })
        )
        .subscribe()
    );
  }

  /**
   * Prüft, ob das Header- oder -Footer-Element der Masterliste ca. 50 % der Master-Höhe einnehmen.
   *
   * Wenn ja, wird die Ausrichtung des Master-Empty-Labels und Master-Empty-Icons nicht mehr anhand des Details bestimmt.
   */
  private checkEmptyIndicatorAlignment() {
    const headerHeight = this.masterHeader ? this.masterHeader.nativeElement.offsetHeight : 0;
    const footerHeight = this.masterFooter ? this.masterFooter.nativeElement.offsetHeight : 0;

    if (this.masterContainer) {
      // Max-Height ist die Hälfte der Master-Container Höhe minus eine kleine Pauschale von 100px damit
      // die Ansicht nicht zu knapp ist
      const maxHeight = this.masterContainer.nativeElement.offsetHeight / 2 - 100;
      this.alignEmptyIndicators = !(headerHeight > maxHeight || footerHeight > maxHeight);
    }
  }

  /**
   * Meldet über den LiveAnnouncer, dass evtl. weitere Daten via InfiniteScrolling nachgeladen werden könnten.
   *
   * "assertive", damit die Meldung auf jeden Fall vom ScreenReader vorgelesen wird und nicht von etwaigen anderen
   * Aussagen verdeckt wird.
   */
  private announcePossibleInfiniteScrolling() {
    this.liveAnnouncer.announce(
      'Die Masterliste hat weitere Einträge erhalten. ' +
        'Aufgrund des Infinite-Scrollings könnten vielleicht noch mehr Einträge nachgeladen werden.',
      'assertive'
    );
  }
}
