import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  contentChildren,
  forwardRef,
  inject,
  input,
  model,
  output,
  TemplateRef,
  viewChild
} from '@angular/core';
import { LuxButtonComponent } from '../../../../../lux-action/lux-button/lux-button.component';
import { LuxAriaExpandedDirective } from '../../../../../lux-directives/lux-aria/lux-aria-expanded.directive';
import { LuxIconComponent } from '../../../../../lux-icon/lux-icon/lux-icon.component';

@Component({
  selector: 'lux-side-nav-item',
  templateUrl: './lux-side-nav-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, LuxAriaExpandedDirective, NgTemplateOutlet, LuxButtonComponent, LuxIconComponent]
})
export class LuxSideNavItemComponent implements AfterViewInit {
  private cdr = inject(ChangeDetectorRef);

  readonly templateRef = viewChild(TemplateRef);

  readonly luxLabel = input<string | undefined>();
  readonly luxDisabled = input(false);
  readonly luxTagId = input<string | undefined>();
  readonly luxSelected = input(false);
  readonly luxCloseOnClick = input(true);
  readonly luxIconName = input<string | undefined>();
  readonly luxExpandable = input(false);
  readonly luxExpanded = model(true);

  readonly luxClicked = output<Event>();

  readonly sideNavItems = contentChildren(forwardRef(() => LuxSideNavItemComponent));

  get lastSideNavItem(): LuxSideNavItemComponent | undefined {
    const items = this.sideNavItems();
    return items.length > 0 ? items[items.length - 1] : undefined;
  }

  ngAfterViewInit() {
    // Nach Abschluss der Initialisierung die CD anstossen
    this.cdr.markForCheck();
  }

  onClick(event: Event) {
    if (this.luxDisabled()) {
      return;
    }

    this.luxClicked.emit(event);
    if (this.luxExpandable()) {
      this.luxExpanded.update((expanded) => !expanded);
    }
  }
}
