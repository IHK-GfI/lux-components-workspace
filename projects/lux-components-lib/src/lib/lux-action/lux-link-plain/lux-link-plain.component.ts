import { NgClass } from '@angular/common';
import { ChangeDetectorRef, Component, HostBinding, Input, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxTooltipDirective } from '../../lux-directives/lux-tooltip/lux-tooltip.directive';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxActionComponentBaseClass } from '../lux-action-model/lux-action-component-base.class';

@Component({
  selector: 'lux-link-plain',
  templateUrl: './lux-link-plain.component.html',
  styleUrls: ['./lux-link-plain.component.scss'],
  host: { '[class.lux-disabled]': 'luxDisabled' },
  imports: [LuxAriaLabelDirective, NgClass, LuxIconComponent]
})
export class LuxLinkPlainComponent extends LuxActionComponentBaseClass implements OnInit {
  private router = inject(Router);
  cdr = inject(ChangeDetectorRef);
  tooltipDirective?: LuxTooltipDirective;

  @HostBinding('class') classes = '';
  @Input() luxHref = '';
  @Input() luxBlank = false;

  private _customClass = '';
  get luxCustomClass() {
    return this._customClass;
  }
  @Input() set luxCustomClass(customClass: string) {
    if (customClass) {
      this._customClass = customClass;
      this.updateHostClasses();
    }
  }

  ngOnInit() {
    this.updateHostClasses();
  }

  private updateHostClasses() {
    if (this.luxCustomClass) {
      this.classes = this.luxCustomClass;
    } else {
      this.classes = 'default-style';
    }
  }

  isExternal(): boolean {
    if (!this.luxHref) return false;
    const href = this.luxHref.trim();
    return (
      href.startsWith('http://') ||
      href.startsWith('https://') ||
      href.startsWith('//') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:')
    );
  }

  auxClicked(event: MouseEvent) {
    if (event.which === 2) {
      this.redirectToHref(event);
    }
  }

  redirectToHref($event: any) {
    this.luxClicked.emit($event);

    if (!this.luxHref) return;

    $event.preventDefault();
    const href = this.luxHref.trim();

    if (this.isExternal()) {
      // Externe Links: Öffne im aktuellen oder neuen Fenster
      window.open(href, this.luxBlank || $event.ctrlKey || $event.metaKey || $event.which === 2 ? '_blank' : '_self');
    } else {
      // Interne Links: Nutze Angular Router
      if (this.luxBlank || $event.ctrlKey || $event.metaKey || $event.which === 2) {
        const newRelativeUrl = this.router.createUrlTree([href]);
        const baseUrl = window.location.href.replace(this.router.url, '');
        window.open(baseUrl + newRelativeUrl, '_blank');
      } else {
        this.router.navigate([href]);
      }
    }
  }
}
