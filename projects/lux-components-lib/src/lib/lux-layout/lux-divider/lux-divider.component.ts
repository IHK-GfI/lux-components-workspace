import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'lux-divider',
  templateUrl: './lux-divider.component.html',
  styleUrls: ['./lux-divider.component.scss'],
  imports: [MatDivider],
  host: {
    '[class.lux-vertical-divider]': 'luxVertical()',
    '[class.lux-horizontal-divider]': '!luxVertical()'
  }
  ,changeDetection: ChangeDetectionStrategy.OnPush
})
export class LuxDividerComponent {
  luxInset = input<boolean>(false);
  luxVertical = input<boolean>(false);

  constructor() {}
}
