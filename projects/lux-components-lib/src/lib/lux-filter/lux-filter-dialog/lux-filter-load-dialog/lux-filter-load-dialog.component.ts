import { Component, OnInit, inject } from '@angular/core';
import { LuxButtonComponent } from '../../../lux-action/lux-button/lux-button.component';
import { LuxCardActionsComponent } from '../../../lux-layout/lux-card/lux-card-subcomponents/lux-card-actions.component';
import { LuxCardContentComponent } from '../../../lux-layout/lux-card/lux-card-subcomponents/lux-card-content.component';
import { LuxCardComponent } from '../../../lux-layout/lux-card/lux-card.component';
import { LuxDialogRef } from '../../../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-ref.class';
import { LuxDialogActionsComponent } from '../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-actions.component';
import { LuxDialogContentComponent } from '../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-content.component';
import { LuxDialogTitleComponent } from '../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-title.component';
import { LuxDialogStructureComponent } from '../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure.component';
import { LuxFilter } from '../../lux-filter-base/lux-filter';
import { LuxFilterFormComponent } from '../../lux-filter-form/lux-filter-form.component';

@Component({
  selector: 'lux-filter-load-dialog',
  templateUrl: './lux-filter-load-dialog.component.html',
  imports: [
    LuxDialogStructureComponent,
    LuxDialogTitleComponent,
    LuxDialogContentComponent,
    LuxDialogActionsComponent,
    LuxCardComponent,
    LuxCardContentComponent,
    LuxCardActionsComponent,
    LuxButtonComponent
  ]
})
export class LuxFilterLoadDialogComponent implements OnInit {
  luxDialogRef = inject<LuxDialogRef<LuxFilterFormComponent>>(LuxDialogRef);

  filterArr: LuxFilter[] = [];
  component!: LuxFilterFormComponent;

  ngOnInit() {
    this.component = this.luxDialogRef.data;
    this.filterArr = this.component.luxStoredFilters ?? [];
  }

  onDelete(index: number) {
    const deletedFilter = this.filterArr.splice(index, 1)[0];
    this.component.onDelete(deletedFilter);
  }
}
