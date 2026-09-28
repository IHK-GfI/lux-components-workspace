import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideLuxTranslocoTesting } from '../../../../testing/transloco-test.provider';
import { LuxConsoleService } from '../../../lux-util/lux-console.service';
import { LuxDateTimePickerAcAdapter } from '../lux-datetimepicker-ac-adapter';
import { APP_DATE_TIME_FORMATS_AC } from '../lux-datetimepicker-ac.component';
import { LuxDatetimeOverlayAcComponent } from './lux-datetime-overlay-ac.component';
import { LuxDatetimeOverlayContentAcComponent } from './lux-datetime-overlay-content-ac.component';

// mat-calendar vergleicht über die lokalen Datumsbestandteile. Die Kalenderdaten des Overlays müssen daher
// lokale Mitternacht des gemeinten (UTC-)Tages sein - unabhängig von der Zeitzone, in der die Tests laufen.
const localCalendarDay = (date: Date | null) => (date ? [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()] : null);

describe('LuxDatetimeOverlayContentAcComponent', () => {
  let component: LuxDatetimeOverlayContentAcComponent;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [
        LuxConsoleService,
        provideNoopAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        provideLuxTranslocoTesting(),
        // Stellt in der Anwendung die LuxDatetimepickerAcComponent bereit, in der das Overlay geöffnet wird
        { provide: DateAdapter, useClass: LuxDateTimePickerAcAdapter },
        { provide: MAT_DATE_FORMATS, useValue: APP_DATE_TIME_FORMATS_AC }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    // Nur die Komponente erzeugen (ohne Change Detection), damit initDate() direkt getestet werden kann
    component = TestBed.createComponent(LuxDatetimeOverlayContentAcComponent).componentInstance;
    component.dateTimePicker = {
      luxStartDate: null,
      luxStartTime: [],
      luxMinDate: null,
      luxMaxDate: null
    } as unknown as LuxDatetimeOverlayAcComponent;
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

        expect(component.hours).withContext(value).toEqual(hours);
        expect(component.minutes).withContext(value).toEqual(minutes);
        expect(localCalendarDay(component.selected)).withContext(value).toEqual([2029, 4, 26, 0]);
        expect(localCalendarDay(component.startDate)).withContext(value).toEqual([2029, 4, 26, 0]);
      });
    });

    it('Sollte einen ISO-String mit Zeitzoneninfo als UTC-Datum und UTC-Uhrzeit übernehmen', () => {
      const testCases = [
        { value: '2029-05-26T00:30:00.000Z', hours: '00', minutes: '30' },
        { value: '2029-05-26T23:30:00.000Z', hours: '23', minutes: '30' }
      ];

      testCases.forEach(({ value, hours, minutes }) => {
        component.initDate(value);

        expect(component.hours).withContext(value).toEqual(hours);
        expect(component.minutes).withContext(value).toEqual(minutes);
        expect(localCalendarDay(component.selected)).withContext(value).toEqual([2029, 4, 26, 0]);
        expect(localCalendarDay(component.startDate)).withContext(value).toEqual([2029, 4, 26, 0]);
      });
    });

    it('Sollte Start-, Min- und Max-Datum ohne Wert auf den jeweiligen UTC-Tag setzen', () => {
      component.dateTimePicker.luxStartDate = new Date('2029-05-26T00:00:00.000Z');
      component.dateTimePicker.luxMinDate = new Date('2029-05-10T00:00:00.000Z');
      component.dateTimePicker.luxMaxDate = new Date('2029-05-31T23:59:00.000Z');

      component.initDate(undefined);

      expect(localCalendarDay(component.startDate)).toEqual([2029, 4, 26, 0]);
      expect(localCalendarDay(component.selected)).toEqual([2029, 4, 26, 0]);
      expect(localCalendarDay(component.minCalendarDate)).toEqual([2029, 4, 10, 0]);
      expect(localCalendarDay(component.maxCalendarDate)).toEqual([2029, 4, 31, 0]);
    });
  });
});
