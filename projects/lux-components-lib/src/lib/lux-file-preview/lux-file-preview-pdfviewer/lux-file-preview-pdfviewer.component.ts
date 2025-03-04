import { NgStyle } from '@angular/common';
import { AfterViewInit, Component, ElementRef, inject } from '@angular/core';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxFilePreviewBase } from '../lux-file-preview-base/lux-file-preview-base';
import { LuxFilePreviewToolbarComponent } from '../lux-file-preview-toolbar/lux-file-preview-toolbar.component';

@Component({
  selector: 'lux-file-preview-pdfviewer',
  templateUrl: './lux-file-preview-pdfviewer.component.html',
  imports: [LuxFilePreviewToolbarComponent, LuxButtonComponent, LuxAriaLabelDirective, NgStyle]
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
