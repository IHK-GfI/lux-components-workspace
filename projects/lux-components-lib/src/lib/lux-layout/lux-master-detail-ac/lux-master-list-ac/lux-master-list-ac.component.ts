import { Component, ContentChild, Input, TemplateRef, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lux-master-list-ac',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: ''
})
export class LuxMasterListAcComponent {
  @Input() luxTitleProp?: string;
  @Input() luxTitleTooltipProp?: string;
  @Input() luxSubTitleProp?: string;
  @Input() luxSubTitleTooltipProp?: string;

  @ContentChild('luxSimpleContent') contentTempRef?: TemplateRef<any>;
  @ContentChild('luxSimpleIcon') iconTempRef?: TemplateRef<any>;
  @ContentChild('luxSimpleCustomHeader') customHeaderTempRef?: TemplateRef<any>;

  constructor() {}
}
