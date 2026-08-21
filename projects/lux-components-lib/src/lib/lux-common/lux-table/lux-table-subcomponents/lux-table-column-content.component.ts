import { ChangeDetectionStrategy, Component, TemplateRef, contentChild, effect } from '@angular/core';

@Component({
  selector: 'lux-table-column-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ''
})
export class LuxTableColumnContentComponent<T = any> {
  readonly tempRef = contentChild.required<TemplateRef<T>>(TemplateRef);

  constructor() {
    effect(() => this.tempRef());
  }
}
