import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import {
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
}
