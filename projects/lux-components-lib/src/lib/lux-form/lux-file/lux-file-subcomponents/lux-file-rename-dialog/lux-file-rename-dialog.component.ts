import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { LuxButtonComponent } from '../../../../lux-action/lux-button/lux-button.component';
import { LuxAutofocusDirective } from '../../../../lux-directives/lux-autofocus/lux-autofocus.directive';
import { LuxDialogRef } from '../../../../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-ref.class';
import { LuxDialogActionsComponent } from '../../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-actions.component';
import { LuxDialogContentComponent } from '../../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-content.component';
import { LuxDialogTitleComponent } from '../../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-title.component';
import { LuxDialogStructureComponent } from '../../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure.component';
import { LuxInputAcComponent } from '../../../lux-input-ac/lux-input-ac.component';
import { ILuxFileObject } from '../../lux-file-model/lux-file-object.interface';

@Component({
  selector: 'lux-lux-file-rename-dialog',
  imports: [
    LuxInputAcComponent,
    LuxDialogStructureComponent,
    LuxDialogTitleComponent,
    LuxDialogContentComponent,
    LuxDialogActionsComponent,
    LuxButtonComponent,
    LuxAutofocusDirective
  ],
  templateUrl: './lux-file-rename-dialog.component.html',
  styleUrl: './lux-file-rename-dialog.component.scss'
})
export class LuxFileRenameDialogComponent implements AfterViewInit {
  luxDialogRef = inject<LuxDialogRef<ILuxFileObject>>(LuxDialogRef);

  @ViewChild(LuxInputAcComponent, { read: LuxInputAcComponent, static: true }) input!: LuxInputAcComponent;

  ngAfterViewInit(): void {
    this.input.inputElement.nativeElement.select();
  }
}
