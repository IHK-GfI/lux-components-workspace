import { Component, OnDestroy, inject } from '@angular/core';
import { MatSnackBarDismiss } from '@angular/material/snack-bar';
import {
  LuxButtonComponent,
  LuxInputAcComponent,
  LuxSelectAcComponent,
  LuxSnackbarColors,
  LuxSnackbarConfig,
  LuxSnackbarService,
  LuxToggleAcComponent,
  LuxTooltipDirective
} from '@ihk-gfi/lux-components';
import { Subscription } from 'rxjs';
import { ExampleBaseOptionsActionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-options-actions.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';

@Component({
  selector: 'app-snackbar-example',
  templateUrl: './snackbar-example.component.html',
  imports: [
    LuxButtonComponent,
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    LuxTooltipDirective,
    ExampleBaseStructureComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseOptionsActionsComponent
  ]
})
export class SnackbarExampleComponent implements OnDestroy {
  private snackbar = inject(LuxSnackbarService);

  dismissSubscription: Subscription | null = null;
  actionSubscription: Subscription | null = null;
  colors: string[] = LuxSnackbarColors;

  showOutputEvents = false;

  duration = 5000;
  snackbarConfig: LuxSnackbarConfig = {
    text: 'Text',
    textColor: 'white',
    iconName: 'lux-interface-alert-information-circle',
    iconColor: 'white',
    iconSize: '2x',
    action: 'Action',
    actionColor: 'white'
  };

  ngOnDestroy(): void {
    if (this.dismissSubscription) {
      this.dismissSubscription.unsubscribe();
    }
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
  }

  openSnackbarText() {
    this.snackbar.openText(this.snackbarConfig.text ?? '---', this.duration, this.snackbarConfig.action);
    this.dismissSubscription = this.snackbar.afterDismissed().subscribe(this.observeDismiss.bind(this));
    this.actionSubscription = this.snackbar.onAction().subscribe(this.observeAction.bind(this));
  }

  openSnackbar() {
    this.snackbar.open(this.duration, this.snackbarConfig);
    this.dismissSubscription = this.snackbar.afterDismissed().subscribe(this.observeDismiss.bind(this));
    this.actionSubscription = this.snackbar.onAction().subscribe(this.observeAction.bind(this));
  }

  openSnackbarShow() {
    let time = 0;
    this.colors.forEach((color) => {
      setTimeout(() => {
        this.snackbarConfig.textColor = color;
        this.snackbarConfig.iconColor = color;
        this.snackbarConfig.actionColor = color;
        this.snackbar.open(this.duration, this.snackbarConfig);
      }, time);
      time += this.duration;
    });
  }

  dismissSnackbar() {
    this.snackbar.dismiss();
  }

  private observeDismiss(payload: MatSnackBarDismiss) {
    logResult(this.showOutputEvents, 'afterDismissed', payload);

    // Subscriptions auflösen, da eine neue Snackbar neue Observables bedeuten sollte
    // (siehe lux-snackbar.service.ts -> _openedSnackBarRef)
    if (this.dismissSubscription) {
      this.dismissSubscription.unsubscribe();
    }
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
  }

  private observeAction() {
    logResult(this.showOutputEvents, 'onAction');
  }
}
