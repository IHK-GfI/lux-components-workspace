import { TemplateRef } from '@angular/core';
import { ILuxDialogAction } from './lux-dialog-action.interface';
import { ILuxDialogConfig } from './lux-dialog-config.interface';

export declare type LuxDialogDefaultButton = 'confirm' | 'decline' | undefined;

/**
 * Config-Interface für die LuxDialogPresetComponent.
 */
export interface ILuxDialogPresetConfig extends ILuxDialogConfig {
  confirmAction?: ILuxDialogAction;
  declineAction?: ILuxDialogAction;
  defaultButton?: LuxDialogDefaultButton;
  title?: string;
  iconName?: string;
  content?: string;
  contentTemplate?: TemplateRef<any>;
}

export const DEFAULT_DIALOG_PRESET_CONF: ILuxDialogPresetConfig = {
  width: 'auto',
  height: 'auto',
  title: '',
  content: '',
  panelClass: [],
  disableClose: true,
  contentTemplate: undefined,
  confirmAction: {
    label: '',
    flat: true,
    color: 'primary'
  },
  declineAction: {
    label: '',
    outlined: true,
    color: 'primary'
  },
  defaultButton: undefined
};
