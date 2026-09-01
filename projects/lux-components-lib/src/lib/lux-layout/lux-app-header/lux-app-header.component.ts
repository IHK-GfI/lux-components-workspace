import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  contentChild,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  OnInit,
  output,
  viewChild
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { TranslocoPipe } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxMenuItemComponent } from '../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-item.component';
import { LuxMenuTriggerComponent } from '../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-trigger.component';
import { LuxMenuComponent } from '../../lux-action/lux-menu/lux-menu.component';
import { LuxAriaExpandedDirective } from '../../lux-directives/lux-aria/lux-aria-expanded.directive';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxAriaRoleDirective } from '../../lux-directives/lux-aria/lux-aria-role.directive';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxImageComponent } from '../../lux-icon/lux-image/lux-image.component';
import { LuxAppService } from '../../lux-util/lux-app.service';
import { LuxConsoleService } from '../../lux-util/lux-console.service';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';
import { LuxAppHeaderActionNavComponent } from './lux-app-header-subcomponents/lux-app-header-action-nav/lux-app-header-action-nav.component';
import { LuxAppHeaderRightNavComponent } from './lux-app-header-subcomponents/lux-app-header-right-nav/lux-app-header-right-nav.component';
import { LuxLangSelectComponent } from './lux-app-header-subcomponents/lux-lang-select/lux-lang-select.component';
import { LuxSideNavComponent } from './lux-app-header-subcomponents/lux-side-nav/lux-side-nav.component';

@Component({
  selector: 'lux-app-header',
  templateUrl: './lux-app-header.component.html',
  imports: [
    LuxAriaRoleDirective,
    LuxAriaLabelDirective,
    NgClass,
    LuxAriaExpandedDirective,
    NgTemplateOutlet,
    LuxLangSelectComponent,
    MatButton,
    LuxMenuComponent,
    LuxMenuItemComponent,
    LuxMenuTriggerComponent,
    LuxButtonComponent,
    LuxIconComponent,
    LuxImageComponent,
    TranslocoPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.lux-header-mobile]': 'mobileView'
  }
})
export class LuxAppHeaderComponent implements OnInit, OnDestroy {
  private queryService = inject(LuxMediaQueryObserverService);
  private logger = inject(LuxConsoleService);
  private elementRef = inject(ElementRef);
  private appService = inject(LuxAppService);
  private cdr = inject(ChangeDetectorRef);

  readonly luxLocaleSupported = input(['de']);
  readonly luxLocaleBaseHref = input('');
  readonly luxUserName = input<string | undefined>();
  readonly luxAppTitle = input<string | undefined>();
  readonly luxAppTitleShort = input<string | undefined>();
  readonly luxIconName = input<string | undefined>();
  readonly luxImageSrc = input<string | undefined>();
  readonly luxImageHeight = input('55px');
  readonly luxAriaAppMenuButtonLabel = input('');
  readonly luxAriaUserMenuButtonLabel = input('');
  readonly luxAriaTitleIconLabel = input('');
  readonly luxAriaTitleImageLabel = input('');
  readonly luxAriaTitleLinkLabel = input('');
  readonly luxAriaRoleHeaderLabel = input('');

  readonly luxClicked = output<Event>();

  // Ersetzt die frühere .observed-Abfrage von luxClicked (output() hat kein Äquivalent) -
  // steuert die Klickbar-Darstellung des Headers (Cursor, Rolle, Tabindex).
  readonly luxClickable = input(false);

  mobileView: boolean;
  userNameShort?: string;
  subscriptions: Subscription[] = [];

  readonly customTrigger = viewChild('customTrigger', { read: ElementRef });

  readonly actionNav = contentChild(LuxAppHeaderActionNavComponent);
  readonly rightNav = contentChild(LuxAppHeaderRightNavComponent);
  readonly sideNav = contentChild(LuxSideNavComponent);

  constructor() {
    this.appService.appHeaderEl = this.elementRef.nativeElement;

    this.mobileView = this.queryService.activeMediaQuery === 'xs' || this.queryService.activeMediaQuery === 'sm';
    this.subscriptions.push(
      this.queryService.getMediaQueryChangedAsObservable().subscribe((query) => {
        this.mobileView = query === 'xs' || query === 'sm';
        this.cdr.markForCheck();
      })
    );

    effect(() => {
      this.luxUserName();
      this.userNameShort = this.generateUserNameShort();
    });
  }

  ngOnInit() {
    if (!this.luxAppTitleShort() || this.luxAppTitleShort()!.length === 0) {
      this.logger.warn('No title is set for the mobile view.');
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  onMenuClosed() {
    const customTrigger = this.customTrigger();
    if (customTrigger) {
      customTrigger.nativeElement.focus();
    }
  }

  onClicked(event: Event) {
    this.luxClicked.emit(event);
  }

  private generateUserNameShort(): string {
    let short = this.luxUserName() ? this.luxUserName()!.trim() : '';

    if (short.length > 0) {
      short = short.charAt(0);
    }
    return short.toUpperCase();
  }
}
