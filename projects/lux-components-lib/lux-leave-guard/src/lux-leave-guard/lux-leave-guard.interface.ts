/**
 * Interface für Komponenten, die über den `luxLeaveGuard` vor dem Verlassen mit
 * ungespeicherten Änderungen geschützt werden.
 */
export interface ILuxLeaveGuard {
  /**
   * Liefert true, wenn die Komponente ungespeicherte Änderungen enthält.
   * Der Ladezustand (LuxLoadingService) muss hier nicht berücksichtigt werden, das übernimmt der Guard.
   */
  hasUnsavedData(): boolean;
}
