import { Directionality } from '@angular/cdk/bidi';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { JsonPipe } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxA11yTestHelper, LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { Subject } from 'rxjs';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';
import { LuxPickValueFnType } from '../lux-form-model/lux-form-selectable-base.class';
import { LuxSelectComponent } from './lux-select.component';

describe('LuxSelectComponent', () => {
  let dir: any;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: Directionality, useFactory: () => (dir = { value: 'ltr' }) },
        {
          provide: ScrollDispatcher,
          useFactory: () => ({
            scrolled: () => scrolledSubject.asObservable()
          })
        },
        LuxMediaQueryObserverService,
        LuxConsoleService,
        provideNoopAnimations(),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  });

  const scrolledSubject = new Subject();

  describe('innerhalb eines Formulars', () => {
    let fixture: ComponentFixture<SelectInsideFormComponent>;
    let testComponent: SelectInsideFormComponent;
    let trigger: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(SelectInsideFormComponent);
      testComponent = fixture.componentInstance;
    });

    it('Wert über das FormControl setzen', async () => {
      fixture.detectChanges();
      trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;

      expect(testComponent.formGroup.get('hobbies')!.value).toBeNull();

      testComponent.formGroup.get('hobbies')!.setValue([testComponent.allHobbies()[0]]);
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      expect(options[0].classList).toContain('mdc-list-item--selected');
    });

    it('Wert über das Popup setzen', async () => {
      fixture.detectChanges();
      trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;

      expect(testComponent.formGroup.get('hobbies')!.value).toBeNull();

      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      (document.querySelectorAll('.mat-mdc-select-panel mat-option')[1] as HTMLElement).click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      expect([{ label: 'Fußball', value: 'f' }]).toEqual(testComponent.formGroup.get('hobbies')!.value as Option[]);
    });

    it('Den Wert und die Options mit leichter Verzögerung setzen', async () => {
      // Vorbedingungen testen
      const luxSelect = fixture.debugElement.query(By.directive(LuxSelectComponent)).componentInstance;
      const mockData = [...testComponent.allHobbies()];

      testComponent.allHobbies.set([]);
      testComponent.formGroup.get('hobbies')!.setValue([mockData[0]]);
      await LuxTestHelper.wait(fixture);

      expect(luxSelect.value()).toEqual([mockData[0]]);

      // Änderungen durchführen
      testComponent.allHobbies.set(mockData);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(luxSelect.value()).toEqual([mockData[0]]);
    });

    it('Sollte required sein', async () => {
      fixture.detectChanges();
      // Vorbedingungen testen
      const luxSelect: LuxSelectComponent = fixture.debugElement.query(By.directive(LuxSelectComponent)).componentInstance;
      expect(luxSelect.luxRequired()).toBeFalsy();
      expect(luxSelect.formControl.valid).toBe(true);

      // Änderungen durchführen
      testComponent.formGroup.get('hobbies')!.setValidators(Validators.required);
      await LuxTestHelper.wait(fixture);
      luxSelect.formControl.markAsTouched();
      luxSelect.formControl.updateValueAndValidity();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(luxSelect.luxRequired()).toBe(true);
      expect(luxSelect.formControl.valid).toBe(false);
    });
  });

  describe('außerhalb eines Formulars', () => {
    let fixture: ComponentFixture<SelectOutsideFormComponent>;
    let testComponent: SelectOutsideFormComponent;
    let select: HTMLElement;
    let trigger: HTMLElement;

    beforeEach(async () => {
      fixture = TestBed.createComponent(SelectOutsideFormComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;
      select = fixture.debugElement.query(By.css('mat-select')).nativeElement;
    });

    it('Wert über das Property setzen', async () => {
      expect(fixture.componentInstance.selectedOption()).toBeNull();

      fixture.componentInstance.selectedOption.set(testComponent.options()[3]);

      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const selectedOptions = Array.from(options).filter((opt) => opt.classList.contains('mdc-list-item--selected'));
      expect(selectedOptions.length).toBe(1);
      expect(selectedOptions[0].innerText.trim()).toContain('Vertretungsaufgaben');
    });

    it('Wert über das Popup setzen', async () => {
      expect(fixture.componentInstance.selectedOption()).toBeNull();

      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      (document.querySelector('.mat-mdc-select-panel mat-option') as HTMLElement).click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      expect({ label: 'Meine Aufgaben', value: 'A' }).toEqual(fixture.componentInstance.selectedOption() as Option);
    });

    it('Validators setzen und korrekte Fehlermeldung anzeigen', async () => {
      // Vorbedingungen testen
      const selectComponent: LuxSelectComponent = fixture.debugElement.query(By.directive(LuxSelectComponent)).componentInstance;
      let errorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(errorEl).toBeFalsy();

      // Änderungen durchführen
      testComponent.validators.set(Validators.required);
      await LuxTestHelper.wait(fixture);
      selectComponent.formControl.markAsTouched();
      selectComponent.formControl.updateValueAndValidity();
      await LuxTestHelper.wait(fixture, 100);

      // Nachbedingungen testen
      errorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(errorEl.nativeElement.innerText.trim().length).toBeGreaterThan(0);
      expect(errorEl.nativeElement.innerText.trim()).toEqual('* Pflichtfeld');
      expect(selectComponent.formControl.valid).toBeFalsy();
    });

    it('Array als Value', async () => {
      // Vorbedingungen testen
      testComponent.options.set([
        { label: '0', value: ['0', '1', '2'] },
        { label: '1', value: ['3', '4', '5'] },
        { label: '2', value: ['6', '7', '8'] },
        { label: '3', value: ['9', '10', '11'] }
      ] as any);
      testComponent.selectedOption.set(null);
      await LuxTestHelper.wait(fixture);
      expect(testComponent.select().value()).toBeNull();

      // Änderungen durchführen
      testComponent.selectedOption.set(testComponent.options()[1]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(testComponent.select().value()).toEqual(testComponent.options()[1]);

      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
    });

    it('Kein initiales Change-Event ausgeben', async () => {
      // Vorbedingungen testen.
      // Die Component muss neu initialisiert werden.
      fixture = TestBed.createComponent(SelectOutsideFormComponent);
      testComponent = fixture.componentInstance;
      const selectComponent = fixture.debugElement.query(By.directive(LuxSelectComponent)).componentInstance;
      const changeEventSpy = vi.spyOn(selectComponent.luxSelectedChange, 'emit').mockReturnValue(undefined);

      await LuxTestHelper.wait(fixture);

      expect(changeEventSpy).toHaveBeenCalledTimes(0);

      // Änderungen durchführen
      testComponent.selectedOption.set(testComponent.options()[0]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(changeEventSpy).toHaveBeenCalledTimes(1);

      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
    });

    it('aktualisiert renderOptionIndexes bei asynchron geänderten Optionen', async () => {
      const selectComponent = fixture.debugElement.query(By.directive(LuxSelectComponent)).componentInstance as LuxSelectComponent;

      testComponent.options.set([
        { label: 'Neue Aufgabe A', value: 'NA' },
        { label: 'Neue Aufgabe B', value: 'NB' }
      ]);
      testComponent.selectedOption.set(testComponent.options()[1]);
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      expect(selectComponent.renderOptionIndexes()).toEqual([1, 0]);

      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      expect(options.length).toBe(2);
      const selectedOptions = Array.from(options).filter((opt) => opt.classList.contains('mdc-list-item--selected'));
      expect(selectedOptions.length).toBe(1);
      expect(selectedOptions[0].innerText.trim()).toContain('Neue Aufgabe B');
    });

    it('Sollte required sein', async () => {
      // Vorbedingungen testen
      const luxInput: LuxSelectComponent = fixture.debugElement.query(By.directive(LuxSelectComponent)).componentInstance;
      let selectRequired = fixture.debugElement.query(By.css('.mat-mdc-select-required'));
      expect(selectRequired).toBeNull();

      // Änderungen durchführen
      testComponent.required.set(true);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      selectRequired = fixture.debugElement.query(By.css('.mat-mdc-select-required'));
      expect(selectRequired).not.toBeNull();

      // Änderungen durchführen
      luxInput.formControl.markAsTouched();
      luxInput.formControl.updateValueAndValidity();
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(luxInput.formControl.valid).toBe(false);
      expect(luxInput.formControl.errors).not.toBeNull();
      expect(luxInput.formControl.errors!['required']).toBe(true);
    });

    it('Sollte readonly sein', async () => {
      // Vorbedingungen testen
      let readonlySelect = fixture.debugElement.query(By.css('lux-select .lux-form-control-readonly-authentic'));
      expect(readonlySelect).toBeNull();

      // Änderungen durchführen
      testComponent.readonly.set(true);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      readonlySelect = fixture.debugElement.query(By.css('lux-select .lux-form-control-readonly-authentic'));
      expect(readonlySelect).not.toBeNull();
    });

    it('Sollte disabled sein', async () => {
      // Vorbedingungen testen
      let disabledSelect = fixture.debugElement.query(By.css('lux-select .lux-form-control-disabled-authentic'));
      expect(disabledSelect).toBeNull();

      // Änderungen durchführen
      testComponent.disabled.set(true);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      disabledSelect = fixture.debugElement.query(By.css('lux-select .lux-form-control-disabled-authentic'));
      expect(disabledSelect).not.toBeNull();
    });

    it('Sollte das Label darstellen', async () => {
      // Vorbedingungen testen
      let label = fixture.debugElement.query(By.css('.lux-label-authentic'));
      expect(label.nativeElement.textContent.trim()).toEqual('');

      // Änderungen durchführen
      testComponent.label.set('Label');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      label = fixture.debugElement.query(By.css('.lux-label-authentic'));
      expect(label.nativeElement.textContent.trim()).toEqual('Label');
    });

    it('Sollte den Placeholder darstellen', async () => {
      // Vorbedingungen testen
      let placeholder = fixture.debugElement.query(By.css('.mat-mdc-select-placeholder'));
      expect(placeholder.nativeElement.textContent.trim()).toEqual('');

      // Änderungen durchführen
      testComponent.placeholder.set('Placeholder');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      placeholder = fixture.debugElement.query(By.css('.mat-mdc-select-placeholder'));
      expect(placeholder.nativeElement.textContent.trim()).toEqual('Placeholder');
    });

    it('Sollte den Hint darstellen', async () => {
      // Vorbedingungen testen
      let hint = fixture.debugElement.query(By.css('mat-hint'));
      expect(hint).toBeNull();

      // Änderungen durchführen
      testComponent.hint.set('Hint');
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      hint = fixture.debugElement.query(By.css('mat-hint'));
      expect(hint.nativeElement.textContent.trim()).toEqual('Hint');
    });
  });

  describe('Custom Compare', () => {
    let fixture: ComponentFixture<SelectCustomCompareComponent>;
    let testComponent: SelectCustomCompareComponent;
    let select: HTMLElement;
    let trigger: HTMLElement;

    beforeEach(async () => {
      fixture = TestBed.createComponent(SelectCustomCompareComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;
      select = fixture.debugElement.query(By.css('mat-select')).nativeElement;
    });

    it('Objekte anhand der Values vergleichen', async () => {
      expect(fixture.componentInstance.selectedOption()).toBeNull();

      fixture.componentInstance.selectedOption.set({ absoluteNeueProperty: 'mock', value: 'D' });
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const selectedOptions = Array.from(options).filter((opt) => opt.classList.contains('mdc-list-item--selected'));
      expect(selectedOptions.length).toBe(1);
      expect(selectedOptions[0].innerText.trim()).toContain('Vertretungsaufgaben');
    });
  });

  describe('mit simplem Daten-Array', () => {
    let fixture: ComponentFixture<SelectStringArrayComponent>;
    let testComponent: SelectStringArrayComponent;
    let select: HTMLElement;
    let trigger: HTMLElement;

    beforeEach(async () => {
      fixture = TestBed.createComponent(SelectStringArrayComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;
      select = fixture.debugElement.query(By.css('mat-select')).nativeElement;
    });

    it('Wert über das Property setzen', async () => {
      expect(fixture.componentInstance.selectedOption()).toBeNull();

      fixture.componentInstance.selectedOption.set(testComponent.options()[3]);

      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      trigger.click();
      await LuxTestHelper.wait(fixture, 500);
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const selectedOptions = Array.from(options).filter((opt) => opt.classList.contains('mdc-list-item--selected'));
      expect(selectedOptions.length).toBe(1);
      expect(selectedOptions[0].innerText.trim()).toContain('D');
    });

    it('Wert über das Popup setzen', async () => {
      expect(fixture.componentInstance.selectedOption()).toBeNull();

      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      (document.querySelector('.mat-mdc-select-panel mat-option') as HTMLElement).click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      expect('A').toEqual(fixture.componentInstance.selectedOption());
    });

    it('Array als Value', async () => {
      // Vorbedingungen testen
      testComponent.options.set([
        ['0', '1', '2'],
        ['3', '4', '5'],
        ['6', '7', '8'],
        ['9', '10', '11']
      ] as any);
      testComponent.selectedOption.set(undefined);
      await LuxTestHelper.wait(fixture);
      expect(testComponent.select().value()).toBeUndefined();

      // Änderungen durchführen
      testComponent.selectedOption.set(testComponent.options()[1]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(testComponent.select().value()).toEqual(testComponent.options()[1]);

      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
    });

    it('Sollte null, undefined und "" fehlerfrei als leeren String darstellen und die Werte emitten', async () => {
      const clickTrigger = async () => {
        trigger.click();
        await LuxTestHelper.wait(fixture, 500);
        await new Promise((resolve) => setTimeout(resolve, 0));
        fixture.detectChanges();
      };

      const clickOption = async (i: number) => {
        options.item(i).click();
        await LuxTestHelper.wait(fixture, 500);
        await new Promise((resolve) => setTimeout(resolve, 0));
        fixture.detectChanges();
      };

      // Vorbedingungen testen
      testComponent.options.set([null, undefined, '', ...testComponent.options()]);
      await LuxTestHelper.wait(fixture);

      await clickTrigger();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option .mdc-list-item__primary-text') as NodeListOf<HTMLElement>;

      expect(options.length).toBe(testComponent.options().length);
      expect(options.item(0).innerText.trim()).toEqual('');
      expect(options.item(1).innerText.trim()).toEqual('');
      expect(options.item(2).innerText.trim()).toEqual('');
      expect(options.item(3).innerText.trim()).toEqual('A');
      expect(options.item(4).innerText.trim()).toEqual('B');
      expect(options.item(5).innerText.trim()).toEqual('C');
      expect(options.item(6).innerText.trim()).toEqual('D');

      // Änderungen durchführen
      await clickOption(0);

      // Nachbedingungen prüfen
      expect(testComponent.selectedOption()).toBeNull();
      expect(fixture.debugElement.query(By.css('.mat-mdc-select-value-text'))).toBeNull();
      expect(fixture.debugElement.query(By.css('.mat-mdc-select-placeholder'))).not.toBeNull();

      // Änderungen durchführen
      await clickTrigger();
      await clickOption(2);

      // Nachbedingungen prüfen
      expect(testComponent.selectedOption()).toBe('');
      expect(fixture.debugElement.query(By.css('.mat-mdc-select-value-text'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('.mat-mdc-select-placeholder'))).toBeNull();

      // Änderungen durchführen
      await clickTrigger();
      await clickOption(1);

      // Nachbedingungen prüfen
      expect(testComponent.selectedOption()).toBeUndefined();
      expect(fixture.debugElement.query(By.css('.mat-mdc-select-value-text'))).toBeNull();
      expect(fixture.debugElement.query(By.css('.mat-mdc-select-placeholder'))).not.toBeNull();

      // Änderungen durchführen
      await clickTrigger();
      await clickOption(3);

      // Nachbedingungen prüfen
      expect(testComponent.selectedOption()).toBe('A');
      expect(fixture.debugElement.query(By.css('.mat-mdc-select-value-text'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('.mat-mdc-select-placeholder'))).toBeNull();
    });
  });

  describe('mit einer gesetzten Value-Hook (ohne Formular)', () => {
    let fixture: ComponentFixture<SelectValueHookComponent>;
    let testComponent: SelectValueHookComponent;
    let select: HTMLElement;
    let trigger: HTMLElement;

    beforeEach(async () => {
      fixture = TestBed.createComponent(SelectValueHookComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;
      select = fixture.debugElement.query(By.css('mat-select')).nativeElement;
    });

    it('nur Werte und keine Objekte emitten', async () => {
      // Vorbedingungen testen
      testComponent.selectedOption.set(testComponent.options()[1]);
      expect(testComponent.selectedOption()).toEqual(testComponent.options()[1]);

      // Änderungen durchführen
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(testComponent.selectedOption()).toEqual('B');

      // Änderungen durchführen
      testComponent.selectedOption.set(testComponent.options()[2]);
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(testComponent.selectedOption()).toEqual('C');
    });

    it('Array als Value', async () => {
      // Vorbedingungen testen
      testComponent.options.set([
        { label: '0', value: ['0', '1', '2'] },
        { label: '1', value: ['3', '4', '5'] },
        { label: '2', value: ['6', '7', '8'] },
        { label: '3', value: ['9', '10', '11'] }
      ] as any);
      testComponent.selectedOption.set(undefined);
      await LuxTestHelper.wait(fixture);
      expect(testComponent.select().value()).toBeUndefined();

      // Änderungen durchführen
      testComponent.selectedOption.set(testComponent.options()[1]);
      await LuxTestHelper.wait(fixture);
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(testComponent.select().value()).toEqual(testComponent.options()[1].value);
    });
  });

  describe('mit einer gesetzten Value-Hook (in einem Formular)', () => {
    let fixture: ComponentFixture<SelectValueHookFormComponent>;
    let testComponent: SelectValueHookFormComponent;
    let select: HTMLElement;
    let trigger: HTMLElement;

    beforeEach(async () => {
      fixture = TestBed.createComponent(SelectValueHookFormComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;
      select = fixture.debugElement.query(By.css('mat-select')).nativeElement;
    });

    it('nur Werte und keine Objekte emitten', async () => {
      // Vorbedingungen testen
      testComponent.formGroup.get('hobbies')!.setValue(testComponent.options[1]);
      // Änderungen durchführen
      await LuxTestHelper.wait(fixture);
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(testComponent.formGroup.value.hobbies).toEqual('B');

      // Änderungen durchführen
      testComponent.formGroup.get('hobbies')!.setValue(testComponent.options[2]);
      await LuxTestHelper.wait(fixture);
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      // Nachbedingungen prüfen
      expect(testComponent.formGroup.value.hobbies).toEqual('C');
    });
  });

  describe('als Multiselect', () => {
    let fixture: ComponentFixture<SelectMultipleComponent>;
    let testComponent: SelectMultipleComponent;
    let select: HTMLElement;
    let trigger: HTMLElement;

    beforeEach(async () => {
      fixture = TestBed.createComponent(SelectMultipleComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;
      select = fixture.debugElement.query(By.css('mat-select')).nativeElement;
    });

    it('Sollte mehrere Werte selektieren können (über PopUp)', async () => {
      // Vorbedingungen testen
      expect(testComponent.selectedOptions()).toEqual([]);

      // Änderungen durchführen
      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option');
      (options[0] as HTMLElement).click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      (options[1] as HTMLElement).click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      // Nachbedingungen prüfen
      const selectText = fixture.debugElement.query(By.css('.mat-mdc-select-value-text > span'));
      expect(selectText.nativeElement.textContent).toEqual(testComponent.options()[0].label + ', ' + testComponent.options()[1].label);
      expect([testComponent.options()[0], testComponent.options()[1]]).toEqual(fixture.componentInstance.selectedOptions() as any);
    });

    it('Sollte mehrere Werte selektieren können (über Value)', async () => {
      // Vorbedingungen testen
      const luxSelect: LuxSelectComponent = fixture.debugElement.query(By.directive(LuxSelectComponent)).componentInstance;
      expect(testComponent.selectedOptions()).toEqual([]);

      // Änderungen durchführen
      testComponent.selectedOptions.set([testComponent.options()[0], testComponent.options()[1]]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      const selectText = fixture.debugElement.query(By.css('.mat-mdc-select-value-text > span'));
      expect(selectText.nativeElement.textContent).toEqual(testComponent.options()[0].label + ', ' + testComponent.options()[1].label);
      expect(luxSelect.value()).toEqual([testComponent.options()[0], testComponent.options()[1]]);
    });

    it('Sollte mehrere Werte selektieren können (mit ValueHook)', async () => {
      const pickFixture: ComponentFixture<SelectMultiplePickValueFnComponent> = TestBed.createComponent(SelectMultiplePickValueFnComponent);
      const pickComponent: SelectMultiplePickValueFnComponent = pickFixture.componentInstance;
      pickFixture.detectChanges();

      // Vorbedingungen testen
      const luxSelect: LuxSelectComponent = pickFixture.debugElement.query(By.directive(LuxSelectComponent)).componentInstance;
      expect(pickComponent.selectedOptions()).toEqual([]);

      // Änderungen durchführen
      pickComponent.hook.set((option: Option) => option.value);
      await LuxTestHelper.wait(pickFixture);
      pickComponent.selectedOptions.set([pickComponent.options[0].value, pickComponent.options[1].value]);
      await LuxTestHelper.wait(pickFixture);

      // Nachbedingungen prüfen
      const selectText = pickFixture.debugElement.query(By.css('.mat-mdc-select-value-text > span'));
      expect(selectText.nativeElement.textContent).toEqual(pickComponent.options[0].label + ', ' + pickComponent.options[1].label);
      expect(luxSelect.value()).toEqual([pickComponent.options[0].value, pickComponent.options[1].value]);
    });

    it('Sollte mehrere Werte selektieren können (mit String-Options)', async () => {
      // Vorbedingungen testen
      const luxSelect: LuxSelectComponent = fixture.debugElement.query(By.directive(LuxSelectComponent)).componentInstance;
      expect(testComponent.selectedOptions()).toEqual([]);

      // Änderungen durchführen
      testComponent.options.set(['A', 'B', 'C', 'D'] as any);
      await LuxTestHelper.wait(fixture);
      testComponent.selectedOptions.set([testComponent.options()[0], testComponent.options()[1]]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      const selectText = fixture.debugElement.query(By.css('.mat-mdc-select-value-text > span'));
      expect(selectText.nativeElement.textContent).toEqual(testComponent.options()[0] + ', ' + testComponent.options()[1]);
      expect(luxSelect.value()).toEqual([testComponent.options()[0], testComponent.options()[1]]);
    });

    it('Sollte falsche Werte auslassen und einen Fehler loggen', async () => {
      // Vorbedingungen testen
      expect(testComponent.selectedOptions()).toEqual([]);

      // Änderungen durchführen
      testComponent.selectedOptions.set([{ value: 'WRONG', label: 'WRONG' }, testComponent.options()[1]]);
      await LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      const selectText = fixture.debugElement.query(By.css('.mat-mdc-select-value-text > span'));
      expect(selectText.nativeElement.textContent).toEqual(testComponent.options()[1].label);
    });
  });

  describe('Darstellung über Ng-Template', () => {
    let fixture: ComponentFixture<SelectWithTemplateComponent>;
    let testComponent: SelectWithTemplateComponent;
    let select: HTMLElement;
    let trigger: HTMLElement;

    beforeEach(async () => {
      fixture = TestBed.createComponent(SelectWithTemplateComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;
      select = fixture.debugElement.query(By.css('mat-select')).nativeElement;
    });

    it('Sollte die Options richtig darstellen', async () => {
      // Vorbedingungen testen
      let optionTexts = document.querySelectorAll('.mat-mdc-select-panel .mdc-list-item__primary-text');
      expect(optionTexts.length).toBe(0);

      // Änderungen durchführen
      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      // Nachbedingungen prüfen
      optionTexts = document.querySelectorAll('.mat-mdc-select-panel .mdc-list-item__primary-text');
      expect(optionTexts.length).toBe(4);
      expect(optionTexts[0].textContent!.trim()).toEqual('Option: A');
      expect(optionTexts[1].textContent!.trim()).toEqual('Option: B');
      expect(optionTexts[2].textContent!.trim()).toEqual('Option: C');
      expect(optionTexts[3].textContent!.trim()).toEqual('Option: D');
    });

    it('Sollte ngTemplate luxOptionLabelProp vorziehen', async () => {
      // Vorbedingungen testen
      let optionTexts = document.querySelectorAll('.mat-mdc-select-panel .mdc-list-item__primary-text');
      expect(optionTexts.length).toBe(0);

      // Änderungen durchführen
      testComponent.labelProp.set('label');
      await LuxTestHelper.wait(fixture);

      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      // Nachbedingungen prüfen
      optionTexts = document.querySelectorAll('.mat-mdc-select-panel .mdc-list-item__primary-text');
      expect(optionTexts.length).toBe(4);
      expect(optionTexts[0].textContent!.trim()).toEqual('Option: A');
      expect(optionTexts[1].textContent!.trim()).toEqual('Option: B');
      expect(optionTexts[2].textContent!.trim()).toEqual('Option: C');
      expect(optionTexts[3].textContent!.trim()).toEqual('Option: D');
    });
  });

  describe('Reihenfolge selektierter Optionen', () => {
    it('ordnet selektierte Optionen im Single-Select nach oben (stabil)', async () => {
      const fixture = TestBed.createComponent(SelectOutsideFormComponent);
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;

      // Öffnen und Option C auswählen.
      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const optionTexts = Array.from(options).map((opt) => opt.innerText.trim());
      const optionC = Array.from(options).find((opt) => opt.innerText.trim().includes('Zurückgestellte Aufgaben'));
      expect(optionTexts.length).toBe(4);
      expect(optionC).toBeDefined();

      (optionC as HTMLElement).click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      // Panel erneut öffnen und Reihenfolge prüfen: C muss oben stehen.
      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const optionsAfter = Array.from(document.querySelectorAll('.mat-mdc-select-panel mat-option')) as HTMLElement[];
      const selectedOptions = optionsAfter.filter((opt) => opt.classList.contains('mdc-list-item--selected'));
      expect(selectedOptions.length).toBe(1);
      expect(selectedOptions[0].innerText.trim()).toContain('Zurückgestellte Aufgaben');
    });

    it('behält im Multiselect die stabile Ursprungsreihenfolge bei', async () => {
      const fixture = TestBed.createComponent(SelectInsideFormComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();

      // Auswahl in umgekehrter Reihenfolge setzen: Stricken (idx 3) + Fußball (idx 1)
      component.formGroup.get('hobbies')!.setValue([component.allHobbies()[3], component.allHobbies()[1]]);
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const optionTexts = Array.from(
        document.querySelectorAll('.mat-mdc-select-panel mat-option .mdc-list-item__primary-text') as NodeListOf<HTMLElement>
      ).map((el) => el.textContent!.trim());

      expect(optionTexts[0]).toBe('Reiten');
      expect(optionTexts[1]).toBe('Fußball');
      expect(optionTexts[2]).toBe('Handball');
      expect(optionTexts[3]).toBe('Stricken');
    });

    it('behält bei aktivem luxKeepOptionOrder die Ursprungsreihenfolge (renderOptionIndexes)', async () => {
      // Vorbedingungen testen
      const fixture = TestBed.createComponent(SelectKeepOptionOrderComponent);
      const testComponent = fixture.componentInstance;
      fixture.detectChanges();

      const selectComponent = fixture.debugElement.query(By.directive(LuxSelectComponent)).componentInstance as LuxSelectComponent;
      expect(selectComponent.renderOptionIndexes()).toEqual([0, 1, 2, 3]);

      // Änderungen durchführen: mittlere Option selektieren
      testComponent.selectedOption.set(testComponent.options[2]);
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      // Nachbedingungen prüfen: Reihenfolge bleibt stabil (kein Sortieren nach oben)
      expect(selectComponent.renderOptionIndexes()).toEqual([0, 1, 2, 3]);

      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
    });

    it('lässt bei aktivem luxKeepOptionOrder die selektierte Option nicht nach oben wandern', async () => {
      // Vorbedingungen testen
      const fixture = TestBed.createComponent(SelectKeepOptionOrderComponent);
      const testComponent = fixture.componentInstance;
      testComponent.selectedOption.set(testComponent.options[2]);
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      // Änderungen durchführen: Panel öffnen
      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      // Nachbedingungen prüfen: gerenderte Reihenfolge entspricht der Ursprungsreihenfolge
      const optionTexts = Array.from(
        document.querySelectorAll('.mat-mdc-select-panel mat-option .mdc-list-item__primary-text') as NodeListOf<HTMLElement>
      ).map((el) => el.textContent!.trim());

      expect(optionTexts).toEqual(['Meine Aufgaben', 'Gruppenaufgaben', 'Zurückgestellte Aufgaben', 'Vertretungsaufgaben']);

      const selectedOptions = Array.from(document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>).filter(
        (opt) => opt.classList.contains('mdc-list-item--selected')
      );
      expect(selectedOptions.length).toBe(1);
      expect(selectedOptions[0].innerText.trim()).toContain('Zurückgestellte Aufgaben');

      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();
    });
  });

  describe('mit aktivierter Filterfunktion', () => {
    it('verwendet ng-template trotz gesetztem luxOptionLabelProp und filtert weiterhin korrekt', async () => {
      const fixture = TestBed.createComponent(SelectFilterWithTemplateComponent);
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const optionTexts = Array.from(
        document.querySelectorAll('.mat-mdc-select-panel mat-option .mdc-list-item__primary-text') as NodeListOf<HTMLElement>
      ).map((el) => el.textContent?.trim() ?? '');

      expect(optionTexts.length).toBe(4);
      expect(optionTexts[0]).toContain('OptionTpl: Meine Aufgaben');

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'gruppe';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const visibleOptions = Array.from(options).filter((opt) => window.getComputedStyle(opt).display !== 'none');
      expect(visibleOptions.length).toBe(1);
      expect(visibleOptions[0].innerText.trim()).toContain('OptionTpl: Gruppenaufgaben');
    });

    it('rendert das Filterfeld nicht als deaktivierte mat-option', async () => {
      const fixture = TestBed.createComponent(SelectFilterComponent);
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      expect(document.querySelector('.mat-mdc-select-panel mat-option.lux-select-panel-filter-option')).toBeNull();
      expect(document.querySelector('lux-select-panel-filter')).not.toBeNull();
    });

    it('reicht placeholder, filterValue und clearAriaLabel an das Filterfeld durch', async () => {
      const fixture = TestBed.createComponent(SelectFilterComponent);
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const filterInput = document.querySelector('input.lux-select-panel-filter-input') as HTMLInputElement;
      expect(filterInput).toBeTruthy();
      expect(filterInput.getAttribute('aria-label')).toBe('Mein Filter');
      expect(filterInput.value).toBe('init');

      const clearBtn = document.querySelector('.lux-select-panel-filter-clear-btn button') as HTMLButtonElement;
      expect(clearBtn).toBeTruthy();
      expect(clearBtn.getAttribute('aria-label')).toBe('Filter leeren');
    });

    it('reduziert die Optionsliste anhand des Suchtexts', async () => {
      const fixture = TestBed.createComponent(SelectFilterComponent);
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'gru';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const visibleOptions = Array.from(options).filter((opt) => window.getComputedStyle(opt).display !== 'none');
      expect(visibleOptions.length).toBe(1);
      expect(visibleOptions[0].innerText.trim()).toContain('Gruppenaufgaben');
    });

    it('navigiert mit Pfeiltasten fortlaufend über gefilterte Optionen', async () => {
      const fixture = TestBed.createComponent(SelectFilterComponent);
      fixture.detectChanges();

      const luxSelect = fixture.debugElement.query(By.directive(LuxSelectComponent)).componentInstance as LuxSelectComponent;

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'aufgaben';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      // Pfeiltasten werden über das Filterfeld an den MatSelect-KeyManager weitergereicht.
      LuxTestHelper.dispatchEvent(filterInput, LuxTestHelper.createKeyboardEvent('keydown', 40, filterInput, 'ArrowDown'));
      LuxTestHelper.dispatchEvent(filterInput, LuxTestHelper.createKeyboardEvent('keydown', 40, filterInput, 'ArrowDown'));
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const activeItem = (luxSelect.matSelect() as any)?._keyManager?.activeItem;
      expect(activeItem?.value?.value).toBe('B');
    });

    it('stoppt mit Pfeiltasten an der letzten gefilterten Option', async () => {
      const fixture = TestBed.createComponent(SelectFilterComponent);
      fixture.detectChanges();

      const luxSelect = fixture.debugElement.query(By.directive(LuxSelectComponent)).componentInstance as LuxSelectComponent;

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'aufgaben';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      for (let i = 0; i < 5; i++) {
        LuxTestHelper.dispatchEvent(filterInput, LuxTestHelper.createKeyboardEvent('keydown', 40, filterInput, 'ArrowDown'));
      }
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const activeItem = (luxSelect.matSelect() as any)?._keyManager?.activeItem;
      expect(activeItem?.value?.value).toBe('D');
    });

    it('navigiert mit PageUp und PageDown über sichtbare Optionen', async () => {
      const fixture = TestBed.createComponent(SelectFilterComponent);
      fixture.detectChanges();

      const luxSelect = fixture.debugElement.query(By.directive(LuxSelectComponent)).componentInstance as LuxSelectComponent;
      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;

      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = '';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      LuxTestHelper.dispatchEvent(filterInput, new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }));
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      let keyManager = (
        luxSelect.matSelect() as unknown as {
          _keyManager?: {
            activeItem?: {
              value?: Option;
            };
          };
        }
      )._keyManager;
      expect(keyManager?.activeItem?.value?.value).toBe('D');

      LuxTestHelper.dispatchEvent(filterInput, new KeyboardEvent('keydown', { key: 'PageUp', bubbles: true }));
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      keyManager = (
        luxSelect.matSelect() as unknown as {
          _keyManager?: {
            activeItem?: {
              value?: Option;
            };
          };
        }
      )._keyManager;
      expect(keyManager?.activeItem?.value?.value).toBe('A');
    });

    it('navigiert mit Home und End zur ersten bzw. letzten sichtbaren Option', async () => {
      const fixture = TestBed.createComponent(SelectFilterComponent);
      fixture.detectChanges();

      const luxSelect = fixture.debugElement.query(By.directive(LuxSelectComponent)).componentInstance as LuxSelectComponent;
      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;

      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = '';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      LuxTestHelper.dispatchEvent(filterInput, new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      let keyManager = (
        luxSelect.matSelect() as unknown as {
          _keyManager?: {
            activeItem?: {
              value?: Option;
            };
          };
        }
      )._keyManager;
      expect(keyManager?.activeItem?.value?.value).toBe('D');

      LuxTestHelper.dispatchEvent(filterInput, new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      keyManager = (
        luxSelect.matSelect() as unknown as {
          _keyManager?: {
            activeItem?: {
              value?: Option;
            };
          };
        }
      )._keyManager;
      expect(keyManager?.activeItem?.value?.value).toBe('A');
    });

    it('schließt im Single-Select bei Enter auf aktiver Option und erlaubt erneute Arrow-Navigation', async () => {
      const fixture = TestBed.createComponent(SelectFilterComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();

      const luxSelect = fixture.debugElement.query(By.directive(LuxSelectComponent)).componentInstance as LuxSelectComponent;
      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;

      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'aufgaben';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      LuxTestHelper.dispatchEvent(filterInput, LuxTestHelper.createKeyboardEvent('keydown', 40, filterInput, 'ArrowDown'));
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const activeBeforeEnter = (luxSelect.matSelect() as any)?._keyManager?.activeItem;
      const activeElement = document.activeElement as HTMLElement;
      LuxTestHelper.dispatchEvent(activeElement, LuxTestHelper.createKeyboardEvent('keydown', 13, activeElement, 'Enter'));
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      expect(activeBeforeEnter).toBeTruthy();
      expect(luxSelect.matSelect()?.panelOpen).toBe(false);
      expect(component.selectedOption).toBeTruthy();

      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const filterInputAfterReopen = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInputAfterReopen.value = 'aufgaben';
      LuxTestHelper.dispatchFakeEvent(filterInputAfterReopen, 'input');
      LuxTestHelper.dispatchEvent(
        filterInputAfterReopen,
        LuxTestHelper.createKeyboardEvent('keydown', 40, filterInputAfterReopen, 'ArrowDown')
      );
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const activeAfterReopen = (luxSelect.matSelect() as any)?._keyManager?.activeItem;
      expect(activeAfterReopen).toBeTruthy();
    });

    it('funktioniert mit Filterung und Auswahl kombiniert', async () => {
      const fixture = TestBed.createComponent(SelectFilterComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'zur';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const visibleOptions = Array.from(options).filter((opt) => window.getComputedStyle(opt).display !== 'none');
      expect(visibleOptions.length).toBe(1);
      visibleOptions[0].click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      expect(component.selectedOption?.value).toBe('C');
    });

    it('zeigt wieder alle Optionen bei leerem Suchfeld', async () => {
      const fixture = TestBed.createComponent(SelectFilterComponent);
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'ver';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      filterInput.value = '';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const options = fixture.nativeElement.querySelectorAll('mat-option .mdc-list-item__primary-text') as NodeListOf<HTMLElement>;
      expect(options.length).toBe(4);
    });

    it('leert den Filter per Clear-Button', async () => {
      const fixture = TestBed.createComponent(SelectFilterComponent);
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'gru';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const clearButton = document.querySelector('.lux-select-panel-filter-clear-btn button') as HTMLButtonElement;
      clearButton.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option .mdc-list-item__primary-text') as NodeListOf<HTMLElement>;
      expect(options.length).toBe(4);
    });

    it('funktioniert in Reactive Forms', async () => {
      const fixture = TestBed.createComponent(SelectFilterReactiveFormComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'vert';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const visibleOptions = Array.from(options).filter((opt) => window.getComputedStyle(opt).display !== 'none');
      expect(visibleOptions.length).toBe(1);
      visibleOptions[0].click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      expect(component.formGroup.get('task')?.value?.value).toBe('D');
    });

    it('funktioniert im Multiselect', async () => {
      const fixture = TestBed.createComponent(SelectFilterMultipleComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'aufgaben';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const visibleOptions = Array.from(options).filter((opt) => window.getComputedStyle(opt).display !== 'none');
      expect(visibleOptions.length).toBeGreaterThan(0);
      visibleOptions[0].click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      expect(document.activeElement).toBe(filterInput);

      // In Mehrfachauswahl bleibt das Panel nach der Auswahl typischerweise geöffnet.
      // Daher können wir direkt im selben Panel weiter filtern und selektieren.
      filterInput.value = 'gruppe';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const options2 = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const visibleOptions2 = Array.from(options2).filter((opt) => window.getComputedStyle(opt).display !== 'none');
      expect(visibleOptions2.length).toBe(1);
      visibleOptions2[0].click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      expect(document.activeElement).toBe(filterInput);
      expect(component.selectedOptions.length).toBe(2);
      expect(component.selectedOptions[0].value).toBe('A');
      expect(component.selectedOptions[1].value).toBe('B');
    });

    it('sortiert im geöffneten Multiselect nicht sofort nach Auswahl', async () => {
      const fixture = TestBed.createComponent(SelectFilterMultipleComponent);
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      let options = Array.from(document.querySelectorAll('.mat-mdc-select-panel mat-option')) as HTMLElement[];
      let visibleOptions = options.filter((opt) => window.getComputedStyle(opt).display !== 'none');
      expect(visibleOptions[0].innerText.trim()).toContain('Meine Aufgaben');

      const gruppenOption = visibleOptions.find((opt) => opt.innerText.includes('Gruppenaufgaben'));
      expect(gruppenOption).toBeTruthy();
      (gruppenOption as HTMLElement).click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      options = Array.from(document.querySelectorAll('.mat-mdc-select-panel mat-option')) as HTMLElement[];
      visibleOptions = options.filter((opt) => window.getComputedStyle(opt).display !== 'none');
      expect(visibleOptions[0].innerText.trim()).toContain('Meine Aufgaben');
    });

    it('hält im gefilterten Multiselect die Arrow-Navigation auf sichtbaren Optionen', async () => {
      const fixture = TestBed.createComponent(SelectFilterMultipleComponent);
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'gruppe';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const visibleOptions = Array.from(options).filter((opt) => window.getComputedStyle(opt).display !== 'none');
      expect(visibleOptions.length).toBe(1);
      expect(visibleOptions[0].innerText.trim()).toContain('Gruppenaufgaben');

      LuxTestHelper.dispatchEvent(filterInput, LuxTestHelper.createKeyboardEvent('keydown', 40, filterInput, 'ArrowDown'));
      LuxTestHelper.dispatchEvent(filterInput, LuxTestHelper.createKeyboardEvent('keydown', 40, filterInput, 'ArrowDown'));
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const luxSelect = fixture.debugElement.query(By.directive(LuxSelectComponent)).componentInstance as LuxSelectComponent;
      const activeItem = (luxSelect.matSelect() as any)?._keyManager?.activeItem;
      expect(activeItem?.value?.value).toBe('B');
    });

    it('hält im gefilterten Multiselect nach Arrow den Fokus im Filter-Input', async () => {
      const fixture = TestBed.createComponent(SelectFilterMultipleComponent);
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'aufgaben';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      LuxTestHelper.dispatchEvent(filterInput, LuxTestHelper.createKeyboardEvent('keydown', 40, filterInput, 'ArrowDown'));
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      expect(document.activeElement).toBe(filterInput);
    });
  });

  describe('mit konfigurierter sichtbarer Optionsanzahl', () => {
    it('begrenzt die Panelhöhe auf die konfigurierte Anzahl sichtbarer Optionen', async () => {
      const fixture = TestBed.createComponent(SelectVisibleOptionCountComponent);
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      await new Promise((resolve) => setTimeout(resolve, 0));
      fixture.detectChanges();

      const panel = document.querySelector('.mat-mdc-select-panel') as HTMLElement;
      const options = Array.from(document.querySelectorAll('.mat-mdc-select-panel mat-option')) as HTMLElement[];
      const optionHeight = options[0].getBoundingClientRect().height;
      const maxHeight = parseFloat(panel.style.maxHeight);

      expect(maxHeight).toBeCloseTo(optionHeight * 2, 0);
    });
  });

  describe('A11y', () => {
    let fixture: ComponentFixture<LuxSelectA11yComponent>;
    let testComponent: LuxSelectA11yComponent;

    beforeAll(() => {
      LuxA11yTestHelper.addA11yMatchers();
    });

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxSelectA11yComponent);
      testComponent = fixture.componentInstance;
      fixture.detectChanges();
    });

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

    it('sollte keine Barrierefreiheitsverletzungen haben (nur luxAriaLabel, ganz ohne luxLabel)', async () => {
      testComponent.label.set('');
      testComponent.ariaLabel.set('Liste sortieren nach');
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });
  });
});

@Component({
  template: `
    <form [formGroup]="formGroup">
      <lux-select
        luxLabel="Hobbys"
        luxControlBinding="hobbies"
        [luxOptions]="allHobbies()"
        luxOptionLabelProp="label"
        [luxMultiple]="true"
      ></lux-select>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxSelectComponent]
})
class SelectInsideFormComponent {
  readonly select = viewChild.required(LuxSelectComponent);

  allHobbies = signal<Option[]>([
    { label: 'Reiten', value: 'r' },
    { label: 'Fußball', value: 'f' },
    { label: 'Handball', value: 'h' },
    { label: 'Stricken', value: 's' }
  ]);

  formGroup = new FormGroup({
    hobbies: new FormControl<Option[] | null>(null)
  });
}

@Component({
  template: `
    <lux-select
      [luxOptions]="options()"
      luxOptionLabelProp="label"
      [luxControlValidators]="validators()"
      (luxSelectedChange)="selectedChange($event)"
      [(luxSelected)]="selectedOption"
      [luxMultiple]="false"
      [luxRequired]="required()"
      [luxLabel]="label()"
      [luxHint]="hint()"
      [luxReadonly]="readonly()"
      [luxDisabled]="disabled()"
      [luxPlaceholder]="placeholder()"
    ></lux-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxSelectComponent]
})
class SelectOutsideFormComponent {
  readonly select = viewChild.required(LuxSelectComponent);

  label = signal('');
  hint = signal('');
  readonly = signal(false);
  disabled = signal(false);
  placeholder = signal('');

  selectedOption = signal<Option | null>(null);
  validators = signal<LuxPickValueFnType | undefined>(undefined);
  required = signal(false);

  options = signal([
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ]);

  selectedChange(_selected: Option) {}
}

@Component({
  template: `
    <lux-select
      luxLabel="Aufgaben"
      [luxOptions]="options"
      luxOptionLabelProp="label"
      [(luxSelected)]="selectedOption"
      [luxMultiple]="false"
      [luxRequired]="false"
      [luxCompareWith]="compareFn"
    ></lux-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxSelectComponent]
})
class SelectCustomCompareComponent {
  readonly select = viewChild.required(LuxSelectComponent);

  selectedOption = signal<any>(null);

  options = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];

  compareFn(o1: Option, o2: Option) {
    return o1.value === o2.value;
  }
}

@Component({
  template: `
    <lux-select
      luxLabel="Aufgaben"
      [luxOptions]="options()"
      [(luxSelected)]="selectedOption"
      [luxMultiple]="false"
      [luxRequired]="false"
    ></lux-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxSelectComponent]
})
class SelectStringArrayComponent {
  readonly select = viewChild.required(LuxSelectComponent);
  selectedOption = signal<any>(null);
  options = signal<(string | null | undefined)[]>(['A', 'B', 'C', 'D']);
}

@Component({
  template: `
    <lux-select
      [luxOptions]="options"
      luxOptionLabelProp="label"
      [luxEnableFilter]="true"
      luxFilterPlaceholder="Mein Filter"
      luxFilterValue="init"
      luxFilterClearAriaLabel="Filter leeren"
      [(luxSelected)]="selectedOption"
      [luxMultiple]="false"
    ></lux-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxSelectComponent]
})
class SelectFilterComponent {
  selectedOption: Option | null = null;
  options: Option[] = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];
}

@Component({
  template: `
    <lux-select [luxOptions]="options" luxOptionLabelProp="label" [luxEnableFilter]="true" [(luxSelected)]="selectedOption">
      <ng-template let-option> {{ 'OptionTpl: ' + option.label }} </ng-template>
    </lux-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxSelectComponent]
})
class SelectFilterWithTemplateComponent {
  selectedOption: Option | null = null;
  options: Option[] = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];
}

@Component({
  template: `
    <form [formGroup]="formGroup">
      <lux-select [luxOptions]="options" luxOptionLabelProp="label" luxControlBinding="task" [luxEnableFilter]="true"></lux-select>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, LuxSelectComponent]
})
class SelectFilterReactiveFormComponent {
  options: Option[] = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];

  formGroup = new FormGroup({
    task: new FormControl<Option | null>(null)
  });
}

@Component({
  template: `
    <lux-select
      [luxOptions]="options"
      luxOptionLabelProp="label"
      [luxEnableFilter]="true"
      [luxMultiple]="true"
      [(luxSelected)]="selectedOptions"
    ></lux-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxSelectComponent]
})
class SelectFilterMultipleComponent {
  selectedOptions: Option[] = [];
  options: Option[] = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];
}

@Component({
  template: `
    <lux-select [luxOptions]="options" luxOptionLabelProp="label" [luxVisibleOptionCount]="2" [(luxSelected)]="selectedOption"></lux-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxSelectComponent]
})
class SelectVisibleOptionCountComponent {
  selectedOption: Option | null = null;
  options: Option[] = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];
}

@Component({
  template: `
    <lux-select
      luxLabel="Aufgaben"
      [luxOptions]="options"
      luxOptionLabelProp="label"
      [(luxSelected)]="selectedOption"
      [luxMultiple]="false"
      [luxKeepOptionOrder]="true"
    ></lux-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxSelectComponent]
})
class SelectKeepOptionOrderComponent {
  readonly select = viewChild.required(LuxSelectComponent);

  selectedOption = signal<Option | null>(null);

  options: Option[] = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];
}

declare interface Option {
  label: string;
  value: string;
}

@Component({
  template: `
    <lux-select
      luxLabel="Aufgaben"
      [luxOptions]="options()"
      [luxPickValue]="hook"
      luxOptionLabelProp="label"
      [(luxSelected)]="selectedOption"
    ></lux-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxSelectComponent]
})
class SelectValueHookComponent {
  readonly select = viewChild.required(LuxSelectComponent);
  selectedOption = signal<any>(null);
  options = signal<Option[]>([
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ]);

  hook(option: Option) {
    return option ? option.value : option;
  }
}

@Component({
  template: `
    <form [formGroup]="formGroup">
      <lux-select
        luxLabel="Hobbys"
        [luxOptions]="options"
        [luxPickValue]="hook"
        luxOptionLabelProp="label"
        luxControlBinding="hobbies"
      ></lux-select>
    </form>
    {{ formGroup.value | json }}
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [JsonPipe, ReactiveFormsModule, LuxSelectComponent]
})
class SelectValueHookFormComponent {
  readonly select = viewChild.required(LuxSelectComponent);

  options: Option[] = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];

  formGroup = new FormGroup<any>({
    hobbies: new FormControl<any>('')
  });

  hook(option: Option) {
    return option ? option.value : option;
  }
}

@Component({
  selector: 'lux-select-multiple-component',
  template: `
    <lux-select
      luxLabel="Aufgaben"
      [luxOptions]="options()"
      luxOptionLabelProp="label"
      [(luxSelected)]="selectedOptions"
      [luxMultiple]="true"
      [luxPickValue]="hook"
    ></lux-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxSelectComponent]
})
class SelectMultipleComponent {
  selectedOptions = signal<Option[]>([]);

  hook?: LuxPickValueFnType<Option, Option>;

  options = signal<Option[]>([
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ]);
}

@Component({
  selector: 'lux-select-multiple-pick-value-fn-component',
  template: `
    <lux-select
      luxLabel="Aufgaben"
      [luxOptions]="options"
      luxOptionLabelProp="label"
      [(luxSelected)]="selectedOptions"
      [luxMultiple]="true"
      [luxPickValue]="hook()"
    ></lux-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxSelectComponent]
})
class SelectMultiplePickValueFnComponent {
  selectedOptions = signal<string[]>([]);

  hook = signal<LuxPickValueFnType<Option, string> | undefined>(undefined);

  options: Option[] = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];
}

@Component({
  template: `
    <lux-select [luxOptions]="options" [luxOptionLabelProp]="labelProp()" [(luxSelected)]="selectedOption">
      <ng-template let-option>
        {{ 'Option: ' + option.value }}
      </ng-template>
    </lux-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxSelectComponent]
})
class SelectWithTemplateComponent {
  selectedOption: any[] = [];
  labelProp = signal<string | undefined>(undefined);

  options = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];
}

@Component({
  template: `
    <lux-select
      [luxLabel]="label()"
      [luxAriaLabel]="ariaLabel()"
      luxOptionLabelProp="label"
      [luxOptions]="options"
      [luxDisabled]="disabled()"
      [luxReadonly]="readonly()"
      [luxRequired]="required()"
    ></lux-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxSelectComponent]
})
class LuxSelectA11yComponent {
  options = [{ label: 'Meine Aufgaben', value: 'A' }];
  label = signal('Aufgaben');
  ariaLabel = signal<string | undefined>(undefined);
  disabled = signal(false);
  readonly = signal(false);
  required = signal(false);
}
