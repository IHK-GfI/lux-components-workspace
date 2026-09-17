import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, contentChild, TemplateRef, viewChild } from '@angular/core';
import { LuxUtil } from '@ihk-gfi/lux-components';

@Component({
  selector: 'lux-chat-entry',
  imports: [CommonModule],
  template:
    '<ng-template let-item #core><ng-container *ngTemplateOutlet="entryTemplateRef() ?? null; context: { $implicit: item }"></ng-container></ng-template>'
})
export class LuxChatEntryComponent implements AfterContentInit {
  public templateRef = viewChild.required<TemplateRef<any>>('core');
  public entryTemplateRef = contentChild(TemplateRef);

  ngAfterContentInit() {
    LuxUtil.assertNonNull(`entryTemplateRef (missing <ng-template></ng-template> in <lux-chat-entry>)`, this.entryTemplateRef());
  }
}
