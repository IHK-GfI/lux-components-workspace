import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { LuxThemePalette } from '../../../lux-util/lux-colors.enum';
import { LuxActionComponentBaseClass } from '../../lux-action-model/lux-action-component-base.class';

@Component({
  selector: 'lux-menu-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ''
})
export class LuxMenuItemComponent extends LuxActionComponentBaseClass {
  readonly luxButtonTooltip = input<string>('');
  readonly luxMenuTooltip = input<string>('');
  readonly luxPrio = input<number>(0);
  readonly luxButtonBadge = input<string | undefined>(undefined);
  readonly luxButtonBadgeColor = input<LuxThemePalette>('primary');
  readonly luxMenuItemSubtitle = input<string>('');
  readonly luxMenuItemSelected = input<boolean>(false);

  luxClickNotAllowed = output<Event>();
  luxHiddenChange = output<boolean>();
  luxHideLabelIfExtendedChange = output<boolean>();
  luxAlwaysVisibleChange = output<boolean>();

  readonly luxAlwaysVisible = input<boolean>(true);
  readonly luxHideLabelIfExtended = input<boolean>(false);
  readonly luxHidden = input<boolean>(false);
  readonly luxClass = input<string | string[] | Set<string> | Record<string, any> | undefined>(undefined); //vgl. ngClass

  // Wird vom LuxMenuComponent mit dem berechneten Breitenwert belegt
  width = 0;
  // Wird vom LuxMenuComponent mit dem passenden Zustand belegt
  extended = false;

  constructor() {
    super();

    effect(() => {
      this.luxAlwaysVisibleChange.emit(this.luxAlwaysVisible());
    });
    effect(() => {
      this.luxHideLabelIfExtendedChange.emit(this.luxHideLabelIfExtended());
    });
    effect(() => {
      this.luxHiddenChange.emit(this.luxHidden());
    });
  }

  clicked(event: Event) {
    this.luxClicked.emit(event);
  }

  clickNotAllowed(event: Event) {
    this.luxClickNotAllowed.emit(event);
  }
}
