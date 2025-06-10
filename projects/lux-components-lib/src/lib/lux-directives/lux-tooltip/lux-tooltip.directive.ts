import { AfterViewInit, Directive, HostListener, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxLinkPlainComponent } from '../../lux-action/lux-link-plain/lux-link-plain.component';
import { LuxLinkComponent } from '../../lux-action/lux-link/lux-link.component';

@Directive({
  selector: '[luxTooltip]',
  exportAs: 'luxTooltip'
})
export class LuxTooltipDirective extends MatTooltip implements OnInit, OnChanges, AfterViewInit {
  @Input() luxTooltip = '???';
  @Input() luxTooltipHideDelay = 0;
  @Input() luxTooltipShowDelay = 0;
  @Input() luxTooltipPosition: TooltipPosition = 'above';
  @Input() luxTooltipDisabled = false;

  luxButton = inject(LuxButtonComponent, { optional: true });
  luxLink = inject(LuxLinkComponent, { optional: true });
  luxLinkPlain = inject(LuxLinkPlainComponent, { optional: true });

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

  ngOnInit(): void {
    if (this.luxButton) {
      this.luxButton.tooltipDirective = this;
    }
    if (this.luxLink) {
      this.luxLink.luxButton.tooltipDirective = this;
    }
    if (this.luxLinkPlain) {
      this.luxLinkPlain.tooltipDirective = this;
    }
  }

  ngOnChanges(_simpleChanges: SimpleChanges) {
    this.message = this.luxTooltip;
    this.hideDelay = this.luxTooltipHideDelay;
    this.showDelay = this.luxTooltipShowDelay;
    this.position = this.luxTooltipPosition;
    this.disabled = this.luxTooltipDisabled;
  }
}
