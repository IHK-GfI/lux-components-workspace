import { Directive, HostListener, inject, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { LuxUtil } from '../../lux-util/lux-util';
import { LUX_FILE_PREVIEW_DATA } from '../lux-file-preview-config';
import { LuxFilePreviewData } from '../lux-file-preview-data';
import { LuxFilePreviewRef } from '../lux-file-preview-ref';

@Directive()
export class LuxFilePreviewBase implements OnInit, OnDestroy {
  protected previewRef = inject(LuxFilePreviewRef);
  protected previewData = inject<LuxFilePreviewData>(LUX_FILE_PREVIEW_DATA);
  protected sanitizer = inject(DomSanitizer);

  url?: SafeResourceUrl;
  urls: SafeResourceUrl[] = [];

  paddingWith = 100;
  paddingHeight = 150;

  height = 0;
  width = 0;

  startPhase = true;
  startDurationMs = 250;
  loading = true;
  loadingTimer: any;

  downloadIconName = 'lux-interface-download-button-2';
  downloadTagId = 'file-preview-download-btn';
  downloadAriaLabel = $localize`:@@luxc.file-preview.download.arialabel:Datei herunterladen`;

  closeIconName = 'lux-interface-delete-1';
  closeTagId = 'file-preview-close-btn';
  closeAriaLabel = $localize`:@@luxc.file-preview.close.arialabel:Dateivorschau schließen`;

  @HostListener('document:keydown', ['$event'])
  handleKeydown(keyboardEvent: KeyboardEvent) {
    if (LuxUtil.isKeyEscape(keyboardEvent)) {
      this.onClose();
    }
  }

  @HostListener('window:resize')
  windowResize() {
    this.updateWidthAndHeight();
  }

  ngOnInit() {
    this.loadingTimer = setTimeout(() => {
      this.startPhase = false;
    }, this.startDurationMs);

    this.updateWidthAndHeight();

    setTimeout(() => {
      if (this.previewData.fileObject) {
        let myBlob: Blob | undefined;
        if ('string' === typeof this.previewData.fileObject.content) {
          myBlob = new Blob([LuxUtil.base64ToArrayBuffer(this.previewData.fileObject.content.split(',')[1])], {
            type: this.previewData.fileObject.type
          });
        } else {
          myBlob = this.previewData.fileObject.content;
        }

        if (myBlob) {
          const fileName = this.previewData.fileObject.name;
          const file = new File([myBlob], fileName, { type: this.previewData.fileObject.type });
          this.url = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(file) + '#page=1&toolbar=1');
          this.urls.push(this.url);
        }
      }
    });
  }

  ngOnDestroy() {
    this.urls.forEach((url) => {
      window.URL.revokeObjectURL(url.toString());
    });
  }

  onDownload() {
    if (this.previewData && this.previewData.fileComponent && this.previewData.fileObject) {
      this.previewData.fileComponent.downloadFile(this.previewData.fileObject);
      this.previewRef.close();
    }
  }

  onClose() {
    this.previewRef.close();
  }

  loadingFinished() {
    this.loading = false;
  }

  clearFocus() {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  updateWidthAndHeight() {
    this.width = window.innerWidth - this.paddingWith;
    this.height = window.innerHeight - this.paddingHeight;
  }
}
