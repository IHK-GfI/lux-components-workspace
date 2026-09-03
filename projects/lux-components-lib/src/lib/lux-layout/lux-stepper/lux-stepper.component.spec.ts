// noinspection DuplicatedCode

import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';

import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { ILuxStepperButtonConfig } from './lux-stepper-model/lux-stepper-button-config.interface';
import { LuxStepContentComponent } from './lux-stepper-subcomponents/lux-step-content.component';
import { LuxStepHeaderComponent } from './lux-stepper-subcomponents/lux-step-header.component';
import { LuxStepComponent } from './lux-stepper-subcomponents/lux-step.component';
import { LuxStepperComponent } from './lux-stepper.component';

describe('LuxStepperComponent', () => {
  let component: MockStepperComponent;
  let fixture: ComponentFixture<MockStepperComponent>;
  let stepperComponent: LuxStepperComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        provideNoopAnimations(),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MockStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    stepperComponent = fixture.debugElement.query(By.directive(LuxStepperComponent)).componentInstance;
  });

  it('Sollte erstellt werden', () => {
    expect(component).toBeTruthy();
  });

  it('Sollte die Steps korrekt darstellen', fakeAsync(() => {
    const stepHeaders = fixture.debugElement.queryAll(By.css('.step-header'));
    const stepContents = fixture.debugElement.queryAll(By.css('.step-content'));

    expect(stepHeaders.length).toBe(2);
    expect(stepContents.length).toBe(2);

    expect(stepHeaders[0].nativeElement.textContent).toEqual('Step 0');
    expect(stepHeaders[1].nativeElement.textContent).toEqual('Step 1');

    expect(stepContents[0].nativeElement.textContent).toEqual('Step 0');
    expect(stepContents[1].nativeElement.textContent).toEqual('Step 1');
  }));

  it('Sollte Header und Content aus ausgelagerten #header/#content-Templates darstellen', fakeAsync(() => {
    const externalFixture = TestBed.createComponent(MockExternalTemplateStepperComponent);

    externalFixture.detectChanges();

    const stepHeaders = externalFixture.debugElement.queryAll(By.css('.step-header'));
    const stepContents = externalFixture.debugElement.queryAll(By.css('.step-content'));

    expect(stepHeaders.length).toBe(1);
    expect(stepContents.length).toBe(1);
    expect(stepHeaders[0].nativeElement.textContent.trim()).toEqual('Person');
    expect(stepContents[0].nativeElement.textContent.trim()).toEqual('Externer Inhalt');
  }));

  it('Sollte den Stepper deaktivieren', fakeAsync(() => {
    // Vorbedingungen testen
    let stepperOverlay = fixture.debugElement.query(By.css('.lux-stepper-disabled-overlay.lux-hidden'));
    expect(stepperOverlay).not.toBeNull();

    // Änderungen durchführen
    component.disabled.set(true);
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    stepperOverlay = fixture.debugElement.query(By.css('.lux-stepper-disabled-overlay.lux-hidden'));
    expect(stepperOverlay).toBeNull();
  }));

  it('Sollte den Step-Wechsel ohne Validierung erlauben (linear = false)', fakeAsync(() => {
    // Vorbedingungen testen
    let stepSelected = fixture.debugElement.query(By.css('mat-step-header[aria-selected="true"] .step-header'));
    expect(stepSelected.nativeElement.textContent).toEqual('Step 0');

    // Änderungen durchführen
    const stepHeaders = fixture.debugElement.queryAll(By.css('mat-step-header'));
    stepHeaders[1].nativeElement.click();
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    stepSelected = fixture.debugElement.query(By.css('mat-step-header[aria-selected="true"] .step-header'));
    expect(stepSelected.nativeElement.textContent).toEqual('Step 1');

    flush();
  }));

  it('Sollte den Step-Wechsel ohne Validierung nicht erlauben (linear = true)', fakeAsync(() => {
    // Vorbedingungen testen
    let stepSelected = fixture.debugElement.query(By.css('mat-step-header[aria-selected="true"] .step-header'));
    expect(stepSelected.nativeElement.textContent).toEqual('Step 0');

    // Änderungen durchführen
    component.linear.set(true);
    LuxTestHelper.wait(fixture);

    const stepHeaders = fixture.debugElement.queryAll(By.css('mat-step-header'));
    stepHeaders[1].nativeElement.click();
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    stepSelected = fixture.debugElement.query(By.css('mat-step-header[aria-selected="true"] .step-header'));
    expect(stepSelected.nativeElement.textContent).toEqual('Step 0');
  }));

  it('Sollte die Validierung über luxCompleted ermöglichen', fakeAsync(() => {
    // Vorbedingungen testen
    let stepSelected = fixture.debugElement.query(By.css('mat-step-header[aria-selected="true"] .step-header'));
    expect(stepSelected.nativeElement.textContent).toEqual('Step 0');

    // Änderungen durchführen
    component.linear.set(true);
    component.step0Form.set(undefined);
    component.step0Completed.set(false);
    LuxTestHelper.wait(fixture);

    const stepHeaders = fixture.debugElement.queryAll(By.css('mat-step-header'));
    stepHeaders[1].nativeElement.click();
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    stepSelected = fixture.debugElement.query(By.css('mat-step-header[aria-selected="true"] .step-header'));
    expect(stepSelected.nativeElement.textContent).toEqual('Step 0');

    // Änderungen durchführen
    component.step0Completed.set(true);
    LuxTestHelper.wait(fixture);

    stepHeaders[1].nativeElement.click();
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    stepSelected = fixture.debugElement.query(By.css('mat-step-header[aria-selected="true"] .step-header'));
    expect(stepSelected.nativeElement.textContent).toEqual('Step 1');

    flush();
  }));

  it('Sollte optionale Steps überspringen', fakeAsync(() => {
    // Vorbedingungen testen
    let stepSelected = fixture.debugElement.query(By.css('mat-step-header[aria-selected="true"] .step-header'));
    expect(stepSelected.nativeElement.textContent).toEqual('Step 0');

    // Änderungen durchführen
    component.linear.set(true);
    component.step0Form.set(undefined);
    component.step0Optional.set(true);
    LuxTestHelper.wait(fixture);

    const stepHeaders = fixture.debugElement.queryAll(By.css('mat-step-header'));
    stepHeaders[1].nativeElement.click();
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    stepSelected = fixture.debugElement.query(By.css('mat-step-header[aria-selected="true"] .step-header'));
    expect(stepSelected.nativeElement.textContent).toEqual('Step 1');

    flush();
  }));

  it('Sollte nicht editierbare Steps nicht wieder aktivieren können', fakeAsync(() => {
    // Vorbedingungen testen
    let stepSelected = fixture.debugElement.query(By.css('mat-step-header[aria-selected="true"] .step-header'));
    expect(stepSelected.nativeElement.textContent).toEqual('Step 0');

    // Änderungen durchführen
    component.linear.set(true);
    component.step0Form.set(undefined);
    component.step0Editable.set(false);
    component.step0Completed.set(true);
    LuxTestHelper.wait(fixture);

    const stepHeaders = fixture.debugElement.queryAll(By.css('mat-step-header'));
    stepHeaders[1].nativeElement.click();
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    stepSelected = fixture.debugElement.query(By.css('mat-step-header[aria-selected="true"] .step-header'));
    expect(stepSelected.nativeElement.textContent).toEqual('Step 1');

    // Änderungen durchführen
    stepHeaders[0].nativeElement.click();
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    stepSelected = fixture.debugElement.query(By.css('mat-step-header[aria-selected="true"] .step-header'));
    expect(stepSelected.nativeElement.textContent).toEqual('Step 1');

    flush();
  }));

  it('Sollte die Standard-Icons ausblenden', fakeAsync(() => {
    // Vorbedingungen testen
    let matStepIcons = fixture.debugElement.queryAll(By.css('.lux-ignore-mat-step-icons .mat-step-icon'));
    expect(matStepIcons.length).toBe(0);

    // Änderungen durchführen
    component.customIcons.set(true);
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    matStepIcons = fixture.debugElement.queryAll(By.css('.lux-ignore-mat-step-icons .mat-step-icon'));
    expect(matStepIcons.length).toBe(2);
  }));

  it('Sollte die Navigation-Buttons konfigurieren können', fakeAsync(() => {
    // Vorbedingungen testen
    const navButtons = fixture.debugElement.queryAll(By.css('lux-stepper-nav-buttons .lux-button-label'));
    expect(navButtons.length).toBe(3);
    expect(navButtons[0].nativeElement.textContent.trim()).toEqual('Test vorwärts');
    expect(navButtons[1].nativeElement.textContent.trim()).toEqual('Test zurück');
    expect(navButtons[2].nativeElement.textContent.trim()).toEqual('Test fertig');

    // Änderungen durchführen
    component.prevConfig.update((cfg) => ({ ...cfg, label: 'Test prev' }));
    component.nextConf.update((cfg) => ({ ...cfg, label: 'Test next' }));
    component.finConf.update((cfg) => ({ ...cfg, label: 'Test fin' }));
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    expect(navButtons[0].nativeElement.textContent.trim()).toEqual('Test next');
    expect(navButtons[1].nativeElement.textContent.trim()).toEqual('Test prev');
    expect(navButtons[2].nativeElement.textContent.trim()).toEqual('Test fin');
  }));

  it('Sollte die Navigation-Buttons ausblenden können', fakeAsync(() => {
    // Vorbedingungen testen
    let navButtons = fixture.debugElement.queryAll(By.css('lux-stepper-nav-buttons .lux-button-label'));
    expect(navButtons.length).toBe(3);

    // Änderungen durchführen
    component.showNavButtons.set(false);
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    navButtons = fixture.debugElement.queryAll(By.css('lux-stepper-nav-buttons .lux-button-label'));
    expect(navButtons.length).toBe(0);
  }));

  it('Sollte den Next-Button im linearen Modus ohne A11Y deaktivieren', fakeAsync(() => {
    component.linear.set(true);
    component.a11yMode.set(false);
    LuxTestHelper.wait(fixture);

    const nextButton = fixture.debugElement.queryAll(By.css('lux-stepper-nav-buttons button'))[0].nativeElement as HTMLButtonElement;
    expect(nextButton.disabled).toBeTrue();
  }));

  it('Sollte den Next-Button im A11Y-Modus aktiviert lassen', fakeAsync(() => {
    component.linear.set(true);
    component.a11yMode.set(true);
    LuxTestHelper.wait(fixture);

    const nextButton = fixture.debugElement.queryAll(By.css('lux-stepper-nav-buttons button'))[0].nativeElement as HTMLButtonElement;
    expect(nextButton.disabled).toBeFalse();
  }));

  it('Sollte die Navigations-Buttons linksbündig darstellen', fakeAsync(() => {
    component.buttonAlignLeft.set(true);
    LuxTestHelper.wait(fixture);

    const navButtonContainer = fixture.debugElement.query(By.css('lux-stepper-nav-buttons > div'));
    expect(navButtonContainer.nativeElement.classList.contains('lux-place-content-start')).toBeTrue();
  }));

  it('Sollte einen vertikalen Stepper erstellen', fakeAsync(() => {
    // Vorbedingungen testen
    let stepperHorizontal = fixture.debugElement.query(By.css('mat-horizontal-stepper'));
    let stepperVertical = fixture.debugElement.query(By.css('mat-vertical-stepper'));
    expect(stepperHorizontal).not.toBeNull();
    expect(stepperVertical).toBeNull();

    // Änderungen durchführen
    component.vertical.set(true);
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    stepperHorizontal = fixture.debugElement.query(By.css('mat-horizontal-stepper'));
    stepperVertical = fixture.debugElement.query(By.css('mat-vertical-stepper'));
    expect(stepperHorizontal).toBeNull();
    expect(stepperVertical).not.toBeNull();
  }));

  it('Sollte zu einem bestimmten Step springen', fakeAsync(() => {
    // Vorbedingungen testen
    let stepSelected = fixture.debugElement.query(By.css('mat-step-header[aria-selected="true"] .step-header'));
    expect(stepSelected.nativeElement.textContent).toEqual('Step 0');

    // Änderungen durchführen
    component.currentStep.set(1);
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    stepSelected = fixture.debugElement.query(By.css('mat-step-header[aria-selected="true"] .step-header'));
    expect(stepSelected.nativeElement.textContent).toEqual('Step 1');

    flush();
  }));

  it('Sollte luxStepChanged emitten', fakeAsync(() => {
    // Vorbedingungen testen
    const spy = spyOn(component, 'stepChange');
    expect(spy).toHaveBeenCalledTimes(0);

    // Änderungen durchführen
    const stepHeaders = fixture.debugElement.queryAll(By.css('mat-step-header'));
    stepHeaders[1].nativeElement.click();
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    expect(spy).toHaveBeenCalledTimes(1);

    flush();
  }));

  it('Sollte luxCheckValidation emitten, wenn Header-Navigation blockiert wird', fakeAsync(() => {
    component.linear.set(true);
    LuxTestHelper.wait(fixture);

    const spy = spyOn(component, 'checkValidation');
    expect(spy).toHaveBeenCalledTimes(0);

    const stepHeaders = fixture.debugElement.queryAll(By.css('mat-step-header'));
    stepHeaders[1].nativeElement.click();
    LuxTestHelper.wait(fixture);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(0); // aktueller Step (0), nicht Ziel-Step
  }));

  it('Sollte luxCheckValidation emitten, wenn Next-Button-Navigation blockiert wird (A11Y-Modus)', fakeAsync(() => {
    // Vorbedingungen: linear=true, step0 nicht abgeschlossen, A11Y-Modus damit Button klickbar bleibt
    component.linear.set(true);
    component.a11yMode.set(true);
    LuxTestHelper.wait(fixture);

    const spy = spyOn(component, 'checkValidation');
    expect(spy).toHaveBeenCalledTimes(0);

    // Next-Button von Step 0 klicken (erster Button in lux-stepper-nav-buttons)
    const nextButton = fixture.debugElement.queryAll(By.css('lux-stepper-nav-buttons button'))[0].nativeElement as HTMLButtonElement;
    nextButton.click();
    LuxTestHelper.wait(fixture, LuxComponentsConfigService.DEFAULT_CONFIG.buttonConfiguration.throttleTimeMs);

    // Nachbedingungen prüfen: aktueller Step-Index (0) muss emittiert werden, nicht der Ziel-Step
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(0);

    flush();
    discardPeriodicTasks();
  }));

  it('Sollte luxFinishButtonClicked emitten', fakeAsync(() => {
    // Vorbedingungen testen
    const spy = spyOn(component, 'finClicked');
    expect(spy).toHaveBeenCalledTimes(0);

    // Änderungen durchführen
    const stepHeaders = fixture.debugElement.queryAll(By.css('mat-step-header'));
    stepHeaders[1].nativeElement.click();
    LuxTestHelper.wait(fixture, LuxComponentsConfigService.DEFAULT_CONFIG.buttonConfiguration.throttleTimeMs);

    const navButtons = fixture.debugElement.queryAll(By.css('lux-stepper-nav-buttons .lux-button-label'));
    navButtons[2].nativeElement.click();
    LuxTestHelper.wait(fixture);

    // Nachbedingungen prüfen
    expect(spy).toHaveBeenCalledTimes(1);

    flush();
    discardPeriodicTasks();
  }));
});

@Component({
  template: `
    <lux-stepper
      [luxDisabled]="disabled()"
      [(luxCurrentStepNumber)]="currentStep"
      [luxUseCustomIcons]="customIcons()"
      [luxVerticalStepper]="vertical()"
      [luxLinear]="linear()"
      [luxA11YMode]="a11yMode()"
      [luxButtonAlignLeft]="buttonAlignLeft()"
      [luxHorizontalStepAnimationActive]="horAnimation()"
      [luxShowNavigationButtons]="showNavButtons()"
      [luxEditedIconName]="editedIconName()"
      [luxPreviousButtonConfig]="prevConfig()"
      [luxNextButtonConfig]="nextConf()"
      [luxFinishButtonConfig]="finConf()"
      (luxStepChanged)="stepChange($event)"
      (luxCheckValidation)="checkValidation($event)"
      (luxFinishButtonClicked)="finClicked()"
    >
      <lux-step
        [luxCompleted]="step0Completed()"
        [luxOptional]="step0Optional()"
        [luxStepControl]="step0Form()"
        [luxEditable]="step0Editable()"
        [luxIconName]="step0Icon()"
      >
        <lux-step-header>
          <span class="step-header step-0-header">Step 0</span>
        </lux-step-header>
        <lux-step-content>
          <span class="step-content step-0-content">Step 0</span>
          <div [formGroup]="form.get('step0')">
            <input formControlName="input" />
          </div>
        </lux-step-content>
      </lux-step>
      <lux-step
        [luxCompleted]="step1Completed()"
        [luxOptional]="step1Optional()"
        [luxStepControl]="step1Form()"
        [luxEditable]="step1Editable()"
        [luxIconName]="step1Icon()"
      >
        <lux-step-header>
          <span class="step-header step-1-header">Step 1</span>
        </lux-step-header>
        <lux-step-content>
          <span class="step-content step-1-content">Step 1</span>
          <div [formGroup]="form.get('step1')">
            <input formControlName="input" />
          </div>
        </lux-step-content>
      </lux-step>
    </lux-stepper>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxStepperComponent, LuxStepComponent, LuxStepHeaderComponent, LuxStepContentComponent]
})
class MockStepperComponent {
  disabled = signal(false);
  currentStep = signal(0);
  customIcons = signal(false);
  vertical = signal(false);
  linear = signal(false);
  a11yMode = signal(false);
  buttonAlignLeft = signal(false);
  horAnimation = signal(true);
  showNavButtons = signal(true);
  editedIconName = signal<string | undefined>(undefined);

  prevConfig = signal<ILuxStepperButtonConfig>({
    label: 'Test zurück'
  });

  nextConf = signal<ILuxStepperButtonConfig>({
    label: 'Test vorwärts'
  });

  finConf = signal<ILuxStepperButtonConfig>({
    label: 'Test fertig'
  });

  step0Optional = signal(false);
  step0Editable = signal(true);
  step0Completed = signal(false);
  step0Form = signal<FormGroup | undefined>(undefined);
  step0Icon = signal('lux-interface-user-single');

  step1Optional = signal(false);
  step1Editable = signal(true);
  step1Completed = signal(false);
  step1Form = signal<FormGroup | undefined>(undefined);
  step1Icon = signal('lux-file-signature');

  form;

  stepChange(selectionEvent: StepperSelectionEvent) {}

  checkValidation(index: number) {}

  finClicked() {}

  constructor() {
    this.form = new FormGroup<any>({
      step0: new FormGroup<any>({
        input: new FormControl<string>('', { validators: Validators.required, nonNullable: true })
      }),
      step1: new FormGroup<any>({
        input: new FormControl<string>('', { validators: Validators.required, nonNullable: true })
      })
    });
  }
}

@Component({
  selector: 'lux-external-step',
  template: `
    <ng-template #header>
      <span class="step-header">Person</span>
    </ng-template>

    <ng-template #content>
      <span class="step-content">Externer Inhalt</span>
    </ng-template>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: LuxStepComponent, useExisting: MockExternalStepComponent }]
})
class MockExternalStepComponent extends LuxStepComponent {}

@Component({
  template: `
    <lux-stepper>
      <lux-external-step />
    </lux-stepper>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxStepperComponent, MockExternalStepComponent]
})
class MockExternalTemplateStepperComponent {}
