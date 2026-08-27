import { Directive, effect, ElementRef, inject, input } from '@angular/core';
import { MatBadge } from '@angular/material/badge';
import { LuxUtil } from '../../lux-util/lux-util';

export declare type LuxBadgeNotificationColor = 'primary' | 'warn' | 'accent' | 'default' | string;
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
export class LuxBadgeNotificationDirective extends MatBadge {
  private luxElementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  static readonly WHITE_SPACE = '\u{200b}';

  readonly luxBadgeNotification = input<any>('');
  readonly luxBadgeColor = input<LuxBadgeNotificationColor>('default');
  readonly luxBadgeSize = input<LuxBadgeNotificationSize>('medium');
  readonly luxBadgePosition = input<LuxBadgeNotificationPosition>('above after');
  readonly luxBadgeDisabled = input(false);
  readonly luxBadgeHidden = input(false);
  readonly luxBadgeOverlap = input(true);
  readonly luxBadgeNoBorder = input(false);
  readonly luxBadgeCap = input(0);

  constructor() {
    super();

    this.luxElementRef.nativeElement.classList.add('lux-badge-notification');

    // Der erste Effect-Durchlauf ist ein reiner Tracking-Lauf (keine Anwendung der Werte):
    // MatBadge legt sein Badge-Element erst in ngOnInit an, sofern zu diesem Zeitpunkt
    // bereits ein content gesetzt ist. Da ein Effect frühestens nach ngOnInit feuert, würde
    // ein sofortiges syncBadge() hier auf ein bereits existierendes Badge-Element treffen und
    // dessen (unsichtbare) Description-Span doppelt in den Content einfügen. Die initiale
    // Synchronisation übernimmt deshalb ngOnInit (siehe unten), bevor MatBadge.ngOnInit läuft.
    let isFirstRun = true;
    effect(() => {
      this.luxBadgeNotification();
      this.luxBadgeColor();
      this.luxBadgeSize();
      this.luxBadgePosition();
      this.luxBadgeDisabled();
      this.luxBadgeHidden();
      this.luxBadgeOverlap();
      this.luxBadgeNoBorder();

      if (isFirstRun) {
        isFirstRun = false;
        return;
      }

      this.syncBadge();
    });
  }

  override ngOnInit(): void {
    this.syncBadge();
    super.ngOnInit();
  }

  private syncBadge(): void {
    this.updateContent(this.luxBadgeNotification());
    this.color = this.luxBadgeColor() as any;
    this.size = this.luxBadgeSize();
    this.position = this.luxBadgePosition();
    this.disabled = this.luxBadgeDisabled();
    this.hidden = this.luxBadgeHidden();
    this.overlap = this.luxBadgeOverlap();
    if (this.luxBadgeNoBorder()) {
      this.luxElementRef.nativeElement.classList.add('lux-badge-no-border');
    } else {
      this.luxElementRef.nativeElement.classList.remove('lux-badge-no-border');
    }
  }

  updateContent(value: any) {
    let newContent = value;
    const luxBadgeCap = this.luxBadgeCap();

    if (typeof newContent === 'number') {
      if (luxBadgeCap && newContent > luxBadgeCap) {
        newContent = luxBadgeCap + '+';
      } else {
        newContent = newContent + '';
      }
    } else if (typeof newContent === 'string' && LuxUtil.isNumber(newContent)) {
      if (luxBadgeCap && +newContent > luxBadgeCap) {
        newContent = luxBadgeCap + '+';
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
