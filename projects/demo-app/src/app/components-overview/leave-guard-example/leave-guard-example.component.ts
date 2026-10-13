import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LuxButtonComponent, LuxFormHintComponent, LuxInputAcComponent, LuxToggleAcComponent } from '@ihk-gfi/lux-components';
import { LuxLeaveGuardBase } from '@ihk-gfi/lux-components/lux-leave-guard';
import { LuxLoadingService } from '@ihk-gfi/lux-components/lux-loading';
import { debounceTime, distinctUntilChanged, finalize, Subject, switchMap, tap, timer } from 'rxjs';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

const SAVE_DURATION_MS = 5000;
const FILTER_DURATION_MS = 2000;
const FILTER_DEBOUNCE_MS = 600;

@Component({
  selector: 'app-leave-guard-example',
  templateUrl: './leave-guard-example.component.html',
  styleUrls: ['./leave-guard-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxButtonComponent,
    LuxFormHintComponent,
    LuxInputAcComponent,
    LuxToggleAcComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent
  ]
})
export class LeaveGuardExampleComponent extends LuxLeaveGuardBase {
  protected readonly loading = inject(LuxLoadingService);
  protected readonly saveDurationSeconds = SAVE_DURATION_MS / 1000;

  protected readonly name = signal<string | null>('');
  private readonly savedName = signal('');
  protected readonly dirty = computed(() => (this.name() ?? '') !== this.savedName());
  protected readonly filterTerm = signal('');
  protected readonly log = signal<{ time: string; text: string }[]>([]);
  protected readonly permanentlyBlocked = signal(false);

  private readonly filterTrigger = new Subject<string>();
  private releasePermanentBlock?: () => void;
  private requestCounter = 0;

  constructor() {
    super();

    // switchMap überschreibt einen laufenden Request; trackBusy gibt den überholten beim Unsubscribe frei.
    this.filterTrigger
      .pipe(
        debounceTime(FILTER_DEBOUNCE_MS),
        distinctUntilChanged(),
        switchMap((term) => {
          const id = ++this.requestCounter;
          let completed = false;
          this.appendLog(`Filter-Request ${id} gestartet${term ? ` (${term})` : ''}`);
          return timer(FILTER_DURATION_MS).pipe(
            this.loading.trackBusy(),
            tap(() => {
              completed = true;
              this.appendLog(`Filter-Request ${id} abgeschlossen`);
            }),
            finalize(() => {
              if (!completed) {
                this.appendLog(`Filter-Request ${id} überschrieben`);
              }
            })
          );
        }),
        takeUntilDestroyed()
      )
      .subscribe();

    inject(DestroyRef).onDestroy(() => this.releasePermanentBlock?.());
  }

  hasUnsavedData(): boolean {
    return this.dirty();
  }

  save() {
    this.appendLog('Speichern gestartet');
    timer(SAVE_DURATION_MS)
      .pipe(this.loading.trackBlocking())
      .subscribe(() => {
        this.savedName.set(this.name() ?? '');
        this.appendLog('Speichern abgeschlossen');
      });
  }

  discard() {
    this.name.set(this.savedName());
  }

  onFilterChange(value: string | null) {
    this.filterTerm.set(value ?? '');
    this.filterTrigger.next(value ?? '');
  }

  onPermanentBlockChange(blocked: boolean) {
    this.permanentlyBlocked.set(blocked);
    if (blocked) {
      this.releasePermanentBlock = this.loading.block();
      this.appendLog('Seite dauerhaft blockiert');
    } else {
      this.releasePermanentBlock?.();
      this.releasePermanentBlock = undefined;
      this.appendLog('Dauerhafte Blockierung aufgehoben');
    }
  }

  clearLog() {
    this.log.set([]);
  }

  private appendLog(text: string) {
    this.log.update((log) => [{ time: new Date().toLocaleTimeString(), text }, ...log]);
  }
}
