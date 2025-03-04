import { Directive, ElementRef, Input, OnChanges, SimpleChanges, inject } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { LuxUtil } from '../../lux-util/lux-util';

export declare type LuxBadgeNotificationColor = 'primary' | 'warn' | 'accent' | string;
export declare type LuxBadgeNotificationSize = 'small' | 'medium' | 'large';
export declare type LuxBadgeNotificationPosition = 'above after' | 'above before' | 'below before' | 'below after';

@Directive({
  selector: '[luxBadgeNotification], [lux-badge-notification]',
  host: {
    class: 'mat-badge',
    '[class.mat-badge-overlap]': 'overlap',
    '[class.mat-badge-above]': 'isAbove()',
    '[class.mat-badge-below]': '!isAbove()',
    '[class.mat-badge-before]': '!isAfter()',
    '[class.mat-badge-after]': 'isAfter()',
    '[class.mat-badge-small]': 'size === "small"',
    '[class.mat-badge-medium]': 'size === "medium"',
    '[class.mat-badge-large]': 'size === "large"',
    '[class.mat-badge-hidden]': 'hidden || isHidden()',
    '[class.mat-badge-disabled]': 'disabled',
    '[class.lux-badge-color-default]': 'color !== "primary" && color !== "warn" && color !== "accent"'
  }
})
export class LuxBadgeNotificationDirective extends MatBadge implements OnChanges {
  private luxElementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  static readonly WHITE_SPACE = '\u{200b}';

  @Input() luxBadgeNotification = '';
  @Input() luxBadgeColor: LuxBadgeNotificationColor = 'default';
  @Input() luxBadgeSize: LuxBadgeNotificationSize = 'medium';
  @Input() luxBadgePosition: LuxBadgeNotificationPosition = 'above after';
  @Input() luxBadgeDisabled = false;
  @Input() luxBadgeHidden = false;
  @Input() luxBadgeOverlap = true;
  @Input() luxBadgeNoBorder = false;
  @Input() luxBadgeCap = 0;

  constructor() {
    super();

    this.luxElementRef.nativeElement.classList.add('lux-badge-notification');
  }

  ngOnChanges(changes: SimpleChanges) {
    this.updateContent(this.luxBadgeNotification);
    this.color = this.luxBadgeColor as any;
    this.size = this.luxBadgeSize;
    this.position = this.luxBadgePosition;
    this.disabled = this.luxBadgeDisabled;
    this.hidden = this.luxBadgeHidden;
    this.overlap = this.luxBadgeOverlap;
    if (this.luxBadgeNoBorder) {
      this.luxElementRef.nativeElement.classList.add('lux-badge-no-border');
    } else {
      this.luxElementRef.nativeElement.classList.remove('lux-badge-no-border');
    }
  }

  updateContent(value: any) {
    let newContent = value;

    if (typeof newContent === 'number') {
      if (this.luxBadgeCap && newContent > this.luxBadgeCap) {
        newContent = this.luxBadgeCap + '+';
      } else {
        newContent = newContent + '';
      }
    } else if (typeof newContent === 'string' && LuxUtil.isNumber(newContent)) {
      if (this.luxBadgeCap && +newContent > this.luxBadgeCap) {
        newContent = this.luxBadgeCap + '+';
      } else {
        newContent = newContent + '';
      }
    } else if (!newContent) {
      // Die Werte "undefined" und "null" zum Leerstring umwandeln,
      // damit diese nicht angezeigt werden.
      newContent = '';
    }
    this.content = newContent === ' ' ? LuxBadgeNotificationDirective.WHITE_SPACE : newContent;
    this.description = newContent;
  }

  isHidden(): boolean {
    return this.hidden || !this.content;
  }
}
