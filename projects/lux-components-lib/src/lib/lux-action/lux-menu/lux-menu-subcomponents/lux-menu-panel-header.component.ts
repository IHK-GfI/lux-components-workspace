import { Component, input } from '@angular/core';

@Component({
  selector: 'lux-menu-panel-header',
  template: ''
})
export class LuxMenuPanelHeaderComponent {
  luxTitle = input<string>('');
  luxSubtitle = input<string | undefined>(undefined);
}
