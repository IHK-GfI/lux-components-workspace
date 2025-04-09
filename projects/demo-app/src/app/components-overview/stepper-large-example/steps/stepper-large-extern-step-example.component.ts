import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild, inject } from '@angular/core';
import { LuxStepperLargeStepComponent, LuxToggleAcComponent } from '@ihk-gfi/lux-components';
import { Subscription } from 'rxjs';
import { StepperLargeExampleDataService } from '../stepper-large-example-data.service';
import { StepperLargeExampleErrorMessageBoxComponent } from '../stepper-large-example-error-message-box/stepper-large-example-error-message-box.component';

@Component({
  selector: 'lux-stepper-large-extern-step-example',
  templateUrl: './stepper-large-extern-step-example.component.html',
  providers: [{ provide: LuxStepperLargeStepComponent, useExisting: StepperLargeExternStepExampleComponent }],
  imports: [LuxToggleAcComponent, StepperLargeExampleErrorMessageBoxComponent]
})
export class StepperLargeExternStepExampleComponent extends LuxStepperLargeStepComponent implements OnInit, AfterViewInit {
  private cdr = inject(ChangeDetectorRef);
  dataService = inject(StepperLargeExampleDataService);

  @ViewChild('requiredCheck') toggle!: LuxToggleAcComponent;

  showErrorMessage = false;
  subscriptions: Subscription[] = [];

  ngOnInit(): void {
    if (!this.luxTitle) {
      this.luxTitle = 'Lorem ipsum 4711';
    }

    this.subscriptions.push(
      this.dataService.showErrorMessage.subscribe((value) => {
        this.showErrorMessage = value;
        if (this.showErrorMessage && this.toggle) {
          this.toggle.formControl.markAsTouched();
        }
      })
    );
  }

  override ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
