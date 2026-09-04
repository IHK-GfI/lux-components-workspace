import { ChangeDetectionStrategy, Component, OnDestroy, inject, signal } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  dismissSubscription: Subscription | null = null;
  actionSubscription: Subscription | null = null;
  readonly colors: string[] = LuxSnackbarColors;

  readonly showOutputEvents = signal(false);

  readonly duration = signal(5000);
  readonly snackbarConfig: Omit<LuxSnackbarConfig, 'textColor' | 'iconColor' | 'actionColor'> = {
    text: 'Text',
    iconName: 'lux-interface-alert-information-circle',
    iconSize: '2x',
    action: 'Action'
  };

  // Werden in openSnackbarShow() innerhalb eines setTimeout gesetzt; als Signal, damit die
  // eigenen [(luxSelected)]-Bindings unter OnPush trotzdem aktualisiert werden.
  readonly textColor = signal('white');
  readonly iconColor = signal('white');
  readonly actionColor = signal('white');

  private readonly snackbar = inject(LuxSnackbarService);

  ngOnDestroy(): void {
    if (this.dismissSubscription) {
      this.dismissSubscription.unsubscribe();
    }
    if (this.actionSubscription) {
      this.actionSubscription.unsubscribe();
    }
  }

  openSnackbarText() {
    this.snackbar.openText(this.snackbarConfig.text ?? '---', this.duration(), this.snackbarConfig.action);
    this.dismissSubscription = this.snackbar.afterDismissed().subscribe(this.observeDismiss.bind(this));
    this.actionSubscription = this.snackbar.onAction().subscribe(this.observeAction.bind(this));
  }

  openSnackbar() {
    this.snackbar.open(this.duration(), this.buildSnackbarConfig());
    this.dismissSubscription = this.snackbar.afterDismissed().subscribe(this.observeDismiss.bind(this));
    this.actionSubscription = this.snackbar.onAction().subscribe(this.observeAction.bind(this));
  }

  openSnackbarShow() {
    let time = 0;
    this.colors.forEach((color) => {
      setTimeout(() => {
        this.textColor.set(color);
        this.iconColor.set(color);
        this.actionColor.set(color);
        this.snackbar.open(this.duration(), this.buildSnackbarConfig());
      }, time);
      time += this.duration();
    });
  }

  dismissSnackbar() {
    this.snackbar.dismiss();
  }

  private buildSnackbarConfig(): LuxSnackbarConfig {
    return {
      ...this.snackbarConfig,
      textColor: this.textColor(),
      iconColor: this.iconColor(),
      actionColor: this.actionColor()
    };
  }

  private observeDismiss(payload: MatSnackBarDismiss) {
    logResult(this.showOutputEvents(), 'afterDismissed', payload);

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
    logResult(this.showOutputEvents(), 'onAction');
  }
}
