import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  model,
  OnDestroy,
  output,
  Signal,
  signal,
  viewChild
} from '@angular/core';
import { MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { Subscription } from 'rxjs';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxAccordionComponent, LuxTogglePosition } from '../lux-accordion/lux-accordion.component';

@Component({
  selector: 'lux-panel',
  templateUrl: './lux-panel.component.html',
  styleUrls: ['./lux-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatExpansionPanel, MatExpansionPanelHeader]
})
export class LuxPanelComponent implements AfterViewInit, OnDestroy {
  readonly luxDisabled = input<boolean | undefined>();
  readonly luxExpanded = model(false);
  readonly luxHideToggle = input<boolean | undefined>();
  readonly luxTogglePosition = input<LuxTogglePosition>();
  readonly luxStickyHeader = input<boolean | undefined>();
  readonly luxStickyHeaderOffset = input<string | undefined>();
  readonly luxCollapsedHeaderHeight = input<string | undefined>();
  readonly luxExpandedHeaderHeight = input<string | undefined>();
  readonly luxDynamicHeaderHeight = input<boolean | undefined>();

  readonly luxOpened = output<void>();
  readonly luxClosed = output<void>();

  readonly matExpansionPanel = viewChild.required(MatExpansionPanel);

  readonly mobile = signal(false);

  protected parent = inject(LuxAccordionComponent, { optional: true, host: true, skipSelf: true });
  protected mediaQuery = inject(LuxMediaQueryObserverService);
  private subscriptions: Subscription[] = [];
  private readonly syncedExpandedHeaderHeight = this.syncFromParentOnChange(this.luxExpandedHeaderHeight, () =>
    this.parent?.luxExpandedHeaderHeight()
  );
  private readonly syncedCollapsedHeaderHeight = this.syncFromParentOnChange(this.luxCollapsedHeaderHeight, () =>
    this.parent?.luxCollapsedHeaderHeight()
  );

  // Panel-Wert hat Priorität, sonst greift der Wert des umgebenden Accordions.
  readonly stickyHeader = computed(() => this.luxStickyHeader() ?? this.parent?.luxStickyHeader());
  readonly stickyHeaderOffset = computed(() => this.luxStickyHeaderOffset() ?? this.parent?.luxStickyHeaderOffset());

  // Diese Properties übernehmen zusätzlich das Verhalten des alten changed$-Subjects: eine
  // nachträgliche Änderung am Accordion überschreibt den aktuell wirksamen Panel-Wert wieder
  // bedingungslos (unabhängig davon, ob das Panel selbst einen eigenen Wert gebunden hat) -
  // bis das Panel seinerseits wieder einen eigenen Wert bindet. Siehe syncFromParentOnChange().
  readonly effectiveHideToggle = this.syncFromParentOnChange(this.luxHideToggle, () => this.parent?.luxHideToggle());
  readonly effectiveDisabled = this.syncFromParentOnChange(this.luxDisabled, () => this.parent?.luxDisabled());
  readonly effectiveTogglePosition = this.syncFromParentOnChange(this.luxTogglePosition, () => this.parent?.luxTogglePosition() ?? 'after');
  readonly effectiveDynamicHeaderHeight = this.syncFromParentOnChange(this.luxDynamicHeaderHeight, () => this.parent?.luxDynamicHeaderHeight());
  readonly effectiveExpandedHeaderHeight = computed(() => (this.effectiveDynamicHeaderHeight() ? 'unset' : this.syncedExpandedHeaderHeight()));
  readonly effectiveCollapsedHeaderHeight = computed(() => (this.effectiveDynamicHeaderHeight() ? 'unset' : this.syncedCollapsedHeaderHeight()));

  constructor() {
    this.mobile.set(this.mediaQuery.isSmallerOrEqual('sm'));

    this.subscriptions.push(
      this.mediaQuery.getMediaQueryChangedAsObservable().subscribe(() => {
        this.mobile.set(this.mediaQuery.isSmallerOrEqual('sm'));
      })
    );
  }

  ngAfterViewInit() {
    LuxUtil.assertNonNull('matExpansionPanel', this.getMatExpansionPanel());

    // Diese Zeile wird benötigt, damit der Multi-Mode (nur ein Abschnitt darf geöffnet sein)
    // des Accordions funktioniert. Die Zuweisung des übergeordneten Accordions an dieses Panel
    // muss einen Zyklus später stattfinden, um einen ExpressionChangedAfterItHasBeenCheckedError
    // zu vermeiden.
    setTimeout(() => {
      if (this.parent) {
        this.getMatExpansionPanel().accordion = this.parent.matAccordion();
      }
    });
  }

  ngOnDestroy() {
    if (this.subscriptions) {
      this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
    }
  }

  onOpened() {
    this.luxOpened.emit();
    this.luxExpanded.set(true);
  }

  onClosed() {
    this.luxClosed.emit();
    this.luxExpanded.set(false);
  }

  protected getMatExpansionPanel() {
    return this.matExpansionPanel();
  }

  /**
   * Repliziert das Verhalten des alten changed$-Subjects: initial hat der Panel-Wert Priorität
   * (falls das Panel keinen eigenen Wert bindet, wird der Wert des Accordions übernommen). Ändert
   * sich anschließend EINE der beiden Quellen, gewinnt diese - unabhängig vom aktuellen Wert der
   * jeweils anderen Quelle. So bleibt ein Accordion-weites Umschalten wirksam, auch wenn ein
   * Panel bereits (z.B. mit `false`) einen eigenen Wert gebunden hat.
   *
   * Wichtig: Der Fallback-Pfad (own() ?? parent()) darf NICHT einmalig im Konstruktor berechnet
   * werden - zu diesem Zeitpunkt hat Angular die Inputs des Accordions (parent) noch nicht befüllt
   * (die Input-Bindings des umgebenden Accordions laufen erst NACH der Konstruktion dieses
   * Panels). Daher bleibt der Fallback ein lazy ausgewertetes computed(); nur nachträgliche
   * Änderungen (per effect(), die erst nach dem initialen Rendern feuern) werden in einem
   * separaten "override"-Signal festgehalten.
   */
  private syncFromParentOnChange<T>(own: Signal<T | undefined>, parent: () => T | undefined): Signal<T | undefined> {
    const override = signal<{ value: T | undefined } | undefined>(undefined);
    let skipOwn = true;
    let skipParent = true;

    effect(() => {
      const value = own();
      if (skipOwn) {
        skipOwn = false;
        return;
      }
      override.set({ value: value ?? parent() });
    });

    effect(() => {
      const value = parent();
      if (skipParent) {
        skipParent = false;
        return;
      }
      override.set({ value });
    });

    return computed(() => {
      const overrideValue = override();
      return overrideValue !== undefined ? overrideValue.value : (own() ?? parent());
    });
  }
}
