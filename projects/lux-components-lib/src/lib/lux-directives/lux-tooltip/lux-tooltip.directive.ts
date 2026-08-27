import { AfterViewInit, Directive, effect, ElementRef, HostListener, inject, input, OnDestroy } from '@angular/core';
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip';
import { LuxTooltipTruncationWatcher } from './lux-tooltip-truncation';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxLinkPlainComponent } from '../../lux-action/lux-link-plain/lux-link-plain.component';
import { LuxLinkComponent } from '../../lux-action/lux-link/lux-link.component';
import { LuxMenuComponent } from '../../lux-action/lux-menu/lux-menu.component';
import { LuxAppHeaderAcActionNavItemComponent } from '../../lux-layout/lux-app-header-ac/lux-app-header-ac-subcomponents/lux-app-header-ac-action-nav/lux-app-header-ac-action-nav-item/lux-app-header-ac-action-nav-item.component';
import { LuxAppHeaderActionNavItemComponent } from '../../lux-layout/lux-app-header/lux-app-header-subcomponents/lux-app-header-action-nav/lux-app-header-action-nav-item/lux-app-header-action-nav-item.component';

@Directive({
  selector: '[luxTooltip]',
  exportAs: 'luxTooltip'
})
export class LuxTooltipDirective extends MatTooltip implements AfterViewInit, OnDestroy {
  readonly luxTooltip = input('???');
  readonly luxTooltipHideDelay = input(0);
  readonly luxTooltipShowDelay = input(0);
  readonly luxTooltipPosition = input<TooltipPosition>('above');
  readonly luxTooltipDisabled = input(false);
  readonly luxTooltipIfTruncated = input(false);

  luxButton = inject(LuxButtonComponent, { optional: true });
  luxLink = inject(LuxLinkComponent, { optional: true });
  luxLinkPlain = inject(LuxLinkPlainComponent, { optional: true });
  luxActionNavAc = inject(LuxAppHeaderAcActionNavItemComponent, { optional: true });
  luxActionNav = inject(LuxAppHeaderActionNavItemComponent, { optional: true });
  luxMenu = inject(LuxMenuComponent, { optional: true });
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  private truncationWatcher?: LuxTooltipTruncationWatcher;
  private viewInitialized = false;

  @HostListener('longpress') _handleLongPress() {
    super.show(this.luxTooltipShowDelay());
  }

  @HostListener('document:keydown.escape') _handleEscape() {
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
    if (this.luxButton) {
      this.luxButton.tooltipDirective = this;
    }
    if (this.luxLink) {
      this.luxLink.tooltipDirective = this;
    }
    if (this.luxLinkPlain) {
      this.luxLinkPlain.tooltipDirective = this;
    }
    if (this.luxActionNavAc && this.luxActionNavAc.buttonComponent) {
      
      this.luxActionNavAc.buttonComponent.tooltipDirective = this;
    }
    if (this.luxActionNav && this.luxActionNav.buttonComponent) {
      
      this.luxActionNav.buttonComponent.tooltipDirective = this;
    }
    if (this.luxMenu && this.luxMenu.defaultTriggerComponent) {
      this.luxMenu.defaultTriggerComponent.tooltipDirective = this;
    }

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
