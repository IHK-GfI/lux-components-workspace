import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LuxAutofocusDirective, LuxIconComponent, LuxTileAcComponent } from '@ihk-gfi/lux-components';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [LuxIconComponent, LuxTileAcComponent, LuxAutofocusDirective, TranslocoModule]
})
export class HomeComponent {
  private router = inject(Router);
  tService = inject(TranslocoService);

  goTo(target: string) {
    switch (target) {
      case 'Components':
        this.router.navigate(['/components-overview']);
        break;
      case 'Form':
        this.router.navigate(['/form']);
        break;
      case 'Configuration':
        this.router.navigate(['/configuration']);
        break;
      case 'Baseline':
        this.router.navigate(['/baseline']);
        break;
      case 'Iconsearch':
        this.router.navigate(['/icon-overview']);
        break;
    }
  }
}
