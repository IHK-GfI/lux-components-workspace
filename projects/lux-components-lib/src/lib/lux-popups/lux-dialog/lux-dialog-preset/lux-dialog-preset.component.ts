import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewChild, inject } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxButtonComponent } from '../../../lux-action/lux-button/lux-button.component';
import { LuxTabIndexDirective } from '../../../lux-directives/lux-tabindex/lux-tab-index.directive';
import { ILuxDialogPresetConfig } from '../lux-dialog-model/lux-dialog-preset-config.interface';
import { LuxDialogRef } from '../lux-dialog-model/lux-dialog-ref.class';
import { LuxDialogActionsComponent } from '../lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-actions.component';
import { LuxDialogContentComponent } from '../lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-content.component';
import { LuxDialogTitleComponent } from '../lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-title.component';
import { LuxDialogStructureComponent } from '../lux-dialog-structure/lux-dialog-structure.component';

/**
 * Diese Component wird von dem LuxDialogService zur Darstellung via "open" genutzt und nimmt ein Config-Objekt
 * vom Typ LuxDialogConfig entgegen.
 */
@Component({
  selector: 'lux-dialog-preset',
  templateUrl: './lux-dialog-preset.component.html',
  imports: [
    LuxDialogStructureComponent,
    LuxDialogTitleComponent,
    LuxDialogContentComponent,
    NgTemplateOutlet,
    LuxDialogActionsComponent,
    LuxButtonComponent,
    LuxTabIndexDirective,
    TranslocoPipe
  ]
})
export class LuxDialogPresetComponent implements OnInit, AfterViewInit {
  dialogRef = inject<LuxDialogRef<ILuxDialogPresetConfig>>(LuxDialogRef);

  @ViewChild('confirmButton') confirmButton?: LuxButtonComponent;
  @ViewChild('declineButton') declineButton?: LuxButtonComponent;

  data?: ILuxDialogPresetConfig;
  defaultButton?: LuxButtonComponent;

  ngOnInit() {
    this.data = this.dialogRef.data;
  }

  ngAfterViewInit() {
    this.initDefaultButton();

    setTimeout(() => {
      (this.defaultButton?.elementRef?.nativeElement as HTMLElement)?.querySelector('button')?.focus();
    });
  }

  /**
   * Schließt den Dialog beim "positiven" Beenden des Dialogs mit dem Wert true.
   */
  onConfirmClick() {
    this.dialogRef.closeDialog(true);
  }

  /**
   * Schließt den Dialog beim "negativen" Beenden des Dialogs mit dem Wert false.
   */
  onDeclineClick() {
    this.dialogRef.closeDialog(false);
  }

  private initDefaultButton() {
    switch (this.data?.defaultButton) {
      case 'confirm':
        this.defaultButton = this.confirmButton;
        break;
      case 'decline':
        this.defaultButton = this.declineButton;
        break;
      default:
        this.defaultButton = undefined;
    }
  }
}
