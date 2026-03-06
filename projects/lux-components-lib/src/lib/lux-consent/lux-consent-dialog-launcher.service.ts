import { Injectable, inject } from '@angular/core';
import { take } from 'rxjs';
import { LuxDialogService } from '../lux-popups/lux-dialog/lux-dialog.service';
import { LuxMediaQueryObserverService } from '../lux-util/lux-media-query-observer.service';
import { ILuxConsentDialogLauncher } from './lux-consent-dialog-launcher';

@Injectable({
  providedIn: 'root'
})
export class LuxConsentDialogLauncherService implements ILuxConsentDialogLauncher {
  private readonly dialogService = inject(LuxDialogService);
  private readonly mediaService = inject(LuxMediaQueryObserverService);

  open(onClosed?: () => void, onError?: (error: unknown) => void): void {
    // Lazy-load to avoid circular dependency with the dialog component.
    import('./lux-consent-dialog.component')
      .then(({ LuxConsentDialogComponent }) => {
        const dialogRef = this.dialogService.openComponent(LuxConsentDialogComponent, {
          width: 'auto',
          height: this.mediaService.isSmaller('md') ? '90%' : '80%',
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
