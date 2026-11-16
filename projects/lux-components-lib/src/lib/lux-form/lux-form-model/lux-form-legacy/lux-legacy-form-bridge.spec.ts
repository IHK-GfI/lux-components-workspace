import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ChangeDetectionStrategy, Component, Type, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Validators } from '@angular/forms';
import { LuxTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { provideLuxTranslocoTesting } from '../../../../testing/transloco-test.provider';
import { LuxDatepickerComponent } from '../../lux-datepicker/lux-datepicker.component';
import { LuxInputComponent } from '../../lux-input/lux-input.component';
import { LuxTextareaComponent } from '../../lux-textarea/lux-textarea.component';
import { LuxTimepickerComponent } from '../../lux-timepicker/lux-timepicker.component';

abstract class LuxStartHost {
  abstract readonly value: ReturnType<typeof signal<string | null>>;
  abstract readonly otherValue: string;
  readonly changes: unknown[] = [];
  readonly required = signal(false);
  readonly validators = signal<ReturnType<typeof Validators.maxLength>[]>([]);
}

const BINDINGS = `[(value)]="value" [luxRequired]="required()" [luxControlValidators]="validators()" (luxValueChange)="changes.push($event)"`;

@Component({
  selector: 'lux-test-start-input',
  template: `<lux-input luxLabel="Feld" ${BINDINGS} />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxInputComponent]
})
class InputHost extends LuxStartHost {
  readonly value = signal<string | null>('Text');
  readonly otherValue = 'Anderer Text';
}

@Component({
  selector: 'lux-test-start-textarea',
  template: `<lux-textarea luxLabel="Feld" ${BINDINGS} />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxTextareaComponent]
})
class TextareaHost extends LuxStartHost {
  readonly value = signal<string | null>('Text');
  readonly otherValue = 'Anderer Text';
}

@Component({
  selector: 'lux-test-start-datepicker',
  template: `<lux-datepicker luxLabel="Feld" ${BINDINGS} />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxDatepickerComponent]
})
class DatepickerHost extends LuxStartHost {
  readonly value = signal<string | null>('2029-05-26');
  readonly otherValue = '2030-01-02';
}

@Component({
  selector: 'lux-test-start-timepicker',
  template: `<lux-timepicker luxLabel="Feld" ${BINDINGS} />`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxTimepickerComponent]
})
class TimepickerHost extends LuxStartHost {
  readonly value = signal<string | null>('14:15');
  readonly otherValue = '15:45';
}

const HOSTS: { name: string; type: Type<LuxStartHost> }[] = [
  { name: 'lux-input', type: InputHost },
  { name: 'lux-textarea', type: TextareaHost },
  { name: 'lux-datepicker', type: DatepickerHost },
  { name: 'lux-timepicker', type: TimepickerHost }
];

describe('LuxLegacyFormBridge', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
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

  for (const { name, type } of HOSTS) {
    describe(`luxValueChange beim Start (${name})`, () => {
      it('Sollte für einen vorbelegten Wert mit luxRequired nichts auslösen', async () => {
        const fixture = TestBed.createComponent(type);
        fixture.componentInstance.required.set(true);

        await LuxTestHelper.wait(fixture);
        await LuxTestHelper.wait(fixture);

        expect(fixture.componentInstance.changes).toEqual([]);
      });

      it('Sollte für einen vorbelegten Wert mit luxControlValidators nichts auslösen', async () => {
        const fixture = TestBed.createComponent(type);
        fixture.componentInstance.validators.set([Validators.maxLength(50)]);

        await LuxTestHelper.wait(fixture);
        await LuxTestHelper.wait(fixture);

        expect(fixture.componentInstance.changes).toEqual([]);
      });

      it('Sollte für ein später gesetztes luxRequired nichts auslösen', async () => {
        const fixture = TestBed.createComponent(type);
        await LuxTestHelper.wait(fixture);

        fixture.componentInstance.required.set(true);
        await LuxTestHelper.wait(fixture);

        expect(fixture.componentInstance.changes).toEqual([]);
      });

      it('Sollte eine Wertänderung direkt nach dem ersten Rendern melden', async () => {
        const fixture = TestBed.createComponent(type);
        fixture.componentInstance.required.set(true);
        fixture.detectChanges();

        // Noch bevor ein Timer lief
        fixture.componentInstance.value.set(fixture.componentInstance.otherValue);
        await LuxTestHelper.wait(fixture);

        expect(fixture.componentInstance.changes).toEqual([fixture.componentInstance.otherValue]);
      });
    });
  }
});
