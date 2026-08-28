import { FocusableOption } from '@angular/cdk/a11y';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostBinding, contentChild, inject, input, model, output } from '@angular/core';
import { LuxCardContentComponent } from '../../lux-card/lux-card-subcomponents/lux-card-content.component';
import { LuxCardCustomHeaderComponent } from '../../lux-card/lux-card-subcomponents/lux-card-custom-header.component';
import { LuxCardInfoComponent } from '../../lux-card/lux-card-subcomponents/lux-card-info.component';
import { LuxCardComponent } from '../../lux-card/lux-card.component';
import { LuxListItemCustomHeaderComponent } from './lux-list-item-custom-header.component';

@Component({
  selector: 'lux-list-item',
  templateUrl: './lux-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxCardComponent, NgClass, LuxCardInfoComponent, LuxCardContentComponent, LuxCardCustomHeaderComponent]
})
export class LuxListItemComponent implements FocusableOption {
  elementRef = inject(ElementRef);

  @HostBinding('attr.role') role = 'row';
  @HostBinding('attr.tabindex') tabindex = '-1';

  readonly luxTitle = input('');
  readonly luxSubTitle = input('');
  readonly luxTitleTooltip = input<string | undefined>();
  readonly luxSubTitleTooltip = input<string | undefined>();
  readonly luxTitleLineBreak = input(true);
  readonly luxSelected = model(false);

  readonly luxClicked = output<Event>();

  readonly customHeaderComponent = contentChild(LuxListItemCustomHeaderComponent);

  @HostBinding('attr.aria-label') get ariaLabel() {
    return this.getLabel();
  }

  @HostBinding('attr.aria-selected') get ariaSelected() {
    return this.luxSelected();
  }

  clicked(event: Event) {
    this.luxClicked.emit(event);
  }

  focus(): void {
    this.elementRef.nativeElement.focus();
  }

  getLabel() {
    return `${this.luxTitle() ? this.luxTitle() : ''} ${this.luxSubTitle() ? this.luxSubTitle() : ''}`;
  }
}
