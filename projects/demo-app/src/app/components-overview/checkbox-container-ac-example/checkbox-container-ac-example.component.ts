import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, WritableSignal, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  readonly label = signal('Optionales Label für den Container');
  readonly isVertical = signal(true);
  readonly isSmall: WritableSignal<boolean>;

  readonly validatorDemoForm = new FormGroup<CheckboxValidatorDemoForm>({
    options: new FormGroup<CheckboxOptionsGroup>(
      {
        cb1: new FormControl<boolean>(false, { nonNullable: true }),
        cb2: new FormControl<boolean>(false, { nonNullable: true }),
        cb3: new FormControl<boolean>(false, { nonNullable: true })
      },
      { validators: luxAtLeastOneCheckboxChecked(['cb1', 'cb2', 'cb3']) }
    )
  });

  // Standalone-Demo (ohne Formular)
  readonly standalone1 = signal(false);
  readonly standalone2 = signal(false);
  readonly standalone3 = signal(false);
  readonly standaloneSubmitted = signal(false);
  readonly luxAtLeastOneChecked = luxAtLeastOneChecked;

  private readonly mediaQuery = inject(LuxMediaQueryObserverService);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.isSmall = signal(this.mediaQuery.isSmaller('md'));

    this.mediaQuery
      .getMediaQueryChangedAsObservable()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.isSmall.set(this.mediaQuery.isSmaller('md')));
  }

  submitValidatorDemo(): void {
    this.validatorDemoForm.markAllAsTouched();
    this.validatorDemoForm.updateValueAndValidity();
  }

  submitStandaloneDemo(): void {
    this.standaloneSubmitted.set(true);
  }
}
