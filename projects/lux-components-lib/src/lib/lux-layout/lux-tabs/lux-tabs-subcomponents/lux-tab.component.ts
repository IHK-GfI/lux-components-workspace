import { Component, ContentChild, Input, TemplateRef } from '@angular/core';
import { LuxBadgeNotificationColor } from '../../../lux-directives/lux-badge-notification/lux-badge-notification.directive';

@Component({
  selector: 'lux-tab',
  template: ''
})
export class LuxTabComponent {
  @Input() luxTitle = '';
  @Input() luxIconName?: string;
  @Input() luxCounter?: number;
  @Input() luxCounterCap = 10;
  @Input() luxShowNotification?: boolean;
  @Input() luxNotificationColor: LuxBadgeNotificationColor = 'accent';
  @Input() luxDisabled = false;
  @Input() luxTagIdHeader?: string;
  @Input() luxTagIdContent?: string;
  @Input() luxImageSrc?: string;
  @Input() luxImageAlign: 'left' | 'center' | 'right' = 'center';
  @Input() luxImageWidth = '36px';
  @Input() luxImageHeight = '36px';

  @ContentChild(TemplateRef) contentTemplate!: TemplateRef<any>;

  onTabActivated() {
    // Wird aufgerufen, wenn der Tab aktiviert wird (sichtbar wird).
  }
}
