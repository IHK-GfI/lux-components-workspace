import { Component, OnDestroy, inject } from '@angular/core';
import { LuxIconComponent, LuxMediaQueryObserverService } from '@ihk-gfi/lux-components';
import { Subscription } from 'rxjs';
import { LUX_FILE_PREVIEW_DATA } from '../lux-file-preview-config';
import { LuxFilePreviewData } from '../lux-file-preview-data';

@Component({
  selector: 'lux-file-preview-toolbar',
  templateUrl: './lux-file-preview-toolbar.component.html',
  imports: [LuxIconComponent]
})
export class LuxFilePreviewToolbarComponent implements OnDestroy {
  private mediaQueryService = inject(LuxMediaQueryObserverService);
  data = inject<LuxFilePreviewData>(LUX_FILE_PREVIEW_DATA);

  mobileView: boolean;
  subscription: Subscription;

  constructor() {
    this.mobileView = this.mediaQueryService.activeMediaQuery === 'xs';

    this.subscription = this.mediaQueryService.getMediaQueryChangedAsObservable().subscribe((query: string) => {
      this.mobileView = query === 'xs';
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
