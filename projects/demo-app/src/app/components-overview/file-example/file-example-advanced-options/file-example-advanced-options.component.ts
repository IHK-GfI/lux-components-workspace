import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import {
  ILuxFileActionConfig,
  ILuxFileListDeleteActionConfig,
  LuxAccordionComponent,
  LuxInputComponent,
  LuxPanelComponent,
  LuxPanelContentComponent,
  LuxPanelHeaderTitleComponent,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import { FileExampleComponent } from '../file-example.component';

@Component({
  selector: 'app-file-example-advanced-options',
  templateUrl: './file-example-advanced-options.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxAccordionComponent,
    LuxPanelHeaderTitleComponent,
    LuxPanelContentComponent,
    LuxPanelComponent,
    LuxToggleComponent,
    LuxInputComponent
  ]
})
export class FileExampleAdvancedOptionsComponent {
  readonly fileExample = input.required<FileExampleComponent<any, any>>();
  readonly showHeaderConfigProperties = input.required<boolean>();

  // Die Configs werden als neue Objekte zugewiesen, da eine reine Mutation der verschachtelten
  // Properties von den OnPush-File-Components (anderer Zweig im Komponentenbaum) nicht erkannt wird.
  updateUploadActionConfig(patch: Record<string, unknown>) {
    const fileExample = this.fileExample();
    fileExample.uploadActionConfig = { ...fileExample.uploadActionConfig, ...patch };
  }

  updateDeleteActionConfig(patch: Partial<ILuxFileListDeleteActionConfig>) {
    const fileExample = this.fileExample();
    fileExample.deleteActionConfig = { ...fileExample.deleteActionConfig, ...patch };
  }

  updateViewActionConfig(patch: Partial<ILuxFileActionConfig>) {
    const fileExample = this.fileExample();
    fileExample.viewActionConfig = { ...fileExample.viewActionConfig, ...patch };
  }

  updateDownloadActionConfig(patch: Partial<ILuxFileActionConfig>) {
    const fileExample = this.fileExample();
    fileExample.downloadActionConfig = { ...fileExample.downloadActionConfig, ...patch };
  }
}
