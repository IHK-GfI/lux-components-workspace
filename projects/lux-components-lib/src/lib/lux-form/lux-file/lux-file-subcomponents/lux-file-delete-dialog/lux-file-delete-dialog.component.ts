import { Component, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxButtonComponent } from '../../../../lux-action/lux-button/lux-button.component';
import { LuxDialogRef } from '../../../../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-ref.class';
import { LuxDialogActionsComponent } from '../../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-actions.component';
import { LuxDialogContentComponent } from '../../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-content.component';
import { LuxDialogTitleComponent } from '../../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-title.component';
import { LuxDialogStructureComponent } from '../../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure.component';

@Component({
  selector: 'lux-lux-file-delete-dialog',
  templateUrl: './lux-file-delete-dialog.component.html',
  styleUrls: ['./lux-file-delete-dialog.component.scss'],
  imports: [LuxDialogStructureComponent, LuxDialogTitleComponent, LuxDialogContentComponent, LuxDialogActionsComponent, LuxButtonComponent, TranslocoPipe]
})
export class LuxFileDeleteDialogComponent {
  luxDialogRef = inject<LuxDialogRef<void>>(LuxDialogRef);
}
