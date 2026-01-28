import { Directive, TemplateRef, inject } from '@angular/core';

@Directive({
  selector: 'ng-template[luxPopupActions]',
  exportAs: 'luxPopupActions'
})
export class LuxPopupActionsDirective {
  public readonly templateRef = inject<TemplateRef<unknown>>(TemplateRef);
}
