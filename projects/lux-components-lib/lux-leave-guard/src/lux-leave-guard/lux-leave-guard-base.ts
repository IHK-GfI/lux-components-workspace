import { Directive, HostListener, inject } from '@angular/core';
import { LuxLoadingService } from '@ihk-gfi/lux-components/lux-loading';
import { ILuxLeaveGuard } from './lux-leave-guard.interface';

/**
 * Abstrakte Basisklasse für Komponenten, die vor dem Verlassen der Seite auf
 * ungespeicherte Änderungen geprüft werden.
 *
 * Ergänzt den `luxLeaveGuard` um einen nativen `beforeunload`-Handler, der auch beim Neuladen
 * der Seite oder beim Schließen des Browser-Tabs greift. Zusätzlich wird das Verlassen blockiert,
 * solange ein über den LuxLoadingService gemeldeter blockierender Vorgang läuft.
 *
 * @example
 * ```typescript
 * @Component({ ... })
 * export class MyFormComponent extends LuxLeaveGuardBase {
 *   private form = new FormGroup({ ... });
 *
 *   hasUnsavedData(): boolean {
 *     return this.form.dirty;
 *   }
 * }
 * ```
 */
@Directive()
export abstract class LuxLeaveGuardBase implements ILuxLeaveGuard {
  private readonly luxLoadingService = inject(LuxLoadingService);

  @HostListener('window:beforeunload', ['$event'])
  protected handleBeforeUnload(event: BeforeUnloadEvent): void {
    if (this.hasUnsavedData() || this.luxLoadingService.isLoading()) {
      event.preventDefault();
      // Für ältere Browser, die preventDefault() bei beforeunload nicht auswerten.
      event.returnValue = '';
    }
  }

  abstract hasUnsavedData(): boolean;
}
