import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, inject, input, signal } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.lux-uppercase]': 'labelUppercase()',
    '[class.lux-flat]': 'luxFlat()',
    '[class.lux-raised]': 'luxRaised()',
    '[class.lux-rounded]': 'luxRounded()',
    '[class.lux-stroked]': 'luxStroked()'
  }
})
export class LuxLinkComponent extends LuxActionComponentBaseClass {
  readonly luxHref = input('');
  readonly luxBlank = input(false);

  readonly elementRef = inject(ElementRef);
  readonly componentsConfigService = inject(LuxComponentsConfigService);
  tooltipDirective?: LuxTooltipDirective;
  labelUppercase = signal(false);

  private readonly router = inject(Router);

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

  isExternal(): boolean {
    if (!this.luxHref()) return false;
    const href = this.luxHref().trim();
    return (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('//') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:')
    );
  }

  redirectToHref(event: Event) {
    if (this.luxDisabled()) {
      event.preventDefault();
      return;
    }

    this.luxClicked.emit(event);

    if (!this.luxHref()) return;

    event.preventDefault();
    const href = this.luxHref().trim();

    if (this.isExternal()) {
      // Externe Links: Öffne im aktuellen oder neuen Fenster
      if (this.isOpenInNewTab(event)) {
        // noopener,noreferrer verhindert Reverse Tabnabbing (Zugriff der Zielseite auf window.opener)
        window.open(href, '_blank', 'noopener,noreferrer');
      } else {
        window.open(href, '_self');
      }
    } else {
      // Interne Links: Nutze Angular Router
      if (this.isOpenInNewTab(event)) {
        const newRelativeUrl = this.router.createUrlTree([href]);
        const baseUrl = window.location.href.replace(this.router.url, '');
        window.open(baseUrl + newRelativeUrl, '_blank', 'noopener,noreferrer');
      } else {
        this.router.navigate([href]).then(() => {});
      }
    }
  }

  isOpenInNewTab(event: Event): boolean {
    let result = false;

    if (event instanceof MouseEvent || event instanceof KeyboardEvent) {
      result = this.luxBlank() || event.ctrlKey || event.metaKey || event.which === 2;
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

    this.labelUppercase.set(this.componentsConfigService.isLabelUppercaseForSelector(selector));
  }
}
