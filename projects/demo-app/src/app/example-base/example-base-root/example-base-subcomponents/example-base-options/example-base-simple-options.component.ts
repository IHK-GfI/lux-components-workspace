import { ChangeDetectorRef, Component, inject } from '@angular/core';

@Component({
  selector: 'example-base-simple-options',
  template: '<ng-content></ng-content>'
})
export class ExampleBaseSimpleOptionsComponent {
  private cdr = inject(ChangeDetectorRef);

  markForCheck(): void {
    this.cdr.markForCheck();
  }
}
