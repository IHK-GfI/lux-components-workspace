import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';
import { LuxSanitizeConfig } from './lux-sanitize/lux-sanitize-config';
import { LuxSanitizePipe } from './lux-sanitize/lux-sanitize.pipe';

@Component({
  selector: 'lux-html',
  standalone: true,
  templateUrl: './lux-html.component.html',
  styleUrls: ['./lux-html.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxSanitizePipe]
})
export class LuxHtmlComponent {
  luxData = input('');
  luxSanitizeConfig = input<LuxSanitizeConfig | undefined>(undefined);
  luxStyle = input('');
  luxClass = input('');

  contentRef = viewChild.required<ElementRef>('content');
}
