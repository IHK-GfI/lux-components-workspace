import { Component, ContentChild, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs';
import { LuxUtil } from '../../../lux-util/lux-util';
import { LuxTableColumnContentComponent } from './lux-table-column-content.component';
import { LuxTableColumnFooterComponent } from './lux-table-column-footer.component';
import { LuxTableColumnHeaderComponent } from './lux-table-column-header.component';

@Component({
  selector: 'lux-table-column',
  template: `<ng-content select="lux-table-column-header"></ng-content>
    <ng-content select="lux-table-column-content"></ng-content>
    <ng-content select="lux-table-column-footer"></ng-content>`
})
export class LuxTableColumnComponent implements OnInit, OnChanges {
  change$: Subject<void> = new Subject<void>();

  @Input() luxConfigLabel?: string;
  @Input() luxColumnDef!: string;
  @Input() luxSortable = false;
  @Input() luxSticky = false;
  @Input() luxResponsiveBehaviour = '';
  @Input() luxResponsiveAt: string | string[] | null = '';

  @ContentChild(LuxTableColumnHeaderComponent) header?: LuxTableColumnHeaderComponent;
  @ContentChild(LuxTableColumnContentComponent) content?: LuxTableColumnContentComponent;
  @ContentChild(LuxTableColumnFooterComponent) footer?: LuxTableColumnFooterComponent;

  constructor() {}

  ngOnInit() {
    LuxUtil.assertNonNull('luxColumnDef', this.luxColumnDef);
  }

  ngOnChanges(simpleChanges: SimpleChanges) {
    this.change$.next();
  }
}
