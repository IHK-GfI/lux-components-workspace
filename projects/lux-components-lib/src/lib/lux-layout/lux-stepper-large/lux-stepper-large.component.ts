import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { AfterContentInit, ChangeDetectionStrategy, Component, contentChildren, effect, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';
import { LuxButtonComponent } from '../../lux-action/lux-button/lux-button.component';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxSnackbarService } from '../../lux-popups/lux-snackbar/lux-snackbar.service';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';
import { LuxUtil } from '../../lux-util/lux-util';
import {
  LUX_STEPPER_LARGE_DEFAULT_FIN_BTN_CONF,
  LUX_STEPPER_LARGE_DEFAULT_NEXT_BTN_CONF,
  LUX_STEPPER_LARGE_DEFAULT_PREV_BTN_CONF,
  LuxStepperLargeButtonInfo
} from './lux-stepper-large-model/lux-stepper-large-button-info';
import { LuxStepperLargeClickEvent } from './lux-stepper-large-model/lux-stepper-large-click-event';
import { LuxStepperLargeSelectionEvent } from './lux-stepper-large-model/lux-stepper-large-selection-event';
import { LuxVetoState } from './lux-stepper-large-model/lux-stepper-large-step.interface';
import { LuxStepperLargeMobileOverlayService } from './lux-stepper-large-subcomponents/lux-stepper-large-mobile-overlay/lux-stepper-large-mobile-overlay.service';
import { LuxStepperLargeStepComponent } from './lux-stepper-large-subcomponents/lux-stepper-large-step/lux-stepper-large-step.component';

@Component({
  selector: 'lux-stepper-large',
  templateUrl: './lux-stepper-large.component.html',
  styleUrls: ['./lux-stepper-large.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet, LuxAriaLabelDirective, NgClass, LuxButtonComponent, TranslocoPipe]
})
export class LuxStepperLargeComponent implements OnInit, AfterContentInit, OnDestroy {
  readonly luxStepValidationActive = input(true);
  readonly luxA11YMode = input(true);
  readonly luxPrevButtonConfig = input<LuxStepperLargeButtonInfo>(LUX_STEPPER_LARGE_DEFAULT_PREV_BTN_CONF);
  readonly luxNextButtonConfig = input<LuxStepperLargeButtonInfo>(LUX_STEPPER_LARGE_DEFAULT_NEXT_BTN_CONF);
  readonly luxFinButtonConfig = input<LuxStepperLargeButtonInfo>(LUX_STEPPER_LARGE_DEFAULT_FIN_BTN_CONF);
  readonly luxCurrentStepNumber = input(0);

  readonly luxStepperFinished = output<void>();
  readonly luxStepChanged = output<LuxStepperLargeSelectionEvent>();
  readonly luxCurrentStepNumberChange = output<number>();
  readonly luxOnNextStepNotComplete = output<number>();

  readonly steps = contentChildren(LuxStepperLargeStepComponent);

  get currentStepNumber(): number {
    return this._currentStepNumber();
  }

  readonly isMobile = signal(false);
  readonly isFirstStep = signal(true);
  readonly isLastStep = signal(false);
  readonly isFinished = signal(false);
  readonly cursorPos = signal(-1);

  private mobileOverlayService = inject(LuxStepperLargeMobileOverlayService);
  private queryService = inject(LuxMediaQueryObserverService);
  private liveAnnouncer = inject(LiveAnnouncer);
  private snackbar = inject(LuxSnackbarService);
  private tService = inject(TranslocoService);
  private readonly _currentStepNumber = signal(0);
  private subscriptions: Subscription[] = [];

  constructor() {
    effect(() => {
      const requested = this.luxCurrentStepNumber();
      this.trySetCurrentStepNumber(requested);
    });
  }

  ngOnInit() {
    this.subscriptions.push(
      this.queryService.getMediaQueryChangedAsObservable().subscribe((query) => {
        this.isMobile.set(query === 'xs' || query === 'sm');
      })
    );
  }

  ngAfterContentInit() {
    const steps = this.steps();
    if (this._currentStepNumber() >= 0 && this._currentStepNumber() < steps.length) {
      steps[this._currentStepNumber()].luxTouched.set(true);
    }

    this.isLastStep.set(this._currentStepNumber() === steps.length - 1);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  onPrevStep() {
    const newIndex = this.getPrevIndex(this._currentStepNumber());

    const event: LuxStepperLargeClickEvent = {
      stepper: this,
      newIndex: newIndex,
      newStep: this.steps()[newIndex],
      source: 'prev_button'
    };
    const vetoPromise = this.steps()[this._currentStepNumber()].luxVetoFn()(event);

    vetoPromise
      .then((veto) => {
        if (veto === LuxVetoState.navigationAccepted) {
          this.activatePrevStep(newIndex);
        }
      })
      .catch((err) => console.error(err));
  }

  onNextStep() {
    if (this.luxStepValidationActive() && this.luxA11YMode() && !this.steps()[this._currentStepNumber()].luxCompleted()) {
      this.luxOnNextStepNotComplete.emit(this._currentStepNumber());
    }

    const newIndex = this.getNextIndex(this._currentStepNumber());

    const event: LuxStepperLargeClickEvent = {
      stepper: this,
      newIndex: newIndex,
      newStep: this.steps()[newIndex],
      source: 'next_button'
    };
    const vetoPromise = this.steps()[this._currentStepNumber()].luxVetoFn()(event);

    if (this.luxStepValidationActive() && this._currentStepNumber() < newIndex && newIndex < this.steps().length) {
      for (let i = this._currentStepNumber(); i < newIndex; i++) {
        if (this.steps()[i].luxCompleted() === false) {
          return;
        }
      }
    }

    vetoPromise
      .then((veto) => {
        if (veto === LuxVetoState.navigationAccepted) {
          this.activateNextStep(newIndex);
        }
      })
      .catch((err) => console.error(err));
  }

  onFinStep() {
    if (this.luxStepValidationActive() && this.luxA11YMode() && !this.steps()[this._currentStepNumber()].luxCompleted()) {
      this.luxOnNextStepNotComplete.emit(this._currentStepNumber());
      return;
    }

    const event: LuxStepperLargeClickEvent = {
      stepper: this,
      newIndex: this._currentStepNumber(),
      newStep: this.steps()[this._currentStepNumber()],
      source: 'fin_button'
    };
    const vetoPromise = this.steps()[this._currentStepNumber()].luxVetoFn()(event);

    vetoPromise
      .then((veto) => {
        if (veto === LuxVetoState.navigationAccepted) {
          if (this.luxStepValidationActive()) {
            // Prüfen, ob es einen Step gibt, der noch nicht abgeschlossen ist.
            const index = this.steps().findIndex((step) => !step.luxCompleted() && !step.luxDisabled());
            if (index === -1) {
              // Alle Steps signalisieren (luxCompleted = true) das sie valide sind.
              // Der Stepper kann beendet werden.
              this.finishStepper();
            } else {
              // Mindestens ein Step (luxCompleted = false) ist noch nicht valide.
              // Springe zum ersten nicht validen Schritt.
              this.trySetCurrentStepNumber(index);
            }
          } else {
            this.finishStepper();
          }
        }
      })
      .catch((err) => console.error(err));
  }

  onNavFocusin(index: number) {
    if (index === this._currentStepNumber()) {
      // Dieser Timeout ist nötig, um einen ExpressionChangedAfterItHasBeenCheckedError zu vermeiden.
      // Details:
      // Ohne Timeout würde die Cursorposition zweimal (alter Eintrag verliert den Fokus "this.cursorPos.set(-1)" und
      // neuer Eintrag erhält den Fokus "this.cursorPos.set(index)") innerhalb eines Zyklus geändert werden,
      // was zu dem ExpressionChangedAfterItHasBeenCheckedError führt.
      // Dieser Fehler wurde entdeckt, als man in einer Veto-Methode einen Dialog geöffnet hat.
      setTimeout(() => {
        this.cursorPos.set(index);
      });
    }
  }

  onNavFocusout(index: number) {
    if (index === this._currentStepNumber()) {
      this.cursorPos.set(-1);
    }
  }

  onNavLinkEnter(stepIndex: number) {
    const newIndex = stepIndex === this.cursorPos() ? stepIndex : this.cursorPos();
    this.onNavLink(newIndex);
    this.liveAnnouncer.announce('Schritt ausgewählt');
  }

  onNavLink(stepIndex: number) {
    if (this.luxStepValidationActive() && this._currentStepNumber() <= stepIndex) {
      for (let i = this._currentStepNumber(); i < stepIndex; i++) {
        if (this.steps()[i].luxCompleted() === false) {
          this.snackbar.open(0, {
            text: this.tService.translate(`luxc.stepper-large.error_message.steps_not_completed`, { i: i + 1 }),
            action: 'Ok',
            iconName: 'lux-interface-alert-warning-triangle',
            iconColor: 'orange'
          });
          return;
        }
      }
    }

    const event: LuxStepperLargeClickEvent = {
      stepper: this,
      newIndex: stepIndex,
      newStep: this.steps()[stepIndex],
      source: 'nav'
    };
    const vetoPromise = this.steps()[this._currentStepNumber()].luxVetoFn()(event);

    vetoPromise
      .then((veto) => {
        if (veto === LuxVetoState.navigationAccepted) {
          this.steps()[stepIndex].luxTouched.set(true);
          this.trySetCurrentStepNumber(stepIndex);
          this.cursorPos.set(-1);
        }
      })
      .catch((err) => console.error(err));
  }

  onOpenMobileOverlay() {
    this.mobileOverlayService.open({ data: { stepperComponent: this } });
  }

  onResetStepper() {
    this.trySetCurrentStepNumber(0);
    this.isFinished.set(false);
  }

  onNavKeyUp() {
    if (this.cursorPos() === -1) {
      this.cursorPos.set(this._currentStepNumber());
    }

    if (this.cursorPos() > 0) {
      this.cursorPos.set(this.getPrevIndex(this.cursorPos()));
      this.liveAnnouncer.announce('Schritt' + (this.cursorPos() + 1) + ' ' + this.steps()[this.cursorPos()].luxTitle());
    }
  }

  onNavKeyDown() {
    if (this.cursorPos() === -1) {
      this.cursorPos.set(this._currentStepNumber());
    }

    if (this.cursorPos() < this.steps().length) {
      this.cursorPos.set(this.getNextIndex(this.cursorPos()));
      this.liveAnnouncer.announce('Schritt' + (this.cursorPos() + 1) + ' ' + this.steps()[this.cursorPos()].luxTitle());
    }
  }

  private activatePrevStep(newIndex: number) {
    const steps = this.steps();
    if (newIndex >= 0 && newIndex < steps.length && steps[newIndex]) {
      steps[newIndex].luxTouched.set(true);
      this.trySetCurrentStepNumber(newIndex);
      this.liveAnnouncer.announce('Schritt' + (newIndex + 1) + ' ' + steps[newIndex].luxTitle() + ' aktiv.');
    }
  }

  private activateNextStep(newIndex: number) {
    const steps = this.steps();
    if (newIndex >= 0 && newIndex < steps.length && steps[newIndex]) {
      steps[newIndex].luxTouched.set(true);
      this.trySetCurrentStepNumber(newIndex);
      this.liveAnnouncer.announce('Schritt' + (newIndex + 1) + ' ' + steps[newIndex].luxTitle() + ' aktiv.');
    }
  }

  private finishStepper() {
    this.isFinished.set(true);
    this.luxStepperFinished.emit();
  }

  private getPrevIndex(index: number): number {
    const newIndex = index - 1;
    if (!this.steps()[newIndex].luxDisabled()) {
      return newIndex;
    } else {
      return this.getPrevIndex(newIndex);
    }
  }

  private getNextIndex(index: number): number {
    const newIndex = index + 1;
    if (!this.steps()[newIndex].luxDisabled()) {
      return newIndex;
    } else {
      this.steps()[newIndex].luxTouched.set(true);
      return this.getNextIndex(newIndex);
    }
  }

  /**
   * Validiert und übernimmt eine neue Step-Nummer (intern oder von außen über luxCurrentStepNumber gesetzt).
   * Ein Sprung wird nur akzeptiert, wenn der Ziel-Step bereits besucht ("touched") wurde.
   */
  private trySetCurrentStepNumber(stepNumber: number) {
    if (stepNumber === this._currentStepNumber()) {
      return;
    }

    const steps = this.steps();
    const targetStep = steps[stepNumber];

    if (stepNumber >= 0 && stepNumber < steps.length && targetStep && targetStep.luxTouched()) {
      const prevStepIndex = this._currentStepNumber();
      const prevStep = steps[prevStepIndex];
      this._currentStepNumber.set(stepNumber);
      this.isFirstStep.set(stepNumber === 0);
      this.isLastStep.set(stepNumber === steps.length - 1);

      this.luxCurrentStepNumberChange.emit(this._currentStepNumber());
      this.luxStepChanged.emit({
        stepper: this,
        prevIndex: prevStepIndex,
        prevStep: prevStep,
        currentIndex: this._currentStepNumber(),
        currentStep: targetStep
      });
      LuxUtil.goTo('luxstepperlargenavitem' + (this._currentStepNumber() + 1));
      if (this.isMobile()) {
        LuxUtil.goTo('luxstepperlargemobilecontentanchor');
      } else {
        LuxUtil.goTo('luxstepperlargecontentanchor');
      }
    }
  }
}
