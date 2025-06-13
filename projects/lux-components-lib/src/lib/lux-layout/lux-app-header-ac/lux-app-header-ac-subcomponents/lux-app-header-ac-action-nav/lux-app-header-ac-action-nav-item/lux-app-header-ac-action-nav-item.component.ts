import { NgClass } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { LuxButtonComponent } from '../../../../../lux-action/lux-button/lux-button.component';
import { LuxThemePalette } from '../../../../../lux-util/lux-colors.enum';
import { LuxAppHeaderAcActionNavItemCustomComponent } from './lux-app-header-ac-action-nav-item-custom.component';

@Component({
  selector: 'lux-app-header-ac-action-nav-item',
  templateUrl: './lux-app-header-ac-action-nav-item.component.html',
  imports: [NgClass, LuxButtonComponent]
})
export class LuxAppHeaderAcActionNavItemComponent {
  @Input() luxLabel = '';
  @Input() luxIconName?: string;
  @Input() luxColor: LuxThemePalette;
  @Input() luxDisabled = false;
  @Input() luxTagId?: string;

  @Output() luxClicked = new EventEmitter<Event>();

  @ViewChild(LuxButtonComponent, { static: false }) buttonComponent?: LuxButtonComponent;
  @ContentChild(LuxAppHeaderAcActionNavItemCustomComponent) customComponent?: LuxAppHeaderAcActionNavItemCustomComponent;

  constructor() {}
}
