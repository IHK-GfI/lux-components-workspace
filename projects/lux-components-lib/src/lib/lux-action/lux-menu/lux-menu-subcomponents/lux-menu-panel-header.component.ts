import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-menu-panel-header',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: ''
})
export class LuxMenuPanelHeaderComponent {
  luxTitle = input<string>('');
  luxSubtitle = input<string | undefined>(undefined);
}
