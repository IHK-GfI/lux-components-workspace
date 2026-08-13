import { Component, ElementRef, ViewChild, inject } from '@angular/core';
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
  luxDialogRef = inject(LuxDialogRef);

  @ViewChild('validationBox', { read: ElementRef }) validationBoxRef?: ElementRef;
  @ViewChild('finishButton', { read: LuxButtonComponent }) finishButtonRef?: LuxButtonComponent;

  currentStepNumber = 0;
  private validationAttempted = false;
  readonly validationMessage = 'Bitte füllen Sie alle Pflichtfelder aus.';

  get showValidationMessage(): boolean {
    const form = this.currentStepNumber === 0 ? this.form1 : this.currentStepNumber === 1 ? this.form2 : null;
    return this.validationAttempted && (form?.invalid ?? false);
  }

  form1 = new FormGroup<DialogStepForm>({
    name: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
    email: new FormControl<string>('', { validators: [Validators.required, Validators.email], nonNullable: true })
  });

  form2 = new FormGroup<DialogStep2Form>({
    street: new FormControl<string | null>(''),
    city: new FormControl<string | null>('')
  });

  readonly totalSteps = 3;

  get isFirstStep(): boolean {
    return this.currentStepNumber === 0;
  }

  get isLastStep(): boolean {
    return this.currentStepNumber === this.totalSteps - 1;
  }

  prevStep(): void {
    this.validationAttempted = false;
    if (this.currentStepNumber > 0) {
      this.currentStepNumber--;
    }
  }

  nextStep(): void {
    const currentForm = this.currentStepNumber === 0 ? this.form1 : this.currentStepNumber === 1 ? this.form2 : null;
    if (currentForm?.invalid) {
      currentForm.markAllAsTouched();
      this.validationAttempted = true;
      setTimeout(() => this.validationBoxRef?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
      return;
    }
    this.validationAttempted = false;
    if (this.currentStepNumber < this.totalSteps - 1) {
      this.currentStepNumber++;
      if (this.currentStepNumber === this.totalSteps - 1) {
        setTimeout(() => this.finishButtonRef?.elementRef.nativeElement.querySelector('button')?.focus());
      }
    }
  }

  finish(): void {
    if (this.form1.invalid || this.form2.invalid) {
      if (this.form1.invalid) {
        this.currentStepNumber = 0;
        this.form1.markAllAsTouched();
      } else {
        this.currentStepNumber = 1;
        this.form2.markAllAsTouched();
      }
      return;
    }
    this.luxDialogRef.closeDialog(true);
  }
}
