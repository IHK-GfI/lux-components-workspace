import { ChangeDetectionStrategy, Component, contentChild, input, model, TemplateRef } from '@angular/core';
import { LuxBadgeNotificationColor } from '../../../lux-directives/lux-badge-notification/lux-badge-notification.directive';

@Component({
  selector: 'lux-tab',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ''
})
export class LuxTabComponent {
  readonly luxTitle = model('');
  readonly luxIconName = input<string | undefined>();
  readonly luxCounter = input<number | undefined>();
  readonly luxCounterCap = input(10);
  readonly luxShowNotification = input<boolean | undefined>();
  readonly luxNotificationColor = input<LuxBadgeNotificationColor>('accent');
  readonly luxDisabled = input(false);
  readonly luxTagIdHeader = model<string | undefined>();
  readonly luxTagIdContent = model<string | undefined>();
  readonly luxImageSrc = input<string | undefined>();
  readonly luxImageAlign = input<'left' | 'center' | 'right'>('center');
  readonly luxImageWidth = input('36px');
  readonly luxImageHeight = input('36px');

  readonly contentTemplate = contentChild.required(TemplateRef);

  onTabActivated() {
    // Wird aufgerufen, wenn der Tab aktiviert wird (sichtbar wird).
  }

  getContentTemplate() {
    return this.contentTemplate();
  }
}
