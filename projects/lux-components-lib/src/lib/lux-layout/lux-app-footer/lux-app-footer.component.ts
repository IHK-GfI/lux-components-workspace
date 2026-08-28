import { NgClass, NgStyle } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  viewChild
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { LuxLinkComponent } from '../../lux-action/lux-link/lux-link.component';
import { LuxMenuItemComponent } from '../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-item.component';
import { LuxMenuComponent } from '../../lux-action/lux-menu/lux-menu.component';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxAriaRoleDirective } from '../../lux-directives/lux-aria/lux-aria-role.directive';
import { LuxAppService } from '../../lux-util/lux-app.service';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxAppFooterButtonInfo } from './lux-app-footer-button-info';
import { LuxAppFooterButtonService } from './lux-app-footer-button.service';
import { LuxAppFooterLinkInfo } from './lux-app-footer-link-info';
import { LuxAppFooterLinkService } from './lux-app-footer-link.service';

@Component({
  selector: 'lux-app-footer',
  templateUrl: './lux-app-footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAriaRoleDirective, LuxAriaLabelDirective, NgClass, NgStyle, LuxLinkComponent, LuxMenuComponent, LuxMenuItemComponent, TranslocoPipe]
})
export class LuxAppFooterComponent implements OnInit, AfterViewInit, OnDestroy {
  buttonService = inject(LuxAppFooterButtonService);
  private linkService = inject(LuxAppFooterLinkService);
  private mediaObserver = inject(LuxMediaQueryObserverService);
  private elementRef = inject(ElementRef);
  private appService = inject(LuxAppService);
  private cdr = inject(ChangeDetectorRef);
  private configService = inject(LuxComponentsConfigService);

  readonly buttonMenu = viewChild.required<LuxMenuComponent>('buttonMenu');

  readonly luxVersion = input<string | undefined>();
  readonly luxAriaRoleFooterLabel = input('');
  readonly luxCenteredView = input<boolean | undefined>();
  readonly luxCenteredWidth = input<string | undefined>();

  readonly effectiveCenteredView = computed(
    () =>
      this.luxCenteredView() ??
      (this.configService.currentConfig.viewConfiguration?.centeredView
        ? this.configService.currentConfig.viewConfiguration.centeredView
        : LuxComponentsConfigService.DEFAULT_CONFIG.viewConfiguration.centeredView)
  );

  readonly effectiveCenteredWidth = computed(
    () =>
      this.luxCenteredWidth() ??
      (this.configService.currentConfig.viewConfiguration?.centeredWidth
        ? this.configService.currentConfig.viewConfiguration.centeredWidth
        : LuxComponentsConfigService.DEFAULT_CONFIG.viewConfiguration.centeredWidth)
  );

  desktopView?: boolean;
  buttonInfos: LuxAppFooterButtonInfo[] = [];
  linkInfos: LuxAppFooterLinkInfo[] = [];
  subscriptions: Subscription[] = [];

  constructor() {
    this.appService.appFooterEl = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.desktopView = this.mediaObserver.isSM() || this.mediaObserver.isMD() || this.mediaObserver.isLG() || this.mediaObserver.isXL();
    this.subscriptions.push(
      this.mediaObserver.getMediaQueryChangedAsObservable().subscribe(() => {
        this.desktopView = this.mediaObserver.isSM() || this.mediaObserver.isMD() || this.mediaObserver.isLG() || this.mediaObserver.isXL();
        this.cdr.markForCheck();
      })
    );

    this.subscriptions.push(
      this.buttonService.getButtonInfosAsObservable().subscribe((buttonInfos) => {
        this.buttonInfos = buttonInfos;
        this.cdr.markForCheck();
      })
    );

    this.subscriptions.push(
      this.linkService.getLinkInfosAsObservable().subscribe((linkInfos) => {
        this.linkInfos = linkInfos;
        this.cdr.markForCheck();
      })
    );
  }

  ngAfterViewInit() {
    LuxUtil.assertNonNull('buttonMenu', this.buttonMenu());
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  sendButtonCommand(cmd: string) {
    this.buttonService.sendButtonCommand(cmd);
  }
}
