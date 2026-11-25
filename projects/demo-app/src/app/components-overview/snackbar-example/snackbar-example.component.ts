import { ChangeDetectionStrategy, Component, effect, inject, OnDestroy, signal } from '@angular/core';
import {
  LuxButtonComponent,
  LuxInputComponent,
  LuxSelectComponent,
  LuxSnackbarColors,
  LuxSnackbarType,
  LuxToggleComponent,
  LuxTooltipDirective
} from '@ihk-gfi/lux-components';
import {
  LUX_SNACKBAR_LIMITS,
  LuxSnackbarConfig,
  LuxSnackbarDismiss,
  LuxSnackbarLimits,
  LuxSnackbarRef,
  LuxSnackbarService
} from '@ihk-gfi/lux-components/lux-snackbar';
import { StatusMarkerComponent } from '../../base/status-marker/status-marker.component';
import { DemoMarkerType } from '../../base/status-marker/status-marker.model';
import { ExampleBaseOptionsActionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-options-actions.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';

const NO_TYPE = 'ohne';
const CLOSE_BUTTON_AUTO = 'automatisch';

@Component({
  selector: 'app-snackbar-example',
  templateUrl: './snackbar-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxButtonComponent,
    LuxToggleComponent,
    LuxSelectComponent,
    LuxInputComponent,
    LuxTooltipDirective,
    ExampleBaseStructureComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseOptionsActionsComponent,
    StatusMarkerComponent
  ]
})
export class SnackbarExampleComponent implements OnDestroy {
  readonly colors: string[] = LuxSnackbarColors;
  readonly types: string[] = [NO_TYPE, 'info', 'warning', 'error', 'success'];
  readonly closeButtonOptions: string[] = [CLOSE_BUTTON_AUTO, 'an', 'aus'];
  readonly markerTypeNew = DemoMarkerType.New;

  readonly showOutputEvents = signal(false);

  readonly duration = signal(0);
  readonly snackbarConfig: Omit<LuxSnackbarConfig, 'textColor' | 'iconColor' | 'actionColor' | 'type' | 'showCloseButton'> = {
    text: 'Text',
    iconName: 'lux-interface-alert-information-circle',
    iconSize: '2x',
    action: 'Ok'
  };

  // Werden in openSnackbarShow() innerhalb eines setTimeout gesetzt; als Signal, damit die
  // eigenen [(luxSelected)]-Bindings unter OnPush trotzdem aktualisiert werden.
  readonly textColor = signal('white');
  readonly iconColor = signal('white');
  readonly actionColor = signal('white');
  readonly type = signal(NO_TYPE);
  readonly closeButton = signal(CLOSE_BUTTON_AUTO);

  // Limits (wie viele Nachrichten gleichzeitig sichtbar sind)
  readonly maxVisible = signal(1);
  readonly limitsPerType = signal(false);
  readonly maxVisibleInfo = signal<number | null>(2);
  readonly maxVisibleWarning = signal<number | null>(1);
  readonly maxVisibleError = signal<number | null>(3);
  readonly maxVisibleSuccess = signal<number | null>(null);

  private readonly snackbar = inject(LuxSnackbarService);
  private readonly appLimits = inject(LUX_SNACKBAR_LIMITS, { optional: true });
  private showTimeouts: ReturnType<typeof setTimeout>[] = [];

  constructor() {
    effect(() => {
      const limits: LuxSnackbarLimits = { maxVisible: this.maxVisible() };

      if (this.limitsPerType()) {
        limits.maxVisiblePerType = {
          info: this.maxVisibleInfo() ?? undefined,
          warning: this.maxVisibleWarning() ?? undefined,
          error: this.maxVisibleError() ?? undefined,
          success: this.maxVisibleSuccess() ?? undefined
        };
      }

      this.snackbar.setLimits(limits);
    });
  }

  ngOnDestroy(): void {
    this.showTimeouts.forEach((timeout) => clearTimeout(timeout));
    // Die Limits gelten für die ganze App, deshalb beim Verlassen des Beispiels auf die Start-Limits
    // aus provideLuxSnackbar() zurücksetzen.
    this.snackbar.setLimits(this.appLimits ?? {});
  }

  openSnackbarText() {
    this.observe(this.snackbar.openText(this.snackbarConfig.text ?? '---', this.duration(), this.snackbarConfig.action));
  }

  openSnackbar() {
    this.observe(this.snackbar.open(this.duration(), this.buildSnackbarConfig()));
  }

  openSnackbarMultiple() {
    const messages: LuxSnackbarConfig[] = [
      { type: 'info', text: 'Es sind neue Informationen verfügbar.' },
      { type: 'success', text: 'Der Antrag wurde gespeichert.' },
      { type: 'warning', text: 'Die Sitzung läuft in 5 Minuten ab.', action: 'Verlängern' },
      { type: 'error', text: 'Die Datei konnte nicht hochgeladen werden.', action: 'Ok' },
      { type: 'info', text: 'Ein neuer Kommentar wurde hinzugefügt.' },
      { type: 'error', text: 'Der Server ist nicht erreichbar.', action: 'Ok' }
    ];

    messages.forEach((config) => this.observe(this.snackbar.open(this.duration(), { iconSize: '2x', ...config })));
  }

  openSnackbarShow() {
    let time = 0;
    const duration = 1000;
    this.colors.forEach((color) => {
      this.showTimeouts.push(
        setTimeout(() => {
          this.textColor.set(color);
          this.iconColor.set(color);
          this.actionColor.set(color);
          this.observe(this.snackbar.open(this.duration(), this.buildSnackbarConfig()));
        }, time)
      );
      time += duration;
    });
  }

  dismissSnackbar() {
    this.snackbar.dismiss();
  }

  private buildSnackbarConfig(): LuxSnackbarConfig {
    return {
      ...this.snackbarConfig,
      type: this.type() === NO_TYPE ? undefined : (this.type() as LuxSnackbarType),
      showCloseButton: this.closeButton() === CLOSE_BUTTON_AUTO ? undefined : this.closeButton() === 'an',
      textColor: this.textColor(),
      iconColor: this.iconColor(),
      actionColor: this.actionColor()
    };
  }

  // Die Observables der Ref enden mit dem Schließen der Nachricht, ein Abmelden ist nicht nötig.
  private observe(ref: LuxSnackbarRef) {
    ref.afterDismissed().subscribe((payload: LuxSnackbarDismiss) => logResult(this.showOutputEvents(), 'afterDismissed', payload));
    ref.onAction().subscribe(() => logResult(this.showOutputEvents(), 'onAction'));
  }
}
