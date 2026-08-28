import { ChangeDetectionStrategy, Component, contentChild, input, TemplateRef } from '@angular/core';

@Component({
  selector: 'lux-master-list-ac',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ''
})
export class LuxMasterListAcComponent {
  readonly luxTitleProp = input<string | undefined>();
  readonly luxTitleTooltipProp = input<string | undefined>();
  readonly luxSubTitleProp = input<string | undefined>();
  readonly luxSubTitleTooltipProp = input<string | undefined>();

  readonly contentTempRef = contentChild<TemplateRef<any>>('luxSimpleContent');
  readonly iconTempRef = contentChild<TemplateRef<any>>('luxSimpleIcon');
  readonly customHeaderTempRef = contentChild<TemplateRef<any>>('luxSimpleCustomHeader');
}
