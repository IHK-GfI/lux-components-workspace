import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  inject,
  input
} from '@angular/core';
import { MatDivider } from '@angular/material/divider';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { TranslocoPipe } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxTabIndexDirective } from '../../lux-directives/lux-tabindex/lux-tab-index.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxTooltipDirective } from '../../lux-directives/lux-tooltip/lux-tooltip.directive';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxDividerComponent } from '../../lux-layout/lux-divider/lux-divider.component';
import { LuxThemeService } from '../../lux-theme/lux-theme.service';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxButtonComponent } from '../lux-button/lux-button.component';
import { LuxMenuItemComponent } from './lux-menu-subcomponents/lux-menu-item.component';
import { LuxMenuPanelHeaderComponent } from './lux-menu-subcomponents/lux-menu-panel-header.component';
import { LuxMenuSectionTitleComponent } from './lux-menu-subcomponents/lux-menu-section-title.component';
import { LuxMenuTriggerComponent } from './lux-menu-subcomponents/lux-menu-trigger.component';

@Component({
  selector: 'lux-menu',
  templateUrl: './lux-menu.component.html',
  imports: [
    NgTemplateOutlet,
    LuxButtonComponent,
    LuxTabIndexDirective,
    LuxAriaLabelDirective,
    LuxTooltipDirective,
    NgClass,
    NgStyle,
    MatMenu,
    MatMenuItem,
    LuxTagIdDirective,
    MatMenuTrigger,
    LuxIconComponent,
    MatDivider,
    TranslocoPipe
  ]
})
export class LuxMenuComponent implements AfterViewInit, AfterContentInit, AfterViewChecked, OnDestroy, OnInit {
  private cdr = inject(ChangeDetectorRef);
  private themeService = inject(LuxThemeService);
  protected elementRef = inject(ElementRef);

  // Diese Werte müssen angepasst werden, sollte das Styling dieser Component entsprechend geändert worden sein
  private readonly PADDING_PX: number;
  private readonly MARGIN_PX: number;
  private readonly ICON_PX: number; // 15px breite plus 8px gap zwischen icon - label
  private readonly FONT_SIZE: number;
  private readonly FONT_WEIGHT: number;
  private readonly FONT_FAMILY: string;
  private readonly BADGE_SIZE: number;

  // Alle verfügbaren MenuItems als Array
  private _menuItems: LuxMenuItemComponent[] = [];
  private _menuItemsNotExtended: (
    | LuxMenuItemComponent
    | LuxDividerComponent
    | LuxMenuPanelHeaderComponent
    | LuxMenuSectionTitleComponent
  )[] = [];

  // Das Canvas wird genutzt, um die Breite potenzieller MenuItem-Texte zu berechnen
  private readonly canvas;

  private menuItemSubscriptions: Subscription[] = [];
  private menuItemChangeSubscription!: Subscription;

  hideToggle = false;
  triggerButtonDivEl?: HTMLElement;
  customTriggerEl?: HTMLElement;

  @ViewChild('defaultTrigger', { read: ElementRef }) defaultTriggerElRef?: ElementRef;
  @ViewChild('defaultTrigger') defaultTriggerComponent?: LuxButtonComponent;
  @ViewChild('menuTrigger', { read: ElementRef }) menuTriggerElRef?: ElementRef;
  @ViewChild('menuExtendedContainer', { read: ElementRef, static: true }) menuExtendedContainer!: ElementRef;
  @ContentChildren(LuxMenuItemComponent) luxMenuItemComponents!: QueryList<LuxMenuItemComponent>;
  @ContentChildren('menuSection') menuNotExtendedPanel!: QueryList<
    LuxMenuItemComponent | LuxDividerComponent | LuxMenuPanelHeaderComponent | LuxMenuSectionTitleComponent
  >;
  @ContentChild(LuxMenuTriggerComponent) luxMenuTriggerComponent?: LuxMenuTriggerComponent;

  @Output() luxMenuClosed = new EventEmitter<void>();
  @Output() luxMenuOpened = new EventEmitter<void>();

  @Input() luxMenuLabel = '';
  @Input() luxMenuIconName = 'lux-interface-setting-menu-1';
  @Input() luxMenuTriggerIconShowRight = false;
  @Input() luxMenuItemFixWidth = 0;
  @Input() luxClassName = '';
  @Input() luxTagId?: string;
  @Input() luxToggleDisabled = false;
  @Input() luxAriaMenuTriggerLabel = '';
  luxShowSections = input<boolean>(false);
  luxMenuPanelLarge = input<boolean>(false);

  _luxDisplayExtended = false;
  visibleMenuItems: LuxMenuItemComponent[] = [];
  tooltipDirective?: LuxTooltipDirective;

  get luxDisplayExtended() {
    return this._luxDisplayExtended;
  }

  @Input() set luxDisplayExtended(value: boolean) {
    this._luxDisplayExtended = value;

    if (this.menuTriggerElRef) {
      this.updateExtendedMenuItems();
    }
  }

  @Input() luxDisplayMenuLeft = true;
  @Input() luxMaximumExtended = 5;

  @HostListener('window:resize') windowResize() {
    this.updateExtendedMenuItems();
  }

  get menuItems(): LuxMenuItemComponent[] {
    return this._menuItems;
  }

  set menuItems(menuItems: LuxMenuItemComponent[]) {
    this._menuItems = menuItems ? menuItems : [];
    this._menuItems.sort((a, b) => (a.luxPrio ? a.luxPrio : 0) - (b.luxPrio ? b.luxPrio : 0));

    this.menuItems.forEach((item) => {
      this.menuItemSubscriptions.push(
        item.luxHiddenChange.subscribe(() => {
          this.updateExtendedMenuItems();
        })
      );
      this.menuItemSubscriptions.push(
        item.luxAlwaysVisibleChange.subscribe(() => {
          this.updateExtendedMenuItems();
        })
      );
      this.menuItemSubscriptions.push(
        item.luxHideLabelIfExtendedChange.subscribe(() => {
          this.updateExtendedMenuItems();
        })
      );
    });

    this.cdr.detectChanges();
  }

  get menuItemsNotExtended(): (LuxMenuItemComponent | LuxDividerComponent | LuxMenuPanelHeaderComponent | LuxMenuSectionTitleComponent)[] {
    return this._menuItemsNotExtended;
  }

  set menuItemsNotExtended(
    menuItems: (LuxMenuItemComponent | LuxDividerComponent | LuxMenuPanelHeaderComponent | LuxMenuSectionTitleComponent)[]
  ) {
    this._menuItemsNotExtended = menuItems ? menuItems : [];
  }

  constructor() {
    this.canvas = document.createElement('canvas');

    // die folgenden Werte sind für die Berechnung der Breite der extended Menüitems
    // sie müssen entsprechend dem aktuellen Theme gesetzt werden.
    // Wird das Theme geändert müssen auch diese Werte angepasst werden.
    // aktuell wird für die Klasse ".lux-extended-menu" die Breite der Icons auf 15px gesetzt.
    // bei Änderungen es Icon-Sets muss dieser Wert eventuell angepasst werden

    switch (this.themeService.getTheme().name) {
      case 'green':
        this.PADDING_PX = 32;
        this.MARGIN_PX = 8;
        this.ICON_PX = 30; // 22px Breite plus 8px Gap zwischen Icon - Label
        this.FONT_SIZE = 14; //im Theming wird die Fontsize der Buttons auf 14px gesetzt
        this.FONT_WEIGHT = 400;
        this.FONT_FAMILY = '"Blogger Sans", "Source Sans Pro","Helvetica","Arial","sans-serif"';
        this.BADGE_SIZE = 48; //max-width der Button-Badge
        break;

      case 'authentic':
        this.PADDING_PX = 16;
        this.MARGIN_PX = 8;
        this.ICON_PX = 30; // 22px Breite plus 8px Gap zwischen Icon - Label
        this.FONT_SIZE = 14;
        this.FONT_WEIGHT = 400;
        this.FONT_FAMILY = '"Source Sans Pro","Helvetica","Arial","sans-serif"';
        this.BADGE_SIZE = 38;
        break;

      default: // 28px Breite plus 8px Gap zwischen Icon - Button-Label
        this.PADDING_PX = 16;
        this.MARGIN_PX = 8;
        this.ICON_PX = 30;
        this.FONT_SIZE = 14;
        this.FONT_WEIGHT = 400;
        this.FONT_FAMILY = '"Source Sans Pro","Helvetica","Arial","sans-serif"';
        this.BADGE_SIZE = 38;
    }
  }

  ngAfterViewInit(): void {
    this.triggerButtonDivEl = this.elementRef.nativeElement.querySelector('div.lux-menu-trigger');
    this.customTriggerEl = this.elementRef.nativeElement.querySelector('lux-menu-trigger');
    this.customTriggerEl?.addEventListener('click', this.onTrigger.bind(this));
  }

  ngOnInit() {
    if (this.luxShowSections() && this.luxDisplayExtended) {
      console.warn(
        'Das Menu mit den Abschnitten (LuxShowSections) kann nur angezeigt werden, wenn keine Buttons außerhalb des Menu angezeigt werden können.'
      );
    }
  }

  onTrigger() {
    if (this.customTriggerEl && this.triggerButtonDivEl) {
      this.triggerButtonDivEl.click();
    }
  }

  ngAfterContentInit() {
    if (this.luxShowSections()) {
      this.addMenuElementsToArray();
    }
    this.menuItemChangeSubscription = this.luxMenuItemComponents.changes.subscribe(() => {
      if (this.luxShowSections()) {
        this.addMenuElementsToArray();
      } else {
        this.menuItems = this.luxMenuItemComponents.toArray();
        this.calculateMenuItemWidths();
        this.updateExtendedMenuItems();
      }
    });
  }

  addMenuElementsToArray() {
    this.menuItemsNotExtended = this.menuNotExtendedPanel.toArray().map((ref) => (ref instanceof ElementRef ? ref.nativeElement : ref));
    this.cdr.detectChanges();
  }

  ngAfterViewChecked() {
    if (this.luxShowSections()) {
      this.addMenuElementsToArray();
    } else {
      this.menuItems = this.luxMenuItemComponents.toArray();
      this.calculateMenuItemWidths();
      this.updateExtendedMenuItems();
    }
  }

  ngOnDestroy(): void {
    if (this.customTriggerEl && this.triggerButtonDivEl) {
      this.customTriggerEl?.removeEventListener('click', this.onTrigger);
    }

    if (this.menuItemChangeSubscription) {
      this.menuItemChangeSubscription.unsubscribe();
    }

    this.menuItemSubscriptions.forEach((menuItemSubscription) => {
      menuItemSubscription.unsubscribe();
    });
  }

  /**
   * Wird beim Klick auf ein MenuItem aufgerufen.
   * @param menuItem
   * @param event
   */
  menuItemClicked(menuItem: LuxMenuItemComponent, event: Event) {
    menuItem.clicked(event);
  }

  /**
   * Wird nach dem Schließen des Menus aufgerufen und emitted die Output-Property.
   * Setzt den Fokus auf den Default-Trigger (Custom-Trigger => eigene Verantwortung).
   */
  onMenuClosed() {
    this.luxMenuClosed.emit();
    if (this.defaultTriggerElRef) {
      (this.defaultTriggerElRef.nativeElement.children.item(0) as any).focus();
    }
  }

  /**
   * Wird nach dem Öffnen des Menus aufgerufen und emitted die Output-Property.
   */
  onMenuOpened() {
    this.luxMenuOpened.emit();
  }

  /**
   * Der Menü-Trigger in der Filterkomponente wird im Accordion-Panel eingesetzt.
   * Damit sich das Panel bei der Verwendung des Menüs nicht öffnet und schließt,
   * darf das Event nicht weiter gereicht werden.
   * @param event
   */
  menuTriggerStopPropagation(event: Event) {
    LuxUtil.stopEventPropagation(event);
  }
  /**
   * Berechnet anhand der verfügbaren Breite des Containers (CSS-Class: lux-menu-extended) und der maximalen Anzahl an
   * extended MenuItems die Anzahl an möglichen MenuItems, die außerhalb des eigentlichen Menus dargestellt werden können.
   */
  updateExtendedMenuItems() {
    if (!this.luxDisplayExtended) {
      this.hideToggle = false;
      this.menuItems.forEach((menuItem: LuxMenuItemComponent) => {
        menuItem.extended = false;
      });
      return;
    }

    const menuTriggerOffsetWidth = this.menuTriggerElRef?.nativeElement.offsetWidth;
    const menuTriggerWidth = Math.max(menuTriggerOffsetWidth ? menuTriggerOffsetWidth : 0, 50);

    let availableWidth: number = this.menuExtendedContainer.nativeElement.offsetWidth;
    let count = 0;

    availableWidth -= menuTriggerWidth;

    // mit condition sind hier die Zustände luxVisible = true || false gemeint
    this.visibleMenuItems = []; // die sichtbaren Menüitems werden neu einsortiert
    for (const condition of [true, false]) {
      for (const menuItem of this.menuItems) {
        if (menuItem.luxAlwaysVisible === condition && !menuItem.luxHidden) {
          this.visibleMenuItems.push(menuItem);
        }
      }
    }
    for (const menuItem of this.visibleMenuItems) {
      // Wenn es das letzte sichtbare Menüitem ist, wird geprüft, ob es anstelle des
      // Menüitemtriggers dargestellt werden kann.
      if (menuItem === this.visibleMenuItems[this.visibleMenuItems.length - 1] && availableWidth + menuTriggerWidth >= menuItem.width) {
        availableWidth += menuTriggerWidth;
      }

      availableWidth -= menuItem.width;

      if (availableWidth >= 0 && count < this.luxMaximumExtended) {
        menuItem.extended = true;
        count++;
      } else {
        menuItem.extended = false;
      }
    }

    // Jetzt müssen die sichtbaren Items noch nach der Priorität sortiert werden.
    //
    // Erklärung:
    // Das Array "visibleMenuItems" wurde initial wie folgt aufgebaut:
    // - zuerst alle Items mit "luxAlwaysVisible=true" und
    // - danach alle Items mit "luxAlwaysVisible=false".
    // Dies wurde gemacht, damit der zur Verfügung stehende Raum an die Items
    // verteilt wird, die nach Möglichkeit immer angezeigt werden sollten.
    // Bis zu diesem Zeitpunkt wurde bewusst auf die Berücksichtigung der
    // Priorität verzichtet. Nachdem aber jetzt festgelegt wurde, welche Items
    // überhaupt dargestellt werden, kann nach der Priorität sortiert werden.
    this.visibleMenuItems.sort((a, b) => (a.luxPrio ? a.luxPrio : 0) - (b.luxPrio ? b.luxPrio : 0));

    // wenn die Anzahl der extended dargestellten Items der Gesamtzahl entspricht blenden wir den Toggle aus
    const extendedMenuItems = this.visibleMenuItems.filter((item: LuxMenuItemComponent) => item.extended);
    this.hideToggle = extendedMenuItems.length === this.visibleMenuItems.length;
    this.cdr.detectChanges();
  }

  /**
   * Berechnet die Breite für jedes Menuitem und speichert diese abhängig davon, ob das Item immer sichtbar sein soll oder nicht
   * in 2 verschiedenen Maps.
   */
  private calculateMenuItemWidths() {
    this.menuItems.forEach((menuItem: LuxMenuItemComponent) => {
      menuItem.extended = false;
      menuItem.width = this.luxMenuItemFixWidth > 0 ? this.luxMenuItemFixWidth : this.getMenuItemWidth(menuItem);
    });
  }

  /**
   * Gibt die berechnete Breite des MenuItems zurück.
   * Diese setzt sich aus dem Padding (links und rechts, je 16px), dem Icon (wenn vorhanden, 15px) und der berechneten
   * Textbreite zusammen + 25px Sicherheitspuffer.
   * @param menuItem
   */
  private getMenuItemWidth(menuItem: LuxMenuItemComponent): number {
    if (!menuItem) {
      return 0;
    }

    return (
      this.PADDING_PX +
      (menuItem.luxIconName ? this.ICON_PX : 0) +
      (!menuItem.luxHideLabelIfExtended ? this.getTextWidth(menuItem.luxLabel) : 0) +
      this.MARGIN_PX +
      (menuItem.luxButtonBadge ? this.BADGE_SIZE : 0) +
      25
    );
  }

  /**
   * Berechnet mithilfe eines Canvas-Objekts die Breite eines einzelnen Textes
   * @param text
   */
  private getTextWidth(text: string | null | undefined): number {
    if (!text) {
      return 0;
    }

    const letterSpacing = 1; // px
    const canvas = this.canvas;
    const context = canvas.getContext('2d')!;
    context.font = `${this.FONT_WEIGHT} ${this.FONT_SIZE}px ${this.FONT_FAMILY}`;
    const metrics = context.measureText(text);
    // Letter-Spacing multipliziert mit der Anzahl der Zeichen
    const letterSpacingWidth = letterSpacing * text.length;
    // Offset kann weiterhin genutzt werden, falls nötig
    const offset = 0;
    return metrics.width + letterSpacingWidth + offset;
  }

  hasVisibleMenuItems(): boolean {
    let hasVisibleMenuItems = false;

    if (!this.luxShowSections()) {
      for (const element of this.menuItems) {
        if (!element.luxHidden && !element.extended) {
          hasVisibleMenuItems = true;
          break;
        }
      }
    } else {
      for (const element of this.menuItemsNotExtended) {
        if (this.isItemMenuItem(element) && !element.luxHidden && !element.extended) {
          hasVisibleMenuItems = true;
          break;
        }
      }
    }

    return hasVisibleMenuItems;
  }

  isItemDivider(menuItem: any): menuItem is LuxDividerComponent {
    return menuItem instanceof LuxDividerComponent;
  }

  isItemMenuItem(menuItem: any): menuItem is LuxMenuItemComponent {
    return menuItem instanceof LuxMenuItemComponent;
  }

  isPanelHeader(menuItem: any): menuItem is LuxMenuPanelHeaderComponent {
    return menuItem instanceof LuxMenuPanelHeaderComponent;
  }

  isSectionTitle(menuItem: any): menuItem is LuxMenuSectionTitleComponent {
    return menuItem instanceof LuxMenuSectionTitleComponent;
  }
}
