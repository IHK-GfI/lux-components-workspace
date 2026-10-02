import { describe, it, beforeAll, beforeEach, afterEach, expect, vi } from 'vitest';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTimepickerSelected } from '@angular/material/timepicker';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxA11yTestHelper, LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../../testing/transloco-test.provider';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxDatepickerComponent } from '../lux-datepicker/lux-datepicker.component';
import { LuxReferenceControl } from '../lux-form-model/lux-reference-control.interface';
import { LuxTimepickerComponent } from './lux-timepicker.component';

describe('LuxTimepickerComponent', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        provideNoopAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting()
      ]
    }).compileComponents();
  });

  afterEach(async () => {
    if (vi.isFakeTimers()) {
      await vi.runAllTimersAsync();
    }
    vi.useRealTimers();
  });

  it('sollte einen ISO-Wert aus dem Formular anzeigen und beibehalten', async () => {
    const fixture: ComponentFixture<LuxTimepickerFormTestComponent> = TestBed.createComponent(LuxTimepickerFormTestComponent);
    const testComponent = fixture.componentInstance;
    const timepickerComponent = fixture.debugElement.query(By.directive(LuxTimepickerComponent))
      .componentInstance as LuxTimepickerComponent;

    await LuxTestHelper.wait(fixture);
    testComponent.formControl.setValue('1970-01-01T14:15:00.000Z');
    await LuxTestHelper.wait(fixture);

    const inputEl: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(testComponent.formControl.value).toEqual('1970-01-01T14:15:00.000Z');
    expect(timepickerComponent.value()).toEqual('1970-01-01T14:15:00.000Z');
    expect(inputEl.value).toEqual('14:15');
  });

  it('sollte einen ISO-Wert ohne Zeitzoneninfo unabhängig von der lokalen Zeitzone auf dieselbe Uhrzeit abbilden', async () => {
    const fixture: ComponentFixture<LuxTimepickerFormTestComponent> = TestBed.createComponent(LuxTimepickerFormTestComponent);
    const testComponent = fixture.componentInstance;
    const timepickerComponent = fixture.debugElement.query(By.directive(LuxTimepickerComponent))
      .componentInstance as LuxTimepickerComponent;

    await LuxTestHelper.wait(fixture);
    // ISO-String ohne "Z"/Offset (wie z.B. von manchen Backends geliefert)
    testComponent.formControl.setValue('1970-01-01T14:15:00');
    await LuxTestHelper.wait(fixture);

    const inputEl: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(timepickerComponent.value()).toEqual('1970-01-01T14:15:00.000Z');
    expect(inputEl.value).toEqual('14:15');
  });

  it('sollte Uhrzeiten an den Tagen der Zeitumstellung korrekt anzeigen', async () => {
    const fixture: ComponentFixture<LuxTimepickerFormTestComponent> = TestBed.createComponent(LuxTimepickerFormTestComponent);
    const testComponent = fixture.componentInstance;
    const timepickerComponent = fixture.debugElement.query(By.directive(LuxTimepickerComponent))
      .componentInstance as LuxTimepickerComponent;

    await LuxTestHelper.wait(fixture);
    // Die Werte sind UTC-Uhrzeiten. In Europe/Berlin gibt es 02:30 am 28.03.2027 lokal nicht (Umstellung auf Sommerzeit)
    // und die Stunde 02:00 - 03:00 am 31.10.2027 lokal doppelt (Umstellung auf Winterzeit).
    const values = ['2027-03-28T02:30:00.000Z', '2027-10-31T00:30:00.000Z', '2027-10-31T01:30:00.000Z'];

    for (const value of values) {
      testComponent.formControl.setValue(value);
      await LuxTestHelper.wait(fixture);

      const inputEl: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      expect(timepickerComponent.value(), value).toEqual(value);
      expect(inputEl.value, value).toEqual(value.substring(11, 16));
    }
  });

  it('sollte Date-Objekte unabhängig von der lokalen Zeitzone auf dieselbe Uhrzeit abbilden', async () => {
    const fixture: ComponentFixture<LuxTimepickerFormTestComponent> = TestBed.createComponent(LuxTimepickerFormTestComponent);
    const testComponent = fixture.componentInstance;
    const timepickerComponent = fixture.debugElement.query(By.directive(LuxTimepickerComponent))
      .componentInstance as LuxTimepickerComponent;

    await LuxTestHelper.wait(fixture);
    // In jeder Zeitzone außer UTC liegt einer der beiden Zeitpunkte lokal an einem anderen Tag
    // (östlich von UTC: 23:30, westlich von UTC: 00:30).
    for (const value of [new Date(Date.UTC(1970, 0, 1, 0, 30)), new Date(Date.UTC(1970, 0, 1, 23, 30))]) {
      const expectedValue = value.toISOString();

      testComponent.formControl.setValue(value as any);
      await LuxTestHelper.wait(fixture);

      const inputEl: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      expect(testComponent.formControl.value, expectedValue).toEqual(expectedValue);
      expect(timepickerComponent.value(), expectedValue).toEqual(expectedValue);
      expect(inputEl.value, expectedValue).toEqual(expectedValue.substring(11, 16));
    }
  });

  it('sollte eine manuelle Texteingabe im FormControl übernehmen und dirty markieren', async () => {
    // Regressionstest: MatTimepickerInput hat (anders als MatDatepickerInput) kein (dateInput)/
    // (dateChange)-Output, sondern legt getippte Werte ausschließlich in seinem eigenen
    // value-Model ab. Ohne (valueChange)-Anbindung in der Komponente kam eine Texteingabe nie im
    // FormControl an - ein einmal gesetzter Wert blieb dauerhaft stehen und wurde nie dirty.
    const fixture: ComponentFixture<LuxTimepickerFormTestComponent> = TestBed.createComponent(LuxTimepickerFormTestComponent);
    const testComponent = fixture.componentInstance;

    await LuxTestHelper.wait(fixture);
    testComponent.formControl.setValue('1970-01-01T14:15:00.000Z');
    await LuxTestHelper.wait(fixture);

    const inputEl: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(testComponent.formControl.dirty).toBe(false);

    LuxTestHelper.typeInElement(inputEl, '09:15');
    await LuxTestHelper.wait(fixture);

    expect(testComponent.formControl.value).toEqual('1970-01-01T09:15:00.000Z');
    expect(testComponent.formControl.dirty).toBe(true);
  });

  it('sollte bei referenziertem Datepicker das Datum beim Auswählen einer Zeit übernehmen', async () => {
    const fixture: ComponentFixture<LuxTimepickerReferenceFormTestComponent> = TestBed.createComponent(
      LuxTimepickerReferenceFormTestComponent
    );
    const testComponent = fixture.componentInstance;
    const timepickerComponent = fixture.debugElement.query(By.directive(LuxTimepickerComponent))
      .componentInstance as LuxTimepickerComponent;

    await LuxTestHelper.wait(fixture);
    testComponent.dateControl.setValue('2026-06-18T00:00:00.000Z');
    await LuxTestHelper.wait(fixture);

    const selectedTime = { value: new Date(Date.UTC(1970, 0, 1, 9, 30, 0, 0)) } as MatTimepickerSelected<Date>;
    timepickerComponent.onTimeOptionSelected(selectedTime);
    await LuxTestHelper.wait(fixture);

    expect(testComponent.timeControl.value).toEqual('2026-06-18T09:30:00.000Z');
    expect(timepickerComponent.value()).toEqual('2026-06-18T09:30:00.000Z');
  });

  it('sollte bei einem Referenzwert ohne Zeitzoneninfo das Datum beim Auswählen einer Zeit übernehmen', async () => {
    const fixture: ComponentFixture<LuxTimepickerCustomReferenceFormTestComponent> = TestBed.createComponent(
      LuxTimepickerCustomReferenceFormTestComponent
    );
    const testComponent = fixture.componentInstance;
    const timepickerComponent = fixture.debugElement.query(By.directive(LuxTimepickerComponent))
      .componentInstance as LuxTimepickerComponent;

    await LuxTestHelper.wait(fixture);
    await LuxTestHelper.wait(fixture);

    const selectedTime = { value: new Date(Date.UTC(1970, 0, 1, 9, 30, 0, 0)) } as MatTimepickerSelected<Date>;

    // In jeder Zeitzone außer UTC liegt einer der beiden Referenzwerte, lokal interpretiert,
    // an einem anderen UTC-Tag (östlich von UTC: 00:00, westlich von UTC: 23:30).
    for (const referenceValue of ['2026-06-18T00:00:00', '2026-06-18T23:30:00']) {
      testComponent.referenceControl.formControl?.setValue(referenceValue);
      timepickerComponent.onTimeOptionSelected(selectedTime);
      await LuxTestHelper.wait(fixture);

      // Vorbedingung: Der Referenzwert ist weiterhin ohne Zeitzoneninfo, sonst prüft dieser Test nichts
      expect(testComponent.referenceControl.formControl?.value, referenceValue).toEqual(referenceValue);
      expect(testComponent.timeControl.value, referenceValue).toEqual('2026-06-18T09:30:00.000Z');
      expect(timepickerComponent.value(), referenceValue).toEqual('2026-06-18T09:30:00.000Z');
    }
  });

  it('sollte die Kombination ohne Reactive-Form synchron halten', async () => {
    const fixture: ComponentFixture<LuxTimepickerCombinedNoFormTestComponent> = TestBed.createComponent(
      LuxTimepickerCombinedNoFormTestComponent
    );
    const testComponent = fixture.componentInstance;
    const datepickerComponent = fixture.debugElement.query(By.directive(LuxDatepickerComponent))
      .componentInstance as LuxDatepickerComponent;
    const timepickerComponent = fixture.debugElement.query(By.directive(LuxTimepickerComponent))
      .componentInstance as LuxTimepickerComponent;

    await LuxTestHelper.wait(fixture);

    const inputEls: HTMLInputElement[] = fixture.debugElement.queryAll(By.css('input')).map((debugEl) => debugEl.nativeElement);
    expect(testComponent.combinedISO).toEqual('2026-06-18T14:15:00.000Z');
    expect(LuxUtil.stringWithoutASCIIChars(inputEls[0].value)).toEqual('18.06.2026');
    expect(inputEls[1].value).toEqual('14:15');

    const selectedTime = { value: new Date(Date.UTC(1970, 0, 1, 9, 30, 0, 0)) } as MatTimepickerSelected<Date>;
    timepickerComponent.onTimeOptionSelected(selectedTime);
    await LuxTestHelper.wait(fixture);

    expect(testComponent.combinedISO).toEqual('2026-06-18T09:30:00.000Z');
    expect(datepickerComponent.value()).toEqual('2026-06-18T09:30:00.000Z');
    expect(timepickerComponent.value()).toEqual('2026-06-18T09:30:00.000Z');
  });

  it('sollte luxMinTime/luxMaxTime auch ohne Formular (Freistehend) als Fehler melden', async () => {
    // Regressionstest: MatTimepickerInput.validate() liest die Gültigkeit ausschließlich aus internen
    // Flags, die nur asynchron per effect() aktualisiert werden (siehe validateTime()-Kommentar in
    // LuxTimepickerComponent) - syncTimepickerValidation() rief updateValueAndValidity() bisher aber
    // synchron direkt danach auf und las deshalb immer den Stand VOR der aktuellen Eingabe.
    // luxMinTime/luxMaxTime wurden dadurch nie gemeldet. Zusätzlich blieb isInvalid() im
    // Signal-Forms-/Freistehend-Betrieb strukturell leer, weil stateOverride dort bewusst nie gesetzt
    // wird (siehe LuxLegacyFormBridge.engaged) - ohne internalErrors() in LuxFormControlBase käme die
    // Prüfung dort nie an.
    const fixture: ComponentFixture<LuxTimepickerMinMaxTestComponent> = TestBed.createComponent(LuxTimepickerMinMaxTestComponent);
    const timepickerComponent = fixture.debugElement.query(By.directive(LuxTimepickerComponent))
      .componentInstance as LuxTimepickerComponent;

    await LuxTestHelper.wait(fixture);

    const inputEl: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;

    LuxTestHelper.typeInElement(inputEl, '20:00');
    await LuxTestHelper.wait(fixture);
    expect(timepickerComponent.isInvalid()).toBe(true);
    expect(timepickerComponent.errorMessage()).toBeTruthy();

    LuxTestHelper.typeInElement(inputEl, '05:00');
    await LuxTestHelper.wait(fixture);
    expect(timepickerComponent.isInvalid()).toBe(true);
    expect(timepickerComponent.errorMessage()).toBeTruthy();

    LuxTestHelper.typeInElement(inputEl, '10:00');
    await LuxTestHelper.wait(fixture);
    expect(timepickerComponent.isInvalid()).toBe(false);
  });

  it('sollte die Kombination in Reactive-Form mit gemeinsamem Control synchron halten', async () => {
    const fixture: ComponentFixture<LuxTimepickerCombinedFormTestComponent> = TestBed.createComponent(
      LuxTimepickerCombinedFormTestComponent
    );
    const testComponent = fixture.componentInstance;
    const datepickerComponent = fixture.debugElement.query(By.directive(LuxDatepickerComponent))
      .componentInstance as LuxDatepickerComponent;
    const timepickerComponent = fixture.debugElement.query(By.directive(LuxTimepickerComponent))
      .componentInstance as LuxTimepickerComponent;

    await LuxTestHelper.wait(fixture);

    expect(datepickerComponent.formControl).toBe(timepickerComponent.formControl);
    const inputEls: HTMLInputElement[] = fixture.debugElement.queryAll(By.css('input')).map((debugEl) => debugEl.nativeElement);
    expect(testComponent.combinedControl.value).toEqual('2026-06-18T14:15:00.000Z');
    expect(LuxUtil.stringWithoutASCIIChars(inputEls[0].value)).toEqual('18.06.2026');
    expect(inputEls[1].value).toEqual('14:15');

    const selectedTime = { value: new Date(Date.UTC(1970, 0, 1, 9, 30, 0, 0)) } as MatTimepickerSelected<Date>;
    timepickerComponent.onTimeOptionSelected(selectedTime);
    await LuxTestHelper.wait(fixture);

    expect(testComponent.combinedControl.value).toEqual('2026-06-18T09:30:00.000Z');
    expect(datepickerComponent.value()).toEqual('2026-06-18T09:30:00.000Z');
    expect(timepickerComponent.value()).toEqual('2026-06-18T09:30:00.000Z');
  });

  describe('Geteiltes FormControl (mehrere Instanzen)', () => {
    // Regressionstest: Zwei lux-timepicker-Instanzen an demselben luxControlBinding-Control lösten
    // vor dem Fix in syncTimepickerValidation() (updateValueAndValidity() ohne emitEvent:false)
    // einen synchronen Stack-Overflow aus - jede Instanz hat ihren eigenen valueChangesRunning-
    // Reentrancy-Guard, der die jeweils ANDERE Instanz nicht vor der Rückkopplung über das geteilte
    // FormControl schützt. Der reine Ablauf dieses Tests (kein "Maximum call stack size exceeded")
    // ist die eigentliche Absicherung.
    it('sollte mit einem vorbelegten Wert rendern, ohne in eine Endlosschleife zu laufen', async () => {
      const fixture: ComponentFixture<LuxTimepickerSharedControlComponent> = TestBed.createComponent(LuxTimepickerSharedControlComponent);
      const testComponent = fixture.componentInstance;

      await LuxTestHelper.wait(fixture);

      const timepickerComponents = fixture.debugElement
        .queryAll(By.directive(LuxTimepickerComponent))
        .map((debugEl) => debugEl.componentInstance as LuxTimepickerComponent);
      expect(timepickerComponents.length).toEqual(2);
      expect(testComponent.form.get('time')!.value).toEqual('1970-01-01T14:15:00.000Z');
      expect(timepickerComponents[0].value()).toEqual('1970-01-01T14:15:00.000Z');
      expect(timepickerComponents[1].value()).toEqual('1970-01-01T14:15:00.000Z');
    });

    it('sollte eine Texteingabe in der ersten Instanz im gemeinsamen FormControl übernehmen, ohne in eine Endlosschleife zu laufen', async () => {
      const fixture: ComponentFixture<LuxTimepickerSharedControlComponent> = TestBed.createComponent(LuxTimepickerSharedControlComponent);
      const testComponent = fixture.componentInstance;

      await LuxTestHelper.wait(fixture);

      const inputEls: HTMLInputElement[] = fixture.debugElement.queryAll(By.css('input')).map((debugEl) => debugEl.nativeElement);
      LuxTestHelper.typeInElement(inputEls[0], '09:15');
      await LuxTestHelper.wait(fixture);

      // Das geteilte FormControl ist die maßgebliche Quelle (beide Instanzen lesen dieselbe
      // Objektreferenz) - die Anzeige der jeweils ANDEREN Instanz aktualisiert sich dagegen nicht
      // automatisch mit, weil setISOValue() ohne luxReferenceControl bewusst mit emitEvent:false
      // schreibt (siehe dortige Begründung). Das ist unverändertes Bestandsverhalten, nicht Teil
      // dieser Regressionsabsicherung.
      expect(testComponent.form.get('time')!.value).toEqual('1970-01-01T09:15:00.000Z');
    });
  });

  describe('A11y', () => {
    let fixture: ComponentFixture<LuxTimepickerA11yComponent>;
    let testComponent: LuxTimepickerA11yComponent;

    beforeAll(() => {
      LuxA11yTestHelper.addA11yMatchers();
    });

    beforeEach(async () => {
      fixture = TestBed.createComponent(LuxTimepickerA11yComponent);
      await LuxTestHelper.wait(fixture);
      testComponent = fixture.componentInstance;
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (leer)', async () => {
      await LuxTestHelper.wait(fixture);
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (disabled)', async () => {
      testComponent.disabled = true;
      await LuxTestHelper.wait(fixture);
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (readonly)', async () => {
      testComponent.readonly = true;
      await LuxTestHelper.wait(fixture);
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('sollte keine Barrierefreiheitsverletzungen haben (required)', async () => {
      testComponent.required = true;
      await LuxTestHelper.wait(fixture);
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
    <lux-datepicker luxLabel="Datum" [luxReferenceControl]="timepicker" [(luxValue)]="combinedISO" #datepicker></lux-datepicker>
    <lux-timepicker luxLabel="Zeit" [luxReferenceControl]="datepicker" [(luxValue)]="combinedISO" #timepicker></lux-timepicker>
  `,
  imports: [LuxDatepickerComponent, LuxTimepickerComponent]
})
class LuxTimepickerCombinedNoFormTestComponent {
  combinedISO = '2026-06-18T14:15:00.000Z';
}

@Component({
  template: `<lux-timepicker luxLabel="Zeit" [(value)]="value" luxMinTime="08:00" luxMaxTime="19:00"></lux-timepicker>`,
  imports: [LuxTimepickerComponent]
})
class LuxTimepickerMinMaxTestComponent {
  value: string | null = null;
}

@Component({
  template: `
    <div [formGroup]="form">
      <lux-datepicker luxLabel="Datum" luxControlBinding="date" [luxReferenceControl]="timepicker" #datepicker></lux-datepicker>
      <lux-timepicker luxLabel="Zeit" luxControlBinding="time" [luxReferenceControl]="datepicker" #timepicker></lux-timepicker>
    </div>
  `,
  imports: [ReactiveFormsModule, LuxDatepickerComponent, LuxTimepickerComponent]
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
      <lux-datepicker luxLabel="Datum" luxControlBinding="combined" [luxReferenceControl]="timepicker" #datepicker></lux-datepicker>
      <lux-timepicker luxLabel="Zeit" luxControlBinding="combined" [luxReferenceControl]="datepicker" #timepicker></lux-timepicker>
    </div>
  `,
  imports: [ReactiveFormsModule, LuxDatepickerComponent, LuxTimepickerComponent]
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
    <div [formGroup]="form">
      <lux-timepicker luxLabel="Zeit (Ansicht 1)" luxControlBinding="time"></lux-timepicker>
      <lux-timepicker luxLabel="Zeit (Ansicht 2)" luxControlBinding="time"></lux-timepicker>
    </div>
  `,
  imports: [ReactiveFormsModule, LuxTimepickerComponent]
})
class LuxTimepickerSharedControlComponent {
  // Der vorbelegte Wert ist entscheidend: ngOnInit() normalisiert ihn direkt (nicht über den
  // valueChangesRunning-Reentrancy-Guard abgesichert) und löste darüber den Stack-Overflow aus.
  readonly form = new FormGroup({
    time: new FormControl<string | null>('1970-01-01T14:15:00.000Z')
  });
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
