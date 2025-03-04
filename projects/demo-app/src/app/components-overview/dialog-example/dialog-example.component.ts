import { NgTemplateOutlet } from '@angular/common';
import { Component, OnDestroy, TemplateRef, ViewChild, inject } from '@angular/core';
import {
  ILuxDialogPresetConfig,
  LuxAccordionComponent,
  LuxButtonComponent,
  LuxDialogDefaultButton,
  LuxDialogService,
  LuxFormHintComponent,
  LuxInputAcComponent,
  LuxPanelComponent,
  LuxPanelContentComponent,
  LuxPanelHeaderTitleComponent,
  LuxRadioAcComponent,
  LuxSelectAcComponent,
  LuxToggleAcComponent
} from 'lux-components-lib';
import { Subscription } from 'rxjs';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseOptionsActionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-options-actions.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { examplePickValueFn, logResult } from '../../example-base/example-base-util/example-base-helper';
import { DialogComponentExampleComponent } from './dialog-component-example/dialog-component-example.component';

@Component({
  selector: 'app-dialog-example',
  templateUrl: './dialog-example.component.html',
  imports: [
    LuxButtonComponent,
    LuxAccordionComponent,
    LuxPanelHeaderTitleComponent,
    LuxPanelContentComponent,
    LuxPanelComponent,
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxRadioAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    ExampleBaseStructureComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent,
    NgTemplateOutlet,
    ExampleBaseOptionsActionsComponent
  ]
})
export class DialogExampleComponent implements OnDestroy {
  private dialogService = inject(LuxDialogService);

  @ViewChild('contentTemplate', { static: true }) contentTemplate!: TemplateRef<any>;
  useContentTemplate = false;
  showOutputEvents = false;
  contentTemplateString =
    ' <ng-template #contentTemplate>\n' +
    '     <i>Achtung: Ihre Daten werden gelöscht.</i><br/>\n' +
    '     <b>Möchten Sie fortfahren?</b>\n' +
    ' </ng-template>';
  log = logResult;

  dialogConfig: ILuxDialogPresetConfig = {
    title: 'Daten löschen?',
    content: 'Ihre Daten werden endgültig gelöscht. Das Löschen kann nicht rückgängig gemacht werden.',
    disableClose: true,
    width: 'auto',
    height: 'auto',
    iconName: 'lux-interface-alert-warning-triangle',
    panelClass: [],
    confirmAction: {
      label: 'Löschen',
      flat: true,
      outlined: false,
      color: 'warn'
    },
    declineAction: {
      label: 'Abbrechen',
      flat: true,
      outlined: false,
      color: 'primary'
    },
    defaultButton: undefined
  };
  pickValueFn = examplePickValueFn;

  exampleData: object | null = null;
  defaultButtonOptions: { label: string; value: LuxDialogDefaultButton }[] = [
    { label: 'unset', value: undefined },
    { label: 'confirm', value: 'confirm' },
    { label: 'decline', value: 'decline' }
  ];

  _defaultButton?: LuxDialogDefaultButton = undefined;

  get defaultButton() {
    return this._defaultButton;
  }

  set defaultButton(defaultButton) {
    this._defaultButton = defaultButton;
    this.dialogConfig.defaultButton = this._defaultButton;

    switch (this._defaultButton) {
      case 'confirm':
        this.dialogConfig.confirmAction!.flat = true;
        this.dialogConfig.confirmAction!.outlined = false;
        this.dialogConfig.confirmAction!.color = 'warn';

        this.dialogConfig.declineAction!.flat = false;
        this.dialogConfig.declineAction!.outlined = true;
        this.dialogConfig.declineAction!.color = undefined;
        break;
      case 'decline':
        this.dialogConfig.confirmAction!.flat = false;
        this.dialogConfig.confirmAction!.outlined = true;
        this.dialogConfig.confirmAction!.color = 'warn';

        this.dialogConfig.declineAction!.flat = true;
        this.dialogConfig.declineAction!.outlined = false;
        this.dialogConfig.declineAction!.color = 'primary';
        break;
      default:
        this.dialogConfig.confirmAction!.flat = true;
        this.dialogConfig.confirmAction!.outlined = false;
        this.dialogConfig.confirmAction!.color = 'warn';

        this.dialogConfig.declineAction!.flat = true;
        this.dialogConfig.declineAction!.outlined = false;
        this.dialogConfig.declineAction!.color = 'primary';
    }
  }

  private subscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  openDialog() {
    const dialogRef = this.dialogService.open(this.dialogConfig);

    this.subscriptions.push(
      dialogRef.dialogClosed.subscribe((result: any) => {
        this.log(this.showOutputEvents, 'dialogClosed', result);
      })
    );

    this.subscriptions.push(
      dialogRef.dialogDeclined.subscribe((result: any) => {
        this.log(this.showOutputEvents, 'dialogDeclined', result);
      })
    );

    this.subscriptions.push(
      dialogRef.dialogConfirmed.subscribe((result: any) => {
        this.log(this.showOutputEvents, 'dialogConfirmed', result);
      })
    );
  }

  openDialogComponent() {
    const dialogRef = this.dialogService.openComponent(DialogComponentExampleComponent, this.dialogConfig, this.exampleData);

    this.subscriptions.push(
      dialogRef.dialogClosed.subscribe((result: any) => {
        this.log(this.showOutputEvents, 'dialogClosed', result);
      })
    );
  }

  useContentTemplateChange(useContentTemplate: boolean) {
    if (useContentTemplate) {
      this.dialogConfig.contentTemplate = this.contentTemplate;
    } else {
      this.dialogConfig.contentTemplate = undefined;
    }
  }

  updatePanelClass(event: string | string[] | null | undefined) {
    if (Array.isArray(event)) {
      this.dialogConfig.panelClass = event;
    } else if (event && event.length > 0) {
      this.dialogConfig.panelClass = event.split(',');
    }
  }
}
