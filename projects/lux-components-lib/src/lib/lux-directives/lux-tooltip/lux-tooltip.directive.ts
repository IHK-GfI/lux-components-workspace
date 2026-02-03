import { AfterViewInit, Directive, HostListener, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip';
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
export class LuxTooltipDirective extends MatTooltip implements OnChanges, AfterViewInit {
  @Input() luxTooltip = '???';
  @Input() luxTooltipHideDelay = 0;
  @Input() luxTooltipShowDelay = 0;
  @Input() luxTooltipPosition: TooltipPosition = 'above';
  @Input() luxTooltipDisabled = false;

  luxButton = inject(LuxButtonComponent, { optional: true });
  luxLink = inject(LuxLinkComponent, { optional: true });
  luxLinkPlain = inject(LuxLinkPlainComponent, { optional: true });
  luxActionNavAc = inject(LuxAppHeaderAcActionNavItemComponent, { optional: true });
  luxActionNav = inject(LuxAppHeaderActionNavItemComponent, { optional: true });
  luxMenu = inject(LuxMenuComponent, { optional: true });

  @HostListener('longpress') _handleLongPress() {
    super.show(this.luxTooltipShowDelay);
  }

  @HostListener('document:keydown.escape') _handleEscape() {
    super.hide(0);
  }

  override show(delay?: number): void {
    super.show(delay || this.luxTooltipShowDelay);
  }

  override hide(delay?: number): void {
    super.hide(delay || this.luxTooltipHideDelay);
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
      
    super.ngAfterViewInit();
  }

  ngOnChanges(_simpleChanges: SimpleChanges) {
    this.message = this.luxTooltip;
    this.hideDelay = this.luxTooltipHideDelay;
    this.showDelay = this.luxTooltipShowDelay;
    this.position = this.luxTooltipPosition;
    this.disabled = this.luxTooltipDisabled;
  }
}
