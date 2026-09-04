import { Component, ElementRef, inject, signal, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LuxButtonComponent,
  LuxDialogActionsComponent,
  LuxDialogContentComponent,
  LuxDialogRef,
  LuxDialogStructureComponent,
  LuxDialogTitleComponent,
  LuxInputAcComponent,
  LuxStepComponent,
  LuxStepContentComponent,
  LuxStepHeaderComponent,
  LuxStepperComponent,
  LuxTextboxComponent
} from '@ihk-gfi/lux-components';

interface DialogStepForm {
  name: FormControl<string>;
  email: FormControl<string>;
}

interface DialogStep2Form {
  street: FormControl<string | null>;
  city: FormControl<string | null>;
}

@Component({
  selector: 'app-stepper-dialog-example',
  templateUrl: './stepper-dialog-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxDialogStructureComponent,
    LuxDialogTitleComponent,
    LuxDialogContentComponent,
    LuxDialogActionsComponent,
    LuxButtonComponent,
    LuxStepperComponent,
    LuxStepComponent,
    LuxStepHeaderComponent,
    LuxStepContentComponent,
    LuxInputAcComponent,
    ReactiveFormsModule,
    LuxTextboxComponent
  ]
})
export class StepperDialogExampleComponent {
  readonly validationBoxRef = viewChild('validationBox', { read: ElementRef });
  readonly finishButtonRef = viewChild('finishButton', { read: LuxButtonComponent });

  readonly currentStepNumber = signal(0);
  readonly validationMessage = 'Bitte füllen Sie alle Pflichtfelder aus.';
  readonly form1 = new FormGroup<DialogStepForm>({
    name: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
    email: new FormControl<string>('', { validators: [Validators.required, Validators.email], nonNullable: true })
  });
  readonly form2 = new FormGroup<DialogStep2Form>({
    street: new FormControl<string | null>(''),
    city: new FormControl<string | null>('')
  });
  readonly totalSteps = 3;

  private readonly validationAttempted = signal(false);
  private readonly luxDialogRef = inject(LuxDialogRef);

  get showValidationMessage(): boolean {
    const form = this.currentStepNumber() === 0 ? this.form1 : this.currentStepNumber() === 1 ? this.form2 : null;
    return this.validationAttempted() && (form?.invalid ?? false);
  }

  get isFirstStep(): boolean {
    return this.currentStepNumber() === 0;
  }

  get isLastStep(): boolean {
    return this.currentStepNumber() === this.totalSteps - 1;
  }

  prevStep(): void {
    this.validationAttempted.set(false);
    if (this.currentStepNumber() > 0) {
      this.currentStepNumber.update((n) => n - 1);
    }
  }

  nextStep(): void {
    const currentForm = this.currentStepNumber() === 0 ? this.form1 : this.currentStepNumber() === 1 ? this.form2 : null;
    if (currentForm?.invalid) {
      currentForm.markAllAsTouched();
      this.validationAttempted.set(true);
      setTimeout(() => this.validationBoxRef()?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
      return;
    }
    this.validationAttempted.set(false);
    if (this.currentStepNumber() < this.totalSteps - 1) {
      this.currentStepNumber.update((n) => n + 1);
      if (this.currentStepNumber() === this.totalSteps - 1) {
        setTimeout(() => this.finishButtonRef()?.elementRef.nativeElement.querySelector('button')?.focus());
      }
    }
  }

  finish(): void {
    if (this.form1.invalid || this.form2.invalid) {
      if (this.form1.invalid) {
        this.currentStepNumber.set(0);
        this.form1.markAllAsTouched();
      } else {
        this.currentStepNumber.set(1);
        this.form2.markAllAsTouched();
      }
      return;
    }
    this.luxDialogRef.closeDialog(true);
  }
}
