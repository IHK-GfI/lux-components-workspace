import { Component, inject } from '@angular/core';
import { LuxButtonComponent, LuxInputAcComponent, LuxAppHeaderAcSessionTimerService } from '@ihk-gfi/lux-components';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';

@Component({
  selector: 'app-session-timer-example',
  imports: [ExampleBaseStructureComponent, ExampleBaseSimpleOptionsComponent, LuxButtonComponent, LuxInputAcComponent],
  templateUrl: './session-timer-example.component.html'
})
export class SessionTimerExampleComponent {
  timerService = inject(LuxAppHeaderAcSessionTimerService);
  startingSeconds = this.timerService.startingSeconds();

  setTimer() {
    this.timerService.startingSeconds.set(this.startingSeconds + 1);
    this.timerService.startingSeconds.set(this.startingSeconds);
  }

  constructor() {
    this.timerService.luxLogoutEvent.subscribe(() => {
      console.log('Logout Event wurde vom LuxAppHeaderAcSessionTimerService ausgelöst');
    });
  }
}
