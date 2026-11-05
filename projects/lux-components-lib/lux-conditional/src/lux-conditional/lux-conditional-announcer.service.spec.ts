import { describe, it, beforeEach, expect, vi, type MockInstance } from 'vitest';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TestBed } from '@angular/core/testing';
import { provideLuxTranslocoTesting } from '../../../src/testing/transloco-test.provider';
import { LuxConditionalAnnouncer } from './lux-conditional-announcer.service';

describe('LuxConditionalAnnouncer', () => {
  let announcer: LuxConditionalAnnouncer;
  let announceSpy: MockInstance;

  const flushMicrotasks = () => new Promise<void>((resolve) => queueMicrotask(resolve));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideLuxTranslocoTesting()]
    });
    announceSpy = vi.spyOn(TestBed.inject(LiveAnnouncer), 'announce').mockResolvedValue();
    announcer = TestBed.inject(LuxConditionalAnnouncer);
  });

  it('Sollte einen eingeblendeten Bereich ansagen', async () => {
    announcer.announceAdded('Fachrichtung');
    await flushMicrotasks();

    expect(announceSpy).toHaveBeenCalledExactlyOnceWith('Eingeblendet: Fachrichtung', 'polite');
  });

  it('Sollte Bezeichnungen aus demselben Tick zu einer Ansage bündeln', async () => {
    announcer.announceAdded('Fachrichtung');
    announcer.announceAdded('Prüfungsort');
    await flushMicrotasks();

    expect(announceSpy).toHaveBeenCalledExactlyOnceWith('Eingeblendet: Fachrichtung, Prüfungsort', 'polite');
  });

  // Ein zweiter announce()-Aufruf verdrängt die noch ausstehende Meldung des ersten, deshalb eine gemeinsame Meldung.
  it('Sollte Ein- und Ausgeblendetes aus demselben Tick in einer Meldung ansagen, Eingeblendetes zuerst', async () => {
    announcer.announceRemoved('Termin');
    announcer.announceAdded('Fachrichtung');
    await flushMicrotasks();

    expect(announceSpy).toHaveBeenCalledExactlyOnceWith('Eingeblendet: Fachrichtung. Ausgeblendet: Termin', 'polite');
  });

  it('Sollte ausgeblendete Bereiche gebündelt ansagen', async () => {
    announcer.announceRemoved('Fachrichtung');
    announcer.announceRemoved('Prüfungsort');
    await flushMicrotasks();

    expect(announceSpy).toHaveBeenCalledExactlyOnceWith('Ausgeblendet: Fachrichtung, Prüfungsort', 'polite');
  });

  it('Sollte nach der Ansage einen neuen Stapel beginnen', async () => {
    announcer.announceAdded('Fachrichtung');
    await flushMicrotasks();
    announcer.announceRemoved('Fachrichtung');
    await flushMicrotasks();

    expect(announceSpy.mock.calls).toEqual([
      ['Eingeblendet: Fachrichtung', 'polite'],
      ['Ausgeblendet: Fachrichtung', 'polite']
    ]);
  });
});
