import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  ElementRef,
  inject,
  input,
  model,
  OnDestroy,
  OnInit,
  output,
  signal,
  viewChild
} from '@angular/core';
import { MatTab, MatTabChangeEvent, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { ReplaySubject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxBadgeNotificationDirective } from '../../lux-directives/lux-badge-notification/lux-badge-notification.directive';
import { LuxCustomTagIdDirective } from '../../lux-directives/lux-tag-id/lux-custom-tag-id.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxImageComponent } from '../../lux-icon/lux-image/lux-image.component';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';
import { LuxTabComponent } from './lux-tabs-subcomponents/lux-tab.component';

@Component({
  selector: 'lux-tabs',
  templateUrl: './lux-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    MatTabGroup,
    LuxTagIdDirective,
    LuxCustomTagIdDirective,
    MatTab,
    MatTabLabel,
    NgTemplateOutlet,
    LuxBadgeNotificationDirective,
    LuxIconComponent,
    LuxImageComponent
  ]
})
export class LuxTabsComponent implements OnInit, AfterViewInit, OnDestroy {
  private static readonly _DEBOUNCE_TIME: number = 50;

  private static readonly _notificationReadClass = 'lux-notification-read';

  readonly luxActiveTab = model(0);
  readonly luxIconSize = input('2x');
  readonly luxDisplayDivider = input(true);
  readonly luxTagId = input<string | undefined>();
  readonly luxLazyLoading = input(false);
  readonly luxShowBorder = input(false);

  readonly luxActiveTabChanged = output<MatTabChangeEvent>();

  readonly luxTabs = contentChildren(LuxTabComponent);
  readonly tabHeader = viewChild.required('matTabs', { read: ElementRef });

  componentsConfigService = inject(LuxComponentsConfigService);

  readonly tabChange$: ReplaySubject<MatTabChangeEvent> = new ReplaySubject<MatTabChangeEvent>(1);
  readonly labelUppercase = signal(false);
  readonly smallDevice = signal(false);

  private queryService = inject(LuxMediaQueryObserverService);

  private subscriptions: Subscription[] = [];

  ngOnInit() {
    this.subscriptions.push(
      this.tabChange$
        .asObservable()
        .pipe(debounceTime(LuxTabsComponent._DEBOUNCE_TIME))
        .subscribe((tabChange: MatTabChangeEvent) => {
          this.luxActiveTab.set(tabChange.index);
          this.luxActiveTabChanged.emit(tabChange);
          this.callOnTabActivated();
        })
    );

    this.subscriptions.push(
      this.componentsConfigService.config.subscribe(() => {
        this.labelUppercase.set(this.componentsConfigService.isLabelUppercaseForSelector('lux-tab'));
      })
    );

    this.subscriptions.push(
      this.queryService.getMediaQueryChangedAsObservable().subscribe((query) => {
        this.smallDevice.set(query === 'xs' || query === 'sm');
      })
    );
  }

  ngAfterViewInit() {
    this.rerenderTabs();
    this.callOnTabActivated();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getNotificationIconColorClassForTab(luxTab: LuxTabComponent): string {
    return luxTab.luxShowNotification() === true
      ? `lux-notification-color-${luxTab.luxNotificationColor()}`
      : LuxTabsComponent._notificationReadClass;
  }

  /**
   * Forciert Angular die Tab-Header neu zu prüfen, in dem
   * der erste Tab ein Leerzeichen bekommt, welches im nächsten
   * Prüfzyklus entfernt wird.
   */
  rerenderTabs() {
    const tabs = this.luxTabs();
    if (tabs.length > 0) {
      setTimeout(() => {
        tabs[0].luxTitle.update((title) => title + ' ');
        setTimeout(() => {
          tabs[0].luxTitle.update((title) => title.trim());
        });
      });
    }
  }

  private callOnTabActivated() {
    setTimeout(() => {
      this.luxTabs()[this.luxActiveTab()]?.onTabActivated();
    });
  }
}
