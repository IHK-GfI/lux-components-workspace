/**
 * Standard-Breiten für LuxDialog
 */
export const DIALOG_WIDTH_SMALL_PX = 400;
export const DIALOG_WIDTH_MEDIUM_PX = 600;
export const DIALOG_WIDTH_LARGE_PX = 800;

export const DIALOG_WIDTH_SMALL = DIALOG_WIDTH_SMALL_PX + 'px';
export const DIALOG_WIDTH_MEDIUM = DIALOG_WIDTH_MEDIUM_PX + 'px';
export const DIALOG_WIDTH_LARGE = DIALOG_WIDTH_LARGE_PX + 'px';

/**
 * Config-Interface für die Dialoge.
 */
export interface ILuxDialogConfig {
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
  panelClass?: string | string[];
  disableClose?: boolean;
  /**
   * Wenn true, werden Backdrop-Klicks und die ESC-Taste ignoriert —
   * der X-Schließen-Button bleibt jedoch sichtbar. Unterschied zu
   * `disableClose`: `disableClose` verhindert zusätzlich das Anzeigen
   * des X-Buttons.
   */
  disableBackdropAndEscClose?: boolean;
}

export const DEFAULT_DIALOG_CONF: ILuxDialogConfig = {
  width: 'auto',
  height: 'auto',
  panelClass: [],
  disableClose: true
};

export function minWidth(width: number): string {
  if (typeof window === 'undefined') {
    return width + 'px';
  }

  return Math.min(width, window.innerWidth - 50) + 'px';
}
