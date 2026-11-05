import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideLuxTranslocoTesting } from '../../../../testing/transloco-test.provider';
import { LuxConsoleService } from '../../../lux-util/lux-console.service';
import { LuxDatetimepickerAdapter } from '../lux-datetimepicker-adapter';
import { APP_DATE_TIME_FORMATS_AC } from '../lux-datetimepicker.component';
import { LuxDatetimeOverlayComponent } from './lux-datetime-overlay.component';
import { LuxDatetimeOverlayContentComponent } from './lux-datetime-overlay-content.component';

// mat-calendar vergleicht über die lokalen Datumsbestandteile. Die Kalenderdaten des Overlays müssen daher
// lokale Mitternacht des gemeinten (UTC-)Tages sein - unabhängig von der Zeitzone, in der die Tests laufen.
const localCalendarDay = (date: Date | null) => (date ? [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()] : null);

describe('LuxDatetimeOverlayContentComponent', () => {
  let component: LuxDatetimeOverlayContentComponent;
  let dateTimePicker: {
    luxStartDate: ReturnType<typeof signal<Date | null>>;
    luxStartTime: ReturnType<typeof signal<number[]>>;
    luxMinDate: ReturnType<typeof signal<Date | null>>;
    luxMaxDate: ReturnType<typeof signal<Date | null>>;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        LuxConsoleService,
        provideNoopAnimations(),
        provideHttpClient(withXhr(), withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting(),
        // Stellt in der Anwendung die LuxDatetimepickerComponent bereit, in der das Overlay geöffnet wird
        { provide: DateAdapter, useClass: LuxDatetimepickerAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_TIME_FORMATS_AC }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    // Nur die Komponente erzeugen (ohne Change Detection), damit initDate() direkt getestet werden kann
    component = TestBed.createComponent(LuxDatetimeOverlayContentComponent).componentInstance;
    dateTimePicker = {
      luxStartDate: signal<Date | null>(null),
      luxStartTime: signal<number[]>([]),
      luxMinDate: signal<Date | null>(null),
      luxMaxDate: signal<Date | null>(null)
    };
    component.dateTimePicker = dateTimePicker as unknown as LuxDatetimeOverlayComponent;
  });

  describe('initDate', () => {
    it('Sollte einen ISO-String ohne Zeitzoneninfo als UTC-Datum und UTC-Uhrzeit übernehmen', () => {
      // In jeder Zeitzone außer UTC liegt einer der beiden Werte, lokal interpretiert,
      // an einem anderen UTC-Tag (östlich von UTC: 00:30, westlich von UTC: 23:30).
      const testCases = [
        { value: '2029-05-26T00:30:00', hours: '00', minutes: '30' },
        { value: '2029-05-26T23:30:00', hours: '23', minutes: '30' }
      ];

      testCases.forEach(({ value, hours, minutes }) => {
        component.initDate(value);

        expect(component.hours, value).toEqual(hours);
        expect(component.minutes, value).toEqual(minutes);
        expect(localCalendarDay(component.selected), value).toEqual([2029, 4, 26, 0]);
        expect(localCalendarDay(component.startDate), value).toEqual([2029, 4, 26, 0]);
      });
    });

    it('Sollte einen ISO-String mit Zeitzoneninfo als UTC-Datum und UTC-Uhrzeit übernehmen', () => {
      const testCases = [
        { value: '2029-05-26T00:30:00.000Z', hours: '00', minutes: '30' },
        { value: '2029-05-26T23:30:00.000Z', hours: '23', minutes: '30' }
      ];

      testCases.forEach(({ value, hours, minutes }) => {
        component.initDate(value);

        expect(component.hours, value).toEqual(hours);
        expect(component.minutes, value).toEqual(minutes);
        expect(localCalendarDay(component.selected), value).toEqual([2029, 4, 26, 0]);
        expect(localCalendarDay(component.startDate), value).toEqual([2029, 4, 26, 0]);
      });
    });

    it('Sollte Start-, Min- und Max-Datum ohne Wert auf den jeweiligen UTC-Tag setzen', () => {
      dateTimePicker.luxStartDate.set(new Date('2029-05-26T00:00:00.000Z'));
      dateTimePicker.luxMinDate.set(new Date('2029-05-10T00:00:00.000Z'));
      dateTimePicker.luxMaxDate.set(new Date('2029-05-31T23:59:00.000Z'));

      component.initDate(undefined);

      expect(localCalendarDay(component.startDate)).toEqual([2029, 4, 26, 0]);
      expect(localCalendarDay(component.selected)).toEqual([2029, 4, 26, 0]);
      expect(localCalendarDay(component.minCalendarDate)).toEqual([2029, 4, 10, 0]);
      expect(localCalendarDay(component.maxCalendarDate)).toEqual([2029, 4, 31, 0]);
    });
  });
});
