import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { LuxIconComponent, luxTranslateSignal } from '@ihk-gfi/lux-components';
import { LuxSnackbarConfig } from '../lux-snackbar-config';
import { LUX_SNACKBAR_DATA } from '../lux-snackbar-data';
import { LuxSnackbarRef } from '../lux-snackbar-ref';

/**
 * Stellt eine Text-Nachricht dar (Icon, Text, Action, Ok-Button zum Schließen). Wird vom LuxSnackbarService für open()
 * und openText() genutzt.
 */
@Component({
  selector: 'lux-snackbar',
  templateUrl: './lux-snackbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxIconComponent, MatButton]
})
export class LuxSnackbarComponent {
  readonly config = inject<LuxSnackbarConfig>(LUX_SNACKBAR_DATA);
  readonly snackbarRef = inject(LuxSnackbarRef);
  readonly closeLabel = luxTranslateSignal('luxc.snackbar.close.btn');

  actionClick() {
    this.snackbarRef.dismissWithAction();
  }

  closeClick() {
    this.snackbarRef.dismiss();
  }
}
