import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  inject
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
export class LuxTabsComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  componentsConfigService = inject(LuxComponentsConfigService);
  private queryService = inject(LuxMediaQueryObserverService);

  private static readonly _DEBOUNCE_TIME: number = 50;

  private static _notificationNewClass = 'lux-notification-new';
  private static _notificationReadClass = 'lux-notification-read';

  private subscriptions: Subscription[] = [];

  tabChange$: ReplaySubject<MatTabChangeEvent> = new ReplaySubject<MatTabChangeEvent>(1);
  labelUppercase?: boolean;
  smallDevice?: boolean;

  @Input() luxActiveTab = 0;
  @Input() luxIconSize = '2x';
  @Input() luxDisplayDivider = true;
  @Input() luxTagId?: string;
  @Input() luxLazyLoading = false;
  @Input() luxShowBorder = false;

  @Output() luxActiveTabChanged = new EventEmitter<MatTabChangeEvent>();

  @ContentChildren(LuxTabComponent) luxTabs!: QueryList<LuxTabComponent>;
  @ViewChild('matTabs', { read: ElementRef, static: true }) tabHeader!: ElementRef;

  ngOnInit() {
    this.subscriptions.push(
      this.tabChange$
        .asObservable()
        .pipe(debounceTime(LuxTabsComponent._DEBOUNCE_TIME))
        .subscribe((tabChange: MatTabChangeEvent) => {
          this.luxActiveTab = tabChange.index;
          this.luxActiveTabChanged.emit(tabChange);
        })
    );

    this.subscriptions.push(
      this.componentsConfigService.config.subscribe(() => {
        this.labelUppercase = this.componentsConfigService.isLabelUppercaseForSelector('lux-tab');
      })
    );

    this.subscriptions.push(
      this.queryService.getMediaQueryChangedAsObservable().subscribe((query) => {
        this.smallDevice = query === 'xs' || query === 'sm';
      })
    );
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    const activeTabChange = simpleChanges['activeTab'];
    if (activeTabChange) {
      if (!activeTabChange.currentValue) {
        this.luxActiveTab = 0;
      }
    }
  }

  ngAfterViewInit() {
    this.rerenderTabs();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  getNotificationIconColorClassForTab(luxTab: LuxTabComponent): string {
    return luxTab.luxShowNotification === true ? LuxTabsComponent._notificationNewClass : LuxTabsComponent._notificationReadClass;
  }

  /**
   * Forciert Angular die Tab-Header neu zu prüfen, in dem
   * der erste Tab ein Leerzeichen bekommt, welches im nächsten
   * Prüfzyklus entfernt wird.
   */
  rerenderTabs() {
    if (this.luxTabs.length > 0) {
      setTimeout(() => {
        this.luxTabs.first.luxTitle += ' ';
        setTimeout(() => {
          this.luxTabs.first.luxTitle = this.luxTabs.first.luxTitle.trim();
        });
      });
    }
  }

  trackTab(index: number, luxTab: LuxTabComponent) {
    return index;
  }
}
