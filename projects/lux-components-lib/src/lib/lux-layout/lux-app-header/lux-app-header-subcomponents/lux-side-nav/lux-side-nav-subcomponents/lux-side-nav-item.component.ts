import { NgClass, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  OnChanges,
  Output,
  QueryList,
  TemplateRef,
  ViewChild
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
export class LuxSideNavItemComponent implements AfterViewInit, OnChanges {
  private cdr = inject(ChangeDetectorRef);

  @ViewChild(TemplateRef) templateRef?: TemplateRef<any>;

  @Input() luxLabel?: string;
  @Input() luxDisabled = false;
  @Input() luxTagId?: string;
  @Input() luxSelected = false;
  @Input() luxCloseOnClick = true;
  @Input() luxIconName?: string;
  @Input() luxExpandable = false;
  @Input() luxExpanded = true;

  @Output() luxClicked = new EventEmitter<Event>();

  @ContentChildren(forwardRef(() => LuxSideNavItemComponent)) sideNavItems!: QueryList<LuxSideNavItemComponent>;

  ngOnChanges() {
    // Bei Input Änderungen die CD anstossen
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    // Nach Abschluss der Initialisierung die CD anstossen
    this.cdr.detectChanges();
  }

  onClick(event: Event) {
    this.luxClicked.emit(event);
    if (this.luxExpandable) {
      this.luxExpanded = !this.luxExpanded;
    }
  }
}
