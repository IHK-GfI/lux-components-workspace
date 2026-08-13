import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { NgTemplateOutlet } from '@angular/common';
import { Component, DestroyRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ILuxStepperButtonConfig,
  LuxAccordionComponent,
  LuxAppFooterButtonInfo,
  LuxAppFooterButtonService,
  LuxButtonComponent,
  LuxDialogService,
  LuxFormHintComponent,
  LuxInputAcComponent,
  LuxPanelComponent,
  LuxPanelContentComponent,
  LuxPanelHeaderTitleComponent,
  LuxSelectAcComponent,
  LuxSnackbarService,
  LuxStepComponent,
  LuxStepContentComponent,
  LuxStepHeaderComponent,
  LuxStepperComponent,
  LuxStepperHelperService,
  LuxTextboxComponent,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';
import { StepperDialogExampleComponent } from './stepper-dialog-example/stepper-dialog-example.component';

interface IStepperButtonConfigWithVariant extends ILuxStepperButtonConfig {
  variant?: 'default' | 'flat' | 'stroked';
}

interface StepperDummyForm {
  control1: FormControl<string>;
  control2: FormControl<string>;
}

interface StepperForm1DummyForm {
  street: FormControl<string>;
  number: FormControl<string>;
  city: FormControl<string>;
}

interface StepperForm2DummyForm {
  iban: FormControl<string>;
  bic: FormControl<string | null>;
}

@Component({
  selector: 'app-stepper-example',
  templateUrl: './stepper-example.component.html',
  styleUrls: ['./stepper-example.component.scss'],
  imports: [
    LuxTextboxComponent,
    LuxAccordionComponent,
    LuxStepContentComponent,
    LuxStepHeaderComponent,
    LuxStepComponent,
    LuxStepperComponent,
    LuxPanelHeaderTitleComponent,
    LuxPanelContentComponent,
    LuxPanelComponent,
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    LuxButtonComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ReactiveFormsModule,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent,
    NgTemplateOutlet
  ]
})
export class StepperExampleComponent implements OnDestroy {
  private stepperService = inject(LuxStepperHelperService);
  private buttonService = inject(LuxAppFooterButtonService);
  private snackbar = inject(LuxSnackbarService);
  private router = inject(Router);
  private dialogService = inject(LuxDialogService);
  private destroyRef = inject(DestroyRef);

  @ViewChild(LuxStepperComponent, { static: true }) stepperComponent!: LuxStepperComponent;
  newStepsVisible = false;
  newStepsForm1: FormGroup<StepperForm1DummyForm>;
  newStepsForm2: FormGroup<StepperForm2DummyForm>;
  showOutputEvents = false;
  useCustomButtonConfig = false;
  log = logResult;
  steps: any[] = [
    {
      iconName: 'lux-interface-bookmark',
      iconSize: '1x',
      optional: false,
      editable: true,
      completed: false,
      useStepControl: true,
      stepControl: new FormGroup<StepperDummyForm>({
        control1: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
        control2: new FormControl<string>('', {
          validators: Validators.compose([Validators.minLength(5), Validators.required]),
          nonNullable: true
        })
      }),
      hide: false
    },
    {
      iconName: 'lux-interface-user-single',
      iconSize: '1x',
      optional: false,
      editable: true,
      completed: false,
      useStepControl: true,
      stepControl: new FormGroup<StepperDummyForm>({
        control1: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
        control2: new FormControl<string>('', {
          validators: Validators.compose([Validators.minLength(5), Validators.required]),
          nonNullable: true
        })
      }),
      hide: false
    }
  ];
  previousButtonConfig: IStepperButtonConfigWithVariant = {
    label: '',
    iconName: 'lux-interface-arrows-left',
    color: 'primary'
  };
  nextButtonConfig: IStepperButtonConfigWithVariant = {
    label: '',
    iconName: 'lux-interface-arrows-right',
    color: 'primary'
  };
  finishButtonConfig: IStepperButtonConfigWithVariant = {
    label: '',
    iconName: 'lux-interface-validation-check',
    color: 'primary'
  };
  disabled = false;
  showNavigationButtons = true;
  linear = true;
  useCustomIcons = false;
  currentStepNumber = 0;
  editedIconName = 'lux-interface-edit-pencil';
  horizontalAnimation = false;
  verticalStepper = false;
  a11yMode = false;
  buttonAlignLeft = false;
  noHeaderLabels = false;
  validationAttempted = false;
  readonly validationMessage = 'Bitte füllen Sie alle Pflichtfelder aus.';

  get showValidationMessage(): boolean {
    let currentForm = this.currentStepNumber === 0 || this.currentStepNumber === 1 ? this.steps[this.currentStepNumber].stepControl : null;

    if (this.newStepsVisible) {
      currentForm = this.currentStepNumber === 2 ? this.newStepsForm1 : this.currentStepNumber === 3 ? this.newStepsForm2 : currentForm;
    }

    return !!this.a11yMode && this.validationAttempted && (currentForm?.invalid ?? false);
  }

  get computedPreviousButtonConfig(): ILuxStepperButtonConfig {
    return {
      ...this.previousButtonConfig,
      flat: this.previousButtonConfig.variant === 'flat',
      stroked: this.previousButtonConfig.variant === 'stroked'
    };
  }

  get computedNextButtonConfig(): ILuxStepperButtonConfig {
    return {
      ...this.nextButtonConfig,
      flat: this.nextButtonConfig.variant === 'flat',
      stroked: this.nextButtonConfig.variant === 'stroked'
    };
  }

  get computedFinishButtonConfig(): ILuxStepperButtonConfig {
    return {
      ...this.finishButtonConfig,
      flat: this.finishButtonConfig.variant === 'flat',
      stroked: this.finishButtonConfig.variant === 'stroked'
    };
  }

  openStepperDialog(): void {
    const dialogRef = this.dialogService.openComponent(StepperDialogExampleComponent, {
      minWidth: '90vw',
      maxWidth: '90vw',
      minHeight: '60vh',
      maxHeight: '95vh',
      disableClose: false,
      disableBackdropAndEscClose: true
    });
    dialogRef.dialogClosed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((result) => {
      this.log(this.showOutputEvents, 'Stepper-Dialog geschlossen', result);
    });
  }

  constructor() {
    this.newStepsForm1 = new FormGroup<StepperForm1DummyForm>({
      street: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
      number: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
      city: new FormControl<string>('', { validators: Validators.required, nonNullable: true })
    });

    this.newStepsForm2 = new FormGroup<StepperForm2DummyForm>({
      iban: new FormControl<string>('', { validators: Validators.required, nonNullable: true }),
      bic: new FormControl<string | null>(null)
    });
  }

  ngOnDestroy() {
    // sicherheitshalber beim Verlassen der Component unsere neuen Footer-Buttons entfernen.
    this.clearButtonInfos();
  }

  /**
   * Loggt das luxFinishButtonClicked-Event und gibt eine Snackbar-Mitteilung aus.
   * Anschließend wird der aktuelle Step wieder auf 0 gesetzt und die Forms resettet.
   */
  finishClicked() {
    this.log(this.showOutputEvents, 'luxFinishButtonClicked');

    const snackbarDuration = 5000;
    if (this.steps[0].stepControl.valid && this.steps[1].stepControl.valid) {
      this.snackbar.open(snackbarDuration, {
        iconName: 'lux-info',
        iconSize: '2x',
        iconColor: 'green',
        text: 'Stepper erfolgreich abgeschlossen!'
      });
    } else {
      this.snackbar.open(snackbarDuration, {
        iconName: 'lux-interface-alert-warning-triangle',
        iconSize: '2x',
        iconColor: 'red',
        text: 'Daten wurden NICHT übermittelt! Formular wird zurück gesetzt.'
      });
    }

    setTimeout(() => {
      const currentUrl = this.router.url;
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate([currentUrl]);
    }, snackbarDuration);
  }

  /**
   * Loggt das luxCurrentStepNumberChange-Event.
   * @param event
   */
  stepNumberChanged(event: number) {
    this.log(this.showOutputEvents, 'luxCurrentStepNumberChange', event);
  }

  /**
   * Loggt das luxStepChanged-Event und aktualisiert die CurrentStepNumber sowie die Footer-Button-Zustände.
   * @param event
   */
  stepChanged(event: StepperSelectionEvent) {
    this.log(this.showOutputEvents, 'luxStepChanged', event);
    if (this.currentStepNumber !== event.selectedIndex) {
      this.currentStepNumber = event.selectedIndex;
    }
    this.validationAttempted = false;
    this.updateFooterButtonStates();
  }

  stepClicked(index: number) {
    this.log(this.showOutputEvents, `luxStepClicked`, index);
  }

  checkValidation(index: number) {
    this.log(this.showOutputEvents, `luxCheckValidation`, index);
    // index enthält den aktuellen Step-Index (den blockierten Step, der validiert werden muss).
    let currentForm = this.currentStepNumber === 0 || this.currentStepNumber === 1 ? this.steps[this.currentStepNumber].stepControl : null;
    if (this.newStepsVisible) {
      currentForm = this.currentStepNumber === 2 ? this.newStepsForm1 : this.currentStepNumber === 3 ? this.newStepsForm2 : currentForm;
    }
    if (currentForm === null || !currentForm.valid) {
      this.validationAttempted = true;
    }
  }

  /**
   * Aktualisiert den "disabled"-Zustand der aktuellen Footer-Buttons passend zum aktuellen Step.
   */
  updateFooterButtonStates() {
    if (this.showNavigationButtons) {
      return;
    }
    if (this.currentStepNumber === 0) {
      this.buttonService.getButtonInfoByCMD('previous')!.disabled = true;
      this.buttonService.getButtonInfoByCMD('next')!.disabled = false;
      this.buttonService.getButtonInfoByCMD('finish')!.disabled = true;
    } else if (this.currentStepNumber === this.steps.length) {
      this.buttonService.getButtonInfoByCMD('previous')!.disabled = false;
      this.buttonService.getButtonInfoByCMD('next')!.disabled = true;
      this.buttonService.getButtonInfoByCMD('finish')!.disabled = false;
    } else {
      this.buttonService.getButtonInfoByCMD('previous')!.disabled = false;
      this.buttonService.getButtonInfoByCMD('next')!.disabled = false;
      this.buttonService.getButtonInfoByCMD('finish')!.disabled = true;
    }
  }

  /**
   * Aktualisiert die Footer-Buttons passend zum aktuellen Step (wenn Footer-Buttons überhaupt dargestellt werden sollen).
   * @param showNavigationButtons
   */
  updateNavigationButtons(showNavigationButtons: boolean) {
    this.clearButtonInfos();
    if (!showNavigationButtons) {
      this.buttonService.pushButtonInfos(
        LuxAppFooterButtonInfo.generateInfo({
          cmd: 'previous',
          label: 'Vorheriger Step',
          raised: true,
          alwaysVisible: false,
          onClick: () => this.stepperService.previousStep()
        }),
        LuxAppFooterButtonInfo.generateInfo({
          cmd: 'next',
          color: 'primary',
          label: 'Nächster Step',
          raised: true,
          alwaysVisible: false,
          onClick: () => this.stepperService.nextStep()
        }),
        LuxAppFooterButtonInfo.generateInfo({
          cmd: 'finish',
          color: 'accent',
          label: 'Abschließen',
          alwaysVisible: false,
          raised: true,
          onClick: () => this.stepperComponent.luxFinishButtonClicked.emit()
        })
      );

      this.updateFooterButtonStates();
    }
  }

  /**
   * Entfernt unsere Stepper-Buttons aus dem Footer.
   */
  clearButtonInfos() {
    this.buttonService.removeButtonInfoByCmd('next');
    this.buttonService.removeButtonInfoByCmd('previous');
    this.buttonService.removeButtonInfoByCmd('finish');
  }

  /**
   * Helper Funktion, die nur beim Wechsel von horizontal zu vertikal und vice versa greift.
   * Rendert die eigenen Icons einfach neu (werden sonst evtl. nicht korrekt nach dem Wechsel dargestellt).
   */
  redrawIcons() {
    const temp = this.useCustomIcons;
    this.useCustomIcons = !this.useCustomIcons;
    setTimeout(() => {
      this.useCustomIcons = temp;
    });
  }

  onNewStepsChanged(visible: boolean) {
    if (visible) {
      this.currentStepNumber = 0;
    } else {
      this.newStepsForm1.reset();
      this.newStepsForm2.reset();
    }
    this.newStepsVisible = visible;
  }
}
