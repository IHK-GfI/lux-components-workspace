import { ChangeDetectionStrategy, Component, effect, inject, signal, viewChild } from '@angular/core';
import { LUX_FILE_PREVIEW_DATA } from './lux-file-preview-config';
import { LuxFilePreviewData } from './lux-file-preview-data';
import { LuxFilePreviewImgViewerComponent } from './lux-file-preview-imgviewer/lux-file-preview-imgviewer.component';
import { LuxFilePreviewNotSupportedViewerComponent } from './lux-file-preview-notsupportedviewer/lux-file-preview-notsupportedviewer.component';
import { LuxFilePreviewPdfViewerComponent } from './lux-file-preview-pdfviewer/lux-file-preview-pdfviewer.component';

@Component({
  selector: 'lux-file-preview',
  templateUrl: './lux-file-preview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxFilePreviewPdfViewerComponent, LuxFilePreviewImgViewerComponent, LuxFilePreviewNotSupportedViewerComponent]
})
export class LuxFilePreviewComponent {
  readonly pdfViewer = viewChild(LuxFilePreviewPdfViewerComponent);
  readonly imgViewer = viewChild(LuxFilePreviewImgViewerComponent);
  readonly notSupportedViewer = viewChild(LuxFilePreviewNotSupportedViewerComponent);

  fileType = signal<'img' | 'pdf' | 'txt' | 'notsupported'>('notsupported');

  private readonly data = inject<LuxFilePreviewData>(LUX_FILE_PREVIEW_DATA);

  constructor() {
    effect(() => {
      if (this.data && this.data.fileObject) {
        if (this.data.fileObject.type.indexOf('image/') > -1) {
          this.fileType.set('img');
        } else if (this.data.fileObject.type.indexOf('application/pdf') > -1) {
          this.fileType.set('pdf');
        } else if (this.data.fileObject.type.indexOf('text/plain') > -1) {
          this.fileType.set('txt');
        } else {
          this.fileType.set('notsupported');
        }
      }
    });
  }

  onClose() {
    if (this.pdfViewer()) {
      this.pdfViewer()?.onClose();
    } else if (this.imgViewer()) {
      this.imgViewer()?.onClose();
    } else if (this.notSupportedViewer()) {
      this.notSupportedViewer()?.onClose();
    }
  }
}
