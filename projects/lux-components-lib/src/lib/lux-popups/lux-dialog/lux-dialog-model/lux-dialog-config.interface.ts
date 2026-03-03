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
}

export const DEFAULT_DIALOG_CONF: ILuxDialogConfig = {
  width: 'auto',
  height: 'auto',
  panelClass: [],
  disableClose: true
};
