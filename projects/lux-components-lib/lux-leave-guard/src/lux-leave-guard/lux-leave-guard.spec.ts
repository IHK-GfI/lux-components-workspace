import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DIALOG_WIDTH_MEDIUM, ILuxDialogPresetConfig, LuxDialogService } from '@ihk-gfi/lux-components';
import { LuxLoadingService } from '@ihk-gfi/lux-components/lux-loading';
import { Observable, Subject } from 'rxjs';
import { provideLuxTranslocoTesting } from '../../../src/testing/transloco-test.provider';
import { luxLeaveGuard } from './lux-leave-guard';
import { LuxLeaveGuardBase } from './lux-leave-guard-base';
import { ILuxLeaveGuard } from './lux-leave-guard.interface';

@Component({ template: '', changeDetection: ChangeDetectionStrategy.OnPush })
class TestGuardedComponent extends LuxLeaveGuardBase {
  unsaved = false;

  hasUnsavedData(): boolean {
    return this.unsaved;
  }
}

describe('luxLeaveGuard', () => {
  let dialogConfirmed: Subject<void>;
  let dialogDeclined: Subject<void>;
  let dialogClosed: Subject<void>;
  let openSpy: jasmine.Spy<(config?: ILuxDialogPresetConfig) => unknown>;
  let loadingService: LuxLoadingService;

  const runGuard = (component: ILuxLeaveGuard): boolean | Observable<boolean> =>
    TestBed.runInInjectionContext(
      () =>
        luxLeaveGuard(component, {} as ActivatedRouteSnapshot, {} as RouterStateSnapshot, {} as RouterStateSnapshot) as
          | boolean
          | Observable<boolean>
    );

  const runGuardAsync = (component: ILuxLeaveGuard): boolean[] => {
    const results: boolean[] = [];
    (runGuard(component) as Observable<boolean>).subscribe((result) => results.push(result));
    return results;
  };

  const lastConfig = (): ILuxDialogPresetConfig => openSpy.calls.mostRecent().args[0]!;

  beforeEach(() => {
    dialogConfirmed = new Subject<void>();
    dialogDeclined = new Subject<void>();
    dialogClosed = new Subject<void>();
    openSpy = jasmine.createSpy('open').and.returnValue({ dialogConfirmed, dialogDeclined, dialogClosed });

    TestBed.configureTestingModule({
      providers: [provideLuxTranslocoTesting(), { provide: LuxDialogService, useValue: { open: openSpy } }]
    });
    loadingService = TestBed.inject(LuxLoadingService);
  });

  it('Sollte die Navigation ohne ungespeicherte Daten und ohne Ladezustand erlauben', () => {
    expect(runGuard({ hasUnsavedData: () => false })).toBeTrue();
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('Sollte während eines blockierenden Vorgangs den Hinweisdialog öffnen und die Navigation ablehnen', () => {
    loadingService.show();

    const results = runGuardAsync({ hasUnsavedData: () => false });
    expect(openSpy).toHaveBeenCalledTimes(1);

    const config = lastConfig();
    expect(config.title).toBe('Aktion wird verarbeitet');
    expect(config.content).toBe('Eine Aktion wird noch verarbeitet. Die Seite kann verlassen werden, sobald der Vorgang abgeschlossen ist.');
    expect(config.iconName).toBeUndefined();
    expect(config.disableClose).toBeTrue();
    expect(config.width).toBe(DIALOG_WIDTH_MEDIUM);
    expect(config.defaultButton).toBe('confirm');
    expect(config.confirmAction?.label).toBe('Schließen');
    expect(config.declineAction).toBeUndefined();
    expect(results).toEqual([]);

    dialogClosed.next();
    expect(results).toEqual([false]);
  });

  it('Sollte während eines blockierenden Vorgangs den Hinweisdialog dem Bestätigungsdialog vorziehen', () => {
    loadingService.show();

    runGuardAsync({ hasUnsavedData: () => true });
    expect(openSpy).toHaveBeenCalledTimes(1);
    expect(lastConfig().title).toBe('Aktion wird verarbeitet');
  });

  it('Sollte bei ungespeicherten Daten den Bestätigungsdialog öffnen und bei Bestätigung die Navigation erlauben', () => {
    const results = runGuardAsync({ hasUnsavedData: () => true });
    expect(openSpy).toHaveBeenCalledTimes(1);

    const config = lastConfig();
    expect(config.title).toBe('Ungespeicherte Änderungen');
    expect(config.content).toBe('Es liegen ungespeicherte Änderungen vor. Beim Fortfahren gehen diese Änderungen verloren.');
    expect(config.disableClose).toBeTrue();
    expect(config.width).toBe(DIALOG_WIDTH_MEDIUM);
    expect(config.defaultButton).toBe('decline');
    expect(config.confirmAction?.label).toBe('Verwerfen und fortfahren');
    expect(config.confirmAction?.color).toBe('warn');
    expect(config.declineAction?.label).toBe('Abbrechen');
    expect(config.declineAction?.color).toBe('primary');

    dialogConfirmed.next();
    expect(results).toEqual([true]);
  });

  it('Sollte bei ungespeicherten Daten und Abbruch im Dialog die Navigation ablehnen', () => {
    const results = runGuardAsync({ hasUnsavedData: () => true });

    dialogDeclined.next();
    expect(results).toEqual([false]);
  });

  it('Sollte die Navigation sperren, solange ein per trackBlocking() markierter Request läuft', () => {
    const request = new Subject<void>();
    request.pipe(loadingService.trackBlocking()).subscribe();

    runGuardAsync({ hasUnsavedData: () => true });
    expect(lastConfig().title).toBe('Aktion wird verarbeitet');

    request.complete();

    runGuardAsync({ hasUnsavedData: () => true });
    expect(openSpy).toHaveBeenCalledTimes(2);
    expect(lastConfig().title).toBe('Ungespeicherte Änderungen');
  });

  it('Sollte die Navigation bei rein anzeigenden Vorgängen nicht sperren', () => {
    loadingService.busy();

    expect(runGuard({ hasUnsavedData: () => false })).toBeTrue();
    expect(openSpy).not.toHaveBeenCalled();
  });
});

describe('LuxLeaveGuardBase', () => {
  let loadingService: LuxLoadingService;
  let component: TestGuardedComponent;
  let karmaBeforeUnload: typeof window.onbeforeunload;

  beforeEach(() => {
    // Karma meldet jedes beforeunload als "full page reload"; deshalb den Karma-Handler für die Tests parken.
    karmaBeforeUnload = window.onbeforeunload;
    window.onbeforeunload = null;

    TestBed.configureTestingModule({
      imports: [TestGuardedComponent],
      providers: [provideLuxTranslocoTesting()]
    });
    loadingService = TestBed.inject(LuxLoadingService);
    const fixture = TestBed.createComponent(TestGuardedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    window.onbeforeunload = karmaBeforeUnload;
  });

  const dispatchBeforeUnload = (): Event => {
    const event = new Event('beforeunload', { cancelable: true });
    window.dispatchEvent(event);
    return event;
  };

  it('Sollte das Verlassen ohne ungespeicherte Daten und ohne Ladezustand nicht verhindern', () => {
    expect(dispatchBeforeUnload().defaultPrevented).toBeFalse();
  });

  it('Sollte das Verlassen bei ungespeicherten Daten verhindern', () => {
    component.unsaved = true;
    expect(dispatchBeforeUnload().defaultPrevented).toBeTrue();
  });

  it('Sollte das Verlassen während eines blockierenden Vorgangs verhindern', () => {
    loadingService.show();
    expect(dispatchBeforeUnload().defaultPrevented).toBeTrue();
  });

  it('Sollte das Verlassen bei rein anzeigenden Vorgängen nicht verhindern', () => {
    loadingService.busy();
    expect(dispatchBeforeUnload().defaultPrevented).toBeFalse();
  });
});
