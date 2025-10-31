import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxAutocompleteAcComponent } from '../../lux-form/lux-autocomplete-ac/lux-autocomplete-ac.component';
import { LuxCheckboxAcComponent } from '../../lux-form/lux-checkbox-ac/lux-checkbox-ac.component';
import { LuxChipsAcComponent } from '../../lux-form/lux-chips-ac/lux-chips-ac.component';
import { LuxDatepickerAcComponent } from '../../lux-form/lux-datepicker-ac/lux-datepicker-ac.component';
import { LuxDatetimepickerAcComponent } from '../../lux-form/lux-datetimepicker-ac/lux-datetimepicker-ac.component';
import { LuxFileInputAcComponent } from '../../lux-form/lux-file/lux-file-input-ac/lux-file-input-ac.component';
import { LuxFileListComponent } from '../../lux-form/lux-file/lux-file-list/lux-file-list.component';
import { LuxFileUploadComponent } from '../../lux-form/lux-file/lux-file-upload/lux-file-upload.component';
import { LuxInputAcComponent } from '../../lux-form/lux-input-ac/lux-input-ac.component';
import { LuxRadioAcComponent } from '../../lux-form/lux-radio-ac/lux-radio-ac.component';
import { LuxSelectAcComponent } from '../../lux-form/lux-select-ac/lux-select-ac.component';
import { LuxTextareaAcComponent } from '../../lux-form/lux-textarea-ac/lux-textarea-ac.component';
import { LuxToggleAcComponent } from '../../lux-form/lux-toggle-ac/lux-toggle-ac.component';
import { LuxAutofocusDirective } from './lux-autofocus.directive';

describe('LuxAutofocusDirective', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [LuxComponentsConfigService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting(), provideLuxTranslocoTesting()]
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
  template: `<lux-input-ac luxAutofocus></lux-input-ac>`,
  imports: [LuxInputAcComponent, LuxAutofocusDirective]
})
class LuxAutoFocusInputComponent {}

@Component({
  selector: 'lux-autofocus-test-input',
  template: `<lux-autocomplete-ac luxAutofocus></lux-autocomplete-ac>`,
  imports: [LuxAutocompleteAcComponent, LuxAutofocusDirective]
})
class LuxAutoFocusAutoCompleteComponent {}

@Component({
  selector: 'lux-autofocus-test-checkbox',
  template: `<lux-checkbox-ac luxAutofocus></lux-checkbox-ac>`,
  imports: [LuxCheckboxAcComponent, LuxAutofocusDirective]
})
class LuxAutoFocusCheckboxComponent {}

@Component({
  selector: 'lux-autofocus-test-chips',
  template: `<lux-chips-ac [luxInputAllowed]="true" luxAutofocus></lux-chips-ac>`,
  imports: [LuxChipsAcComponent, LuxAutofocusDirective]
})
class LuxAutoFocusChipsComponent {}

@Component({
  selector: 'lux-autofocus-test-datepicker',
  template: `<lux-datepicker-ac luxAutofocus></lux-datepicker-ac>`,
  imports: [LuxDatepickerAcComponent, LuxAutofocusDirective]
})
class LuxAutoFocusDatePickerComponent {}

@Component({
  selector: 'lux-autofocus-test-datetimepicker',
  template: `<lux-datetimepicker-ac luxAutofocus></lux-datetimepicker-ac>`,
  imports: [LuxDatetimepickerAcComponent, LuxAutofocusDirective]
})
class LuxAutoFocusDateTimePickerComponent {}

@Component({
  selector: 'lux-autofocus-test-fileinput',
  template: `<lux-file-input-ac luxAutofocus></lux-file-input-ac>`,
  imports: [LuxFileInputAcComponent, LuxAutofocusDirective]
})
class LuxAutoFocusFileInputComponent {}

@Component({
  selector: 'lux-autofocus-test-radio',
  template: `<lux-radio-ac [luxOptions]="options" luxAutofocus></lux-radio-ac>`,
  imports: [LuxRadioAcComponent, LuxAutofocusDirective]
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
  template: `<lux-select-ac [luxOptions]="options" luxAutofocus></lux-select-ac>`,
  imports: [LuxSelectAcComponent, LuxAutofocusDirective]
})
class LuxAutoFocusSelectComponent {
  options: { label: string; value: string }[] = [
    { label: 'männlich', value: 'm' },
    { label: 'weiblich', value: 'w' }
  ];
}

@Component({
  selector: 'lux-autofocus-test-textarea',
  template: `<lux-textarea-ac luxAutofocus></lux-textarea-ac>`,
  imports: [LuxTextareaAcComponent, LuxAutofocusDirective]
})
class LuxAutoFocusTextAreaComponent {}

@Component({
  selector: 'lux-autofocus-test-toggle',
  template: `<lux-toggle-ac luxAutofocus></lux-toggle-ac>`,
  imports: [LuxToggleAcComponent, LuxAutofocusDirective]
})
class LuxAutoFocusToggleComponent {}

@Component({
  selector: 'lux-autofocus-test-button',
  template: `<lux-button luxAutofocus></lux-button>`,
  imports: [LuxButtonComponent, LuxAutofocusDirective]
})
class LuxAutoFocusButtonComponent {}

@Component({
  selector: 'lux-autofocus-test-file-list',
  template: `<lux-file-list luxAutofocus></lux-file-list>`,
  imports: [LuxFileListComponent, LuxAutofocusDirective]
})
class LuxAutoFocusFileListComponent {}

@Component({
  selector: 'lux-autofocus-test-file-upload',
  template: `<lux-file-upload luxAutofocus></lux-file-upload>`,
  imports: [LuxFileUploadComponent, LuxAutofocusDirective]
})
class LuxAutoFocusFileUploadComponent {}
