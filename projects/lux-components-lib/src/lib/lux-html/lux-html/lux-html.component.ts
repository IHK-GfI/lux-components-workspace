import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxSanitizeConfig } from '../lux-sanitize/lux-sanitize-config';
import { LuxSanitizePipe } from '../lux-sanitize/lux-sanitize.pipe';

@Component({
  selector: 'lux-html',
  templateUrl: './lux-html.component.html',
  styleUrls: ['./lux-html.component.scss'],
  imports: [LuxSanitizePipe]
})
export class LuxHtmlComponent implements AfterViewInit {
  @Input() luxData = '';
  @Input() luxSanitizeConfig?: LuxSanitizeConfig;
  @Input() luxStyle = '';
  @Input() luxClass = '';

  @ViewChild('content', { read: ElementRef }) contentRef!: ElementRef;

  constructor() {}

  ngAfterViewInit() {
    LuxUtil.assertNonNull('contentRef', this.contentRef);
  }
}
