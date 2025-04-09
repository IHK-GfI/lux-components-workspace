import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { LuxSanitizeConfig } from './lux-sanitize/lux-sanitize-config';
import { LuxSanitizePipe } from './lux-sanitize/lux-sanitize.pipe';

@Component({
  selector: 'lux-html',
  templateUrl: './lux-html.component.html',
  styleUrls: ['./lux-html.component.scss'],
  imports: [LuxSanitizePipe]
})
export class LuxHtmlComponent {
  @Input() luxData = '';
  @Input() luxSanitizeConfig?: LuxSanitizeConfig;
  @Input() luxStyle = '';
  @Input() luxClass = '';

  @ViewChild('content', { read: ElementRef }) contentRef!: ElementRef;

  constructor() {}
}
