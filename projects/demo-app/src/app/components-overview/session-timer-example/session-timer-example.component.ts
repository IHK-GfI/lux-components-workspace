import { Component, inject } from '@angular/core';
import { LuxSessionTimerService, LuxButtonComponent, LuxInputAcComponent, LuxToggleAcComponent } from '@ihk-gfi/lux-components';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { MockLuxSessionTimerService } from './mock-session-timer-service';

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
  timerService = inject(LuxSessionTimerService);
  startingSeconds = this.timerService.startingSeconds();

  openSessionDialog() {
    this.timerService.openDialog();
  }

  setTimer() {
    this.timerService.startingSeconds.set(this.startingSeconds + 1);
    this.timerService.startingSeconds.set(this.startingSeconds);
  }

  failSessionExtension() {
    const mockService = inject(MockLuxSessionTimerService);
    mockService.failSessionExtension = !mockService.failSessionExtension;
  }
}
