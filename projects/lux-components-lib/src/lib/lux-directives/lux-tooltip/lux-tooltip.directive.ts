import { AfterViewInit, Directive, effect, ElementRef, inject, input, OnDestroy } from '@angular/core';
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip';
import { LUX_TOOLTIP_HOST } from './lux-tooltip-host';
import { LuxTooltipTruncationWatcher } from './lux-tooltip-truncation';

@Directive({
  selector: '[luxTooltip]',
  exportAs: 'luxTooltip',
  host: {
    '(longpress)': '_handleLongPress()',
    '(document:keydown.escape)': '_handleEscape()'
  }
})
export class LuxTooltipDirective extends MatTooltip implements AfterViewInit, OnDestroy {
  readonly luxTooltip = input('???');
  readonly luxTooltipHideDelay = input(0);
  readonly luxTooltipShowDelay = input(0);
  readonly luxTooltipPosition = input<TooltipPosition>('above');
  readonly luxTooltipDisabled = input(false);
  readonly luxTooltipIfTruncated = input(false);

  // Nur die Komponente auf demselben Element (self), nicht umgebende Komponenten: Ein Tooltip an einem
  // Menüeintrag darf sich z.B. nicht beim umgebenden LuxMenu anmelden.
  private readonly tooltipHost = inject(LUX_TOOLTIP_HOST, { optional: true, self: true });
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  private truncationWatcher?: LuxTooltipTruncationWatcher;
  private viewInitialized = false;

  _handleLongPress() {
    super.show(this.luxTooltipShowDelay());
  }

  _handleEscape() {
    super.hide(0);
  }

  constructor() {
    super();

    effect(() => {
      this.message = this.luxTooltip();
      this.hideDelay = this.luxTooltipHideDelay();
      this.showDelay = this.luxTooltipShowDelay();
      this.position = this.luxTooltipPosition();

      // Vor ngAfterViewInit steht das Layout noch nicht bereit, der Watcher wird erst
      // dort gestartet. Danach reagiert dieser Effect auf ein Umschalten von
      // luxTooltipIfTruncated zur Laufzeit.
      if (this.viewInitialized) {
        this.syncTruncationWatch();
      }
      this.syncDisabledState();
    });
  }

  override show(delay?: number): void {
    super.show(delay || this.luxTooltipShowDelay());
  }

  override hide(delay?: number): void {
    super.hide(delay || this.luxTooltipHideDelay());
  }

  override ngAfterViewInit(): void {
    this.tooltipHost?.registerTooltip(this);

    this.viewInitialized = true;
    this.syncTruncationWatch();
    this.syncDisabledState();
    super.ngAfterViewInit();
  }

  override ngOnDestroy(): void {
    this.truncationWatcher?.disconnect();
    super.ngOnDestroy();
  }

  /** Startet bzw. stoppt die Truncation-Beobachtung passend zu luxTooltipIfTruncated. */
  private syncTruncationWatch(): void {
    if (this.luxTooltipIfTruncated()) {
      this.truncationWatcher ??= new LuxTooltipTruncationWatcher(this.elementRef.nativeElement, () => this.syncDisabledState());
      this.truncationWatcher.connect();
    } else {
      this.truncationWatcher?.disconnect();
    }
  }

  /**
   * Einzige Stelle, die `disabled` setzt (Single Source of Truth). Der Tooltip ist
   * deaktiviert, wenn er explizit deaktiviert wurde ODER wenn nur bei Kürzung
   * angezeigt werden soll und der Text gerade vollständig passt.
   */
  private syncDisabledState(): void {
    const hiddenBecauseItFits = this.luxTooltipIfTruncated() && !(this.truncationWatcher?.isTruncated ?? false);
    this.disabled = this.luxTooltipDisabled() || hiddenBecauseItFits;
  }
}
