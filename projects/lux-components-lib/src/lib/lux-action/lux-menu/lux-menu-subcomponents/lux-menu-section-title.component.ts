import { Component, input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-menu-section-title',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: ''
})
export class LuxMenuSectionTitleComponent {
  luxTitle = input<string>('');
}
