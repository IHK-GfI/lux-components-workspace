import { Component, Input, OnInit } from '@angular/core';
import {
    LuxFormHintComponent,
    LuxInputAcComponent,
    LuxInputAcSuffixComponent,
    LuxSelectAcComponent,
    LuxToggleAcComponent,
    LuxUtil
} from '@ihk-gfi/lux-components';
import { ExampleFormDisableComponent } from '../../../example-base/example-form-disable/example-form-disable.component';
import { FileExampleComponent } from '../file-example.component';

@Component({
  selector: 'app-file-example-simple-options',
  templateUrl: './file-example-simple-options.component.html',
  imports: [
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxInputAcSuffixComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    ExampleFormDisableComponent
  ]
})
export class FileExampleSimpleOptionsComponent implements OnInit {
  @Input() fileExample!: FileExampleComponent;

  constructor() {}

  ngOnInit() {
    LuxUtil.assertNonNull('fileExample', this.fileExample);
  }
}
