import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTimepickerSelected } from '@angular/material/timepicker';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxTestHelper } from '../../lux-util/testing/lux-test-helper';
import { LuxDatepickerAcComponent } from '../lux-datepicker-ac/lux-datepicker-ac.component';
import { LuxTimepickerComponent } from './lux-timepicker.component';

describe('LuxTimepickerComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        provideNoopAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  }));

  it('sollte einen ISO-Wert aus dem Formular anzeigen und beibehalten', fakeAsync(() => {
    const fixture: ComponentFixture<LuxTimepickerFormTestComponent> = TestBed.createComponent(LuxTimepickerFormTestComponent);
    const testComponent = fixture.componentInstance;
    const timepickerComponent = fixture.debugElement.query(By.directive(LuxTimepickerComponent))
      .componentInstance as LuxTimepickerComponent;

    flush();
    testComponent.formControl.setValue('1970-01-01T14:15:00.000Z');
    LuxTestHelper.wait(fixture);

    const inputEl: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(testComponent.formControl.value).toEqual('1970-01-01T14:15:00.000Z');
    expect(timepickerComponent.luxValue).toEqual('1970-01-01T14:15:00.000Z');
    expect(inputEl.value).toEqual('14:15');
  }));

  it('sollte bei referenziertem Datepicker das Datum beim Auswählen einer Zeit übernehmen', fakeAsync(() => {
    const fixture: ComponentFixture<LuxTimepickerReferenceFormTestComponent> = TestBed.createComponent(
      LuxTimepickerReferenceFormTestComponent
    );
    const testComponent = fixture.componentInstance;
    const timepickerComponent = fixture.debugElement.query(By.directive(LuxTimepickerComponent))
      .componentInstance as LuxTimepickerComponent;

    flush();
    testComponent.dateControl.setValue('2026-06-18T00:00:00.000Z');
    LuxTestHelper.wait(fixture);

    const selectedTime = { value: new Date(Date.UTC(1970, 0, 1, 9, 30, 0, 0)) } as MatTimepickerSelected<Date>;
    timepickerComponent.onTimeOptionSelected(selectedTime);
    LuxTestHelper.wait(fixture);

    expect(testComponent.timeControl.value).toEqual('2026-06-18T09:30:00.000Z');
    expect(timepickerComponent.luxValue).toEqual('2026-06-18T09:30:00.000Z');
  }));

  it('sollte die Kombination ohne Reactive-Form synchron halten', fakeAsync(() => {
    const fixture: ComponentFixture<LuxTimepickerCombinedNoFormTestComponent> = TestBed.createComponent(
      LuxTimepickerCombinedNoFormTestComponent
    );
    const testComponent = fixture.componentInstance;
    const datepickerComponent = fixture.debugElement.query(By.directive(LuxDatepickerAcComponent))
      .componentInstance as LuxDatepickerAcComponent;
    const timepickerComponent = fixture.debugElement.query(By.directive(LuxTimepickerComponent))
      .componentInstance as LuxTimepickerComponent;

    flush();
    LuxTestHelper.wait(fixture);

    const inputEls: HTMLInputElement[] = fixture.debugElement.queryAll(By.css('input')).map((debugEl) => debugEl.nativeElement);
    expect(testComponent.combinedISO).toEqual('2026-06-18T14:15:00.000Z');
    expect(LuxUtil.stringWithoutASCIIChars(inputEls[0].value)).toEqual('18.06.2026');
    expect(inputEls[1].value).toEqual('14:15');

    const selectedTime = { value: new Date(Date.UTC(1970, 0, 1, 9, 30, 0, 0)) } as MatTimepickerSelected<Date>;
    timepickerComponent.onTimeOptionSelected(selectedTime);
    LuxTestHelper.wait(fixture);

    expect(testComponent.combinedISO).toEqual('2026-06-18T09:30:00.000Z');
    expect(datepickerComponent.luxValue).toEqual('2026-06-18T09:30:00.000Z');
    expect(timepickerComponent.luxValue).toEqual('2026-06-18T09:30:00.000Z');
  }));

  it('sollte die Kombination in Reactive-Form mit gemeinsamem Control synchron halten', fakeAsync(() => {
    const fixture: ComponentFixture<LuxTimepickerCombinedFormTestComponent> = TestBed.createComponent(
      LuxTimepickerCombinedFormTestComponent
    );
    const testComponent = fixture.componentInstance;
    const datepickerComponent = fixture.debugElement.query(By.directive(LuxDatepickerAcComponent))
      .componentInstance as LuxDatepickerAcComponent;
    const timepickerComponent = fixture.debugElement.query(By.directive(LuxTimepickerComponent))
      .componentInstance as LuxTimepickerComponent;

    flush();
    LuxTestHelper.wait(fixture);

    expect(datepickerComponent.formControl).toBe(timepickerComponent.formControl);
    const inputEls: HTMLInputElement[] = fixture.debugElement.queryAll(By.css('input')).map((debugEl) => debugEl.nativeElement);
    expect(testComponent.combinedControl.value).toEqual('2026-06-18T14:15:00.000Z');
    expect(LuxUtil.stringWithoutASCIIChars(inputEls[0].value)).toEqual('18.06.2026');
    expect(inputEls[1].value).toEqual('14:15');

    const selectedTime = { value: new Date(Date.UTC(1970, 0, 1, 9, 30, 0, 0)) } as MatTimepickerSelected<Date>;
    timepickerComponent.onTimeOptionSelected(selectedTime);
    LuxTestHelper.wait(fixture);

    expect(testComponent.combinedControl.value).toEqual('2026-06-18T09:30:00.000Z');
    expect(datepickerComponent.luxValue).toEqual('2026-06-18T09:30:00.000Z');
    expect(timepickerComponent.luxValue).toEqual('2026-06-18T09:30:00.000Z');
  }));
});

@Component({
  template: `
    <div [formGroup]="form">
      <lux-timepicker luxLabel="Zeit" luxControlBinding="time"></lux-timepicker>
    </div>
  `,
  imports: [ReactiveFormsModule, LuxTimepickerComponent]
})
class LuxTimepickerFormTestComponent {
  form = new FormGroup({
    time: new FormControl<string | null>(null)
  });

  get formControl() {
    return this.form.get('time') as FormControl<string | null>;
  }
}

@Component({
  template: `
    <lux-datepicker-ac luxLabel="Datum" [luxReferenceControl]="timepicker" [(luxValue)]="combinedISO" #datepicker></lux-datepicker-ac>
    <lux-timepicker luxLabel="Zeit" [luxReferenceControl]="datepicker" [(luxValue)]="combinedISO" #timepicker></lux-timepicker>
  `,
  imports: [LuxDatepickerAcComponent, LuxTimepickerComponent]
})
class LuxTimepickerCombinedNoFormTestComponent {
  combinedISO = '2026-06-18T14:15:00.000Z';
}

@Component({
  template: `
    <div [formGroup]="form">
      <lux-datepicker-ac luxLabel="Datum" luxControlBinding="date" [luxReferenceControl]="timepicker" #datepicker></lux-datepicker-ac>
      <lux-timepicker luxLabel="Zeit" luxControlBinding="time" [luxReferenceControl]="datepicker" #timepicker></lux-timepicker>
    </div>
  `,
  imports: [ReactiveFormsModule, LuxDatepickerAcComponent, LuxTimepickerComponent]
})
class LuxTimepickerReferenceFormTestComponent {
  form = new FormGroup({
    date: new FormControl<string | null>(null),
    time: new FormControl<string | null>(null, { updateOn: 'blur' })
  });

  get dateControl() {
    return this.form.get('date') as FormControl<string | null>;
  }

  get timeControl() {
    return this.form.get('time') as FormControl<string | null>;
  }
}

@Component({
  template: `
    <div [formGroup]="form">
      <lux-datepicker-ac luxLabel="Datum" luxControlBinding="combined" [luxReferenceControl]="timepicker" #datepicker></lux-datepicker-ac>
      <lux-timepicker luxLabel="Zeit" luxControlBinding="combined" [luxReferenceControl]="datepicker" #timepicker></lux-timepicker>
    </div>
  `,
  imports: [ReactiveFormsModule, LuxDatepickerAcComponent, LuxTimepickerComponent]
})
class LuxTimepickerCombinedFormTestComponent {
  form = new FormGroup({
    combined: new FormControl<string | null>('2026-06-18T14:15:00.000Z', { updateOn: 'blur' })
  });

  get combinedControl() {
    return this.form.get('combined') as FormControl<string | null>;
  }
}
