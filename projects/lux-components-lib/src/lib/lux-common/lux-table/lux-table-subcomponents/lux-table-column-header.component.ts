import { ChangeDetectionStrategy, Component, TemplateRef, contentChild, effect } from '@angular/core';

@Component({
  selector: 'lux-table-column-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ''
})
export class LuxTableColumnHeaderComponent<T = any> {
  readonly tempRef = contentChild.required<TemplateRef<T>>(TemplateRef);

  constructor() {
    effect(() => this.tempRef());
  }
}
