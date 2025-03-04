import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { LuxButtonComponent, LuxToggleAcComponent } from 'lux-components-lib';

@Component({
  selector: 'example-form-disable',
  templateUrl: './example-form-disable.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [LuxButtonComponent, LuxToggleAcComponent]
})
export class ExampleFormDisableComponent {
  @Input() form!: FormGroup<any>;
  @Input() controlBinding!: string;
  @Output() disabledChange = new EventEmitter<boolean>();

  _disabled = false;

  get disabled(): boolean {
    return this._disabled;
  }

  @Input() set disabled(disabled: boolean) {
    this._disabled = disabled;

    this.disabledChange.emit(this._disabled);
  }
}
