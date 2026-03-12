import { inject, InjectionToken } from '@angular/core';
import { LuxConsentDialogLauncherService } from './lux-consent-dialog-launcher.service';

export interface ILuxConsentDialogLauncher {
  open(onClosed?: () => void, onError?: (error: unknown) => void): void;
}

export const LUX_CONSENT_DIALOG_LAUNCHER = new InjectionToken<ILuxConsentDialogLauncher>(
  'LUX_CONSENT_DIALOG_LAUNCHER',
  {
    providedIn: 'root',
    factory: () => inject(LuxConsentDialogLauncherService)
  }
);
