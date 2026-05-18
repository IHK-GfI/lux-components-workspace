import { NgClass } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import {
  LuxButtonComponent,
  LuxCheckboxAcComponent,
  LuxCheckboxContainerAcComponent,
  LuxIconComponent,
  LuxInputAcComponent,
  LuxMediaQueryObserverService,
  LuxToggleAcComponent,
  luxAtLeastOneCheckboxChecked,
  luxAtLeastOneChecked
} from '@ihk-gfi/lux-components';
import { Subscription } from 'rxjs';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

interface CheckboxOptionsGroup {
  cb1: FormControl<boolean>;
  cb2: FormControl<boolean>;
  cb3: FormControl<boolean>;
}

interface CheckboxValidatorDemoForm {
  options: FormGroup<CheckboxOptionsGroup>;
}

@Component({
  selector: 'checkbox-container-ac-example',
  templateUrl: './checkbox-container-ac-example.component.html',
  styleUrls: ['./checkbox-container-ac-example.component.scss'],
  imports: [
    LuxCheckboxContainerAcComponent,
    LuxToggleAcComponent,
    LuxInputAcComponent,
    LuxCheckboxAcComponent,
    LuxButtonComponent,
    LuxIconComponent,
    MatError,
    ReactiveFormsModule,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    NgClass,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class CheckboxContainerAcExampleComponent {
  private mediaQuery = inject(LuxMediaQueryObserverService);

  label = 'Optionales Label für den Container';
  isVertical = true;
  isSmall: boolean;
  subscriptions: Subscription[] = [];

  validatorDemoForm: FormGroup<CheckboxValidatorDemoForm>;

  // Standalone-Demo (ohne Formular)
  standalone1 = false;
  standalone2 = false;
  standalone3 = false;
  standaloneSubmitted = false;
  readonly luxAtLeastOneChecked = luxAtLeastOneChecked;

  constructor() {
    this.isSmall = this.mediaQuery.isSmaller('md');
    this.subscriptions.push(
      this.mediaQuery.getMediaQueryChangedAsObservable().subscribe(() => {
        this.isSmall = this.mediaQuery.isSmaller('md');
      })
    );

    this.validatorDemoForm = new FormGroup<CheckboxValidatorDemoForm>({
      options: new FormGroup<CheckboxOptionsGroup>(
        {
          cb1: new FormControl<boolean>(false, { nonNullable: true }),
          cb2: new FormControl<boolean>(false, { nonNullable: true }),
          cb3: new FormControl<boolean>(false, { nonNullable: true })
        },
        { validators: luxAtLeastOneCheckboxChecked(['cb1', 'cb2', 'cb3']) }
      )
    });
  }

  submitValidatorDemo(): void {
    this.validatorDemoForm.markAllAsTouched();
    this.validatorDemoForm.updateValueAndValidity();
  }

  submitStandaloneDemo(): void {
    this.standaloneSubmitted = true;
  }
}
