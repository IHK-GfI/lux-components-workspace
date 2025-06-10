import { ChangeDetectorRef, Component, Input, ViewChild, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LuxAriaRoleDirective } from '../../lux-directives/lux-aria/lux-aria-role.directive';
import { LuxActionComponentBaseClass } from '../lux-action-model/lux-action-component-base.class';
import { LuxButtonComponent } from '../lux-button/lux-button.component';

@Component({
  selector: 'lux-link',
  templateUrl: './lux-link.component.html',
  styleUrls: ['./lux-link.component.scss'],
  imports: [LuxButtonComponent, LuxAriaRoleDirective]
})
export class LuxLinkComponent extends LuxActionComponentBaseClass {
  private router = inject(Router);
  cdr = inject(ChangeDetectorRef);

  public readonly iconSize: string = '2x';

  @Input() luxHref = '';
  @Input() luxBlank? = false;

  @ViewChild(LuxButtonComponent, { static: true }) luxButton!: LuxButtonComponent;

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
}
