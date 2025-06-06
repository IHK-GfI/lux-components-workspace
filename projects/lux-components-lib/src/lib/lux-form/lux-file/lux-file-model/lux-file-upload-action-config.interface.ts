import { ILuxFileActionConfig } from './lux-file-action-config.interface';
import { ILuxFileObject } from './lux-file-object.interface';

export interface ILuxFileUploadDeleteActionConfig extends ILuxFileActionConfig {
  isDeletable?: (file: ILuxFileObject) => boolean;
}
