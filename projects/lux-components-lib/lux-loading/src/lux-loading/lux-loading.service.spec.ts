import { LiveAnnouncer } from '@angular/cdk/a11y';
import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { provideLuxTranslocoTesting } from '../../../src/testing/transloco-test.provider';
import { LuxLoadingService } from './lux-loading.service';

describe('LuxLoadingService', () => {
  let service: LuxLoadingService;
  let announceSpy: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideLuxTranslocoTesting()]
    });
    announceSpy = spyOn(TestBed.inject(LiveAnnouncer), 'announce').and.resolveTo();
    service = TestBed.inject(LuxLoadingService);
  });

  it('Sollte initial weder loading noch busy sein', () => {
    expect(service.isLoading()).toBeFalse();
    expect(service.isBusy()).toBeFalse();
  });

  it('Sollte bei show() loading sein', () => {
    service.show();
    expect(service.isLoading()).toBeTrue();
  });

  it('Sollte nach hide() nicht mehr loading sein', () => {
    service.show();
    service.hide();
    expect(service.isLoading()).toBeFalse();
  });

  it('Sollte loading bleiben, bis alle parallelen Blocks freigegeben sind', () => {
    const releaseA = service.block();
    const releaseB = service.block();

    releaseA();
    expect(service.isLoading()).toBeTrue();

    releaseB();
    expect(service.isLoading()).toBeFalse();
  });

  it('Sollte einen zweiten Aufruf derselben Release-Funktion ignorieren', () => {
    const releaseA = service.block();
    service.block();

    releaseA();
    releaseA();
    expect(service.isLoading()).toBeTrue();
  });

  it('Sollte den Zähler bei überzähligen hide()-Aufrufen bei 0 klemmen', () => {
    service.hide();
    service.show();
    expect(service.isLoading()).toBeTrue();
  });

  it('Sollte ein Observable von Subscribe bis Complete als blockierend erfassen', () => {
    const source = new Subject<void>();
    const tracked = source.pipe(service.trackBlocking());

    expect(service.isLoading()).toBeFalse();
    const subscription = tracked.subscribe();
    expect(service.isLoading()).toBeTrue();

    source.next();
    source.complete();
    expect(service.isLoading()).toBeFalse();
    subscription.unsubscribe();
  });

  it('Sollte bei Error freigeben', () => {
    const source = new Subject<void>();
    source.pipe(service.trackBlocking()).subscribe({ error: () => undefined });

    source.error(new Error('boom'));
    expect(service.isLoading()).toBeFalse();
  });

  it('Sollte bei Unsubscribe freigeben', () => {
    const source = new Subject<void>();
    const subscription = source.pipe(service.trackBlocking()).subscribe();

    subscription.unsubscribe();
    expect(service.isLoading()).toBeFalse();
  });

  it('Sollte bei anzeigenden Vorgängen busy, aber nicht loading sein', () => {
    const release = service.busy();

    expect(service.isBusy()).toBeTrue();
    expect(service.isLoading()).toBeFalse();

    release();
    expect(service.isBusy()).toBeFalse();
  });

  it('Sollte während blockierender Vorgänge auch busy sein', () => {
    service.show();
    expect(service.isBusy()).toBeTrue();
  });

  it('Sollte einen überholten trackBusy-Request beim Unsubscribe freigeben (switchMap-Szenario)', () => {
    const first = new Subject<void>();
    const second = new Subject<void>();

    const firstSubscription = first.pipe(service.trackBusy()).subscribe();
    second.pipe(service.trackBusy()).subscribe();
    expect(service.isBusy()).toBeTrue();

    firstSubscription.unsubscribe();
    expect(service.isBusy()).toBeTrue();

    second.complete();
    expect(service.isBusy()).toBeFalse();
  });

  it('Sollte im Leerlauf nichts ansagen', () => {
    TestBed.tick();
    expect(announceSpy).not.toHaveBeenCalled();
  });

  it('Sollte anzeigende Vorgänge nicht ansagen', () => {
    service.busy();
    TestBed.tick();
    expect(announceSpy).not.toHaveBeenCalled();
  });

  it('Sollte Start und Ende blockierender Vorgänge mit übersetzten Texten ansagen', () => {
    service.show();
    TestBed.tick();
    expect(announceSpy).toHaveBeenCalledOnceWith('Verarbeitung läuft.', 'polite');

    service.hide();
    TestBed.tick();
    expect(announceSpy).toHaveBeenCalledWith('Verarbeitung abgeschlossen.', 'polite');
    expect(announceSpy).toHaveBeenCalledTimes(2);
  });

  it('Sollte parallele blockierende Vorgänge nur einmal ansagen', () => {
    const releaseA = service.block();
    TestBed.tick();
    const releaseB = service.block();
    TestBed.tick();
    releaseA();
    TestBed.tick();

    expect(announceSpy).toHaveBeenCalledOnceWith('Verarbeitung läuft.', 'polite');

    releaseB();
    TestBed.tick();
    expect(announceSpy).toHaveBeenCalledTimes(2);
  });
});
