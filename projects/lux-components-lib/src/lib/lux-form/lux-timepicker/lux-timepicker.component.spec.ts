import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTimepickerSelected } from '@angular/material/timepicker';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxA11yTestHelper, LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxDatepickerAcComponent } from '../lux-datepicker-ac/lux-datepicker-ac.component';
import { LuxReferenceControl } from '../lux-form-model/lux-reference-control.interface';
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

  it('sollte einen ISO-Wert ohne Zeitzoneninfo unabhängig von der lokalen Zeitzone auf dieselbe Uhrzeit abbilden', fakeAsync(() => {
    const fixture: ComponentFixture<LuxTimepickerFormTestComponent> = TestBed.createComponent(LuxTimepickerFormTestComponent);
    const testComponent = fixture.componentInstance;
    const timepickerComponent = fixture.debugElement.query(By.directive(LuxTimepickerComponent))
      .componentInstance as LuxTimepickerComponent;

    flush();
    // ISO-String ohne "Z"/Offset (wie z.B. von manchen Backends geliefert)
    testComponent.formControl.setValue('1970-01-01T14:15:00');
    LuxTestHelper.wait(fixture);

    const inputEl: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(timepickerComponent.luxValue).toEqual('1970-01-01T14:15:00.000Z');
    expect(inputEl.value).toEqual('14:15');
  }));

  it('sollte Uhrzeiten an den Tagen der Zeitumstellung korrekt anzeigen', fakeAsync(() => {
    const fixture: ComponentFixture<LuxTimepickerFormTestComponent> = TestBed.createComponent(LuxTimepickerFormTestComponent);
    const testComponent = fixture.componentInstance;
    const timepickerComponent = fixture.debugElement.query(By.directive(LuxTimepickerComponent))
      .componentInstance as LuxTimepickerComponent;

    flush();
    // Die Werte sind UTC-Uhrzeiten. In Europe/Berlin gibt es 02:30 am 28.03.2027 lokal nicht (Umstellung auf Sommerzeit)
    // und die Stunde 02:00 - 03:00 am 31.10.2027 lokal doppelt (Umstellung auf Winterzeit).
    const values = ['2027-03-28T02:30:00.000Z', '2027-10-31T00:30:00.000Z', '2027-10-31T01:30:00.000Z'];

    values.forEach((value) => {
      testComponent.formControl.setValue(value);
      LuxTestHelper.wait(fixture);

      const inputEl: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      expect(timepickerComponent.luxValue).withContext(value).toEqual(value);
      expect(inputEl.value).withContext(value).toEqual(value.substring(11, 16));
    });
  }));

  it('sollte Date-Objekte unabhängig von der lokalen Zeitzone auf dieselbe Uhrzeit abbilden', fakeAsync(() => {
    const fixture: ComponentFixture<LuxTimepickerFormTestComponent> = TestBed.createComponent(LuxTimepickerFormTestComponent);
    const testComponent = fixture.componentInstance;
    const timepickerComponent = fixture.debugElement.query(By.directive(LuxTimepickerComponent))
      .componentInstance as LuxTimepickerComponent;

    flush();
    // In jeder Zeitzone außer UTC liegt einer der beiden Zeitpunkte lokal an einem anderen Tag
    // (östlich von UTC: 23:30, westlich von UTC: 00:30).
    [new Date(Date.UTC(1970, 0, 1, 0, 30)), new Date(Date.UTC(1970, 0, 1, 23, 30))].forEach((value) => {
      const expectedValue = value.toISOString();

      testComponent.formControl.setValue(value as any);
      LuxTestHelper.wait(fixture);

      const inputEl: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      expect(testComponent.formControl.value).withContext(expectedValue).toEqual(expectedValue);
      expect(timepickerComponent.luxValue).withContext(expectedValue).toEqual(expectedValue);
      expect(inputEl.value).withContext(expectedValue).toEqual(expectedValue.substring(11, 16));
    });
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

  it('sollte bei einem Referenzwert ohne Zeitzoneninfo das Datum beim Auswählen einer Zeit übernehmen', fakeAsync(() => {
    const fixture: ComponentFixture<LuxTimepickerCustomReferenceFormTestComponent> = TestBed.createComponent(
      LuxTimepickerCustomReferenceFormTestComponent
    );
    const testComponent = fixture.componentInstance;
    const timepickerComponent = fixture.debugElement.query(By.directive(LuxTimepickerComponent))
      .componentInstance as LuxTimepickerComponent;

    flush();
    LuxTestHelper.wait(fixture);

    const selectedTime = { value: new Date(Date.UTC(1970, 0, 1, 9, 30, 0, 0)) } as MatTimepickerSelected<Date>;

    // In jeder Zeitzone außer UTC liegt einer der beiden Referenzwerte, lokal interpretiert,
    // an einem anderen UTC-Tag (östlich von UTC: 00:00, westlich von UTC: 23:30).
    ['2026-06-18T00:00:00', '2026-06-18T23:30:00'].forEach((referenceValue) => {
      testComponent.referenceControl.formControl?.setValue(referenceValue);
      timepickerComponent.onTimeOptionSelected(selectedTime);
      LuxTestHelper.wait(fixture);

      // Vorbedingung: Der Referenzwert ist weiterhin ohne Zeitzoneninfo, sonst prüft dieser Test nichts
      expect(testComponent.referenceControl.formControl?.value).withContext(referenceValue).toEqual(referenceValue);
      expect(testComponent.timeControl.value).withContext(referenceValue).toEqual('2026-06-18T09:30:00.000Z');
      expect(timepickerComponent.luxValue).withContext(referenceValue).toEqual('2026-06-18T09:30:00.000Z');
    });
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

  describe('A11y', () => {
    let fixture: ComponentFixture<LuxTimepickerA11yComponent>;
    let testComponent: LuxTimepickerA11yComponent;

    beforeAll(() => {
      LuxA11yTestHelper.addA11yMatchers();
    });

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(LuxTimepickerA11yComponent);
      fixture.detectChanges();
      testComponent = fixture.componentInstance;
    }));

    it('sollte keine Barrierefreiheitsverletzungen haben (leer)', async () => {
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (disabled)', async () => {
      testComponent.disabled = true;
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (readonly)', async () => {
      testComponent.readonly = true;
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (required)', async () => {
      testComponent.required = true;
      fixture.detectChanges();
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });
  });
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
      <lux-timepicker luxLabel="Zeit" luxControlBinding="time" [luxReferenceControl]="referenceControl"></lux-timepicker>
    </div>
  `,
  imports: [ReactiveFormsModule, LuxTimepickerComponent]
})
class LuxTimepickerCustomReferenceFormTestComponent {
  // Eigenes Referenz-Control mit einem Wert ohne "Z"/Offset (z.B. java.time.LocalDateTime).
  // Anders als der LUX-Datepicker normalisiert es den Wert nicht auf UTC.
  referenceControl: LuxReferenceControl = { formControl: new FormControl<any>('2026-06-18T00:00:00') };

  form = new FormGroup({
    time: new FormControl<string | null>(null, { updateOn: 'blur' })
  });

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

@Component({
  template: `
    <lux-timepicker luxLabel="Zeit" [luxDisabled]="disabled" [luxReadonly]="readonly" [luxRequired]="required"></lux-timepicker>
  `,
  imports: [LuxTimepickerComponent]
})
class LuxTimepickerA11yComponent {
  disabled = false;
  readonly = false;
  required = false;
}
