import { NgStyle } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';
import { LuxAriaLabelDirective, LuxButtonComponent } from '@ihk-gfi/lux-components';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxFilePreviewBase } from '../lux-file-preview-base/lux-file-preview-base';
import { LuxFilePreviewToolbarComponent } from '../lux-file-preview-toolbar/lux-file-preview-toolbar.component';

@Component({
  selector: 'lux-file-preview-pdfviewer',
  templateUrl: './lux-file-preview-pdfviewer.component.html',
  imports: [LuxFilePreviewToolbarComponent, LuxButtonComponent, LuxAriaLabelDirective, NgStyle, TranslocoPipe]
})
export class LuxFilePreviewPdfViewerComponent extends LuxFilePreviewBase implements AfterViewInit {
  private elementRef = inject(ElementRef);

  ngAfterViewInit(): void {
    setTimeout(() => {
      const firstButton = (this.elementRef.nativeElement as HTMLElement).querySelector('button');
      if (firstButton) {
        firstButton.focus();
      }
    });
  }
}
