import { NgStyle } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { LuxAriaLabelDirective, LuxButtonComponent } from '@ihk-gfi/lux-components';
import { LuxFilePreviewBase } from '../lux-file-preview-base/lux-file-preview-base';
import { LuxFilePreviewToolbarComponent } from '../lux-file-preview-toolbar/lux-file-preview-toolbar.component';

@Component({
  selector: 'lux-file-preview-imgviewer',
  templateUrl: './lux-file-preview-imgviewer.component.html',
  imports: [LuxFilePreviewToolbarComponent, LuxButtonComponent, LuxAriaLabelDirective, NgStyle]
})
export class LuxFilePreviewImgViewerComponent extends LuxFilePreviewBase implements OnInit, AfterViewInit {
  private elementRef = inject(ElementRef);

  @ViewChild('previewImg') previewImg?: ElementRef;

  zoomActive = false;
  zoomWidth = 0;
  zoomStep = 250;

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.previewImg) {
        this.zoomActive = this.previewImg && this.previewImg.nativeElement.naturalWidth - this.paddingWith > window.innerWidth;

        const firstButton = (this.elementRef.nativeElement as HTMLElement).querySelector('button');
        if (firstButton) {
          firstButton.focus();
        }
      }
    });
  }

  onLoad() {
    if (this.previewImg) {
      this.zoomActive = this.previewImg && this.previewImg.nativeElement.naturalWidth - this.paddingWith > window.innerWidth;
    }
    this.loadingFinished();
  }

  onZoomIn() {
    this.zoomWidth += this.zoomStep;
    this.clearFocus();
  }

  onZoomOut() {
    this.zoomWidth -= this.zoomStep;
    this.clearFocus();
  }
}
