import { LuxSnackbarColor, LuxSnackbarType } from '@ihk-gfi/lux-components';

export class LuxSnackbarConfig {
  type?: LuxSnackbarType;
  iconName?: string = '';
  iconSize?: string = '3x';
  iconColor?: string = '';
  text?: string = '';
  textColor?: string = '';
  action?: string = '';
  actionColor?: string = '';
  /**
   * Zeigt einen Ok-Button zum Schließen an. Ohne Angabe erscheint er automatisch bei Nachrichten ohne Action,
   * da sich diese sonst nicht schließen ließen (Dauer 0, verborgene Nachrichten, pausierte Timer).
   */
  showCloseButton?: boolean;

  constructor(partial: Partial<LuxSnackbarConfig>) {
    Object.assign(this, partial);
  }
}

/**
 * Standard-Icon und -Farbe je Typ. Sie greifen nur, wenn iconName bzw. iconColor nicht gesetzt sind.
 */
export const LUX_SNACKBAR_TYPE_DEFAULTS: Record<LuxSnackbarType, { iconName: string; iconColor: LuxSnackbarColor }> = {
  info: { iconName: 'lux-interface-alert-information-circle', iconColor: 'blue' },
  warning: { iconName: 'lux-interface-alert-warning-triangle', iconColor: 'orange' },
  error: { iconName: 'lux-interface-alert-warning-diamond', iconColor: 'red' },
  success: { iconName: 'lux-interface-validation-check-circle', iconColor: 'green' }
};
