import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  inject
} from '@angular/core';
import { MatButton } from '@angular/material/button';
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
    LuxImageComponent
  ]
})
export class LuxAppHeaderComponent implements OnInit, OnChanges, OnDestroy {
  private queryService = inject(LuxMediaQueryObserverService);
  private logger = inject(LuxConsoleService);
  private elementRef = inject(ElementRef);
  private appService = inject(LuxAppService);

  @Input() luxLocaleSupported = ['de'];
  @Input() luxLocaleBaseHref = '';
  @Input() luxUserName?: string;
  @Input() luxAppTitle?: string;
  @Input() luxAppTitleShort?: string;
  @Input() luxIconName?: string;
  @Input() luxImageSrc?: string;
  @Input() luxImageHeight = '55px';
  @Input() luxAriaAppMenuButtonLabel = $localize`:@@luxc.app-header.aria.appmenu.btn:Anwendungsmenü / Navigation`;
  @Input() luxAriaUserMenuButtonLabel = $localize`:@@luxc.app-header.aria.usermenu.btn:Benutzermenü / Navigation`;
  @Input() luxAriaTitleIconLabel = $localize`:@@luxc.app-header.aria.title_icon.lbl:Titelicon`;
  @Input() luxAriaTitleImageLabel = $localize`:@@luxc.app-header.aria.title.image.lbl:Titelbild`;
  @Input() luxAriaTitleLinkLabel = $localize`:@@luxc.app-header.aria.title.link.lbl:`;
  @Input() luxAriaRoleHeaderLabel = $localize`:@@luxc.app-header.aria.role_header.lbl:Kopfbereich / Menübereich`;

  @Output() luxClicked = new EventEmitter<Event>();

  mobileView: boolean;
  userNameShort?: string;
  hasOnClickedListener?: boolean;
  subscriptions: Subscription[] = [];

  @ViewChild('customTrigger', { read: ElementRef }) customTrigger?: ElementRef;

  @ContentChild(LuxAppHeaderActionNavComponent) actionNav?: LuxAppHeaderActionNavComponent;
  @ContentChild(LuxAppHeaderRightNavComponent) rightNav?: LuxAppHeaderRightNavComponent;
  @ContentChild(LuxSideNavComponent) sideNav?: LuxSideNavComponent;

  constructor() {
    this.appService.appHeaderEl = this.elementRef.nativeElement;

    this.mobileView = this.queryService.activeMediaQuery === 'xs' || this.queryService.activeMediaQuery === 'sm';
    this.subscriptions.push(
      this.queryService.getMediaQueryChangedAsObservable().subscribe((query) => {
        this.mobileView = query === 'xs' || query === 'sm';
      })
    );
  }

  ngOnInit() {
    if (this.luxClicked.observed) {
      this.hasOnClickedListener = true;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    if (simpleChanges['luxUserName']) {
      this.userNameShort = this.generateUserNameShort();
    }

    if (!this.luxAppTitleShort || this.luxAppTitleShort.length === 0) {
      this.logger.warn('No title is set for the mobile view.');
    }
  }

  onMenuClosed() {
    if (this.customTrigger) {
      this.customTrigger.nativeElement.focus();
    }
  }

  onClicked(event: Event) {
    this.luxClicked.emit(event);
  }

  private generateUserNameShort(): string {
    let short = this.luxUserName ? this.luxUserName.trim() : '';

    if (short.length > 0) {
      short = short.charAt(0);
    }
    return short.toUpperCase();
  }
}
