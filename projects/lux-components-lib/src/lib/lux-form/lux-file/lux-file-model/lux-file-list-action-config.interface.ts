import { ILuxFileActionConfig, ILuxFilesActionConfig } from './lux-file-action-config.interface';
import { ILuxFileObject } from './lux-file-object.interface';

export interface ILuxFileListDeleteActionConfig extends ILuxFileListActionConfig {
  isDeletable?: (file: ILuxFileObject) => boolean;
}

export interface ILuxFileListActionConfig extends ILuxFileActionConfig {
  hiddenHeader: boolean;
  disabledHeader: boolean;
  iconNameHeader: string;
  labelHeader: string;
}

export interface ILuxFilesListActionConfig extends ILuxFilesActionConfig {
  hiddenHeader: boolean;
  disabledHeader: boolean;
  iconNameHeader: string;
  labelHeader: string;
}
