import { NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  contentChildren,
  effect,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  signal,
  Signal,
  viewChild
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { LuxLinkComponent } from '../../../../lux-action/lux-link/lux-link.component';
import { LuxAriaLabelDirective } from '../../../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxAriaRoleDirective } from '../../../../lux-directives/lux-aria/lux-aria-role.directive';
import { LuxIconComponent } from '../../../../lux-icon/lux-icon/lux-icon.component';
import { LuxAppService } from '../../../../lux-util/lux-app.service';
import { LuxUtil } from '../../../../lux-util/lux-util';
import { LuxDividerComponent } from '../../../lux-divider/lux-divider.component';
import { sideNavAnimation, sideNavOverlayAnimation } from './lux-side-nav-model/lux-side-nav-animations';
import { LuxSideNavItemComponent } from './lux-side-nav-subcomponents/lux-side-nav-item.component';

@Component({
  selector: 'lux-side-nav',
  templateUrl: './lux-side-nav.component.html',
  animations: [sideNavAnimation, sideNavOverlayAnimation],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:keyup)': 'keyEvent($event)',
    '(window:resize)': 'windowResize()'
  },
  imports: [
    NgStyle,
    LuxAriaRoleDirective,
    LuxAriaLabelDirective,
    LuxDividerComponent,
    NgTemplateOutlet,
    LuxLinkComponent,
    LuxIconComponent,
    TranslocoPipe
  ]
})
export class LuxSideNavComponent implements AfterViewInit, OnDestroy {
  private appService = inject(LuxAppService);

  readonly luxDashboardLink = input<string | undefined>();
  readonly luxDashboardLinkTitle = input('LUX Dashboard');
  readonly luxOpenLinkBlank = input(false);
  readonly luxAriaRoleNavigationLabel = input('');

  readonly luxSideNavExpandedChange = output<boolean>();

  readonly sideNavItems = contentChildren(LuxSideNavItemComponent, { descendants: true });
  readonly directSideNavItems = contentChildren(LuxSideNavItemComponent, { descendants: false });

  readonly sideNavEl = viewChild.required('sideNav', { read: ElementRef });
  readonly sideNavHeaderEl = viewChild.required('sideNavHeader', { read: ElementRef });
  readonly sideNavFooterEl = viewChild.required('sideNavFooter', { read: ElementRef });

  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
  focusElement: any;
  height?: number;
  width?: number;
  visibility = 'hidden';

  private readonly _sideNavExpanded = signal(false);
  readonly sideNavExpanded = this._sideNavExpanded.asReadonly();

  private itemClickSubscriptions: { unsubscribe(): void }[] = [];
  private isFirstSideNavItemsRun = true;

  constructor() {
    effect(() => {
      this.sideNavItems();

      // Der erste automatische Lauf entspricht der initialen Auflösung der ContentChildren
      // (kein "echter" Wechsel wie früher bei QueryList.changes, das initial nie feuert)
      // und wird daher übersprungen – die Erstinitialisierung übernimmt ngAfterViewInit synchron.
      if (this.isFirstSideNavItemsRun) {
        this.isFirstSideNavItemsRun = false;
        return;
      }

      this.updateItemClickListeners();
    });
  }

  ngAfterViewInit() {
    this.updateItemClickListeners();
    this.calculateWidthHeight();
  }

  ngOnDestroy() {
    this.itemClickSubscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  keyEvent(event: KeyboardEvent) {
    if (LuxUtil.isKeyEscape(event) && this.sideNavExpanded()) {
      // Escape soll nur das Menü schließen, wenn es auch geöffnet ist.
      this.toggle();
    }
  }

  windowResize() {
    this.calculateWidthHeight();
    this.calculateAppMenuPosition();
  }

  toggle() {
    this.calculateAppMenuPosition();

    this.setSideNavExpanded(!this.sideNavExpanded());

    if (this.sideNavExpanded()) {
      this.visibility = 'visible';
      this.calculateWidthHeight();

      // Hier wird sich der Menübutton zwischengespeichert
      this.focusElement = document.activeElement;
    } else {
      setTimeout(() => {
        // Wenn das SideNavMenü geschlossen wird, wird wieder der SideNavMenübutton fokussiert.
        if (this.focusElement) {
          this.focusElement.focus();
        }
      });
    }
  }

  /**
   * Wenn die Animation beendet ist, wird das Menü ausgeblendet, damit der Fokus weiter zum Inhalt springt und nicht
   * durch das versteckte Menü wandert. Das ist auch für Screenreader nötig.
   */
  updateSideNavAfterAnimationIsFinished() {
    this.visibility = this.sideNavExpanded() ? 'visible' : 'hidden';

    // Den Fokus auf den ersten Button setzen
    const sideNavEl = this.sideNavEl();
    if (this.sideNavExpanded() && sideNavEl && sideNavEl.nativeElement) {
      setTimeout(() => {
        const firstButton = (sideNavEl.nativeElement as HTMLElement).querySelector('button');
        if (firstButton) {
          firstButton.focus();
        }
      });
    }
  }

  open() {
    this.setSideNavExpanded(true);
    this.calculateWidthHeight();
  }

  close() {
    this.setSideNavExpanded(false);
  }

  private calculateAppMenuPosition() {
    this.top = this.appService.getAppTop() + 'px';
    this.left = this.appService.getAppLeft() + 'px';
    this.bottom = this.appService.getAppBottom() + 'px';
    this.right = this.appService.getAppRight() + 'px';
  }

  private setSideNavExpanded(expanded: boolean) {
    this._sideNavExpanded.set(expanded);
    this.luxSideNavExpandedChange.emit(expanded);
  }

  /**
   * Berechnet die Höhe für den Container der SideNavMenuItems.
   * Dafür wird die Gesamthöhe minus der Höhe des Headers und des Footers sowie eine feste Höhe
   * für den App-Header gerechnet.
   */
  private calculateWidthHeight() {
    setTimeout(() => {
      const totalHeight = this.sideNavEl().nativeElement.offsetHeight;
      const headerHeight = this.sideNavHeaderEl().nativeElement.offsetHeight;
      const footerHeight = this.sideNavFooterEl().nativeElement.offsetHeight;
      this.height = totalHeight - headerHeight - footerHeight;
      this.width = this.sideNavEl().nativeElement.offsetWidth + 20 /* Sicherheitsaufschlag (Schatten, Scrollbar,...) */;
    });
  }

  /**
   * Hängt sich an die Klick-Events der einzelnen SideNavItems, um so, je nach Einstellung der Items,
   * die SideNav zu schließen.
   */
  private updateItemClickListeners() {
    this.itemClickSubscriptions.forEach((subscription) => subscription.unsubscribe());
    this.itemClickSubscriptions = [];

    this.sideNavItems().forEach((item: LuxSideNavItemComponent) => {
      this.itemClickSubscriptions.push(
        item.luxClicked.subscribe(() => {
          if (item.luxCloseOnClick()) {
            this.close();
          }
        })
      );
    });
  }
}
