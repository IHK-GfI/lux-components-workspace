import { OverlayRef } from '@angular/cdk/overlay';

export class LuxFilePreviewRef {
  private activeElement: HTMLElement | null;

  constructor(private overlayRef: OverlayRef, activeElement?: HTMLElement | null) {
    this.activeElement = activeElement || null;
  }

  close(): void {
    this.overlayRef.dispose();

    if (this.activeElement) {
      this.activeElement.focus();
    }
  }
}
