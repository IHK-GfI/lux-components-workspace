import { inject } from '@angular/core';
import { CanDeactivateFn } from '@angular/router';
import { DIALOG_WIDTH_MEDIUM, ILuxDialogPresetConfig, LuxDialogService } from '@ihk-gfi/lux-components';
import { LuxLoadingService } from '@ihk-gfi/lux-components/lux-loading';
import { TranslocoService } from '@jsverse/transloco';
import { map, merge, take } from 'rxjs';
import { ILuxLeaveGuard } from './lux-leave-guard.interface';

const LUX_LEAVE_GUARD_UNSAVED_DIALOG_BASE: ILuxDialogPresetConfig = {
  disableClose: true,
  width: DIALOG_WIDTH_MEDIUM,
  height: 'auto',
  defaultButton: 'decline'
};

const LUX_LEAVE_GUARD_BUSY_DIALOG_BASE: ILuxDialogPresetConfig = {
  disableClose: true,
  width: DIALOG_WIDTH_MEDIUM,
  height: 'auto',
  defaultButton: 'confirm'
};

/**
 * Schützt eine Route vor dem unbeabsichtigten Verlassen mit ungespeicherten Änderungen.
 *
 * Die geschützte Komponente muss {@link ILuxLeaveGuard} implementieren. Liegen ungespeicherte Daten vor,
 * öffnet der Guard einen Bestätigungsdialog. Solange ein blockierender Vorgang läuft (siehe LuxLoadingService),
 * wird die Navigation stattdessen mit einem Hinweisdialog abgelehnt.
 *
 * @example
 * ```typescript
 * // app.routes.ts
 * {
 *   path: 'form',
 *   component: MyFormComponent,
 *   canDeactivate: [luxLeaveGuard]
 * }
 * ```
 */
export const luxLeaveGuard: CanDeactivateFn<ILuxLeaveGuard> = (component) => {
  const loadingService = inject(LuxLoadingService);
  const dialogService = inject(LuxDialogService);
  const tService = inject(TranslocoService);

  if (loadingService.isLoading()) {
    const dialogRef = dialogService.open({
      ...LUX_LEAVE_GUARD_BUSY_DIALOG_BASE,
      title: tService.translate('luxc.leave-guard.busy.title'),
      content: tService.translate('luxc.leave-guard.busy.content'),
      confirmAction: {
        label: tService.translate('luxc.leave-guard.busy.close'),
        outlined: true,
        color: 'primary'
      }
    });
    return dialogRef.dialogClosed.pipe(
      map(() => false),
      take(1)
    );
  }

  if (!component?.hasUnsavedData()) {
    return true;
  }

  const dialogRef = dialogService.open({
    ...LUX_LEAVE_GUARD_UNSAVED_DIALOG_BASE,
    title: tService.translate('luxc.leave-guard.unsaved.title'),
    content: tService.translate('luxc.leave-guard.unsaved.content'),
    confirmAction: {
      label: tService.translate('luxc.leave-guard.unsaved.confirm'),
      outlined: true,
      color: 'warn'
    },
    declineAction: {
      label: tService.translate('luxc.leave-guard.unsaved.decline'),
      outlined: true,
      color: 'primary'
    }
  });
  return merge(dialogRef.dialogConfirmed.pipe(map(() => true)), dialogRef.dialogDeclined.pipe(map(() => false))).pipe(take(1));
};
