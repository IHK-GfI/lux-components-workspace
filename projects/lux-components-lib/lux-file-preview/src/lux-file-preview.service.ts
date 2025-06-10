import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ComponentRef, Injectable, Injector, inject } from '@angular/core';
import { LUX_FILE_PREVIEW_DATA, LuxFilePreviewConfig } from './lux-file-preview-config';
import { LuxFilePreviewRef } from './lux-file-preview-ref';
import { LuxFilePreviewComponent } from './lux-file-preview.component';

export const DEFAULT_FILE_PREVIEW_CONFIG: LuxFilePreviewConfig = {
  hasBackdrop: true,
  backdropClass: 'lux-file-preview-backdrop',
  panelClass: 'lux-file-preview-panel',
  previewData: {
    fileComponent: undefined,
    fileObject: undefined
  }
};

@Injectable({
  providedIn: 'root'
})
export class LuxFilePreviewService {
  private injector = inject(Injector);
  private overlay = inject(Overlay);

  open(config: LuxFilePreviewConfig): LuxFilePreviewRef {
    const previewConfig = { ...DEFAULT_FILE_PREVIEW_CONFIG, ...config };
    const activeElement = (document.activeElement instanceof HTMLElement) ? document.activeElement : null;
    const overlayRef = this.createOverlay(previewConfig);
    const previewRef = new LuxFilePreviewRef(overlayRef, activeElement);
    const previewComponent = this.attachDialogContainer(overlayRef, previewRef, previewConfig);

    overlayRef.backdropClick().subscribe(() => previewComponent.onClose());

    return previewRef;
  }

  private attachDialogContainer(overlayRef: OverlayRef, dialogRef: LuxFilePreviewRef, config: LuxFilePreviewConfig) {
    const injector = this.createInjector(config, dialogRef);
    const containerPortal = new ComponentPortal(LuxFilePreviewComponent, null, injector);
    const containerRef: ComponentRef<LuxFilePreviewComponent> = overlayRef.attach(containerPortal);

    return containerRef.instance;
  }

  private createOverlay(config: LuxFilePreviewConfig) {
    return this.overlay.create(this.getOverlayConfig(config));
  }

  private createInjector(config: LuxFilePreviewConfig, dialogRef: LuxFilePreviewRef): Injector {
    return Injector.create({
      parent: this.injector,
      providers: [
        { provide: LuxFilePreviewRef, useValue: dialogRef },
        { provide: LUX_FILE_PREVIEW_DATA, useValue: config.previewData }
      ]
    });
  }

  private getOverlayConfig(config: LuxFilePreviewConfig): OverlayConfig {
    const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();

    return new OverlayConfig({
      hasBackdrop: config.hasBackdrop,
      backdropClass: config.backdropClass,
      panelClass: config.panelClass,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });
  }
}
