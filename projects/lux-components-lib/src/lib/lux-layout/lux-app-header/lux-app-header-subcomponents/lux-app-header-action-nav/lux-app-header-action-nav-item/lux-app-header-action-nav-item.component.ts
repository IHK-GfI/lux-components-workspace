import { NgClass } from '@angular/common';
import { Component, ContentChild, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { LuxButtonComponent } from '../../../../../lux-action/lux-button/lux-button.component';
import { LuxThemePalette } from '../../../../../lux-util/lux-colors.enum';
import { LuxAppHeaderActionNavItemCustomComponent } from './lux-app-header-action-nav-item-custom.component';

@Component({
  selector: 'lux-app-header-action-nav-item',
  templateUrl: './lux-app-header-action-nav-item.component.html',
  imports: [NgClass, LuxButtonComponent]
})
export class LuxAppHeaderActionNavItemComponent {
  @Input() luxLabel = '';
  @Input() luxIconName?: string;
  @Input() luxColor: LuxThemePalette;
  @Input() luxDisabled = false;
  @Input() luxTagId?: string;

  @Output() luxClicked = new EventEmitter<Event>();

  @ViewChild(LuxButtonComponent, { static: false }) buttonComponent?: LuxButtonComponent;
  @ContentChild(LuxAppHeaderActionNavItemCustomComponent) customComponent?: LuxAppHeaderActionNavItemCustomComponent;

  constructor() {}
}
