import { Component, OnInit } from '@angular/core';
import { LuxAriaLabelDirective, LuxButtonComponent } from '@ihk-gfi/lux-components';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxFilePreviewBase } from '../lux-file-preview-base/lux-file-preview-base';
import { LuxFilePreviewToolbarComponent } from '../lux-file-preview-toolbar/lux-file-preview-toolbar.component';

@Component({
  selector: 'lux-file-preview-notsupportedviewer',
  templateUrl: './lux-file-preview-notsupportedviewer.component.html',
  imports: [LuxFilePreviewToolbarComponent, LuxButtonComponent, LuxAriaLabelDirective, TranslocoPipe]
})
export class LuxFilePreviewNotSupportedViewerComponent extends LuxFilePreviewBase implements OnInit {
  counter = 5;
  timer: any;

  override onDownload() {
    super.onDownload();
  }

  override onClose() {
    super.onClose();
  }
}
