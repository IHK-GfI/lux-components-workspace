import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LuxButtonComponent, LuxToggleAcComponent } from '@ihk-gfi/lux-components';

@Component({
  selector: 'example-form-disable',
  templateUrl: './example-form-disable.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxButtonComponent, LuxToggleAcComponent]
})
export class ExampleFormDisableComponent {
  readonly form = input.required<FormGroup<any>>();
  readonly controlBinding = input.required<string>();
  readonly disabled = model(false);

  setDisabled(disabled: boolean): void {
    this.disabled.set(disabled);
  }
}
