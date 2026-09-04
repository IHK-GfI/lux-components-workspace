import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxAutocompleteComponent } from '../../lux-form/lux-autocomplete/lux-autocomplete.component';
import { LuxCheckboxComponent } from '../../lux-form/lux-checkbox/lux-checkbox.component';
import { LuxChipsComponent } from '../../lux-form/lux-chips/lux-chips.component';
import { LuxDatepickerComponent } from '../../lux-form/lux-datepicker/lux-datepicker.component';
import { LuxDatetimepickerComponent } from '../../lux-form/lux-datetimepicker/lux-datetimepicker.component';
import { LuxFileInputComponent } from '../../lux-form/lux-file/lux-file-input/lux-file-input.component';
import { LuxFileListComponent } from '../../lux-form/lux-file/lux-file-list/lux-file-list.component';
import { LuxFileUploadComponent } from '../../lux-form/lux-file/lux-file-upload/lux-file-upload.component';
import { LuxInputComponent } from '../../lux-form/lux-input/lux-input.component';
import { LuxRadioComponent } from '../../lux-form/lux-radio/lux-radio.component';
import { LuxSelectComponent } from '../../lux-form/lux-select/lux-select.component';
import { LuxTextareaComponent } from '../../lux-form/lux-textarea/lux-textarea.component';
import { LuxTimepickerComponent } from '../../lux-form/lux-timepicker/lux-timepicker.component';
import { LuxToggleComponent } from '../../lux-form/lux-toggle/lux-toggle.component';
import { LuxAutofocusDirective } from './lux-autofocus.directive';

describe('LuxAutofocusDirective', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        LuxComponentsConfigService,
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  }));

  it('Sollte mit lux-input-ac funktionieren', fakeAsync(() => {
    const fixture = TestBed.createComponent(LuxAutoFocusInputComponent);
    fixture.detectChanges();
    spyOn(fixture.debugElement.query(By.css('input')).nativeElement, 'focus');

    tick();

    expect(fixture.debugElement.query(By.css('input')).nativeElement.focus).toHaveBeenCalled();
  }));

  it('Sollte mit lux-autocomplete-ac funktionieren', fakeAsync(() => {
    const fixture = TestBed.createComponent(LuxAutoFocusAutoCompleteComponent);
    fixture.detectChanges();
    spyOn(fixture.debugElement.query(By.css('input')).nativeElement, 'focus');

    tick();

    expect(fixture.debugElement.query(By.css('input')).nativeElement.focus).toHaveBeenCalled();
  }));

  it('Sollte mit lux-checkbox-ac funktionieren', fakeAsync(() => {
    const fixture = TestBed.createComponent(LuxAutoFocusCheckboxComponent);
    fixture.detectChanges();
    spyOn(fixture.debugElement.query(By.css('input')).nativeElement, 'focus');

    tick();

    expect(fixture.debugElement.query(By.css('input')).nativeElement.focus).toHaveBeenCalled();
  }));

  it('Sollte mit lux-chips-ac funktionieren', fakeAsync(() => {
    const fixture = TestBed.createComponent(LuxAutoFocusChipsComponent);
    fixture.detectChanges();
    spyOn(fixture.debugElement.query(By.css('input')).nativeElement, 'focus');

    tick();

    expect(fixture.debugElement.query(By.css('input')).nativeElement.focus).toHaveBeenCalled();
  }));

  it('Sollte mit lux-datepicker-ac funktionieren', fakeAsync(() => {
    const fixture = TestBed.createComponent(LuxAutoFocusDatePickerComponent);
    fixture.detectChanges();
    spyOn(fixture.debugElement.query(By.css('input')).nativeElement, 'focus');

    tick();

    expect(fixture.debugElement.query(By.css('input')).nativeElement.focus).toHaveBeenCalled();
  }));

  it('Sollte mit lux-timepicker funktionieren', fakeAsync(() => {
    const fixture = TestBed.createComponent(LuxAutoFocusTimepickerComponent);
    fixture.detectChanges();
    spyOn(fixture.debugElement.query(By.css('input')).nativeElement, 'focus');

    tick();

    expect(fixture.debugElement.query(By.css('input')).nativeElement.focus).toHaveBeenCalled();
  }));

  it('Sollte mit lux-dateptimeicker-ac funktionieren', fakeAsync(() => {
    const fixture = TestBed.createComponent(LuxAutoFocusDateTimePickerComponent);
    fixture.detectChanges();
    spyOn(fixture.debugElement.query(By.css('input')).nativeElement, 'focus');

    tick();

    expect(fixture.debugElement.query(By.css('input')).nativeElement.focus).toHaveBeenCalled();
  }));

  it('Sollte mit lux-file-input-ac funktionieren', fakeAsync(() => {
    const fixture = TestBed.createComponent(LuxAutoFocusFileInputComponent);
    fixture.detectChanges();
    spyOn(fixture.debugElement.query(By.css('input')).nativeElement, 'focus');

    tick();

    expect(fixture.debugElement.query(By.css('input')).nativeElement.focus).toHaveBeenCalled();
  }));

  it('Sollte mit lux-radio-ac funktionieren', fakeAsync(() => {
    const fixture = TestBed.createComponent(LuxAutoFocusRadioComponent);
    fixture.detectChanges();
    spyOn(fixture.debugElement.query(By.css('input')).nativeElement, 'focus');

    tick();

    expect(fixture.debugElement.query(By.css('input')).nativeElement.focus).toHaveBeenCalled();
  }));

  it('Sollte mit lux-select-ac funktionieren', fakeAsync(() => {
    const fixture = TestBed.createComponent(LuxAutoFocusSelectComponent);
    fixture.detectChanges();
    spyOn(fixture.debugElement.query(By.css('mat-select')).nativeElement, 'focus');

    tick();

    expect(fixture.debugElement.query(By.css('mat-select')).nativeElement.focus).toHaveBeenCalled();
  }));

  it('Sollte mit lux-textarea-ac funktionieren', fakeAsync(() => {
    const fixture = TestBed.createComponent(LuxAutoFocusTextAreaComponent);
    fixture.detectChanges();
    spyOn(fixture.debugElement.query(By.css('textarea')).nativeElement, 'focus');

    tick();

    expect(fixture.debugElement.query(By.css('textarea')).nativeElement.focus).toHaveBeenCalled();
  }));

  it('Sollte mit lux-toggle-ac funktionieren', fakeAsync(() => {
    const fixture = TestBed.createComponent(LuxAutoFocusToggleComponent);
    fixture.detectChanges();
    spyOn(fixture.debugElement.query(By.css('button')).nativeElement, 'focus');

    tick();

    expect(fixture.debugElement.query(By.css('button')).nativeElement.focus).toHaveBeenCalled();
  }));

  it('Sollte mit lux-button funktionieren', fakeAsync(() => {
    const fixture = TestBed.createComponent(LuxAutoFocusButtonComponent);
    fixture.detectChanges();
    spyOn(fixture.debugElement.query(By.css('button')).nativeElement, 'focus');

    tick();

    expect(fixture.debugElement.query(By.css('button')).nativeElement.focus).toHaveBeenCalled();
  }));

  it('Sollte mit lux-file-list funktionieren', fakeAsync(() => {
    const fixture = TestBed.createComponent(LuxAutoFocusFileListComponent);
    fixture.detectChanges();
    spyOn(fixture.debugElement.query(By.css('lux-card.lux-file-list')).nativeElement, 'focus');

    tick();

    expect(fixture.debugElement.query(By.css('lux-card.lux-file-list')).nativeElement.focus).toHaveBeenCalled();
  }));

  it('Sollte mit lux-file-upload funktionieren', fakeAsync(() => {
    const fixture = TestBed.createComponent(LuxAutoFocusFileUploadComponent);
    fixture.detectChanges();
    spyOn(fixture.debugElement.query(By.css('div.lux-file-upload-drop-container')).nativeElement, 'focus');

    tick();

    expect(fixture.debugElement.query(By.css('div.lux-file-upload-drop-container')).nativeElement.focus).toHaveBeenCalled();
  }));
});

@Component({
  selector: 'lux-autofocus-test-input',
  template: `<lux-input luxAutofocus></lux-input>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxInputComponent, LuxAutofocusDirective]
})
class LuxAutoFocusInputComponent {}

@Component({
  selector: 'lux-autofocus-test-input',
  template: `<lux-autocomplete luxAutofocus></lux-autocomplete>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAutocompleteComponent, LuxAutofocusDirective]
})
class LuxAutoFocusAutoCompleteComponent {}

@Component({
  selector: 'lux-autofocus-test-checkbox',
  template: `<lux-checkbox luxAutofocus></lux-checkbox>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxCheckboxComponent, LuxAutofocusDirective]
})
class LuxAutoFocusCheckboxComponent {}

@Component({
  selector: 'lux-autofocus-test-chips',
  template: `<lux-chips [luxInputAllowed]="true" luxAutofocus></lux-chips>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxChipsComponent, LuxAutofocusDirective]
})
class LuxAutoFocusChipsComponent {}

@Component({
  selector: 'lux-autofocus-test-datepicker',
  template: `<lux-datepicker luxAutofocus></lux-datepicker>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxDatepickerComponent, LuxAutofocusDirective]
})
class LuxAutoFocusDatePickerComponent {}

@Component({
  selector: 'lux-autofocus-test-timepicker',
  template: `<lux-timepicker luxAutofocus></lux-timepicker>`,
  imports: [LuxTimepickerComponent, LuxAutofocusDirective]
})
class LuxAutoFocusTimepickerComponent {}

@Component({
  selector: 'lux-autofocus-test-datetimepicker',
  template: `<lux-datetimepicker luxAutofocus></lux-datetimepicker>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxDatetimepickerComponent, LuxAutofocusDirective]
})
class LuxAutoFocusDateTimePickerComponent {}

@Component({
  selector: 'lux-autofocus-test-fileinput',
  template: `<lux-file-input luxAutofocus></lux-file-input>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxFileInputComponent, LuxAutofocusDirective]
})
class LuxAutoFocusFileInputComponent {}

@Component({
  selector: 'lux-autofocus-test-radio',
  template: `<lux-radio [luxOptions]="options" luxAutofocus></lux-radio>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxRadioComponent, LuxAutofocusDirective]
})
class LuxAutoFocusRadioComponent {
  options: { label: string; value: string; disabled?: boolean }[] = [
    { label: 'männlich', value: 'm' },
    { label: 'weiblich', value: 'w' },
    { label: 'divers', value: 'd', disabled: true }
  ];
}

@Component({
  selector: 'lux-autofocus-test-select',
  template: `<lux-select [luxOptions]="options" luxAutofocus></lux-select>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxSelectComponent, LuxAutofocusDirective]
})
class LuxAutoFocusSelectComponent {
  options: { label: string; value: string }[] = [
    { label: 'männlich', value: 'm' },
    { label: 'weiblich', value: 'w' }
  ];
}

@Component({
  selector: 'lux-autofocus-test-textarea',
  template: `<lux-textarea luxAutofocus></lux-textarea>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxTextareaComponent, LuxAutofocusDirective]
})
class LuxAutoFocusTextAreaComponent {}

@Component({
  selector: 'lux-autofocus-test-toggle',
  template: `<lux-toggle luxAutofocus></lux-toggle>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxToggleComponent, LuxAutofocusDirective]
})
class LuxAutoFocusToggleComponent {}

@Component({
  selector: 'lux-autofocus-test-button',
  template: `<lux-button luxAutofocus></lux-button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxButtonComponent, LuxAutofocusDirective]
})
class LuxAutoFocusButtonComponent {}

@Component({
  selector: 'lux-autofocus-test-file-list',
  template: `<lux-file-list luxAutofocus></lux-file-list>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxFileListComponent, LuxAutofocusDirective]
})
class LuxAutoFocusFileListComponent {}

@Component({
  selector: 'lux-autofocus-test-file-upload',
  template: `<lux-file-upload luxAutofocus></lux-file-upload>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxFileUploadComponent, LuxAutofocusDirective]
})
class LuxAutoFocusFileUploadComponent {}
