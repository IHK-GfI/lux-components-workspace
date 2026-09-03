import { ChangeDetectionStrategy, Component, ElementRef, inject, input, OnDestroy, output, signal, viewChild } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { LuxButtonComponent } from '../../../lux-action/lux-button/lux-button.component';
import { LuxAriaExpandedDirective } from '../../../lux-directives/lux-aria/lux-aria-expanded.directive';
import { LuxAriaLabelDirective } from '../../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxMediaQueryObserverService } from '../../../lux-util/lux-media-query-observer.service';

@Component({
  selector: 'lux-master-header-ac',
  templateUrl: './lux-master-header-ac.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.lux-no-toggle]': 'isMobile()'
  },
  imports: [LuxAriaLabelDirective, LuxAriaExpandedDirective, LuxButtonComponent]
})
export class LuxMasterHeaderAcComponent implements OnDestroy {
  readonly luxToggleHidden = input<boolean | undefined>();
  readonly luxOpened = output<boolean>();

  readonly headerContentContainer = viewChild.required('headerContentContainer', { read: ElementRef });

  readonly iconName = signal('lux-interface-arrows-button-left');
  open?: boolean;
  subscription: Subscription;

  readonly isMobile = signal(false);

  private mediaObserver = inject(LuxMediaQueryObserverService);
  private tService = inject(TranslocoService);

  constructor() {
    this.isMobile.set(this.mediaObserver.isXS() || this.mediaObserver.isSM());
    this.open = true;

    this.subscription = this.mediaObserver.getMediaQueryChangedAsObservable().subscribe(() => {
      setTimeout(() => {
        this.isMobile.set(this.mediaObserver.isXS() || this.mediaObserver.isSM());
      });
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  getAriaLabelForOpenCloseButton(iconName?: string): string {
    if (iconName === 'lux-interface-arrows-button-left') {
      return this.tService.translate('luxc.master-detail.header.close.btn');
    } else {
      return this.tService.translate('luxc.master-detail.header.open.btn');
    }
  }

  clicked(that: LuxButtonComponent) {
    if (this.iconName() === 'lux-interface-arrows-button-left') {
      this.iconName.set('lux-interface-arrows-button-right');
      this.open = false;
    } else {
      this.iconName.set('lux-interface-arrows-button-left');
      this.open = true;
    }

    this.luxOpened.emit(!!this.open);
  }
}
