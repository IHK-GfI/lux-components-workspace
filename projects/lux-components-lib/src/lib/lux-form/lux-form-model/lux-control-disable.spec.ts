// noinspection DuplicatedCode

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxTestHelper } from '../../lux-util/testing/lux-test-helper';
import { LuxAutocompleteAcComponent } from '../lux-autocomplete-ac/lux-autocomplete-ac.component';
import { LuxCheckboxAcComponent } from '../lux-checkbox-ac/lux-checkbox-ac.component';
import { LuxDatepickerAcComponent } from '../lux-datepicker-ac/lux-datepicker-ac.component';

import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxFileInputAcComponent } from '../lux-file/lux-file-input-ac/lux-file-input-ac.component';
import { LuxFileListComponent } from '../lux-file/lux-file-list/lux-file-list.component';
import { LuxInputAcComponent } from '../lux-input-ac/lux-input-ac.component';
import { LuxRadioAcComponent } from '../lux-radio-ac/lux-radio-ac.component';
import { LuxSelectAcComponent } from '../lux-select-ac/lux-select-ac.component';
import { LuxSliderAcComponent } from '../lux-slider-ac/lux-slider-ac.component';
import { LuxTextareaAcComponent } from '../lux-textarea-ac/lux-textarea-ac.component';
import { LuxToggleAcComponent } from '../lux-toggle-ac/lux-toggle-ac.component';

describe('LuxControlDisable', () => {
  let fixture: ComponentFixture<LuxControlDisableComponent>;
  let testComponent: LuxControlDisableComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [LuxConsoleService, provideNoopAnimations(), provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
    }).compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(LuxControlDisableComponent);
    fixture.detectChanges();
    testComponent = fixture.componentInstance;
    discardPeriodicTasks();
  }));

  it('Controls über luxDisabled (de-)aktivieren', fakeAsync(() => {
    // Vorbedingungen testen
    const inputEl = fixture.debugElement.query(By.css('#input input')).nativeElement as HTMLInputElement;
    const autocompleteEl = fixture.debugElement.query(By.css('#autocomplete input')).nativeElement as HTMLInputElement;
    const checkboxEl = fixture.debugElement.query(By.css('#checkbox input')).nativeElement as HTMLInputElement;
    const datepickerEl = fixture.debugElement.query(By.css('#datepicker input')).nativeElement as HTMLInputElement;
    const fileInputEl = fixture.debugElement.query(By.css('#fileInput div.lux-form-control-wrapper')).nativeElement as HTMLInputElement;
    const fileListEl = fixture.debugElement.query(By.css('#fileList lux-card')).nativeElement as HTMLInputElement;
    let radioEl = fixture.debugElement.queryAll(By.css('.mdc-radio--disabled'));
    const selectEl = fixture.debugElement.query(By.css('#select mat-select')).nativeElement as HTMLInputElement;
    const sliderEl = fixture.debugElement.query(By.css('#slider mat-slider')).nativeElement as HTMLInputElement;
    const textareaEl = fixture.debugElement.query(By.css('#textarea textarea')).nativeElement as HTMLInputElement;
    const toggleEl = fixture.debugElement.query(By.css('#toggle button')).nativeElement as HTMLInputElement;

    expect(inputEl.disabled).toBe(false);
    expect(autocompleteEl.disabled).toBe(false);
    expect(checkboxEl.disabled).toBe(false);
    expect(datepickerEl.disabled).toBe(false);
    expect(fileInputEl.classList).not.toContain('lux-form-control-disabled-authentic');
    expect(fileListEl.classList).not.toContain('lux-file-list-disabled');
    expect(radioEl.length).toBe(0);
    expect(selectEl.classList).not.toContain('mat-mdc-select-disabled');
    expect(sliderEl.classList).not.toContain('mdc-slider--disabled');
    expect(textareaEl.disabled).toBe(false);
    expect(toggleEl.disabled).toBe(false);

    // Änderungen durchführen
    testComponent.disabledState = true;
    LuxTestHelper.wait(fixture);

    // Nachbedingungen testen
    expect(inputEl.disabled).toBe(true);
    expect(testComponent.myForm.get('input')!.disabled).toBe(true);
    expect(autocompleteEl.disabled).toBe(true);
    expect(testComponent.myForm.get('autocomplete')!.disabled).toBe(true);
    expect(checkboxEl.disabled).toBe(true);
    expect(testComponent.myForm.get('checkbox')!.disabled).toBe(true);
    expect(datepickerEl.disabled).toBe(true);
    expect(testComponent.myForm.get('datepicker')!.disabled).toBe(true);
    expect(fileInputEl.classList).toContain('lux-form-control-disabled-authentic');
    expect(testComponent.myForm.get('fileInput')!.disabled).toBe(true);
    expect(fileListEl.classList).toContain('lux-file-list-disabled');
    expect(testComponent.myForm.get('fileList')!.disabled).toBe(true);
    radioEl = fixture.debugElement.queryAll(By.css('.mdc-radio--disabled'));
    expect(radioEl.length).toBe(4);
    expect(testComponent.myForm.get('radio')!.disabled).toBe(true);
    expect(selectEl.classList).toContain('mat-mdc-select-disabled');
    expect(testComponent.myForm.get('select')!.disabled).toBe(true);
    expect(sliderEl.classList).toContain('mdc-slider--disabled');
    expect(testComponent.myForm.get('slider')!.disabled).toBe(true);
    expect(textareaEl.disabled).toBe(true);
    expect(testComponent.myForm.get('textarea')!.disabled).toBe(true);
    expect(toggleEl.disabled).toBe(true);
    expect(testComponent.myForm.get('toggle')!.disabled).toBe(true);

    // Änderungen durchführen
    testComponent.disabledState = false;
    LuxTestHelper.wait(fixture);

    // Nachbedingungen testen
    expect(inputEl.disabled).toBe(false);
    expect(testComponent.myForm.get('input')!.disabled).toBe(false);
    expect(autocompleteEl.disabled).toBe(false);
    expect(testComponent.myForm.get('autocomplete')!.disabled).toBe(false);
    expect(checkboxEl.disabled).toBe(false);
    expect(testComponent.myForm.get('checkbox')!.disabled).toBe(false);
    expect(datepickerEl.disabled).toBe(false);
    expect(testComponent.myForm.get('datepicker')!.disabled).toBe(false);
    expect(fileInputEl.classList).not.toContain('lux-form-control-disabled-authentic');
    expect(testComponent.myForm.get('fileInput')!.disabled).toBe(false);
    expect(fileListEl.classList).not.toContain('lux-file-list-disabled');
    expect(testComponent.myForm.get('fileList')!.disabled).toBe(false);
    radioEl = fixture.debugElement.queryAll(By.css('.mdc-radio--disabled'));
    expect(radioEl.length).toBe(0);
    expect(testComponent.myForm.get('radio')!.disabled).toBe(false);
    expect(selectEl.classList).not.toContain('mat-mdc-select-disabled');
    expect(testComponent.myForm.get('select')!.disabled).toBe(false);
    expect(sliderEl.classList).not.toContain('mdc-slider--disabled');
    expect(testComponent.myForm.get('slider')!.disabled).toBe(false);
    expect(textareaEl.disabled).toBe(false);
    expect(testComponent.myForm.get('textarea')!.disabled).toBe(false);
    expect(toggleEl.disabled).toBe(false);
    expect(testComponent.myForm.get('toggle')!.disabled).toBe(false);

    discardPeriodicTasks();
  }));

  it('Controls über das Formular (de-)aktivieren', fakeAsync(() => {
    // Vorbedingungen testen
    const inputEl = fixture.debugElement.query(By.css('#input input')).nativeElement as HTMLInputElement;
    const autocompleteEl = fixture.debugElement.query(By.css('#autocomplete input')).nativeElement as HTMLInputElement;
    const checkboxEl = fixture.debugElement.query(By.css('#checkbox input')).nativeElement as HTMLInputElement;
    const datepickerEl = fixture.debugElement.query(By.css('#datepicker input')).nativeElement as HTMLInputElement;
    const fileInputEl = fixture.debugElement.query(By.css('#fileInput div.lux-form-control-wrapper')).nativeElement as HTMLInputElement;
    const fileListEl = fixture.debugElement.query(By.css('#fileList lux-card')).nativeElement as HTMLInputElement;
    let radioEl = fixture.debugElement.queryAll(By.css('.mdc-radio--disabled'));
    const selectEl = fixture.debugElement.query(By.css('#select mat-select')).nativeElement as HTMLInputElement;
    const sliderEl = fixture.debugElement.query(By.css('#slider mat-slider')).nativeElement as HTMLInputElement;
    const textareaEl = fixture.debugElement.query(By.css('#textarea textarea')).nativeElement as HTMLInputElement;
    const toggleEl = fixture.debugElement.query(By.css('#toggle button')).nativeElement as HTMLInputElement;

    expect(inputEl.disabled).toBe(false);
    expect(autocompleteEl.disabled).toBe(false);
    expect(checkboxEl.disabled).toBe(false);
    expect(datepickerEl.disabled).toBe(false);
    expect(fileInputEl.classList).not.toContain('lux-form-control-disabled-authentic');
    expect(fileListEl.classList).not.toContain('lux-file-list-disabled');
    expect(radioEl.length).toBe(0);
    expect(selectEl.classList).not.toContain('mat-mdc-select-disabled');
    expect(sliderEl.classList).not.toContain('mdc-slider--disabled');
    expect(textareaEl.disabled).toBe(false);
    expect(toggleEl.disabled).toBe(false);

    // Änderungen durchführen
    testComponent.myForm.get('input')!.disable();
    testComponent.myForm.get('autocomplete')!.disable();
    testComponent.myForm.get('checkbox')!.disable();
    testComponent.myForm.get('datepicker')!.disable();
    testComponent.myForm.get('fileInput')!.disable();
    testComponent.myForm.get('fileList')!.disable();
    testComponent.myForm.get('radio')!.disable();
    testComponent.myForm.get('select')!.disable();
    testComponent.myForm.get('slider')!.disable();
    testComponent.myForm.get('textarea')!.disable();
    testComponent.myForm.get('toggle')!.disable();
    LuxTestHelper.wait(fixture);

    // Nachbedingungen testen
    expect(inputEl.disabled).toBe(true);
    expect(testComponent.myForm.get('input')!.disabled).toBe(true);
    expect(autocompleteEl.disabled).toBe(true);
    expect(testComponent.myForm.get('autocomplete')!.disabled).toBe(true);
    expect(checkboxEl.disabled).toBe(true);
    expect(testComponent.myForm.get('checkbox')!.disabled).toBe(true);
    expect(datepickerEl.disabled).toBe(true);
    expect(testComponent.myForm.get('datepicker')!.disabled).toBe(true);
    expect(fileInputEl.classList).toContain('lux-form-control-disabled-authentic');
    expect(testComponent.myForm.get('fileInput')!.disabled).toBe(true);
    expect(fileListEl.classList).toContain('lux-file-list-disabled');
    expect(testComponent.myForm.get('fileList')!.disabled).toBe(true);
    radioEl = fixture.debugElement.queryAll(By.css('.mdc-radio--disabled'));
    expect(radioEl.length).toBe(4);
    expect(selectEl.classList).toContain('mat-mdc-select-disabled');
    expect(testComponent.myForm.get('select')!.disabled).toBe(true);
    expect(sliderEl.classList).toContain('mdc-slider--disabled');
    expect(testComponent.myForm.get('slider')!.disabled).toBe(true);
    expect(textareaEl.disabled).toBe(true);
    expect(testComponent.myForm.get('textarea')!.disabled).toBe(true);
    expect(toggleEl.disabled).toBe(true);
    expect(testComponent.myForm.get('toggle')!.disabled).toBe(true);

    // Änderungen durchführen
    testComponent.myForm.get('input')!.enable();
    testComponent.myForm.get('autocomplete')!.enable();
    testComponent.myForm.get('checkbox')!.enable();
    testComponent.myForm.get('datepicker')!.enable();
    testComponent.myForm.get('fileInput')!.enable();
    testComponent.myForm.get('fileList')!.enable();
    testComponent.myForm.get('radio')!.enable();
    testComponent.myForm.get('select')!.enable();
    testComponent.myForm.get('slider')!.enable();
    testComponent.myForm.get('textarea')!.enable();
    testComponent.myForm.get('toggle')!.enable();
    LuxTestHelper.wait(fixture);

    // Nachbedingungen testen
    expect(inputEl.disabled).toBe(false);
    expect(testComponent.myForm.get('input')!.disabled).toBe(false);
    expect(autocompleteEl.disabled).toBe(false);
    expect(testComponent.myForm.get('autocomplete')!.disabled).toBe(false);
    expect(checkboxEl.disabled).toBe(false);
    expect(testComponent.myForm.get('checkbox')!.disabled).toBe(false);
    expect(datepickerEl.disabled).toBe(false);
    expect(testComponent.myForm.get('datepicker')!.disabled).toBe(false);
    expect(fileInputEl.classList).not.toContain('lux-form-control-disabled-authentic');
    expect(testComponent.myForm.get('fileInput')!.disabled).toBe(false);
    expect(fileListEl.classList).not.toContain('lux-file-list-disabled');
    expect(testComponent.myForm.get('fileList')!.disabled).toBe(false);
    radioEl = fixture.debugElement.queryAll(By.css('.mdc-radio--disabled'));
    expect(radioEl.length).toBe(0);
    expect(selectEl.classList).not.toContain('mat-mdc-select-disabled');
    expect(testComponent.myForm.get('select')!.disabled).toBe(false);
    expect(sliderEl.classList).not.toContain('mdc-slider--disabled');
    expect(testComponent.myForm.get('slider')!.disabled).toBe(false);
    expect(textareaEl.disabled).toBe(false);
    expect(testComponent.myForm.get('textarea')!.disabled).toBe(false);
    expect(toggleEl.disabled).toBe(false);
    expect(testComponent.myForm.get('toggle')!.disabled).toBe(false);

    discardPeriodicTasks();
  }));

  it('Controls über das Formular deaktivieren und über LuxDisabled aktivieren', fakeAsync(() => {
    // Vorbedingungen testen
    const inputEl = fixture.debugElement.query(By.css('#input input')).nativeElement as HTMLInputElement;
    const autocompleteEl = fixture.debugElement.query(By.css('#autocomplete input')).nativeElement as HTMLInputElement;
    const checkboxEl = fixture.debugElement.query(By.css('#checkbox input')).nativeElement as HTMLInputElement;
    const datepickerEl = fixture.debugElement.query(By.css('#datepicker input')).nativeElement as HTMLInputElement;
    const fileInputEl = fixture.debugElement.query(By.css('#fileInput div.lux-form-control-wrapper')).nativeElement as HTMLInputElement;
    const fileListEl = fixture.debugElement.query(By.css('#fileList lux-card')).nativeElement as HTMLInputElement;
    let radioEl = fixture.debugElement.queryAll(By.css('.mdc-radio--disabled'));
    const selectEl = fixture.debugElement.query(By.css('#select mat-select')).nativeElement as HTMLInputElement;
    const sliderEl = fixture.debugElement.query(By.css('#slider mat-slider')).nativeElement as HTMLInputElement;
    const textareaEl = fixture.debugElement.query(By.css('#textarea textarea')).nativeElement as HTMLInputElement;
    const toggleEl = fixture.debugElement.query(By.css('#toggle button')).nativeElement as HTMLInputElement;

    expect(inputEl.disabled).toBe(false);
    expect(autocompleteEl.disabled).toBe(false);
    expect(checkboxEl.disabled).toBe(false);
    expect(datepickerEl.disabled).toBe(false);
    expect(fileInputEl.classList).not.toContain('lux-form-control-disabled-authentic');
    expect(fileListEl.classList).not.toContain('lux-file-list-disabled');
    expect(radioEl.length).toBe(0);
    expect(selectEl.classList).not.toContain('mat-mdc-select-disabled');
    expect(sliderEl.classList).not.toContain('mdc-slider--disabled');
    expect(textareaEl.disabled).toBe(false);
    expect(toggleEl.disabled).toBe(false);

    // Änderungen durchführen
    testComponent.myForm.get('input')!.disable();
    testComponent.myForm.get('autocomplete')!.disable();
    testComponent.myForm.get('checkbox')!.disable();
    testComponent.myForm.get('datepicker')!.disable();
    testComponent.myForm.get('fileInput')!.disable();
    testComponent.myForm.get('fileList')!.disable();
    testComponent.myForm.get('radio')!.disable();
    testComponent.myForm.get('select')!.disable();
    testComponent.myForm.get('slider')!.disable();
    testComponent.myForm.get('textarea')!.disable();
    testComponent.myForm.get('toggle')!.disable();
    LuxTestHelper.wait(fixture);

    // Nachbedingungen testen
    expect(inputEl.disabled).toBe(true);
    expect(testComponent.myForm.get('input')!.disabled).toBe(true);
    expect(autocompleteEl.disabled).toBe(true);
    expect(testComponent.myForm.get('autocomplete')!.disabled).toBe(true);
    expect(checkboxEl.disabled).toBe(true);
    expect(testComponent.myForm.get('checkbox')!.disabled).toBe(true);
    expect(datepickerEl.disabled).toBe(true);
    expect(testComponent.myForm.get('datepicker')!.disabled).toBe(true);
    expect(fileInputEl.classList).toContain('lux-form-control-disabled-authentic');
    expect(testComponent.myForm.get('fileInput')!.disabled).toBe(true);
    expect(fileListEl.classList).toContain('lux-file-list-disabled');
    expect(testComponent.myForm.get('fileList')!.disabled).toBe(true);
    radioEl = fixture.debugElement.queryAll(By.css('.mdc-radio--disabled'));
    expect(radioEl.length).toBe(4);
    expect(selectEl.classList).toContain('mat-mdc-select-disabled');
    expect(testComponent.myForm.get('select')!.disabled).toBe(true);
    expect(sliderEl.classList).toContain('mdc-slider--disabled');
    expect(testComponent.myForm.get('slider')!.disabled).toBe(true);
    expect(textareaEl.disabled).toBe(true);
    expect(testComponent.myForm.get('textarea')!.disabled).toBe(true);
    expect(toggleEl.disabled).toBe(true);
    expect(testComponent.myForm.get('toggle')!.disabled).toBe(true);

    // Änderungen durchführen
    testComponent.disabledState = false;
    LuxTestHelper.wait(fixture);

    // Nachbedingungen testen
    expect(inputEl.disabled).toBe(false);
    expect(testComponent.myForm.get('input')!.disabled).toBe(false);
    expect(autocompleteEl.disabled).toBe(false);
    expect(testComponent.myForm.get('autocomplete')!.disabled).toBe(false);
    expect(checkboxEl.disabled).toBe(false);
    expect(testComponent.myForm.get('checkbox')!.disabled).toBe(false);
    expect(datepickerEl.disabled).toBe(false);
    expect(testComponent.myForm.get('datepicker')!.disabled).toBe(false);
    expect(fileInputEl.classList).not.toContain('lux-form-control-disabled-authentic');
    expect(testComponent.myForm.get('fileInput')!.disabled).toBe(false);
    expect(fileListEl.classList).not.toContain('lux-file-list-disabled');
    expect(testComponent.myForm.get('fileList')!.disabled).toBe(false);
    radioEl = fixture.debugElement.queryAll(By.css('.mdc-radio--disabled'));
    expect(radioEl.length).toBe(0);
    expect(selectEl.classList).not.toContain('mat-mdc-select-disabled');
    expect(testComponent.myForm.get('select')!.disabled).toBe(false);
    expect(sliderEl.classList).not.toContain('mdc-slider--disabled');
    expect(testComponent.myForm.get('slider')!.disabled).toBe(false);
    expect(textareaEl.disabled).toBe(false);
    expect(testComponent.myForm.get('textarea')!.disabled).toBe(false);
    expect(toggleEl.disabled).toBe(false);
    expect(testComponent.myForm.get('toggle')!.disabled).toBe(false);

    discardPeriodicTasks();
  }));

  it('Controls über luxDisabled deaktivieren und übers Formular aktivieren', fakeAsync(() => {
    // Vorbedingungen testen
    const inputEl = fixture.debugElement.query(By.css('#input input')).nativeElement as HTMLInputElement;
    const autocompleteEl = fixture.debugElement.query(By.css('#autocomplete input')).nativeElement as HTMLInputElement;
    const checkboxEl = fixture.debugElement.query(By.css('#checkbox input')).nativeElement as HTMLInputElement;
    const datepickerEl = fixture.debugElement.query(By.css('#datepicker input')).nativeElement as HTMLInputElement;
    const fileInputEl = fixture.debugElement.query(By.css('#fileInput div.lux-form-control-wrapper')).nativeElement as HTMLInputElement;
    const fileListEl = fixture.debugElement.query(By.css('#fileList lux-card')).nativeElement as HTMLInputElement;
    let radioEl = fixture.debugElement.queryAll(By.css('.mdc-radio--disabled'));
    const selectEl = fixture.debugElement.query(By.css('#select mat-select')).nativeElement as HTMLInputElement;
    const sliderEl = fixture.debugElement.query(By.css('#slider mat-slider')).nativeElement as HTMLInputElement;
    const textareaEl = fixture.debugElement.query(By.css('#textarea textarea')).nativeElement as HTMLInputElement;
    const toggleEl = fixture.debugElement.query(By.css('#toggle button')).nativeElement as HTMLInputElement;

    expect(inputEl.disabled).toBe(false);
    expect(autocompleteEl.disabled).toBe(false);
    expect(checkboxEl.disabled).toBe(false);
    expect(datepickerEl.disabled).toBe(false);
    expect(fileInputEl.classList).not.toContain('lux-form-control-disabled-authentic');
    expect(fileListEl.classList).not.toContain('lux-file-list-disabled');
    expect(radioEl.length).toBe(0);
    expect(selectEl.classList).not.toContain('mat-mdc-select-disabled');
    expect(sliderEl.classList).not.toContain('mdc-slider--disabled');
    expect(textareaEl.disabled).toBe(false);
    expect(toggleEl.disabled).toBe(false);

    // Änderungen durchführen
    testComponent.disabledState = true;
    LuxTestHelper.wait(fixture);

    // Nachbedingungen testen
    expect(inputEl.disabled).toBe(true);
    expect(testComponent.myForm.get('input')!.disabled).toBe(true);
    expect(autocompleteEl.disabled).toBe(true);
    expect(testComponent.myForm.get('autocomplete')!.disabled).toBe(true);
    expect(checkboxEl.disabled).toBe(true);
    expect(testComponent.myForm.get('checkbox')!.disabled).toBe(true);
    expect(datepickerEl.disabled).toBe(true);
    expect(testComponent.myForm.get('datepicker')!.disabled).toBe(true);
    expect(fileInputEl.classList).toContain('lux-form-control-disabled-authentic');
    expect(testComponent.myForm.get('fileInput')!.disabled).toBe(true);
    expect(fileListEl.classList).toContain('lux-file-list-disabled');
    expect(testComponent.myForm.get('fileList')!.disabled).toBe(true);
    radioEl = fixture.debugElement.queryAll(By.css('.mdc-radio--disabled'));
    expect(radioEl.length).toBe(4);
    expect(testComponent.myForm.get('radio')!.disabled).toBe(true);
    expect(selectEl.classList).toContain('mat-mdc-select-disabled');
    expect(testComponent.myForm.get('select')!.disabled).toBe(true);
    expect(sliderEl.classList).toContain('mdc-slider--disabled');
    expect(testComponent.myForm.get('slider')!.disabled).toBe(true);
    expect(textareaEl.disabled).toBe(true);
    expect(testComponent.myForm.get('textarea')!.disabled).toBe(true);
    expect(toggleEl.disabled).toBe(true);
    expect(testComponent.myForm.get('toggle')!.disabled).toBe(true);

    // Änderungen durchführen
    testComponent.myForm.get('input')!.enable();
    testComponent.myForm.get('autocomplete')!.enable();
    testComponent.myForm.get('checkbox')!.enable();
    testComponent.myForm.get('datepicker')!.enable();
    testComponent.myForm.get('fileInput')!.enable();
    testComponent.myForm.get('fileList')!.enable();
    testComponent.myForm.get('radio')!.enable();
    testComponent.myForm.get('select')!.enable();
    testComponent.myForm.get('slider')!.enable();
    testComponent.myForm.get('textarea')!.enable();
    testComponent.myForm.get('toggle')!.enable();
    LuxTestHelper.wait(fixture);

    // Nachbedingungen testen
    expect(inputEl.disabled).toBe(false);
    expect(testComponent.myForm.get('input')!.disabled).toBe(false);
    expect(autocompleteEl.disabled).toBe(false);
    expect(testComponent.myForm.get('autocomplete')!.disabled).toBe(false);
    expect(checkboxEl.disabled).toBe(false);
    expect(testComponent.myForm.get('checkbox')!.disabled).toBe(false);
    expect(datepickerEl.disabled).toBe(false);
    expect(testComponent.myForm.get('datepicker')!.disabled).toBe(false);
    expect(fileInputEl.classList).not.toContain('lux-form-control-disabled-authentic');
    expect(testComponent.myForm.get('fileInput')!.disabled).toBe(false);
    expect(fileListEl.classList).not.toContain('lux-file-list-disabled');
    expect(testComponent.myForm.get('fileList')!.disabled).toBe(false);
    radioEl = fixture.debugElement.queryAll(By.css('.mdc-radio--disabled'));
    expect(radioEl.length).toBe(0);
    expect(testComponent.myForm.get('radio')!.disabled).toBe(false);
    expect(selectEl.classList).not.toContain('mat-mdc-select-disabled');
    expect(testComponent.myForm.get('select')!.disabled).toBe(false);
    expect(sliderEl.classList).not.toContain('mdc-slider--disabled');
    expect(testComponent.myForm.get('slider')!.disabled).toBe(false);
    expect(textareaEl.disabled).toBe(false);
    expect(testComponent.myForm.get('textarea')!.disabled).toBe(false);
    expect(toggleEl.disabled).toBe(false);
    expect(testComponent.myForm.get('toggle')!.disabled).toBe(false);

    discardPeriodicTasks();
  }));
});

@Component({
  template: `
    <form [formGroup]="myForm">
      <lux-input-ac luxLabel="Input" luxControlBinding="input" [(luxDisabled)]="disabledState" id="input"></lux-input-ac>
      <lux-autocomplete-ac
        luxLabel="Autocomplete"
        [luxOptions]="options"
        luxControlBinding="autocomplete"
        [(luxDisabled)]="disabledState"
        id="autocomplete"
      ></lux-autocomplete-ac>
      <lux-checkbox-ac luxLabel="checkbox" luxControlBinding="checkbox" [(luxDisabled)]="disabledState" id="checkbox"></lux-checkbox-ac>
      <lux-datepicker-ac
        luxLabel="datepicker"
        luxControlBinding="datepicker"
        [(luxDisabled)]="disabledState"
        id="datepicker"
      ></lux-datepicker-ac>
      <lux-file-input-ac
        luxLabel="fileInput"
        luxControlBinding="fileInput"
        [(luxDisabled)]="disabledState"
        id="fileInput"
      ></lux-file-input-ac>
      <lux-file-list luxLabel="fileList" luxControlBinding="fileList" [(luxDisabled)]="disabledState" id="fileList"></lux-file-list>
      <lux-radio-ac
        luxLabel="radio"
        [luxOptions]="options"
        luxControlBinding="radio"
        [(luxDisabled)]="disabledState"
        id="radio"
      ></lux-radio-ac>
      <lux-select-ac
        luxLabel="select"
        [luxOptions]="options"
        luxControlBinding="select"
        [(luxDisabled)]="disabledState"
        id="select"
      ></lux-select-ac>
      <lux-slider-ac luxLabel="slider" luxControlBinding="slider" [(luxDisabled)]="disabledState" id="slider"></lux-slider-ac>
      <lux-textarea-ac luxLabel="textarea" luxControlBinding="textarea" [(luxDisabled)]="disabledState" id="textarea"></lux-textarea-ac>
      <lux-toggle-ac luxLabel="toggle" luxControlBinding="toggle" [(luxDisabled)]="disabledState" id="toggle"></lux-toggle-ac>
    </form>
  `,
  imports: [
    ReactiveFormsModule,
    LuxToggleAcComponent,
    LuxTextareaAcComponent,
    LuxSliderAcComponent,
    LuxSelectAcComponent,
    LuxRadioAcComponent,
    LuxInputAcComponent,
    LuxAutocompleteAcComponent,
    LuxCheckboxAcComponent,
    LuxDatepickerAcComponent,
    LuxFileInputAcComponent,
    LuxFileListComponent
  ]
})
class LuxControlDisableComponent {
  myForm: FormGroup;
  disabledState = false;

  options = [
    { label: 'Option #1', short: 'O1', value: '#1' },
    { label: 'Option #2', short: 'O2', value: '#2' },
    { label: 'Option #3', short: 'O3', value: '#3' },
    { label: 'Option #4', short: 'O4', value: '#4' }
  ];

  constructor() {
    this.myForm = new FormGroup<any>({
      input: new FormControl<any>(null),
      autocomplete: new FormControl<any>(null),
      checkbox: new FormControl<any>(null),
      datepicker: new FormControl<any>(null),
      fileInput: new FormControl<any>(null),
      fileList: new FormControl<any>(null),
      radio: new FormControl<any>(null),
      select: new FormControl<any>(null),
      slider: new FormControl<any>(null),
      textarea: new FormControl<any>(null),
      toggle: new FormControl<any>(null)
    });
  }
}
