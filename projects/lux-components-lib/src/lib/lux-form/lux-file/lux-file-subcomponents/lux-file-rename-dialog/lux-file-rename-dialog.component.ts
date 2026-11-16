import { AfterViewInit, ChangeDetectionStrategy, Component, inject, viewChild } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxButtonComponent } from '../../../../lux-action/lux-button/lux-button.component';
import { LuxAutofocusDirective } from '../../../../lux-directives/lux-autofocus/lux-autofocus.directive';
import { LuxDialogRef } from '../../../../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-ref.class';
import { LuxDialogActionsComponent } from '../../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-actions.component';
import { LuxDialogContentComponent } from '../../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-content.component';
import { LuxDialogTitleComponent } from '../../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-title.component';
import { LuxDialogStructureComponent } from '../../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure.component';
import { LuxInputComponent } from '../../../lux-input/lux-input.component';
import { ILuxFileObject } from '../../lux-file-model/lux-file-object.interface';

@Component({
  selector: 'lux-file-rename-dialog',
  imports: [
    LuxInputComponent,
    LuxDialogStructureComponent,
    LuxDialogTitleComponent,
    LuxDialogContentComponent,
    LuxDialogActionsComponent,
    LuxButtonComponent,
    LuxAutofocusDirective,
    TranslocoPipe
  ],
  templateUrl: './lux-file-rename-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './lux-file-rename-dialog.component.scss'
})
export class LuxFileRenameDialogComponent implements AfterViewInit {
  readonly input = viewChild.required(LuxInputComponent);

  luxDialogRef = inject<LuxDialogRef<ILuxFileObject>>(LuxDialogRef);

  ngAfterViewInit(): void {
    this.input().inputElement()?.nativeElement.select();
  }
}
