import { Component, computed, input, ChangeDetectionStrategy } from '@angular/core';
import {
  LuxFormHintComponent,
  LuxInputComponent,
  LuxInputSuffixComponent,
  LuxSelectComponent,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import { ExampleFormDisableComponent } from '../../../example-base/example-form-disable/example-form-disable.component';
import { FileExampleComponent } from '../file-example.component';
import { FileListExampleComponent } from '../file-list-example/file-list-example.component';

@Component({
  selector: 'app-file-example-simple-options',
  templateUrl: './file-example-simple-options.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxToggleComponent,
    LuxSelectComponent,
    LuxInputComponent,
    LuxFormHintComponent,
    ExampleFormDisableComponent,
    LuxInputSuffixComponent
  ]
})
export class FileExampleSimpleOptionsComponent {
  readonly fileExample = input.required<FileExampleComponent>();

  readonly isFileListExample = computed(() => this.fileExample() instanceof FileListExampleComponent);
}
