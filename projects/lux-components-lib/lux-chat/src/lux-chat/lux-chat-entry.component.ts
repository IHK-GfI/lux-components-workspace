import { CommonModule } from "@angular/common";
import { Component, contentChild, TemplateRef, viewChild } from "@angular/core";

@Component({
  selector: 'lux-chat-entry',
  imports: [
    CommonModule,
],
  template: '<ng-template let-item #core><ng-container *ngTemplateOutlet="entryTemplateRef() ?? null; context: { $implicit: item }"></ng-container></ng-template>'
})
export class LuxChatEntryComponent {

  public templateRef = viewChild.required<TemplateRef<any>>("core");
  public entryTemplateRef = contentChild(TemplateRef);

}