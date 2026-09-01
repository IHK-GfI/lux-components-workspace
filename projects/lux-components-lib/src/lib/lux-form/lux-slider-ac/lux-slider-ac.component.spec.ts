// noinspection DuplicatedCode

import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxA11yTestHelper, LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxDisplayWithAcFnType, LuxSliderAcComponent } from './lux-slider-ac.component';

describe('LuxSliderAcComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        LuxConsoleService,
        provideNoopAnimations(),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  }));

  describe('In ReactiveForm', () => {
    let component: MockSliderFormComponent;
    let fixture: ComponentFixture<MockSliderFormComponent>;
    let sliderComponent: LuxSliderAcComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(MockSliderFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      sliderComponent = fixture.debugElement.query(By.directive(LuxSliderAcComponent)).componentInstance;
    });
    // Vorbedingungen testen
    // Änderungen durchführen
    // Nachbedingungen prüfen

    it('Sollte den Wert setzen', fakeAsync(() => {
      // Vorbedingungen testen
      expect(component.form.value.slider).toEqual(0);

      // Änderungen durchführen
      component.form.get('slider')!.setValue(25);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(component.form.value.slider).toEqual(25);
      expect(sliderComponent.formControl.value).toEqual(25);
    }));

    it('Sollte den Wert und Prozent-Wert richtig emitten (bei geändertem Max/Min Wert)', fakeAsync(() => {
      // Vorbedingungen testen
      const valueSpy = spyOn(component, 'valueChanged');
      const percentSpy = spyOn(component, 'percentChanged');

      LuxTestHelper.wait(fixture);

      expect(valueSpy).toHaveBeenCalledTimes(0);
      expect(percentSpy).toHaveBeenCalledTimes(0);

      // Änderungen durchführen
      component.max.set(50);
      component.min.set(25);
      LuxTestHelper.wait(fixture);
      component.form.get('slider')!.setValue(30);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(valueSpy).toHaveBeenCalledTimes(1);
      expect(percentSpy).toHaveBeenCalledTimes(1);
      expect(valueSpy).toHaveBeenCalledWith(30);
      expect(percentSpy).toHaveBeenCalledWith(20);
    }));

    it('Sollte den Min- und Max-Wert nicht überschreiten', fakeAsync(() => {
      // Vorbedingungen testen
      expect(component.form.get('slider')!.value).toEqual(0);
      expect(sliderComponent.value()).toEqual(0);

      // Änderungen durchführen
      component.max.set(50);
      component.min.set(25);
      LuxTestHelper.wait(fixture);
      component.form.get('slider')!.setValue(20);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(component.form.get('slider')!.value).toEqual(25);
      expect(sliderComponent.value()).toEqual(25);

      // Änderungen durchführen
      component.form.get('slider')!.setValue(55);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(component.form.get('slider')!.value).toEqual(50);
      expect(sliderComponent.value()).toEqual(50);
    }));

    it('Sollte deaktiviert werden (über die Property)', fakeAsync(() => {
      // Vorbedingungen testen
      let disabledSlider = fixture.debugElement.query(By.css('.mat-slider-disabled'));
      expect(disabledSlider).toBeNull();
      expect(sliderComponent.luxDisabled()).toBe(false);

      // Änderungen durchführen
      component.disabled.set(true);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      disabledSlider = fixture.debugElement.query(By.css('.mat-slider-disabled'));
      expect(disabledSlider).toBeDefined();
      expect(sliderComponent.luxDisabled()).toBe(true);
    }));

    it('Sollte deaktiviert werden (über die FormControl)', fakeAsync(() => {
      // Vorbedingungen testen
      expect(sliderComponent.formControl.disabled).toBe(false);

      // Änderungen durchführen
      component.form.get('slider')!.disable();
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(sliderComponent.formControl.disabled).toBe(true);
    }));
  });

  describe('Ohne ReactiveForm', () => {
    let component: MockSliderNoFormComponent;
    let fixture: ComponentFixture<MockSliderNoFormComponent>;
    let sliderComponent: LuxSliderAcComponent;

    beforeEach(() => {
      fixture = TestBed.createComponent(MockSliderNoFormComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      sliderComponent = fixture.debugElement.query(By.directive(LuxSliderAcComponent)).componentInstance;
    });

    it('Sollte den Wert setzen', fakeAsync(() => {
      // Vorbedingungen testen
      expect(component.value()).toEqual(0);
      expect(sliderComponent.value()).toEqual(0);

      // Änderungen durchführen
      component.value.set(50);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(component.value()).toEqual(50);
      expect(sliderComponent.value()).toEqual(50);
    }));

    it('Sollte den Wert und Prozent-Wert richtig emitten (bei geändertem Max/Min Wert)', fakeAsync(() => {
      // Vorbedingungen testen
      const valueSpy = spyOn(component, 'valueChanged');
      const percentSpy = spyOn(component, 'percentChanged');

      LuxTestHelper.wait(fixture);

      expect(valueSpy).toHaveBeenCalledTimes(0);
      expect(percentSpy).toHaveBeenCalledTimes(0);

      // Änderungen durchführen
      component.max.set(50);
      component.min.set(25);
      LuxTestHelper.wait(fixture);
      component.value.set(30);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(valueSpy).toHaveBeenCalledTimes(1);
      expect(percentSpy).toHaveBeenCalledTimes(1);
      expect(valueSpy).toHaveBeenCalledWith(30);
      expect(percentSpy).toHaveBeenCalledWith(20);
    }));

    it('Sollte deaktiviert werden', fakeAsync(() => {
      // Vorbedingungen testen
      let disabledSlider = fixture.debugElement.query(By.css('.mat-slider-disabled'));
      expect(disabledSlider).toBeNull();
      expect(sliderComponent.luxDisabled()).toBe(false);

      // Änderungen durchführen
      component.disabled.set(true);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      disabledSlider = fixture.debugElement.query(By.css('.mat-slider-disabled'));
      expect(disabledSlider).toBeDefined();
      expect(sliderComponent.luxDisabled()).toBe(true);
    }));

    it('Sollte den Min- und Max-Wert nicht überschreiten', fakeAsync(() => {
      // Vorbedingungen testen
      expect(component.value()).toEqual(0);
      expect(sliderComponent.value()).toEqual(0);

      // Änderungen durchführen
      component.max.set(50);
      component.min.set(25);
      LuxTestHelper.wait(fixture);
      component.value.set(20);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(component.value()).toEqual(25);
      expect(sliderComponent.value()).toEqual(25);

      // Änderungen durchführen
      component.value.set(55);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(component.value()).toEqual(50);
      expect(sliderComponent.value()).toEqual(50);
    }));

    it('Sollte den Thumb-Label anzeigen und verstecken', fakeAsync(() => {
      // Vorbedingungen testen
      let thumbLabel = fixture.debugElement.query(By.css('.mat-slider-thumb-label-showing .mat-slider-thumb-label'));
      expect(thumbLabel).toBeDefined();

      // Änderungen durchführen
      component.showThumbLabel.set(false);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      thumbLabel = fixture.debugElement.query(By.css('.mat-slider-thumb-label-showing .mat-slider-thumb-label'));
      expect(thumbLabel).toBeNull();
    }));

    it('Sollte die displayWith-Funktion korrekt ausführen', fakeAsync(() => {
      // Vorbedingungen testen
      let thumbLabelText = fixture.debugElement.query(By.css('.mdc-slider__value-indicator-text'));
      expect(thumbLabelText.nativeElement.textContent).toEqual('0');

      // Änderungen durchführen
      component.max.set(10000);
      component.showThumbLabel.set(true);
      component.displayWith.set((value: number) => {
        const result = value ? '' + value : '0';
        if (value && value >= 1000) {
          return Math.round(value / 1000) + 'k';
        }
        return result;
      });
      LuxTestHelper.wait(fixture);
      component.value.set(1000);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      thumbLabelText = fixture.debugElement.query(By.css('.mdc-slider__value-indicator-text'));
      expect(thumbLabelText.nativeElement.textContent).toEqual('1k');

      component.value.set(5600);
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      thumbLabelText = fixture.debugElement.query(By.css('.mdc-slider__value-indicator-text'));
      expect(thumbLabelText.nativeElement.textContent).toEqual('6k');
    }));
  });

  describe('A11y', () => {
    let fixture: ComponentFixture<LuxSliderA11yComponent>;
    let testComponent: LuxSliderA11yComponent;

    beforeAll(() => {
      LuxA11yTestHelper.addA11yMatchers();
    });

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(LuxSliderA11yComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
    }));

    it('sollte keine Barrierefreiheitsverletzungen haben (leer)', async () => {
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (disabled)', async () => {
      testComponent.disabled.set(true);
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (readonly)', async () => {
      testComponent.readonly.set(true);
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (required)', async () => {
      testComponent.required.set(true);
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });
  });
});

@Component({
  template: `<lux-slider-ac
    luxLabel="Lorem ipsum"
    [luxColor]="color()"
    [luxDisabled]="disabled()"
    [luxShowThumbLabel]="showThumbLabel()"
    [(luxValue)]="value"
    [luxMax]="max()"
    [luxMin]="min()"
    [luxDisplayWith]="displayWith()"
    (luxValuePercent)="percentChanged($event)"
    (luxValueChange)="valueChanged($event)"
    luxTagId="slidernoform"
  >
  </lux-slider-ac>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxSliderAcComponent]
})
class MockSliderNoFormComponent {
  color = signal('primary');
  disabled = signal(false);
  showThumbLabel = signal(true);
  value = signal(0);
  max = signal(100);
  min = signal(0);
  displayWith = signal<LuxDisplayWithAcFnType | undefined>(undefined);

  percentChanged(value: number) {}

  valueChanged(value: number) {}
}

@Component({
  template: `<div [formGroup]="form">
    <lux-slider-ac
      [luxDisabled]="disabled()"
      [luxMax]="max()"
      [luxMin]="min()"
      luxControlBinding="slider"
      (luxValuePercent)="percentChanged($event)"
      (luxValueChange)="valueChanged($event)"
      luxTagId="slidernoform"
    >
    </lux-slider-ac>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxSliderAcComponent]
})
class MockSliderFormComponent {
  disabled = signal(false);
  max = signal(100);
  min = signal(0);

  form;

  percentChanged(value: number) {}

  valueChanged(value: number) {}

  constructor() {
    this.form = new FormGroup({
      slider: new FormControl<number>(0)
    });
  }
}

@Component({
  template: `
    <lux-slider-ac luxLabel="Slider" [luxDisabled]="disabled()" [luxReadonly]="readonly()" [luxRequired]="required()"></lux-slider-ac>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxSliderAcComponent]
})
class LuxSliderA11yComponent {
  disabled = signal(false);
  readonly = signal(false);
  required = signal(false);
}
