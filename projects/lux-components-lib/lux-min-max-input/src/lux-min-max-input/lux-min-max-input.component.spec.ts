import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { LuxDatepickerAcComponent, LuxInputAcComponent } from '@ihk-gfi/lux-components';
import { LuxA11yTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { provideLuxTranslocoTesting } from '../../../src/testing/transloco-test.provider';
import { LuxMinMaxInputComponent } from './lux-min-max-input.component';
import { LuxMinMaxType, LuxMinMaxValue } from './lux-min-max-input-types';

const PROVIDERS = [
  provideNoopAnimations(),
  provideHttpClient(withInterceptorsFromDi()),
  provideHttpClientTesting(),
  provideLuxTranslocoTesting()
];

const settleFixture = async (fixture: ComponentFixture<unknown>): Promise<void> => {
  fixture.detectChanges();
  await fixture.whenStable();
  await new Promise((resolve) => setTimeout(resolve));
  fixture.detectChanges();
  await fixture.whenStable();
  fixture.detectChanges();
};

const allInputs = (fixture: ComponentFixture<unknown>): HTMLInputElement[] =>
  fixture.debugElement.queryAll(By.css('input')).map((el) => el.nativeElement as HTMLInputElement);

describe('LuxMinMaxInputComponent', () => {
  let fixture: ComponentFixture<LuxMinMaxInputComponent>;
  let emitted: LuxMinMaxValue<number | string>[];

  const settle = (): Promise<void> => settleFixture(fixture);

  const setup = async (inputs: Record<string, unknown> = {}, initial?: LuxMinMaxValue<number | string>): Promise<void> => {
    TestBed.configureTestingModule({ imports: [LuxMinMaxInputComponent], providers: PROVIDERS });
    fixture = TestBed.createComponent(LuxMinMaxInputComponent);
    emitted = [];
    fixture.componentInstance.luxValue.subscribe((value) => emitted.push(value));
    if (initial) {
      fixture.componentRef.setInput('luxValue', initial);
    }
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    await settle();
  };

  const inputs = (): HTMLInputElement[] => allInputs(fixture);

  const typeInto = async (index: number, text: string): Promise<void> => {
    const input = inputs()[index];
    input.value = text;
    input.dispatchEvent(new Event('input'));
    await settle();
  };

  const blur = async (index: number): Promise<void> => {
    inputs()[index].dispatchEvent(new Event('blur'));
    await settle();
  };

  const messageElement = (): HTMLElement => fixture.debugElement.query(By.css('p.lux-min-max-input__message')).nativeElement as HTMLElement;

  const messageText = (): string => messageElement().textContent?.trim() ?? '';

  const fieldErrorLines = (): number => fixture.debugElement.queryAll(By.css('mat-error')).length;

  const invalidStates = (): (string | null)[] => inputs().map((el) => el.getAttribute('aria-invalid'));

  const isMarked = (): boolean[] =>
    fixture.debugElement
      .queryAll(By.css('.lux-form-control-wrapper'))
      .map((el) => (el.nativeElement as HTMLElement).classList.contains('lux-form-control-error-authentic'));

  const pickers = (): LuxDatepickerAcComponent[] =>
    fixture.debugElement.queryAll(By.directive(LuxDatepickerAcComponent)).map((el) => el.componentInstance as LuxDatepickerAcComponent);

  const fieldType = (luxType: LuxMinMaxType): Promise<void> => setup({ luxType });

  describe('number', () => {
    it('Sollte nur das Bis-Feld markieren, wenn es unter dem Von-Wert verlassen wird, und nach der Korrektur emittieren', async () => {
      await setup();
      await typeInto(0, '200');
      await blur(0);
      await typeInto(1, '100');
      await blur(1);

      expect(messageText()).toBe('Bis 100 darf nicht kleiner als Von 200 sein.');
      expect(invalidStates()).toEqual(['false', 'true']);
      expect(fieldErrorLines()).toBe(0);
      expect(emitted.at(-1)).toEqual({ min: 200 });

      await typeInto(1, '300');

      expect(messageText()).toBe('');
      expect(emitted.at(-1)).toEqual({ min: 200, max: 300 });
      expect(invalidStates()).toEqual(['false', 'false']);
    });

    it('Sollte nur das Von-Feld markieren, wenn es über dem Bis-Wert verlassen wird', async () => {
      await setup();
      await typeInto(1, '100');
      await blur(1);
      await typeInto(0, '200');
      await blur(0);

      expect(messageText()).toBe('Von 200 darf nicht größer als Bis 100 sein.');
      expect(invalidStates()).toEqual(['true', 'false']);
      expect(emitted.at(-1)).toEqual({ max: 100 });
    });

    it('Sollte beim Tippen nie eine Meldung erzeugen und sie löschen, sobald das Paar gültig wird', async () => {
      await setup();
      await typeInto(0, '5');
      await blur(0);
      await typeInto(1, '1');
      expect(messageText()).toBe('');

      await blur(1);
      expect(messageText()).toBe('Bis 1 darf nicht kleiner als Von 5 sein.');

      await typeInto(1, '10');
      expect(messageText()).toBe('');
    });

    it('Sollte die Meldung löschen, wenn die Änderung im Nachbarfeld das Paar gültig macht', async () => {
      await setup();
      await typeInto(0, '200');
      await blur(0);
      await typeInto(1, '100');
      await blur(1);
      expect(messageText()).not.toBe('');

      await typeInto(0, '50');

      expect(messageText()).toBe('');
      expect(invalidStates()).toEqual(['false', 'false']);
    });

    it('Sollte Feld und zulässigen Bereich nennen, den Wert behalten und nicht emittieren', async () => {
      await setup({ luxBounds: { min: 0, max: 100 } });
      await typeInto(0, '150');
      await blur(0);

      expect(messageText()).toBe('Von: Zulässig sind Werte von 0 bis 100.');
      expect(inputs()[0].value).toBe('150');
      expect(emitted).toEqual([]);
    });

    it('Sollte einseitige Meldungen nutzen und die Emission zurückhalten, auch wenn das Feld nie als ungültig gezeigt wurde', async () => {
      await setup({ luxBounds: { min: 0 } });
      await typeInto(0, '-3');
      expect(emitted).toEqual([]);
      expect(messageText()).toBe('');

      await blur(0);
      expect(messageText()).toBe('Von: Der Wert muss mindestens 0 sein.');
      expect(emitted).toEqual([]);
    });

    it('Sollte luxMaxFieldBounds nur auf das Bis-Feld anwenden, innerhalb von luxBounds', async () => {
      await setup({ luxBounds: { min: 0 }, luxMaxFieldBounds: { min: 10, max: 20 } });
      await typeInto(0, '1');
      await blur(0);
      expect(messageText()).toBe('');

      await typeInto(1, '5');
      await blur(1);
      expect(messageText()).toBe('Bis: Zulässig sind Werte von 10 bis 20.');
      expect(emitted.at(-1)).toEqual({ min: 1 });
    });

    it('Sollte luxMaxFieldBounds mit luxBounds schneiden, die engere Grenze gewinnt', async () => {
      await setup({ luxBounds: { min: 0, max: 100 }, luxMaxFieldBounds: { max: 150 } });
      await typeInto(1, '120');
      await blur(1);

      expect(messageText()).toBe('Bis: Zulässig sind Werte von 0 bis 100.');
    });

    it('Sollte luxMinFieldBounds nur auf das Von-Feld anwenden, innerhalb von luxBounds', async () => {
      await setup({ luxBounds: { max: 100 }, luxMinFieldBounds: { max: 50 } });
      await typeInto(1, '70');
      await blur(1);
      expect(messageText()).toBe('');

      await typeInto(0, '60');
      await blur(0);

      expect(messageText()).toBe('Von: Der Wert darf höchstens 50 sein.');
    });

    it('Sollte das Feld bei Bereichs- und Grenzfehlern rot markieren und die Markierung nach der Korrektur entfernen', async () => {
      await setup({ luxBounds: { min: 0 } });
      await typeInto(0, '200');
      await blur(0);
      await typeInto(1, '100');
      await blur(1);

      expect(isMarked()).toEqual([false, true]);

      await typeInto(1, '300');
      expect(isMarked()).toEqual([false, false]);

      await typeInto(0, '-1');
      await blur(0);
      expect(isMarked()).toEqual([true, false]);
    });

    it('Sollte das geprüfte Feld nicht erneut markieren, wenn der alte Wert zurückgetippt wird', async () => {
      await setup();
      await typeInto(0, '200');
      await blur(0);
      await typeInto(1, '100');
      await blur(1);
      expect(invalidStates()).toEqual(['false', 'true']);

      await typeInto(1, '10');
      await typeInto(1, '100');

      expect(messageText()).toBe('');
      expect(invalidStates()).toEqual(['false', 'false']);

      await blur(1);
      expect(messageText()).toBe('Bis 100 darf nicht kleiner als Von 200 sein.');
    });

    it('Sollte die Meldung des anderen Feldes behalten, wenn ein fehlerfreies Feld verlassen wird', async () => {
      await setup({ luxBounds: { max: 100 } });
      await typeInto(1, '150');
      await blur(1);
      expect(messageText()).toBe('Bis: Der Wert darf höchstens 100 sein.');

      await blur(0);

      expect(messageText()).toBe('Bis: Der Wert darf höchstens 100 sein.');
      expect(invalidStates()).toEqual(['false', 'true']);
    });

    it('Sollte die nativen Attribute jedes Feldes durch den Nachbarwert begrenzen', async () => {
      await setup({ luxBounds: { min: 0, max: 100 } }, { min: 10, max: 80 });

      expect(inputs().map((el) => [el.min, el.max])).toEqual([
        ['0', '80'],
        ['10', '100']
      ]);

      await typeInto(1, '');
      expect(inputs().map((el) => [el.min, el.max])).toEqual([
        ['0', '100'],
        ['10', '100']
      ]);
    });

    it('Sollte die Meldungsregion immer mit der Rolle status rendern', async () => {
      await setup();
      const region = messageElement();

      expect(region.getAttribute('role')).toBe('status');
      expect(region.getAttribute('aria-live')).toBe('polite');
      expect(messageText()).toBe('');
    });

    it('Sollte leere Felder im Wert weglassen, nie 0 oder einen leeren String', async () => {
      await setup();
      await typeInto(1, '5');
      await blur(1);
      expect(emitted.at(-1)).toEqual({ max: 5 });
      expect('min' in emitted.at(-1)!).toBe(false);

      await typeInto(1, '');
      await blur(1);
      expect(emitted.at(-1)).toEqual({});
    });

    it('Sollte das geprüfte Feld neu bewerten, wenn sich die Grenzen zur Laufzeit ändern', async () => {
      await setup();
      await typeInto(0, '150');
      await blur(0);
      expect(messageText()).toBe('');

      fixture.componentRef.setInput('luxBounds', { max: 100 });
      await settle();

      expect(messageText()).toBe('Von: Der Wert darf höchstens 100 sein.');
    });

    it('Sollte die Standardlabels mit luxMinLabel und luxMaxLabel überschreiben', async () => {
      await setup({ luxMinLabel: 'Ab', luxMaxLabel: 'Höchstens' });
      const labels = fixture.debugElement.queryAll(By.css('label')).map((el) => (el.nativeElement as HTMLElement).textContent?.trim());

      expect(labels.slice(0, 2)).toEqual(['Ab', 'Höchstens']);
    });

    it('Sollte step, min und max an das Zahlenfeld schreiben', async () => {
      await setup({ luxStep: 5, luxBounds: { min: 0, max: 100 } });

      expect(inputs().map((el) => [el.step, el.min, el.max])).toEqual([
        ['5', '0', '100'],
        ['5', '0', '100']
      ]);
    });

    it('Sollte die Einheit als Suffix in beiden Feldern rendern', async () => {
      await setup({ luxUnit: 'kg' });

      expect(fixture.debugElement.queryAll(By.css('lux-input-ac-suffix')).length).toBe(2);
    });
  });

  describe('externer Zustand', () => {
    it('Sollte einen externen Wert anzeigen, ohne zu emittieren', async () => {
      await setup();
      fixture.componentRef.setInput('luxValue', { min: 5, max: 9 });
      await settle();

      expect(inputs().map((el) => el.value)).toEqual(['5', '9']);
      expect(emitted).toEqual([]);
    });

    it('Sollte die Zahlenfelder aus dem Startwert befüllen', async () => {
      await setup({}, { min: 1 });

      expect(inputs().map((el) => el.value)).toEqual(['1', '']);
      expect(emitted).toEqual([]);
    });

    it('Sollte den disabled-Zustand beider Felder zur Laufzeit umschalten', async () => {
      await setup();
      const wrappers = (): Element[] =>
        fixture.debugElement.queryAll(By.css('.lux-form-control-wrapper')).map((el) => el.nativeElement as Element);

      fixture.componentRef.setInput('luxDisabled', true);
      await settle();
      expect(inputs().every((el) => el.disabled)).toBe(true);
      expect(wrappers().length).toBe(2);
      expect(wrappers().every((el) => el.classList.contains('lux-form-control-disabled-authentic'))).toBe(true);

      fixture.componentRef.setInput('luxDisabled', false);
      await settle();
      expect(inputs().every((el) => !el.disabled)).toBe(true);
      expect(wrappers().some((el) => el.classList.contains('lux-form-control-disabled-authentic'))).toBe(false);
    });

    it('Sollte Felder und Wert zurücksetzen, wenn sich der Typ ändert', async () => {
      await setup();
      await typeInto(0, '5');
      await blur(0);
      expect(emitted.at(-1)).toEqual({ min: 5 });

      fixture.componentRef.setInput('luxType', 'date');
      await settle();

      expect(inputs().map((el) => el.value)).toEqual(['', '']);
      expect(emitted.at(-1)).toEqual({});
    });

    it('Sollte einen zusammen mit dem Typwechsel gesetzten Wert übernehmen', async () => {
      await setup();
      fixture.componentRef.setInput('luxType', 'date');
      fixture.componentRef.setInput('luxValue', { min: '2026-05-10T00:00:00.000Z' });
      await settle();

      expect(inputs()[0].value).not.toBe('');
      expect(emitted).toEqual([]);
    });
  });

  describe('date', () => {
    const YEAR = { min: '2026-01-01T00:00:00.000Z', max: '2026-12-31T00:00:00.000Z' };

    it('Sollte den Datepicker rendern und die Grenzen als luxMinDate und luxMaxDate übergeben', async () => {
      await setup({ luxType: 'date', luxBounds: YEAR });

      expect(pickers().length).toBe(2);
      expect(pickers().every((p) => p.luxMinDate === YEAR.min)).toBe(true);
      expect(pickers().every((p) => p.luxMaxDate === YEAR.max)).toBe(true);
    });

    it('Sollte jeden Kalender durch den Nachbarwert vorbegrenzen und die Sperre nach dem Leeren aufheben', async () => {
      await setup({ luxType: 'date', luxBounds: YEAR });
      fixture.componentRef.setInput('luxValue', { min: '2026-05-10T00:00:00.000Z', max: '2026-06-01T00:00:00.000Z' });
      await settle();

      expect(pickers().map((p) => [p.luxMinDate, p.luxMaxDate])).toEqual([
        [YEAR.min, '2026-06-01T00:00:00.000Z'],
        ['2026-05-10T00:00:00.000Z', YEAR.max]
      ]);

      fixture.componentRef.setInput('luxValue', {});
      await settle();

      expect(pickers().map((p) => [p.luxMinDate, p.luxMaxDate])).toEqual([
        [YEAR.min, YEAR.max],
        [YEAR.min, YEAR.max]
      ]);
    });

    it('Sollte ohne Grenze null übergeben', async () => {
      await setup({ luxType: 'date' });

      expect(pickers().map((p) => [p.luxMinDate, p.luxMaxDate])).toEqual([
        [null, null],
        [null, null]
      ]);
    });

    it('Sollte den Bis-Kalender auf die Schnittmenge aus luxBounds und luxMaxFieldBounds begrenzen', async () => {
      await setup({
        luxType: 'date',
        luxBounds: YEAR,
        luxMaxFieldBounds: { min: '2026-12-28T00:00:00.000Z', max: '2027-01-05T00:00:00.000Z' }
      });

      expect(pickers().map((p) => [p.luxMinDate, p.luxMaxDate])).toEqual([
        [YEAR.min, YEAR.max],
        ['2026-12-28T00:00:00.000Z', YEAR.max]
      ]);
    });

    it('Sollte ein unlesbares Datum in der gemeinsamen Meldung nennen und nicht emittieren', async () => {
      await fieldType('date');
      await typeInto(0, 'abc');
      await blur(0);

      expect(messageText()).toBe('Von: Bitte ein gültiges Datum eingeben.');
      expect(emitted).toEqual([]);
    });

    it('Sollte die Kalendersperre von Bis aufheben, wenn Von geleert wird', async () => {
      await setup({ luxType: 'date' }, { min: '2026-05-10T00:00:00.000Z' });
      expect(pickers()[1].luxMinDate).toBe('2026-05-10T00:00:00.000Z');

      await typeInto(0, '');
      await blur(0);

      expect(pickers()[1].luxMinDate).toBeNull();
    });

    it('Sollte den Bereich in der gemeinsamen Meldung nennen, wenn das Bis-Datum vor dem Von-Datum liegt', async () => {
      await fieldType('date');
      fixture.componentRef.setInput('luxValue', { min: '2026-05-10T00:00:00.000Z', max: '2026-05-01T00:00:00.000Z' });
      await settle();
      await blur(1);

      expect(messageText()).toBe('Bis 01.05.26 darf nicht kleiner als Von 10.05.26 sein.');
      expect(emitted).toEqual([]);

      fixture.componentRef.setInput('luxValue', { min: '2026-05-10T00:00:00.000Z', max: '2026-06-01T00:00:00.000Z' });
      await settle();
      expect(messageText()).toBe('');
    });
  });

  describe('Struktur und Barrierefreiheit', () => {
    beforeAll(() => {
      LuxA11yTestHelper.addA11yMatchers();
    });

    it('Sollte die Felder in einem fieldset mit einer nur für Screenreader sichtbaren Legende ohne Label gruppieren', async () => {
      await setup();
      const legend = fixture.debugElement.query(By.css('fieldset > legend')).nativeElement as HTMLElement;

      expect(legend.classList.contains('lux-sr-only')).toBe(true);
      expect(legend.textContent?.trim()).toBe('Wertebereich');
    });

    it('Sollte mit Label eine sichtbare Legende zeigen und Von vor Bis anordnen', async () => {
      await setup({ luxLabel: 'Mitarbeitende' });
      const legend = fixture.debugElement.query(By.css('fieldset > legend')).nativeElement as HTMLElement;
      const labels = fixture.debugElement.queryAll(By.css('label')).map((el) => (el.nativeElement as HTMLElement).textContent?.trim());

      expect(legend.classList.contains('lux-sr-only')).toBe(false);
      expect(legend.textContent?.trim()).toBe('Mitarbeitende');
      expect(labels.slice(0, 2)).toEqual(['Von', 'Bis']);
    });

    it('Sollte Tag-Ids mit Seiten-Suffix vergeben', async () => {
      await setup({ luxTagId: 'preis' });
      const fields = fixture.debugElement
        .queryAll(By.directive(LuxInputAcComponent))
        .map((el) => (el.componentInstance as LuxInputAcComponent).luxTagId);

      expect(fields).toEqual(['preis-min', 'preis-max']);
    });

    it('Sollte beide Felder per aria-describedby mit der gemeinsamen Meldung verknüpfen', async () => {
      await setup({ luxId: 'bereich' });

      expect(messageElement().id).toBe('bereich-message');
      expect(inputs().map((el) => el.getAttribute('aria-describedby'))).toEqual(['bereich-message', 'bereich-message']);
    });

    it('Sollte ohne luxId eine eigene Id je Instanz vergeben', async () => {
      await setup();
      const id = messageElement().id;

      expect(id).toMatch(/^lux-min-max-input-\d+-message$/);
      expect(inputs().map((el) => el.getAttribute('aria-describedby'))).toEqual([id, id]);
    });

    it('Sollte keine Barrierefreiheitsverletzungen haben (leer)', async () => {
      await setup({ luxLabel: 'Mitarbeitende' });
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('Sollte keine Barrierefreiheitsverletzungen haben (mit Meldung)', async () => {
      await setup();
      await typeInto(0, '200');
      await blur(0);
      await typeInto(1, '100');
      await blur(1);
      expect(messageText()).not.toBe('');
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });

    it('Sollte keine Barrierefreiheitsverletzungen haben (disabled)', async () => {
      await setup({ luxDisabled: true });
      await LuxA11yTestHelper.expectNoA11yViolations(fixture.nativeElement);
    });
  });
});

describe('LuxMinMaxInputComponent als ControlValueAccessor', () => {
  let fixture: ComponentFixture<MinMaxFormHostComponent>;
  let host: MinMaxFormHostComponent;

  beforeEach(async () => {
    TestBed.configureTestingModule({ imports: [MinMaxFormHostComponent], providers: PROVIDERS });
    fixture = TestBed.createComponent(MinMaxFormHostComponent);
    host = fixture.componentInstance;
    await settleFixture(fixture);
  });

  it('Sollte den Wert des FormControls anzeigen (writeValue)', async () => {
    expect(allInputs(fixture).map((el) => el.value)).toEqual(['1', '']);

    host.control.setValue({ min: 3, max: 8 });
    await settleFixture(fixture);

    expect(allInputs(fixture).map((el) => el.value)).toEqual(['3', '8']);
  });

  it('Sollte einen gültigen Bereich an das FormControl melden und touched setzen (registerOnChange, registerOnTouched)', async () => {
    const input = allInputs(fixture)[1];
    input.value = '5';
    input.dispatchEvent(new Event('input'));
    await settleFixture(fixture);
    expect(host.control.value).toEqual({ min: 1, max: 5 });
    expect(host.control.touched).toBe(false);

    input.dispatchEvent(new Event('blur'));
    await settleFixture(fixture);

    expect(host.control.touched).toBe(true);
  });

  it('Sollte einen ungültigen Bereich nicht an das FormControl melden', async () => {
    const input = allInputs(fixture)[1];
    input.value = '0';
    input.dispatchEvent(new Event('input'));
    await settleFixture(fixture);

    expect(host.control.value).toEqual({ min: 1 });
  });

  it('Sollte beide Felder deaktivieren, wenn das FormControl deaktiviert wird (setDisabledState)', async () => {
    host.control.disable();
    await settleFixture(fixture);
    expect(allInputs(fixture).every((el) => el.disabled)).toBe(true);

    host.control.enable();
    await settleFixture(fixture);
    expect(allInputs(fixture).every((el) => !el.disabled)).toBe(true);
  });
});

@Component({
  template: ` <lux-min-max-input luxLabel="Anzahl" [formControl]="control"></lux-min-max-input> `,
  imports: [LuxMinMaxInputComponent, ReactiveFormsModule]
})
class MinMaxFormHostComponent {
  readonly control = new FormControl<LuxMinMaxValue<number | string>>({ min: 1 }, { nonNullable: true });
}
