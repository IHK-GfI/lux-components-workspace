import { NgStyle } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { LuxAriaLabelDirective, LuxButtonComponent } from '@ihk-gfi/lux-components';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxFilePreviewBase } from '../lux-file-preview-base/lux-file-preview-base';
import { LuxFilePreviewToolbarComponent } from '../lux-file-preview-toolbar/lux-file-preview-toolbar.component';

@Component({
  selector: 'lux-file-preview-imgviewer',
  templateUrl: './lux-file-preview-imgviewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxFilePreviewToolbarComponent, LuxButtonComponent, LuxAriaLabelDirective, NgStyle, TranslocoPipe]
})
export class LuxFilePreviewImgViewerComponent extends LuxFilePreviewBase implements AfterViewInit {
  private elementRef = inject(ElementRef);

  previewImg = viewChild<ElementRef>('previewImg');

  zoomActive = signal(false);
  zoomWidth = signal(0);
  zoomStep = 250;

  ngAfterViewInit(): void {
    setTimeout(() => {
      const img = this.previewImg();
      if (img) {
        this.zoomActive.set(img.nativeElement.naturalWidth - this.paddingWith > window.innerWidth);

        const firstButton = (this.elementRef.nativeElement as HTMLElement).querySelector('button');
        if (firstButton) {
          firstButton.focus();
        }
      }
    });
  }

  onLoad() {
    const img = this.previewImg();
    if (img) {
      this.zoomActive.set(img.nativeElement.naturalWidth - this.paddingWith > window.innerWidth);
    }
    this.loadingFinished();
  }

  onZoomIn() {
    this.zoomWidth.update((width) => width + this.zoomStep);
    this.clearFocus();
  }

  onZoomOut() {
    this.zoomWidth.update((width) => width - this.zoomStep);
    this.clearFocus();
  }
}
