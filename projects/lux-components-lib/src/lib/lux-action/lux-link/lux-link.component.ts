import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Input, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton, MatFabButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { LuxIconComponent } from '../../../lib/lux-icon/lux-icon/lux-icon.component';
import { LuxComponentsConfigService } from '../../lux-components-config/lux-components-config.service';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxTooltipDirective } from '../../lux-directives/lux-tooltip/lux-tooltip.directive';
import { LuxActionComponentBaseClass } from '../lux-action-model/lux-action-component-base.class';

@Component({
  selector: 'lux-link',
  templateUrl: './lux-link.component.html',
  styleUrls: ['./lux-link.component.scss'],
  imports: [NgClass, LuxTagIdDirective, LuxIconComponent, NgTemplateOutlet, MatButton, MatFabButton],
  host: {
    '[class.lux-uppercase]': 'labelUppercase',
    '[class.lux-flat]': 'luxFlat',
    '[class.lux-raised]': 'luxRaised',
    '[class.lux-rounded]': 'luxRounded',
    '[class.lux-stroked]': 'luxStroked'
  }
})
export class LuxLinkComponent extends LuxActionComponentBaseClass {
  private router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  elementRef = inject(ElementRef);
  componentsConfigService = inject(LuxComponentsConfigService);
  tooltipDirective?: LuxTooltipDirective;
  labelUppercase!: boolean;

  public readonly iconSize: string = '2x';

  @Input() luxHref = '';
  @Input() luxBlank? = false;

  constructor() {
    super();

    this.componentsConfigService.config.pipe(takeUntilDestroyed()).subscribe(() => {
      this.detectParent();
    });
  }

  auxClicked(event: Event) {
    if (event instanceof UIEvent && event.which === 2) {
      this.redirectToHref(event);
    }
  }

  redirectToHref(event: Event) {
    this.luxClicked.emit(event);

    if (this.luxHref) {
      this.luxHref = this.luxHref.trim();
      if (!this.luxHref.startsWith('http')) {
        if (this.isOpenInNewTab(event)) {
          const newRelativeUrl = this.router.createUrlTree([this.luxHref]);
          const baseUrl = window.location.href.replace(this.router.url, '');

          window.open(baseUrl + newRelativeUrl, '_blank');
        } else {
          this.router.navigate([this.luxHref]).then(() => {});
        }
      } else {
        window.open(this.luxHref, this.isOpenInNewTab(event) ? '_blank' : '_self');
      }
    }
  }

  isOpenInNewTab(event: Event): boolean {
    let result = false;

    if (event instanceof MouseEvent || event instanceof KeyboardEvent) {
      result = this.luxBlank || event.ctrlKey || event.metaKey || event.which === 2;
    }

    return result;
  }

  private detectParent() {
    const className = this.elementRef.nativeElement.className;

    let selector;
    if (className.indexOf('lux-side-nav-item-button') > -1) {
      selector = 'lux-side-nav-item';
    } else if (className.indexOf('lux-menu-item') > -1) {
      selector = 'lux-menu-item';
    } else {
      selector = 'lux-link';
    }

    this.labelUppercase = this.componentsConfigService.isLabelUppercaseForSelector(selector);
  }
}
