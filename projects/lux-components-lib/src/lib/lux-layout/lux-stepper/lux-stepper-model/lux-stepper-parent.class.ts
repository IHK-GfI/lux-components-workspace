import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { AfterViewInit, Directive, effect, input, output, viewChild, viewChildren, ViewContainerRef } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { ILuxStepperConfiguration } from './lux-stepper-configuration.interface';

/**
 * Parent-Klasse für den LuxStepperVertical und LuxStepperHorizontal, beide Komponenten werden ausschließlich von
 * dem LuxStepper zur Darstellung genutzt.
 */
@Directive()
export class LuxStepperParent implements AfterViewInit {
  readonly luxStepperConfig = input<ILuxStepperConfiguration | undefined>();

  // Diese Outputs werden bei den Klicks auf die Stepper-eigenen Navigations-Buttons ausgelöst und informieren die
  // LuxStepperComponent
  readonly luxFinButtonClicked = output<void>();
  readonly luxNextButtonClicked = output<void>();
  readonly luxPrevButtonClicked = output<void>();
  // Wird beim Wechsel des Steps (über Header oder Button) aufgerufen
  readonly luxStepChanged = output<StepperSelectionEvent>();
  // über die aktuellen Elemente informiert zu halten
  readonly luxMatStepperLoaded = output<MatStepper>();
  readonly luxMatStepLabelsLoaded = output<ViewContainerRef[]>();
  readonly luxStepClicked = output<number>();

  readonly matStepper = viewChild.required<MatStepper>('stepper');
  readonly matStepLabels = viewChildren('matStepLabel', { read: ViewContainerRef });

  private isFirstStepLabelsRun = true;

  constructor() {
    effect(() => {
      const labels = this.matStepLabels();

      // Der erste automatische Lauf entspricht der initialen Auflösung der ViewChildren
      // (kein "echter" Wechsel wie früher bei QueryList.changes, das initial nie feuert)
      // und wird daher übersprungen – die Erstinitialisierung übernimmt ngAfterViewInit synchron.
      if (this.isFirstStepLabelsRun) {
        this.isFirstStepLabelsRun = false;
        return;
      }

      this.luxMatStepLabelsLoaded.emit([...labels]);
    });
  }

  ngAfterViewInit() {
    // Sobald die Component initialisiert ist, dem Parent (luxStepper) den
    // MatStepper und die MatStepLabels mitteilen
    this.luxMatStepperLoaded.emit(this.matStepper());
    this.luxMatStepLabelsLoaded.emit([...this.matStepLabels()]);
  }

  onStepClicked(event: Event) {
    const target = event.target || event.srcElement || event.currentTarget;
    const stepIndex = this.getStepIndex(target as HTMLElement);

    if (stepIndex !== -1) {
      this.luxStepClicked.emit(stepIndex);
    }
  }

  private getStepIndex(element: HTMLElement, count = 0): number {
    if (element) {
      if ('mat-step-header' === element.nodeName.toLowerCase()) {
        // Das Attribut "aria-posinset" fängt mit dem Index 1 an,
        // während das Property "luxCurrentStepNumber" bei Index 0 beginnt.
        // Deshalb wird hier -1 gerechnet.
        return +element.getAttribute('aria-posinset')! - 1;
      } else {
        if (count <= 10) {
          return this.getStepIndex(element.parentElement!, count + 1);
        } else {
          return -1;
        }
      }
    } else {
      return -1;
    }
  }
}
