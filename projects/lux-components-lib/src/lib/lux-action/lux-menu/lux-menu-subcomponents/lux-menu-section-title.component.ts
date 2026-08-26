import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lux-menu-section-title',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ''
})
export class LuxMenuSectionTitleComponent {
  luxTitle = input<string>('');
}
