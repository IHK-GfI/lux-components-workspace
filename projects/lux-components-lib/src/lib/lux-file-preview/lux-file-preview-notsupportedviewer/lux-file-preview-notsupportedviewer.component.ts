import { Component, OnInit } from '@angular/core';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxFilePreviewBase } from '../lux-file-preview-base/lux-file-preview-base';
import { LuxFilePreviewToolbarComponent } from '../lux-file-preview-toolbar/lux-file-preview-toolbar.component';

@Component({
  selector: 'lux-file-preview-notsupportedviewer',
  templateUrl: './lux-file-preview-notsupportedviewer.component.html',
  imports: [LuxFilePreviewToolbarComponent, LuxButtonComponent, LuxAriaLabelDirective]
})
export class LuxFilePreviewNotSupportedViewerComponent extends LuxFilePreviewBase implements OnInit {
  counter = 5;
  timer: any;

  downloadLabelDefault = $localize`:@@luxc.file-preview.notsupportedviewer.download.lbl:Download... `;
  downloadLabel = 'Zur Ansicht Downloaden';

  override onDownload() {
    super.onDownload();
  }

  override onClose() {
    super.onClose();
  }
}
