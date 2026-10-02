import { FocusableOption } from '@angular/cdk/a11y';
import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, contentChild, inject, input, model, output } from '@angular/core';
import { LuxCardContentComponent } from '../../lux-card/lux-card-subcomponents/lux-card-content.component';
import { LuxCardCustomHeaderComponent } from '../../lux-card/lux-card-subcomponents/lux-card-custom-header.component';
import { LuxCardInfoComponent } from '../../lux-card/lux-card-subcomponents/lux-card-info.component';
import { LuxCardComponent } from '../../lux-card/lux-card.component';
import { LuxListItemCustomHeaderComponent } from './lux-list-item-custom-header.component';

@Component({
  selector: 'lux-list-item',
  templateUrl: './lux-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': 'role',
    '[attr.tabindex]': 'tabindex',
    '[attr.aria-label]': 'ariaLabel',
    '[attr.aria-selected]': 'ariaSelected'
  },
  imports: [LuxCardComponent, NgClass, LuxCardInfoComponent, LuxCardContentComponent, LuxCardCustomHeaderComponent]
})
export class LuxListItemComponent implements FocusableOption {
  readonly luxTitle = input('');
  readonly luxSubTitle = input('');
  readonly luxTitleTooltip = input<string | undefined>();
  readonly luxSubTitleTooltip = input<string | undefined>();
  readonly luxTitleLineBreak = input(true);
  readonly luxSelected = model(false);

  readonly luxClicked = output<Event>();

  readonly customHeaderComponent = contentChild(LuxListItemCustomHeaderComponent);

  elementRef = inject(ElementRef);

  role = 'row';
  tabindex = '-1';

  get ariaLabel() {
    return this.getLabel();
  }

  get ariaSelected() {
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
