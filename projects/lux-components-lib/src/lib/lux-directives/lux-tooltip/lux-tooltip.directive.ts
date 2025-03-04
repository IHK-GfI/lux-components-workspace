import { Directive, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatTooltip, TooltipPosition } from '@angular/material/tooltip';

@Directive({
  selector: '[luxTooltip]',
  exportAs: 'luxTooltip'
})
export class LuxTooltipDirective extends MatTooltip implements OnChanges {
  @Input() luxTooltip = '???';
  @Input() luxTooltipHideDelay = 0;
  @Input() luxTooltipShowDelay = 0;
  @Input() luxTooltipPosition: TooltipPosition = 'above';
  @Input() luxTooltipDisabled = false;

  @HostListener('longpress') _handleLongPress() {
    super.show(this.luxTooltipShowDelay);
  }

  @HostListener('document:keydown.escape') _handleEscape() {
    super.hide(0);
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    this.message = this.luxTooltip;
    this.hideDelay = this.luxTooltipHideDelay;
    this.showDelay = this.luxTooltipShowDelay;
    this.position = this.luxTooltipPosition;
    this.disabled = this.luxTooltipDisabled;
  }
}
