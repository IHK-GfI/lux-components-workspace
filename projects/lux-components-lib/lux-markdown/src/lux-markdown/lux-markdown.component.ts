import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { LuxHtmlComponent, LuxSanitizeConfig } from '@ihk-gfi/lux-components/lux-html';
import { marked } from 'marked';

@Component({
  selector: 'lux-markdown',
  templateUrl: './lux-markdown.component.html',
  imports: [LuxHtmlComponent]
})
export class LuxMarkdownComponent {
  @Input() luxSanitizeConfig?: LuxSanitizeConfig;
  @Input() luxStyle = '';
  @Input() luxClass = '';

  _luxData = '';

  @Input()
  set luxData(markdownData: string) {
    this._luxData = markdownData ? marked(markdownData, { async: false }) : '';
  }

  get luxData() {
    return this._luxData;
  }

  @ViewChild('content') contentComponent!: LuxHtmlComponent;
  @ViewChild('content', { read: ElementRef }) contentRef!: ElementRef;

  constructor() {}
}
