import { Component, inject } from '@angular/core';
import { LuxAppHeaderAcSessionTimerService, LuxButtonComponent, LuxInputAcComponent, LuxToggleAcComponent } from '@ihk-gfi/lux-components';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';

@Component({
  selector: 'app-session-timer-example',
  imports: [
    ExampleBaseStructureComponent,
    ExampleBaseSimpleOptionsComponent,
    LuxButtonComponent,
    LuxInputAcComponent,
    LuxToggleAcComponent
  ],
  templateUrl: './session-timer-example.component.html'
})
export class SessionTimerExampleComponent {
  protected timerService = inject(LuxAppHeaderAcSessionTimerService);
  startingSeconds = 1800;

  get canExtendSession(): boolean {
    return this.timerService.canExtendSession;
  }

  get canExtendSessionButtonLabel(): string {
    return this.canExtendSession ? 'canExtendSession auf false setzen' : 'canExtendSession auf true setzen';
  }

  setTimer() {
    this.timerService.resetTimer(this.startingSeconds);
  }

  toggleCanExtendSession(checked: boolean) {
    this.timerService.canExtendSession = checked;
  }
}
