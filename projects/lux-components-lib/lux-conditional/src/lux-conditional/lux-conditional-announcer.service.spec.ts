import { LiveAnnouncer } from '@angular/cdk/a11y';
import { fakeAsync, flushMicrotasks, TestBed } from '@angular/core/testing';
import { provideLuxTranslocoTesting } from '../../../src/testing/transloco-test.provider';
import { LuxConditionalAnnouncer } from './lux-conditional-announcer.service';

describe('LuxConditionalAnnouncer', () => {
  let announcer: LuxConditionalAnnouncer;
  let announceSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideLuxTranslocoTesting()]
    });
    announceSpy = spyOn(TestBed.inject(LiveAnnouncer), 'announce').and.resolveTo();
    announcer = TestBed.inject(LuxConditionalAnnouncer);
  });

  it('Sollte einen eingeblendeten Bereich ansagen', fakeAsync(() => {
    announcer.announceAdded('Fachrichtung');
    flushMicrotasks();

    expect(announceSpy).toHaveBeenCalledOnceWith('Eingeblendet: Fachrichtung', 'polite');
  }));

  it('Sollte Bezeichnungen aus demselben Tick zu einer Ansage bündeln', fakeAsync(() => {
    announcer.announceAdded('Fachrichtung');
    announcer.announceAdded('Prüfungsort');
    flushMicrotasks();

    expect(announceSpy).toHaveBeenCalledOnceWith('Eingeblendet: Fachrichtung, Prüfungsort', 'polite');
  }));

  // Ein zweiter announce()-Aufruf verdrängt die noch ausstehende Meldung des ersten, deshalb eine gemeinsame Meldung.
  it('Sollte Ein- und Ausgeblendetes aus demselben Tick in einer Meldung ansagen, Eingeblendetes zuerst', fakeAsync(() => {
    announcer.announceRemoved('Termin');
    announcer.announceAdded('Fachrichtung');
    flushMicrotasks();

    expect(announceSpy).toHaveBeenCalledOnceWith('Eingeblendet: Fachrichtung. Ausgeblendet: Termin', 'polite');
  }));

  it('Sollte ausgeblendete Bereiche gebündelt ansagen', fakeAsync(() => {
    announcer.announceRemoved('Fachrichtung');
    announcer.announceRemoved('Prüfungsort');
    flushMicrotasks();

    expect(announceSpy).toHaveBeenCalledOnceWith('Ausgeblendet: Fachrichtung, Prüfungsort', 'polite');
  }));

  it('Sollte nach der Ansage einen neuen Stapel beginnen', fakeAsync(() => {
    announcer.announceAdded('Fachrichtung');
    flushMicrotasks();
    announcer.announceRemoved('Fachrichtung');
    flushMicrotasks();

    expect(announceSpy.calls.allArgs()).toEqual([
      ['Eingeblendet: Fachrichtung', 'polite'],
      ['Ausgeblendet: Fachrichtung', 'polite']
    ]);
  }));
});
