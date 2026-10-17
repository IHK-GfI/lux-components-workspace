import { ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';
import { LuxHtmlComponent, LuxSanitizeConfig } from '@ihk-gfi/lux-components/lux-html';
import { marked } from 'marked';

@Component({
  selector: 'lux-markdown',
  standalone: true,
  templateUrl: './lux-markdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxHtmlComponent]
})
export class LuxMarkdownComponent {
  luxSanitizeConfig = input<LuxSanitizeConfig | undefined>(undefined);
  luxStyle = input('');
  luxClass = input('');
  luxData = input('', {
    transform: (markdownData: string) => (markdownData ? (marked(markdownData, { async: false }) as string) : '')
  });

  contentComponent = viewChild.required<LuxHtmlComponent>('content');
  contentRef = viewChild.required<ElementRef>('content');
}
