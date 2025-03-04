import { Component, Input, OnInit } from '@angular/core';
import {
  LuxAccordionComponent,
  LuxInputAcComponent,
  LuxPanelComponent,
  LuxPanelContentComponent,
  LuxPanelHeaderTitleComponent,
  LuxToggleAcComponent,
  LuxUtil
} from 'lux-components-lib';
import { FileExampleComponent } from '../file-example.component';

@Component({
  selector: 'app-file-example-advanced-options',
  templateUrl: './file-example-advanced-options.component.html',
  imports: [
    LuxAccordionComponent,
    LuxPanelHeaderTitleComponent,
    LuxPanelContentComponent,
    LuxPanelComponent,
    LuxToggleAcComponent,
    LuxInputAcComponent
  ]
})
export class FileExampleAdvancedOptionsComponent implements OnInit {
  @Input() fileExample!: FileExampleComponent<any, any>;
  @Input() showHeaderConfigProperties!: boolean;

  constructor() {}

  ngOnInit() {
    LuxUtil.assertNonNull('fileExample', this.fileExample);
    LuxUtil.assertNonNull('showHeaderConfigProperties', this.showHeaderConfigProperties);
  }
}
