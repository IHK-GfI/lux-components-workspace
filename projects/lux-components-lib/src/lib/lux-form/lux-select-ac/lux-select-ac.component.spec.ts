import { Directionality } from '@angular/cdk/bidi';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { JsonPipe } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, flush, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Subject } from 'rxjs';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';
import { LuxTestHelper } from '../../lux-util/testing/lux-test-helper';
import { LuxPickValueFnType } from '../lux-form-model/lux-form-selectable-base.class';
import { LuxSelectAcComponent } from './lux-select-ac.component';

describe('LuxSelectAcComponent', () => {
  let dir: any;

  beforeEach(waitForAsync(() => {
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
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  }));

  const scrolledSubject = new Subject();

  describe('innerhalb eines Formulars', () => {
    let fixture: ComponentFixture<SelectInsideFormComponent>;
    let testComponent: SelectInsideFormComponent;
    let trigger: HTMLElement;

    beforeEach(() => {
      fixture = TestBed.createComponent(SelectInsideFormComponent);
      testComponent = fixture.componentInstance;
    });

    it('Wert über das FormControl setzen', fakeAsync(() => {
      fixture.detectChanges();
      trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;

      expect(testComponent.formGroup.get('hobbies')!.value).toBeNull();

      testComponent.formGroup.get('hobbies')!.setValue([testComponent.allHobbies[0]]);
      tick();
      fixture.detectChanges();

      trigger.click();
      fixture.detectChanges();
      flush();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      expect(options[0].classList).toContain('mdc-list-item--selected');
    }));

    it('Wert über das Popup setzen', fakeAsync(() => {
      fixture.detectChanges();
      trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;

      expect(testComponent.formGroup.get('hobbies')!.value).toBeNull();

      trigger.click();
      fixture.detectChanges();
      flush();

      (document.querySelectorAll('.mat-mdc-select-panel mat-option')[1] as HTMLElement).click();
      fixture.detectChanges();
      flush();

      expect([{ label: 'Fußball', value: 'f' }]).toEqual(testComponent.formGroup.get('hobbies')!.value as Option[]);
    }));

    it('Den Wert und die Options mit leichter Verzögerung setzen', fakeAsync(() => {
      // Vorbedingungen testen
      const luxSelect = fixture.debugElement.query(By.directive(LuxSelectAcComponent)).componentInstance;
      const mockData = [...testComponent.allHobbies];

      testComponent.allHobbies = [];
      testComponent.formGroup.get('hobbies')!.setValue([mockData[0]]);
      LuxTestHelper.wait(fixture);

      expect(luxSelect.luxSelected).toEqual([mockData[0]]);

      // Änderungen durchführen
      testComponent.allHobbies = mockData;
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(luxSelect.luxSelected).toEqual([mockData[0]]);
    }));

    it('Sollte required sein', fakeAsync(() => {
      fixture.detectChanges();
      // Vorbedingungen testen
      const luxSelect: LuxSelectAcComponent = fixture.debugElement.query(By.directive(LuxSelectAcComponent)).componentInstance;
      expect(luxSelect.luxRequired).toBeFalsy();
      expect(luxSelect.formControl.valid).toBe(true);

      // Änderungen durchführen
      testComponent.formGroup.get('hobbies')!.setValidators(Validators.required);
      LuxTestHelper.wait(fixture);
      luxSelect.formControl.markAsTouched();
      luxSelect.formControl.updateValueAndValidity();
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(luxSelect.luxRequired).toBe(true);
      expect(luxSelect.formControl.valid).toBe(false);
    }));
  });

  describe('außerhalb eines Formulars', () => {
    let fixture: ComponentFixture<SelectOutsideFormComponent>;
    let testComponent: SelectOutsideFormComponent;
    let select: HTMLElement;
    let trigger: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SelectOutsideFormComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;
      select = fixture.debugElement.query(By.css('mat-select')).nativeElement;
    }));

    it('Wert über das Property setzen', fakeAsync(() => {
      expect(fixture.componentInstance.selectedOption).toBeNull();

      fixture.componentInstance.selectedOption = testComponent.options[3];

      fixture.detectChanges();
      flush();

      trigger.click();
      fixture.detectChanges();
      flush();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const selectedOptions = Array.from(options).filter((opt) => opt.classList.contains('mdc-list-item--selected'));
      expect(selectedOptions.length).toBe(1);
      expect(selectedOptions[0].innerText.trim()).toContain('Vertretungsaufgaben');
    }));

    it('Wert über das Popup setzen', fakeAsync(() => {
      expect(fixture.componentInstance.selectedOption).toBeNull();

      trigger.click();
      fixture.detectChanges();
      flush();

      (document.querySelector('.mat-mdc-select-panel mat-option') as HTMLElement).click();
      fixture.detectChanges();
      flush();

      expect({ label: 'Meine Aufgaben', value: 'A' }).toEqual(fixture.componentInstance.selectedOption as Option);

      discardPeriodicTasks();
    }));

    it('Validators setzen und korrekte Fehlermeldung anzeigen', fakeAsync(() => {
      // Vorbedingungen testen
      const selectComponent: LuxSelectAcComponent = fixture.debugElement.query(By.directive(LuxSelectAcComponent)).componentInstance;
      let errorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(errorEl).toBeFalsy();

      // Änderungen durchführen
      testComponent.validators = Validators.required;
      LuxTestHelper.wait(fixture);
      selectComponent.formControl.markAsTouched();
      selectComponent.formControl.updateValueAndValidity();
      LuxTestHelper.wait(fixture, 100);

      // Nachbedingungen testen
      errorEl = fixture.debugElement.query(By.css('mat-error'));
      expect(errorEl.nativeElement.innerText.trim().length).toBeGreaterThan(0);
      expect(errorEl.nativeElement.innerText.trim()).toEqual('* Pflichtfeld');
      expect(selectComponent.formControl.valid).toBeFalsy();
    }));

    it('Array als Value', fakeAsync(() => {
      // Vorbedingungen testen
      testComponent.options = [
        { label: '0', value: ['0', '1', '2'] },
        { label: '1', value: ['3', '4', '5'] },
        { label: '2', value: ['6', '7', '8'] },
        { label: '3', value: ['9', '10', '11'] }
      ] as any;
      testComponent.selectedOption = null;
      LuxTestHelper.wait(fixture);
      expect(testComponent.select.luxSelected).toBeNull();

      // Änderungen durchführen
      testComponent.selectedOption = testComponent.options[1];
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(testComponent.select.luxSelected).toEqual(testComponent.options[1]);

      flush();
    }));

    it('Kein initiales Change-Event ausgeben', fakeAsync(() => {
      // Vorbedingungen testen.
      // Die Component muss neu initialisiert werden.
      fixture = TestBed.createComponent(SelectOutsideFormComponent);
      testComponent = fixture.componentInstance;
      const selectComponent = fixture.debugElement.query(By.directive(LuxSelectAcComponent)).componentInstance;
      const changeEventSpy = spyOn(selectComponent.luxSelectedChange, 'emit');

      LuxTestHelper.wait(fixture);

      expect(changeEventSpy).toHaveBeenCalledTimes(0);

      // Änderungen durchführen
      testComponent.selectedOption = testComponent.options[0];
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(changeEventSpy).toHaveBeenCalledTimes(1);

      flush();
    }));

    it('Sollte required sein', fakeAsync(() => {
      // Vorbedingungen testen
      const luxInput: LuxSelectAcComponent = fixture.debugElement.query(By.directive(LuxSelectAcComponent)).componentInstance;
      let selectRequired = fixture.debugElement.query(By.css('.mat-mdc-select-required'));
      expect(selectRequired).toBeNull();

      // Änderungen durchführen
      testComponent.required = true;
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      selectRequired = fixture.debugElement.query(By.css('.mat-mdc-select-required'));
      expect(selectRequired).not.toBeNull();

      // Änderungen durchführen
      luxInput.formControl.markAsTouched();
      luxInput.formControl.updateValueAndValidity();
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(luxInput.formControl.valid).toBe(false);
      expect(luxInput.formControl.errors).not.toBeNull();
      expect(luxInput.formControl.errors!['required']).toBe(true);
    }));

    it('Sollte readonly sein', fakeAsync(() => {
      // Vorbedingungen testen
      let readonlySelect = fixture.debugElement.query(By.css('lux-select-ac .lux-form-control-readonly-authentic'));
      expect(readonlySelect).toBeNull();

      // Änderungen durchführen
      testComponent.readonly = true;
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      readonlySelect = fixture.debugElement.query(By.css('lux-select-ac .lux-form-control-readonly-authentic'));
      expect(readonlySelect).not.toBeNull();
    }));

    it('Sollte disabled sein', fakeAsync(() => {
      // Vorbedingungen testen
      let disabledSelect = fixture.debugElement.query(By.css('lux-select-ac .lux-form-control-disabled-authentic'));
      expect(disabledSelect).toBeNull();

      // Änderungen durchführen
      testComponent.disabled = true;
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      disabledSelect = fixture.debugElement.query(By.css('lux-select-ac .lux-form-control-disabled-authentic'));
      expect(disabledSelect).not.toBeNull();
    }));

    it('Sollte das Label darstellen', fakeAsync(() => {
      // Vorbedingungen testen
      let label = fixture.debugElement.query(By.css('.lux-label-authentic'));
      expect(label.nativeElement.textContent.trim()).toEqual('');

      // Änderungen durchführen
      testComponent.label = 'Label';
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      label = fixture.debugElement.query(By.css('.lux-label-authentic'));
      expect(label.nativeElement.textContent.trim()).toEqual('Label');
    }));

    it('Sollte den Placeholder darstellen', fakeAsync(() => {
      // Vorbedingungen testen
      let placeholder = fixture.debugElement.query(By.css('.mat-mdc-select-placeholder'));
      expect(placeholder.nativeElement.textContent.trim()).toEqual('');

      // Änderungen durchführen
      testComponent.placeholder = 'Placeholder';
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      placeholder = fixture.debugElement.query(By.css('.mat-mdc-select-placeholder'));
      expect(placeholder.nativeElement.textContent.trim()).toEqual('Placeholder');
    }));

    it('Sollte den Hint darstellen', fakeAsync(() => {
      // Vorbedingungen testen
      let hint = fixture.debugElement.query(By.css('mat-hint'));
      expect(hint).toBeNull();

      // Änderungen durchführen
      testComponent.hint = 'Hint';
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      hint = fixture.debugElement.query(By.css('mat-hint'));
      expect(hint.nativeElement.textContent.trim()).toEqual('Hint');
    }));
  });

  describe('Custom Compare', () => {
    let fixture: ComponentFixture<SelectCustomCompareComponent>;
    let testComponent: SelectCustomCompareComponent;
    let select: HTMLElement;
    let trigger: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SelectCustomCompareComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;
      select = fixture.debugElement.query(By.css('mat-select')).nativeElement;
    }));

    it('Objekte anhand der Values vergleichen', fakeAsync(() => {
      expect(fixture.componentInstance.selectedOption).toBeNull();

      fixture.componentInstance.selectedOption = { absoluteNeueProperty: 'mock', value: 'D' };
      fixture.detectChanges();
      flush();

      trigger.click();
      fixture.detectChanges();
      flush();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const selectedOptions = Array.from(options).filter((opt) => opt.classList.contains('mdc-list-item--selected'));
      expect(selectedOptions.length).toBe(1);
      expect(selectedOptions[0].innerText.trim()).toContain('Vertretungsaufgaben');
      discardPeriodicTasks();
    }));
  });

  describe('mit simplem Daten-Array', () => {
    let fixture: ComponentFixture<SelectStringArrayComponent>;
    let testComponent: SelectStringArrayComponent;
    let select: HTMLElement;
    let trigger: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SelectStringArrayComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;
      select = fixture.debugElement.query(By.css('mat-select')).nativeElement;
    }));

    it('Wert über das Property setzen', fakeAsync(() => {
      expect(fixture.componentInstance.selectedOption).toBeNull();

      fixture.componentInstance.selectedOption = testComponent.options[3];

      fixture.detectChanges();
      flush();

      trigger.click();
      LuxTestHelper.wait(fixture, 500);
      fixture.detectChanges();
      flush();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const selectedOptions = Array.from(options).filter((opt) => opt.classList.contains('mdc-list-item--selected'));
      expect(selectedOptions.length).toBe(1);
      expect(selectedOptions[0].innerText.trim()).toContain('D');
    }));

    it('Wert über das Popup setzen', fakeAsync(() => {
      expect(fixture.componentInstance.selectedOption).toBeNull();

      trigger.click();
      fixture.detectChanges();
      flush();

      (document.querySelector('.mat-mdc-select-panel mat-option') as HTMLElement).click();
      fixture.detectChanges();
      flush();

      expect('A').toEqual(fixture.componentInstance.selectedOption);
    }));

    it('Array als Value', fakeAsync(() => {
      // Vorbedingungen testen
      testComponent.options = [
        ['0', '1', '2'],
        ['3', '4', '5'],
        ['6', '7', '8'],
        ['9', '10', '11']
      ] as any;
      testComponent.selectedOption = undefined;
      LuxTestHelper.wait(fixture);
      expect(testComponent.select.luxSelected).toBeUndefined();

      // Änderungen durchführen
      testComponent.selectedOption = testComponent.options[1];
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      expect(testComponent.select.luxSelected).toEqual(testComponent.options[1]);

      flush();
    }));

    it('Sollte null, undefined und "" fehlerfrei als leeren String darstellen und die Werte emitten', fakeAsync(() => {
      const clickTrigger = () => {
        trigger.click();
        LuxTestHelper.wait(fixture, 500);
        flush();
      };

      const clickOption = (i: number) => {
        options.item(i).click();
        LuxTestHelper.wait(fixture, 500);
        flush();
      };

      // Vorbedingungen testen
      testComponent.options.unshift(null, undefined, '');
      LuxTestHelper.wait(fixture);

      clickTrigger();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option .mdc-list-item__primary-text') as NodeListOf<HTMLElement>;

      expect(options.length).toBe(testComponent.options.length);
      expect(options.item(0).innerText.trim()).toEqual('');
      expect(options.item(1).innerText.trim()).toEqual('');
      expect(options.item(2).innerText.trim()).toEqual('');
      expect(options.item(3).innerText.trim()).toEqual('A');
      expect(options.item(4).innerText.trim()).toEqual('B');
      expect(options.item(5).innerText.trim()).toEqual('C');
      expect(options.item(6).innerText.trim()).toEqual('D');

      // Änderungen durchführen
      clickOption(0);

      // Nachbedingungen prüfen
      expect(testComponent.selectedOption).toBeNull();
      expect(fixture.debugElement.query(By.css('.mat-mdc-select-value-text'))).toBeNull();
      expect(fixture.debugElement.query(By.css('.mat-mdc-select-placeholder'))).not.toBeNull();

      // Änderungen durchführen
      clickTrigger();
      clickOption(2);

      // Nachbedingungen prüfen
      expect(testComponent.selectedOption).toBe('');
      expect(fixture.debugElement.query(By.css('.mat-mdc-select-value-text'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('.mat-mdc-select-placeholder'))).toBeNull();

      // Änderungen durchführen
      clickTrigger();
      clickOption(1);

      // Nachbedingungen prüfen
      expect(testComponent.selectedOption).toBeUndefined();
      expect(fixture.debugElement.query(By.css('.mat-mdc-select-value-text'))).toBeNull();
      expect(fixture.debugElement.query(By.css('.mat-mdc-select-placeholder'))).not.toBeNull();

      // Änderungen durchführen
      clickTrigger();
      clickOption(3);

      // Nachbedingungen prüfen
      expect(testComponent.selectedOption).toBe('A');
      expect(fixture.debugElement.query(By.css('.mat-mdc-select-value-text'))).not.toBeNull();
      expect(fixture.debugElement.query(By.css('.mat-mdc-select-placeholder'))).toBeNull();
    }));
  });

  describe('mit einer gesetzten Value-Hook (ohne Formular)', () => {
    let fixture: ComponentFixture<SelectValueHookComponent>;
    let testComponent: SelectValueHookComponent;
    let select: HTMLElement;
    let trigger: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SelectValueHookComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;
      select = fixture.debugElement.query(By.css('mat-select')).nativeElement;
    }));

    it('nur Werte und keine Objekte emitten', fakeAsync(() => {
      // Vorbedingungen testen
      testComponent.selectedOption = testComponent.options[1];
      expect(testComponent.selectedOption).toEqual(testComponent.options[1]);

      // Änderungen durchführen
      fixture.detectChanges();
      flush();

      // Nachbedingungen prüfen
      expect(testComponent.selectedOption).toEqual('B');

      // Änderungen durchführen
      testComponent.selectedOption = testComponent.options[2];
      fixture.detectChanges();
      flush();

      // Nachbedingungen prüfen
      expect(testComponent.selectedOption).toEqual('C');
    }));

    it('Array als Value', fakeAsync(() => {
      // Vorbedingungen testen
      testComponent.options = [
        { label: '0', value: ['0', '1', '2'] },
        { label: '1', value: ['3', '4', '5'] },
        { label: '2', value: ['6', '7', '8'] },
        { label: '3', value: ['9', '10', '11'] }
      ] as any;
      testComponent.selectedOption = undefined;
      LuxTestHelper.wait(fixture);
      expect(testComponent.select.luxSelected).toBeUndefined();

      // Änderungen durchführen
      testComponent.selectedOption = testComponent.options[1];
      LuxTestHelper.wait(fixture);
      flush();

      // Nachbedingungen prüfen
      expect(testComponent.select.luxSelected).toEqual(testComponent.options[1].value);
    }));
  });

  describe('mit einer gesetzten Value-Hook (in einem Formular)', () => {
    let fixture: ComponentFixture<SelectValueHookFormComponent>;
    let testComponent: SelectValueHookFormComponent;
    let select: HTMLElement;
    let trigger: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SelectValueHookFormComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;
      select = fixture.debugElement.query(By.css('mat-select')).nativeElement;
    }));

    it('nur Werte und keine Objekte emitten', fakeAsync(() => {
      // Vorbedingungen testen
      testComponent.formGroup.get('hobbies')!.setValue(testComponent.options[1]);
      // Änderungen durchführen
      LuxTestHelper.wait(fixture);
      flush();

      // Nachbedingungen prüfen
      expect(testComponent.formGroup.value.hobbies).toEqual('B');

      // Änderungen durchführen
      testComponent.formGroup.get('hobbies')!.setValue(testComponent.options[2]);
      LuxTestHelper.wait(fixture);
      flush();

      // Nachbedingungen prüfen
      expect(testComponent.formGroup.value.hobbies).toEqual('C');
    }));
  });

  describe('als Multiselect', () => {
    let fixture: ComponentFixture<SelectMultipleComponent>;
    let testComponent: SelectMultipleComponent;
    let select: HTMLElement;
    let trigger: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SelectMultipleComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;
      select = fixture.debugElement.query(By.css('mat-select')).nativeElement;
    }));

    it('Sollte mehrere Werte selektieren können (über PopUp)', fakeAsync(() => {
      // Vorbedingungen testen
      expect(testComponent.selectedOptions).toEqual([]);

      // Änderungen durchführen
      trigger.click();
      fixture.detectChanges();
      flush();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option');
      (options[0] as HTMLElement).click();
      fixture.detectChanges();
      flush();

      trigger.click();
      fixture.detectChanges();
      flush();

      (options[1] as HTMLElement).click();
      fixture.detectChanges();
      flush();

      // Nachbedingungen prüfen
      const selectText = fixture.debugElement.query(By.css('.mat-mdc-select-value-text > span'));
      expect(selectText.nativeElement.textContent).toEqual(testComponent.options[0].label + ', ' + testComponent.options[1].label);
      expect([testComponent.options[0], testComponent.options[1]]).toEqual(fixture.componentInstance.selectedOptions as any);
      discardPeriodicTasks();
    }));

    it('Sollte mehrere Werte selektieren können (über Value)', fakeAsync(() => {
      // Vorbedingungen testen
      const luxSelect: LuxSelectAcComponent = fixture.debugElement.query(By.directive(LuxSelectAcComponent)).componentInstance;
      expect(testComponent.selectedOptions).toEqual([]);

      // Änderungen durchführen
      testComponent.selectedOptions = [testComponent.options[0], testComponent.options[1]];
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      const selectText = fixture.debugElement.query(By.css('.mat-mdc-select-value-text > span'));
      expect(selectText.nativeElement.textContent).toEqual(testComponent.options[0].label + ', ' + testComponent.options[1].label);
      expect(luxSelect.luxSelected).toEqual([testComponent.options[0], testComponent.options[1]]);
      discardPeriodicTasks();
    }));

    it('Sollte mehrere Werte selektieren können (mit ValueHook)', fakeAsync(() => {
      const pickFixture: ComponentFixture<SelectMultiplePickValueFnComponent> = TestBed.createComponent(SelectMultiplePickValueFnComponent);
      const pickComponent: SelectMultiplePickValueFnComponent = pickFixture.componentInstance;
      pickFixture.detectChanges();

      // Vorbedingungen testen
      const luxSelect: LuxSelectAcComponent = pickFixture.debugElement.query(By.directive(LuxSelectAcComponent)).componentInstance;
      expect(pickComponent.selectedOptions).toEqual([]);

      // Änderungen durchführen
      pickComponent.hook = (option: Option) => option.value;
      LuxTestHelper.wait(pickFixture);
      pickComponent.selectedOptions = [pickComponent.options[0].value, pickComponent.options[1].value];
      LuxTestHelper.wait(pickFixture);

      // Nachbedingungen prüfen
      const selectText = pickFixture.debugElement.query(By.css('.mat-mdc-select-value-text > span'));
      expect(selectText.nativeElement.textContent).toEqual(pickComponent.options[0].label + ', ' + pickComponent.options[1].label);
      expect(luxSelect.luxSelected).toEqual([pickComponent.options[0].value, pickComponent.options[1].value]);
      discardPeriodicTasks();
    }));

    it('Sollte mehrere Werte selektieren können (mit String-Options)', fakeAsync(() => {
      // Vorbedingungen testen
      const luxSelect: LuxSelectAcComponent = fixture.debugElement.query(By.directive(LuxSelectAcComponent)).componentInstance;
      expect(testComponent.selectedOptions).toEqual([]);

      // Änderungen durchführen
      testComponent.options = ['A', 'B', 'C', 'D'] as any;
      LuxTestHelper.wait(fixture);
      testComponent.selectedOptions = [testComponent.options[0], testComponent.options[1]];
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      const selectText = fixture.debugElement.query(By.css('.mat-mdc-select-value-text > span'));
      expect(selectText.nativeElement.textContent).toEqual(testComponent.options[0] + ', ' + testComponent.options[1]);
      expect(luxSelect.luxSelected).toEqual([testComponent.options[0], testComponent.options[1]]);
      discardPeriodicTasks();
    }));

    it('Sollte falsche Werte auslassen und einen Fehler loggen', fakeAsync(() => {
      // Vorbedingungen testen
      expect(testComponent.selectedOptions).toEqual([]);

      // Änderungen durchführen
      testComponent.selectedOptions = [{ value: 'WRONG', label: 'WRONG' }, testComponent.options[1]];
      LuxTestHelper.wait(fixture);

      // Nachbedingungen prüfen
      const selectText = fixture.debugElement.query(By.css('.mat-mdc-select-value-text > span'));
      expect(selectText.nativeElement.textContent).toEqual(testComponent.options[1].label);
      discardPeriodicTasks();
    }));
  });

  describe('Darstellung über Ng-Template', () => {
    let fixture: ComponentFixture<SelectWithTemplateComponent>;
    let testComponent: SelectWithTemplateComponent;
    let select: HTMLElement;
    let trigger: HTMLElement;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SelectWithTemplateComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
      trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement;
      select = fixture.debugElement.query(By.css('mat-select')).nativeElement;
    }));

    it('Sollte die Options richtig darstellen', fakeAsync(() => {
      // Vorbedingungen testen
      let optionTexts = document.querySelectorAll('.mat-mdc-select-panel .mdc-list-item__primary-text');
      expect(optionTexts.length).toBe(0);

      // Änderungen durchführen
      trigger.click();
      fixture.detectChanges();
      flush();

      // Nachbedingungen prüfen
      optionTexts = document.querySelectorAll('.mat-mdc-select-panel .mdc-list-item__primary-text');
      expect(optionTexts.length).toBe(4);
      expect(optionTexts[0].textContent!.trim()).toEqual('Option: A');
      expect(optionTexts[1].textContent!.trim()).toEqual('Option: B');
      expect(optionTexts[2].textContent!.trim()).toEqual('Option: C');
      expect(optionTexts[3].textContent!.trim()).toEqual('Option: D');
    }));

    it('Sollte ngTemplate luxOptionLabelProp vorziehen', fakeAsync(() => {
      // Vorbedingungen testen
      let optionTexts = document.querySelectorAll('.mat-mdc-select-panel .mdc-list-item__primary-text');
      expect(optionTexts.length).toBe(0);

      // Änderungen durchführen
      testComponent.labelProp = 'label';
      LuxTestHelper.wait(fixture);

      trigger.click();
      fixture.detectChanges();
      flush();

      // Nachbedingungen prüfen
      optionTexts = document.querySelectorAll('.mat-mdc-select-panel .mdc-list-item__primary-text');
      expect(optionTexts.length).toBe(4);
      expect(optionTexts[0].textContent!.trim()).toEqual('Option: A');
      expect(optionTexts[1].textContent!.trim()).toEqual('Option: B');
      expect(optionTexts[2].textContent!.trim()).toEqual('Option: C');
      expect(optionTexts[3].textContent!.trim()).toEqual('Option: D');
    }));
  });

  describe('Reihenfolge selektierter Optionen', () => {
    it('ordnet selektierte Optionen im Single-Select nach oben (stabil)', fakeAsync(() => {
      const fixture = TestBed.createComponent(SelectOutsideFormComponent);
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;

      // Öffnen und Option C auswählen.
      trigger.click();
      fixture.detectChanges();
      flush();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const optionTexts = Array.from(options).map((opt) => opt.innerText.trim());
      const optionC = Array.from(options).find((opt) => opt.innerText.trim().includes('Zurückgestellte Aufgaben'));
      expect(optionTexts.length).toBe(4);
      expect(optionC).toBeDefined();

      (optionC as HTMLElement).click();
      fixture.detectChanges();
      flush();

      // Panel erneut öffnen und Reihenfolge prüfen: C muss oben stehen.
      trigger.click();
      fixture.detectChanges();
      flush();

      const optionsAfter = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      expect(optionsAfter[0].innerText.trim()).toContain('Zurückgestellte Aufgaben');
    }));

    it('behält im Multiselect die stabile Ursprungsreihenfolge bei', fakeAsync(() => {
      const fixture = TestBed.createComponent(SelectInsideFormComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();

      // Auswahl in umgekehrter Reihenfolge setzen: Stricken (idx 3) + Fußball (idx 1)
      component.formGroup.get('hobbies')!.setValue([component.allHobbies[3], component.allHobbies[1]]);
      tick();
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      flush();

      const optionTexts = Array.from(
        document.querySelectorAll('.mat-mdc-select-panel mat-option .mdc-list-item__primary-text') as NodeListOf<HTMLElement>
      ).map((el) => el.textContent!.trim());

      expect(optionTexts[0]).toBe('Reiten');
      expect(optionTexts[1]).toBe('Fußball');
      expect(optionTexts[2]).toBe('Handball');
      expect(optionTexts[3]).toBe('Stricken');
    }));
  });

  describe('mit aktivierter Filterfunktion', () => {
    it('rendert das Filterfeld nicht als deaktivierte mat-option', fakeAsync(() => {
      const fixture = TestBed.createComponent(SelectFilterComponent);
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      flush();

      expect(document.querySelector('.mat-mdc-select-panel mat-option.lux-select-panel-filter-option')).toBeNull();
      expect(document.querySelector('lux-select-panel-filter')).not.toBeNull();
    }));

    it('reicht placeholder, filterValue und clearAriaLabel an das Filterfeld durch', fakeAsync(() => {
      const fixture = TestBed.createComponent(SelectFilterComponent);
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      flush();

      const filterInput = document.querySelector('input.lux-select-panel-filter-input') as HTMLInputElement;
      expect(filterInput).toBeTruthy();
      expect(filterInput.getAttribute('aria-label')).toBe('Mein Filter');
      expect(filterInput.value).toBe('init');

      const clearBtn = document.querySelector('.lux-select-panel-filter-clear-btn button') as HTMLButtonElement;
      expect(clearBtn).toBeTruthy();
      expect(clearBtn.getAttribute('aria-label')).toBe('Filter leeren');
    }));

    it('reduziert die Optionsliste anhand des Suchtexts', fakeAsync(() => {
      const fixture = TestBed.createComponent(SelectFilterComponent);
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      flush();

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'gru';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      flush();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const visibleOptions = Array.from(options).filter((opt) => window.getComputedStyle(opt).display !== 'none');
      expect(visibleOptions.length).toBe(1);
      expect(visibleOptions[0].innerText.trim()).toContain('Gruppenaufgaben');
    }));

    it('navigiert mit Pfeiltasten nur über gefilterte Optionen', fakeAsync(() => {
      const fixture = TestBed.createComponent(SelectFilterComponent);
      fixture.detectChanges();

      const luxSelect = fixture.debugElement.query(By.directive(LuxSelectAcComponent)).componentInstance as LuxSelectAcComponent;

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      flush();

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'gru';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      flush();

      // Pfeiltasten/Enter werden über das Filterfeld an den MatSelect weitergereicht.
      LuxTestHelper.dispatchEvent(filterInput, LuxTestHelper.createKeyboardEvent('keydown', 40, filterInput, 'ArrowDown'));
      fixture.detectChanges();
      flush();

      const activeItem = (luxSelect.matSelect as any)?._keyManager?.activeItem;
      expect(activeItem?.value?.value).toBe('B');
    }));

    it('funktioniert mit Filterung und Auswahl kombiniert', fakeAsync(() => {
      const fixture = TestBed.createComponent(SelectFilterComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      flush();

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'zur';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      flush();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const visibleOptions = Array.from(options).filter((opt) => window.getComputedStyle(opt).display !== 'none');
      expect(visibleOptions.length).toBe(1);
      visibleOptions[0].click();
      fixture.detectChanges();
      flush();

      expect(component.selectedOption?.value).toBe('C');
    }));

    it('zeigt wieder alle Optionen bei leerem Suchfeld', fakeAsync(() => {
      const fixture = TestBed.createComponent(SelectFilterComponent);
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      flush();

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'ver';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      flush();

      filterInput.value = '';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      flush();

      const options = fixture.nativeElement.querySelectorAll('mat-option .mdc-list-item__primary-text') as NodeListOf<HTMLElement>;
      expect(options.length).toBe(4);
    }));

    it('leert den Filter per Clear-Button', fakeAsync(() => {
      const fixture = TestBed.createComponent(SelectFilterComponent);
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      flush();

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'gru';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      flush();

      const clearButton = document.querySelector('.lux-select-panel-filter-clear-btn button') as HTMLButtonElement;
      clearButton.click();
      fixture.detectChanges();
      flush();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option .mdc-list-item__primary-text') as NodeListOf<HTMLElement>;
      expect(options.length).toBe(4);
    }));

    it('funktioniert in Reactive Forms', fakeAsync(() => {
      const fixture = TestBed.createComponent(SelectFilterReactiveFormComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      flush();

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'vert';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      flush();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const visibleOptions = Array.from(options).filter((opt) => window.getComputedStyle(opt).display !== 'none');
      expect(visibleOptions.length).toBe(1);
      visibleOptions[0].click();
      fixture.detectChanges();
      flush();

      expect(component.formGroup.get('task')?.value?.value).toBe('D');
    }));

    it('funktioniert im Multiselect', fakeAsync(() => {
      const fixture = TestBed.createComponent(SelectFilterMultipleComponent);
      const component = fixture.componentInstance;
      fixture.detectChanges();

      const trigger = fixture.debugElement.query(By.css('.mat-mdc-select-trigger')).nativeElement as HTMLElement;
      trigger.click();
      fixture.detectChanges();
      flush();

      const filterInput = document.querySelector('.lux-select-panel-filter-input') as HTMLInputElement;
      filterInput.value = 'aufgaben';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      flush();

      const options = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const visibleOptions = Array.from(options).filter((opt) => window.getComputedStyle(opt).display !== 'none');
      expect(visibleOptions.length).toBeGreaterThan(0);
      visibleOptions[0].click();
      fixture.detectChanges();
      flush();

      // In Mehrfachauswahl bleibt das Panel nach der Auswahl typischerweise geöffnet.
      // Daher können wir direkt im selben Panel weiter filtern und selektieren.
      filterInput.value = 'gruppe';
      LuxTestHelper.dispatchFakeEvent(filterInput, 'input');
      fixture.detectChanges();
      flush();

      const options2 = document.querySelectorAll('.mat-mdc-select-panel mat-option') as NodeListOf<HTMLElement>;
      const visibleOptions2 = Array.from(options2).filter((opt) => window.getComputedStyle(opt).display !== 'none');
      expect(visibleOptions2.length).toBe(1);
      visibleOptions2[0].click();
      fixture.detectChanges();
      flush();

      expect(component.selectedOptions.length).toBe(2);
      expect(component.selectedOptions[0].value).toBe('A');
      expect(component.selectedOptions[1].value).toBe('B');
    }));
  });
});

@Component({
  template: `
    <form [formGroup]="formGroup">
      <lux-select-ac
        luxLabel="Hobbys"
        luxControlBinding="hobbies"
        [luxOptions]="allHobbies"
        luxOptionLabelProp="label"
        [luxMultiple]="true"
      ></lux-select-ac>
    </form>
  `,
  imports: [ReactiveFormsModule, LuxSelectAcComponent]
})
class SelectInsideFormComponent {
  @ViewChild(LuxSelectAcComponent) select!: LuxSelectAcComponent;

  allHobbies: Option[] = [
    { label: 'Reiten', value: 'r' },
    { label: 'Fußball', value: 'f' },
    { label: 'Handball', value: 'h' },
    { label: 'Stricken', value: 's' }
  ];

  formGroup = new FormGroup({
    hobbies: new FormControl<Option[] | null>(null)
  });
}

@Component({
  template: `
    <lux-select-ac
      [luxOptions]="options"
      luxOptionLabelProp="label"
      [luxControlValidators]="validators"
      (luxSelectedChange)="selectedChange($event)"
      [(luxSelected)]="selectedOption"
      [luxMultiple]="false"
      [luxRequired]="required"
      [luxLabel]="label"
      [luxHint]="hint"
      [luxReadonly]="readonly"
      [luxDisabled]="disabled"
      [luxPlaceholder]="placeholder"
    ></lux-select-ac>
  `,
  imports: [LuxSelectAcComponent]
})
class SelectOutsideFormComponent {
  @ViewChild(LuxSelectAcComponent) select!: LuxSelectAcComponent;

  label?: string;
  hint?: string;
  readonly?: boolean;
  disabled?: boolean;
  placeholder?: string;

  selectedOption: Option | null = null;
  validators?: LuxPickValueFnType;
  required?: boolean;

  options = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];

  selectedChange(_selected: Option) {}
}

@Component({
  template: `
    <lux-select-ac
      luxLabel="Aufgaben"
      [luxOptions]="options"
      luxOptionLabelProp="label"
      [(luxSelected)]="selectedOption"
      [luxMultiple]="false"
      [luxRequired]="false"
      [luxCompareWith]="compareFn"
    ></lux-select-ac>
  `,
  imports: [LuxSelectAcComponent]
})
class SelectCustomCompareComponent {
  @ViewChild(LuxSelectAcComponent) select!: LuxSelectAcComponent;

  selectedOption: any = null;

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
    <lux-select-ac
      luxLabel="Aufgaben"
      [luxOptions]="options"
      [(luxSelected)]="selectedOption"
      [luxMultiple]="false"
      [luxRequired]="false"
    ></lux-select-ac>
  `,
  imports: [LuxSelectAcComponent]
})
class SelectStringArrayComponent {
  @ViewChild(LuxSelectAcComponent) select!: LuxSelectAcComponent;
  selectedOption: any = null;
  options: (string | null | undefined)[] = ['A', 'B', 'C', 'D'];
}

@Component({
  template: `
    <lux-select-ac
      [luxOptions]="options"
      luxOptionLabelProp="label"
      [luxEnableFilter]="true"
      luxFilterPlaceholder="Mein Filter"
      luxFilterValue="init"
      luxFilterClearAriaLabel="Filter leeren"
      [(luxSelected)]="selectedOption"
      [luxMultiple]="false"
    ></lux-select-ac>
  `,
  imports: [LuxSelectAcComponent]
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
    <form [formGroup]="formGroup">
      <lux-select-ac [luxOptions]="options" luxOptionLabelProp="label" luxControlBinding="task" [luxEnableFilter]="true"></lux-select-ac>
    </form>
  `,
  imports: [ReactiveFormsModule, LuxSelectAcComponent]
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
    <lux-select-ac
      [luxOptions]="options"
      luxOptionLabelProp="label"
      [luxEnableFilter]="true"
      [luxMultiple]="true"
      [(luxSelected)]="selectedOptions"
    ></lux-select-ac>
  `,
  imports: [LuxSelectAcComponent]
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

declare interface Option {
  label: string;
  value: string;
}

@Component({
  template: `
    <lux-select-ac
      luxLabel="Aufgaben"
      [luxOptions]="options"
      [luxPickValue]="hook"
      luxOptionLabelProp="label"
      [(luxSelected)]="selectedOption"
    ></lux-select-ac>
  `,
  imports: [LuxSelectAcComponent]
})
class SelectValueHookComponent {
  @ViewChild(LuxSelectAcComponent) select!: LuxSelectAcComponent;
  selectedOption: any = null;
  options: Option[] = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];

  hook(option: Option) {
    return option ? option.value : option;
  }
}

@Component({
  template: `
    <form [formGroup]="formGroup">
      <lux-select-ac
        luxLabel="Hobbys"
        [luxOptions]="options"
        [luxPickValue]="hook"
        luxOptionLabelProp="label"
        luxControlBinding="hobbies"
      ></lux-select-ac>
    </form>
    {{ formGroup.value | json }}
  `,
  imports: [JsonPipe, ReactiveFormsModule, LuxSelectAcComponent]
})
class SelectValueHookFormComponent {
  @ViewChild(LuxSelectAcComponent) select!: LuxSelectAcComponent;

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
    <lux-select-ac
      luxLabel="Aufgaben"
      [luxOptions]="options"
      luxOptionLabelProp="label"
      [(luxSelected)]="selectedOptions"
      [luxMultiple]="true"
      [luxPickValue]="hook"
    ></lux-select-ac>
  `,
  imports: [LuxSelectAcComponent]
})
class SelectMultipleComponent {
  selectedOptions: Option[] = [];

  hook?: LuxPickValueFnType<Option, Option>;

  options: Option[] = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];
}

@Component({
  selector: 'lux-select-multiple-pick-value-fn-component',
  template: `
    <lux-select-ac
      luxLabel="Aufgaben"
      [luxOptions]="options"
      luxOptionLabelProp="label"
      [(luxSelected)]="selectedOptions"
      [luxMultiple]="true"
      [luxPickValue]="hook"
    ></lux-select-ac>
  `,
  imports: [LuxSelectAcComponent]
})
class SelectMultiplePickValueFnComponent {
  selectedOptions: string[] = [];

  hook?: LuxPickValueFnType<Option, string>;

  options: Option[] = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];
}

@Component({
  template: `
    <lux-select-ac [luxOptions]="options" [(luxSelected)]="selectedOption">
      <ng-template let-option>
        {{ 'Option: ' + option.value }}
      </ng-template>
    </lux-select-ac>
  `,
  imports: [LuxSelectAcComponent]
})
class SelectWithTemplateComponent {
  selectedOption: any[] = [];
  labelProp?: string;

  options = [
    { label: 'Meine Aufgaben', value: 'A' },
    { label: 'Gruppenaufgaben', value: 'B' },
    { label: 'Zurückgestellte Aufgaben', value: 'C' },
    { label: 'Vertretungsaufgaben', value: 'D' }
  ];
}
