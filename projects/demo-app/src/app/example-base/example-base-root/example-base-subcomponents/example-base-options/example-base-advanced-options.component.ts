import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';

@Component({
  selector: 'example-base-advanced-options',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '<ng-content></ng-content>'
})
export class ExampleBaseAdvancedOptionsComponent {
  private cdr = inject(ChangeDetectorRef);

  markForCheck(): void {
    this.cdr.markForCheck();
  }
}
