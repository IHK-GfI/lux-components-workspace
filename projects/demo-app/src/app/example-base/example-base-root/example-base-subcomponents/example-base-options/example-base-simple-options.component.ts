import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';

@Component({
  selector: 'example-base-simple-options',
  changeDetection: ChangeDetectionStrategy.Eager,
  template: '<ng-content></ng-content>'
})
export class ExampleBaseSimpleOptionsComponent {
  private cdr = inject(ChangeDetectorRef);

  markForCheck(): void {
    this.cdr.markForCheck();
  }
}
