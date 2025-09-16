import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

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
  @Input() luxDisabled = false;
  @Input() luxTagIdHeader?: string;
  @Input() luxTagIdContent?: string;
  @Input() luxImageSrc?: string;
  @Input() luxImageAlign: 'left' | 'center' | 'right' = 'center';
  @Input() luxImageWidth = '36px';
  @Input() luxImageHeight = '36px';

  @ContentChild(TemplateRef) contentTemplate!: TemplateRef<any>;

  constructor() {}

  onTabActivated() {
    // Wird aufgerufen, wenn der Tab aktiviert wird (sichtbar wird).
  }
}
