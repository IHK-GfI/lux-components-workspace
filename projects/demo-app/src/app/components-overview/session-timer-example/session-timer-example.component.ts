import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { LuxAppHeaderAcSessionTimerService, LuxButtonComponent, LuxInputAcComponent, LuxToggleAcComponent } from '@ihk-gfi/lux-components';
import { DemoMarkerType } from '../../base/status-marker/status-marker.model';
import { StatusMarkerComponent } from '../../base/status-marker/status-marker.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';

@Component({
  selector: 'app-session-timer-example',
  imports: [
    ExampleBaseStructureComponent,
    ExampleBaseSimpleOptionsComponent,
    LuxButtonComponent,
    LuxInputAcComponent,
    LuxToggleAcComponent,
    StatusMarkerComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './session-timer-example.component.html'
})
export class SessionTimerExampleComponent {
  readonly markerTypeNew = DemoMarkerType.New;
  readonly startingSeconds = signal(1800);

  protected readonly timerService = inject(LuxAppHeaderAcSessionTimerService);

  get canExtendSession(): boolean {
    return this.timerService.canExtendSession;
  }

  setTimer() {
    this.timerService.resetTimer(this.startingSeconds());
  }

  toggleCanExtendSession(checked: boolean) {
    this.timerService.canExtendSession = checked;
  }
}
