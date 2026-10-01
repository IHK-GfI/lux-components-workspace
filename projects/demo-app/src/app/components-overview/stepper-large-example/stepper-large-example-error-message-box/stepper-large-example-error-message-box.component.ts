import { Component, OnInit, inject, signal, input, ChangeDetectionStrategy } from '@angular/core';
import { LuxStepperLargeStepComponent, LuxTextboxComponent } from '@ihk-gfi/lux-components';
import { Subscription } from 'rxjs';
import { StepperLargeExampleDataService } from '../stepper-large-example-data.service';

@Component({
  selector: 'lux-stepper-large-example-error-message-box',
  templateUrl: './stepper-large-example-error-message-box.component.html',
  imports: [LuxTextboxComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: LuxStepperLargeStepComponent, useExisting: StepperLargeExampleErrorMessageBoxComponent }]
})
export class StepperLargeExampleErrorMessageBoxComponent implements OnInit {
  readonly luxTitle = input('');
  readonly luxCompleted = input(true);

  readonly showErrorMessage = signal(false);
  subscriptions: Subscription[] = [];

  private dataService = inject(StepperLargeExampleDataService);

  ngOnInit() {
    this.subscriptions.push(
      this.dataService.showErrorMessage.subscribe((value) => {
        this.showErrorMessage.set(value);
      })
    );
  }
}
