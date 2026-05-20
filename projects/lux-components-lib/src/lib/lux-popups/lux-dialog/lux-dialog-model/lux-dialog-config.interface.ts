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
