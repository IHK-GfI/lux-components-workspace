import { Observable, Subject } from 'rxjs';

/**
 * Wird von afterDismissed() geliefert, sobald eine Snackbar-Nachricht geschlossen wurde.
 */
export interface LuxSnackbarDismiss {
  /** true, wenn die Nachricht über ihre Action geschlossen wurde. */
  dismissedByAction: boolean;
}

/**
 * Referenz auf eine einzelne Snackbar-Nachricht. Wird von den open-Methoden des LuxSnackbarService geliefert
 * und steht Komponenten, die über openComponent() angezeigt werden, per inject(LuxSnackbarRef) zur Verfügung.
 */
export class LuxSnackbarRef {
  private readonly action$ = new Subject<void>();
  private readonly afterDismissed$ = new Subject<LuxSnackbarDismiss>();
  private dismissed = false;

  /**
   * @param onDismiss Entfernt die Nachricht aus der Anzeige (wird vom LuxSnackbarService gesetzt).
   */
  constructor(private readonly onDismiss: () => void) {}

  /**
   * Liefert ein Observable, das benachrichtigt, wenn die Action der Nachricht geklickt wurde.
   */
  onAction(): Observable<void> {
    return this.action$.asObservable();
  }

  /**
   * Liefert ein Observable, das benachrichtigt, sobald die Nachricht geschlossen wurde.
   */
  afterDismissed(): Observable<LuxSnackbarDismiss> {
    return this.afterDismissed$.asObservable();
  }

  /**
   * Schließt die Nachricht.
   */
  dismiss(): void {
    this.close(false);
  }

  /**
   * Meldet die Action und schließt die Nachricht.
   */
  dismissWithAction(): void {
    if (!this.dismissed) {
      this.action$.next();
    }
    this.close(true);
  }

  private close(dismissedByAction: boolean) {
    if (this.dismissed) {
      return;
    }

    this.dismissed = true;
    this.onDismiss();
    this.afterDismissed$.next({ dismissedByAction });
    this.afterDismissed$.complete();
    this.action$.complete();
  }
}
