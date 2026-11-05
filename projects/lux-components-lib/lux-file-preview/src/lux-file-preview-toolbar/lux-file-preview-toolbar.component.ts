import { ChangeDetectionStrategy, Component, inject, OnDestroy, signal } from '@angular/core';
import { LuxIconComponent, LuxMediaQueryObserverService } from '@ihk-gfi/lux-components';
import { LUX_FILE_PREVIEW_DATA } from '../lux-file-preview-config';
import { LuxFilePreviewData } from '../lux-file-preview-data';

@Component({
  selector: 'lux-file-preview-toolbar',
  templateUrl: './lux-file-preview-toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxIconComponent]
})
export class LuxFilePreviewToolbarComponent implements OnDestroy {
  data = inject<LuxFilePreviewData>(LUX_FILE_PREVIEW_DATA);

  private mediaQueryService = inject(LuxMediaQueryObserverService);

  mobileView = signal(this.mediaQueryService.activeMediaQuery === 'xs');

  private unsubscribe: (() => void) | null = null;

  constructor() {
    const subscription = this.mediaQueryService.getMediaQueryChangedAsObservable().subscribe((query: string) => {
      this.mobileView.set(query === 'xs');
    });

    this.unsubscribe = () => subscription.unsubscribe();
  }

  ngOnDestroy() {
    this.unsubscribe?.();
  }
}
