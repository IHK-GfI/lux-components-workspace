import { Directive, HostListener, inject } from '@angular/core';
import { LuxSnackbarService } from '@ihk-gfi/lux-components';
import { IUnsavedDataCheck } from '../unsaved-data-guard/unsaved-data-check.interface';

@Directive()
export abstract class FormBase implements IUnsavedDataCheck {
  protected snackbar = inject(LuxSnackbarService);

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(unloadEvent: Event) {
    // hier muss irgendwie geprüft werden, ob es ungespeicherte Daten gibt
    if (this.hasUnsavedData()) {
      unloadEvent.preventDefault();
      // Damit der Browser eine Warnung ausgibt (die je nach Browser variiert und nicht anpassbar ist), muss ein returnValue gesetzt sein.
      unloadEvent.returnValue = false;
    }
  }

  abstract hasUnsavedData(): boolean;
}
