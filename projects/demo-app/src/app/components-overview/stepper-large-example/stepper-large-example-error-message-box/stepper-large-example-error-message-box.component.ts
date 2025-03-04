import { Component, Input, OnInit, inject } from '@angular/core';
import { LuxStepperLargeStepComponent, LuxTextboxComponent } from 'lux-components-lib';
import { Subscription } from 'rxjs';
import { StepperLargeExampleDataService } from '../stepper-large-example-data.service';

@Component({
  selector: 'lux-stepper-large-example-error-message-box',
  templateUrl: './stepper-large-example-error-message-box.component.html',
  imports: [LuxTextboxComponent],
  providers: [{ provide: LuxStepperLargeStepComponent, useExisting: StepperLargeExampleErrorMessageBoxComponent }]
})
export class StepperLargeExampleErrorMessageBoxComponent implements OnInit {
  dataService = inject(StepperLargeExampleDataService);

  @Input() luxTitle = '';
  @Input() luxCompleted = true;
  showErrorMessage = false;
  subscriptions: Subscription[] = [];

  ngOnInit() {
    this.subscriptions.push(
      this.dataService.showErrorMessage.subscribe((value) => {
        this.showErrorMessage = value;
      })
    );
  }
}
