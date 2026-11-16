import { AfterViewInit, ChangeDetectorRef, Component, OnInit, inject, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { LuxStepperLargeStepComponent, LuxToggleComponent } from '@ihk-gfi/lux-components';
import { Subscription } from 'rxjs';
import { StepperLargeExampleDataService } from '../stepper-large-example-data.service';
import { StepperLargeExampleErrorMessageBoxComponent } from '../stepper-large-example-error-message-box/stepper-large-example-error-message-box.component';

@Component({
  selector: 'lux-stepper-large-extern-step-example',
  templateUrl: './stepper-large-extern-step-example.component.html',
  providers: [{ provide: LuxStepperLargeStepComponent, useExisting: StepperLargeExternStepExampleComponent }],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxToggleComponent, StepperLargeExampleErrorMessageBoxComponent]
})
export class StepperLargeExternStepExampleComponent extends LuxStepperLargeStepComponent implements OnInit, AfterViewInit {
  readonly toggle = viewChild<LuxToggleComponent>('requiredCheck');

  showErrorMessage = false;
  subscriptions: Subscription[] = [];

  private cdr = inject(ChangeDetectorRef);
  private dataService = inject(StepperLargeExampleDataService);

  ngOnInit(): void {
    if (!this.luxTitle()) {
      this.luxTitle.set('Lorem ipsum 4711');
    }

    this.subscriptions.push(
      this.dataService.showErrorMessage.subscribe((value) => {
        this.showErrorMessage = value;
        const toggle = this.toggle();
        if (this.showErrorMessage && toggle) {
          toggle.formControl.markAsTouched();
        }
      })
    );
  }

  override ngAfterViewInit() {
    this.cdr.detectChanges();
  }
}
