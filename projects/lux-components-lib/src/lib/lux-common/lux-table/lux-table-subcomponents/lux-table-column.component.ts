import { ChangeDetectionStrategy, Component, contentChild, effect, input } from '@angular/core';
import { Subject } from 'rxjs';
import { LuxTableColumnContentComponent } from './lux-table-column-content.component';
import { LuxTableColumnFooterComponent } from './lux-table-column-footer.component';
import { LuxTableColumnHeaderComponent } from './lux-table-column-header.component';

@Component({
  selector: 'lux-table-column',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content select="lux-table-column-header"></ng-content>
    <ng-content select="lux-table-column-content"></ng-content>
    <ng-content select="lux-table-column-footer"></ng-content>`
})
export class LuxTableColumnComponent {
  change$: Subject<void> = new Subject<void>();

  readonly luxConfigLabel = input<string>();
  readonly luxColumnDef = input.required<string>();
  readonly luxSortable = input(false);
  readonly luxSticky = input(false);
  readonly luxResponsiveBehaviour = input('');
  readonly luxResponsiveAt = input<string | string[] | null>('');

  readonly header = contentChild(LuxTableColumnHeaderComponent);
  readonly content = contentChild(LuxTableColumnContentComponent);
  readonly footer = contentChild(LuxTableColumnFooterComponent);

  constructor() {
    effect(() => {
      // Sämtliche Inputs referenzieren, damit change$ - analog zum vorherigen ngOnChanges -
      // bei jeder Änderung eines Inputs (inkl. dem initialen Setzen) ausgelöst wird.
      this.luxConfigLabel();
      this.luxColumnDef();
      this.luxSortable();
      this.luxSticky();
      this.luxResponsiveBehaviour();
      this.luxResponsiveAt();
      this.change$.next();
    });
  }
}
