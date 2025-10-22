import { Component, input } from '@angular/core';

@Component({
  selector: 'lux-menu-section-title',
  template: ''
})
export class LuxMenuSectionTitleComponent {
  luxTitle = input<string>('');
}
