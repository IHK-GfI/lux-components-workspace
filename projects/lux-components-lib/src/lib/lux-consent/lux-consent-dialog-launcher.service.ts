import { Injectable, inject } from '@angular/core';
import { take } from 'rxjs';
import { DIALOG_WIDTH_LARGE_PX, minWidth } from '../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-config.interface';
import { LuxDialogService } from '../lux-popups/lux-dialog/lux-dialog.service';
import { ILuxConsentDialogLauncher } from './lux-consent-dialog-launcher';

@Injectable({
  providedIn: 'root'
})
export class LuxConsentDialogLauncherService implements ILuxConsentDialogLauncher {
  private readonly dialogService = inject(LuxDialogService);

  open(onClosed?: () => void, onError?: (error: unknown) => void): void {
    // Lazy-load to avoid circular dependency with the dialog component.
    import('./lux-consent-dialog.component')
      .then(({ LuxConsentDialogComponent }) => {
        const dialogRef = this.dialogService.openComponent(LuxConsentDialogComponent, {
          maxWidth: minWidth(DIALOG_WIDTH_LARGE_PX),
          minHeight: '40%',
          panelClass: 'lux-consent-dialog'
        });

        if (onClosed) {
          dialogRef.dialogClosed.pipe(take(1)).subscribe(() => {
            onClosed();
          });
        }
      })
      .catch((error) => {
        onError?.(error);
      });
  }
}
