import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'lux-menu-panel-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ''
})
export class LuxMenuPanelHeaderComponent {
  readonly luxTitle = input<string>('');
  readonly luxSubtitle = input<string | undefined>(undefined);
}
