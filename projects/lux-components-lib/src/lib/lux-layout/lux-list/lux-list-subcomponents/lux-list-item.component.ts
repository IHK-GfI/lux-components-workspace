import { FocusableOption } from '@angular/cdk/a11y';
import { NgClass } from '@angular/common';
import { Component, ContentChild, ElementRef, EventEmitter, HostBinding, Input, Output, inject } from '@angular/core';
import { LuxCardContentComponent } from '../../lux-card/lux-card-subcomponents/lux-card-content.component';
import { LuxCardCustomHeaderComponent } from "../../lux-card/lux-card-subcomponents/lux-card-custom-header.component";
import { LuxCardInfoComponent } from '../../lux-card/lux-card-subcomponents/lux-card-info.component';
import { LuxCardComponent } from '../../lux-card/lux-card.component';
import { LuxListItemCustomHeaderComponent } from './lux-list-item-custom-header.component';

@Component({
  selector: 'lux-list-item',
  templateUrl: './lux-list-item.component.html',
  imports: [LuxCardComponent, NgClass, LuxCardInfoComponent, LuxCardContentComponent, LuxCardCustomHeaderComponent]
})
export class LuxListItemComponent implements FocusableOption {
  elementRef = inject(ElementRef);

  private _luxTitle = '';
  private _luxSubTitle = '';
  private _luxSelected = false;

  @HostBinding('attr.aria-label') ariaLabel?: string;
  @HostBinding('attr.aria-selected') ariaSelected?: boolean;
  @HostBinding('attr.role') role = 'option';
  @HostBinding('attr.tabindex') tabindex = '-1';

  @Input() luxTitleTooltip?: string;
  @Input() luxSubTitleTooltip?: string;
  @Input() luxTitleLineBreak = true;
  
  @Output() luxClicked = new EventEmitter<Event>();

  @ContentChild(LuxListItemCustomHeaderComponent) customHeaderComponent?: LuxListItemCustomHeaderComponent;

  get luxTitle(): string {
    return this._luxTitle;
  }

  @Input() set luxTitle(title: string) {
    this._luxTitle = title;
    this.ariaLabel = this.getLabel();
  }

  get luxSubTitle(): string {
    return this._luxSubTitle;
  }

  @Input() set luxSubTitle(subTitle: string) {
    this._luxSubTitle = subTitle;
    this.ariaLabel = this.getLabel();
  }

  get luxSelected(): boolean {
    return this._luxSelected;
  }

  @Input() set luxSelected(selected: boolean) {
    this._luxSelected = selected;
    this.ariaSelected = selected;
  }

  clicked(event: Event) {
    this.luxClicked.emit(event);
  }

  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  getLabel() {
    return `${this.luxTitle ? this.luxTitle : ''} ${this.luxSubTitle ? this.luxSubTitle : ''}`;
  }
}
