import { CdkStepHeader, StepperSelectionEvent } from '@angular/cdk/stepper';
import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ComponentRef,
  computed,
  contentChildren,
  effect,
  ElementRef,
  inject,
  input,
  model,
  OnDestroy,
  OnInit,
  output,
  signal,
  ViewContainerRef
} from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Subscription } from 'rxjs';
import { skip } from 'rxjs/operators';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';
import { LuxUtil } from '../../lux-util/lux-util';
import { LuxStepperHelperService } from './lux-stepper-helper.service';
import { ILuxStepperButtonConfig } from './lux-stepper-model/lux-stepper-button-config.interface';
import { ILuxStepperConfiguration } from './lux-stepper-model/lux-stepper-configuration.interface';
import { LuxStepComponent } from './lux-stepper-subcomponents/lux-step.component';
import { LuxStepperHorizontalComponent } from './lux-stepper-subcomponents/lux-stepper-horizontal/lux-stepper-horizontal.component';
import { LuxStepperVerticalComponent } from './lux-stepper-subcomponents/lux-stepper-vertical/lux-stepper-vertical.component';

@Component({
  selector: 'lux-stepper',
  templateUrl: './lux-stepper.component.html',
  styleUrls: ['./lux-stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxStepperVerticalComponent, NgClass, LuxStepperHorizontalComponent]
})
export class LuxStepperComponent implements AfterViewInit, OnDestroy, OnInit {
  readonly luxCurrentStepNumber = model(0);
  readonly luxUseCustomIcons = input(false);
  readonly luxEditedIconName = input('lux-interface-edit-pencil');
  readonly luxVerticalStepper = input(false);
  readonly luxLinear = input(true);
  readonly luxDisabled = input(false);
  readonly luxShowNavigationButtons = input(true);
  readonly luxHorizontalStepAnimationActive = input(true);
  readonly luxPreviousButtonConfig = input<ILuxStepperButtonConfig | undefined>();
  readonly luxNextButtonConfig = input<ILuxStepperButtonConfig | undefined>();
  readonly luxFinishButtonConfig = input<ILuxStepperButtonConfig | undefined>();
  readonly luxA11YMode = input(false);
  readonly luxButtonAlignLeft = input(false);

  readonly luxFinishButtonClicked = output<void>();
  readonly luxStepChanged = output<StepperSelectionEvent>();
  readonly luxCheckValidation = output<number>();
  readonly luxStepClicked = output<number>();

  readonly luxSteps = contentChildren(LuxStepComponent);

  stepperService = inject(LuxStepperHelperService);
  matStepper!: MatStepper;
  matStepLabels!: ViewContainerRef[];
  matStepHeaders!: CdkStepHeader[];
  readonly mobileView = signal<boolean | undefined>(undefined);

  private cdr = inject(ChangeDetectorRef);
  private elementRef = inject(ElementRef);
  private queryService = inject(LuxMediaQueryObserverService);
  private readonly _DEFAULT_PREV_BTN_CONF: ILuxStepperButtonConfig = {
    label: ''
  };
  private readonly _DEFAULT_NEXT_BTN_CONF: ILuxStepperButtonConfig = {
    label: ''
  };
  private readonly _DEFAULT_FIN_BTN_CONF: ILuxStepperButtonConfig = {
    label: '',
    color: 'primary'
  };
  private subscriptions: Subscription[] = [];
  private subscription?: Subscription;

  readonly stepperConfiguration = computed<ILuxStepperConfiguration>(() => ({
    luxCurrentStepNumber: this.luxCurrentStepNumber(),
    luxUseCustomIcons: this.luxUseCustomIcons(),
    luxEditedIconName: this.luxEditedIconName(),
    luxVerticalStepper: this.luxVerticalStepper(),
    luxLinear: this.luxLinear(),
    luxDisabled: this.luxDisabled(),
    luxShowNavigationButtons: this.luxShowNavigationButtons(),
    luxHorizontalStepAnimationActive: this.luxHorizontalStepAnimationActive(),
    luxPreviousButtonConfig: this.luxPreviousButtonConfig() ?? this._DEFAULT_PREV_BTN_CONF,
    luxNextButtonConfig: this.luxNextButtonConfig() ?? this._DEFAULT_NEXT_BTN_CONF,
    luxFinishButtonConfig: this.luxFinishButtonConfig() ?? this._DEFAULT_FIN_BTN_CONF,
    luxSteps: [...this.luxSteps()],
    luxA11YMode: this.luxA11YMode(),
    luxButtonAlignLeft: this.luxButtonAlignLeft()
  }));

  constructor() {
    // Den Stepper im Helper-Service bekannt machen
    this.stepperService.registerStepper(this);

    // Out-of-Bound-Steps abfangen (z.B. wenn luxCurrentStepNumber von außen gesetzt wird oder
    // sich die Anzahl der Steps ändert).
    effect(() => {
      const steps = this.luxSteps();
      const current = this.luxCurrentStepNumber();
      if (steps.length === 0) {
        return;
      }
      const clamped = Math.min(Math.max(current, 0), steps.length - 1);
      if (clamped !== current) {
        this.luxCurrentStepNumber.set(clamped);
      }
    });

    // Icons neu generieren, wenn sich der Icon-Modus oder der Name des "edited"-Icons ändert.
    let isFirstIconsRun = true;
    effect(() => {
      this.luxUseCustomIcons();
      this.luxEditedIconName();
      if (isFirstIconsRun) {
        isFirstIconsRun = false;
        return;
      }
      this.updateIcons();
    });

    // Rollen-Attribute korrigieren, wenn sich die Ausrichtung (horizontal/vertikal) ändert.
    let isFirstVerticalRun = true;
    effect(() => {
      const vertical = this.luxVerticalStepper();
      if (isFirstVerticalRun) {
        isFirstVerticalRun = false;
        return;
      }
      if (!vertical) {
        setTimeout(() => {
          this.fixRoleAttributes();
        });
      }
    });
  }

  ngOnInit() {
    this.subscription = this.queryService.getMediaQueryChangedAsObservable().subscribe((query) => {
      this.mobileView.set(query === 'xs' || query === 'sm');
    });
  }

  ngAfterViewInit() {
    // Falls initial bereits bestimmt wurde, dass individuelle Icons genutzt werden, diese generieren
    if (this.luxUseCustomIcons()) {
      this.generateCustomIcons();
    }

    // Workaround: this.matStepper._stepHeader.
    // Normalerweise sollte man über this.matStepper._stepHeader an die MatStepHeader kommen,
    // aber leider ist mit Angular 9 die QueryList<MatStepHeader> nur in diesem Lifecycle Hook
    // "ngAfterViewInit" gefüllt und danach immer leer. Deshalb werden hier die MatStepHeader
    // zwischengespeichert.
    this.matStepHeaders = this.matStepper._stepHeader.toArray();

    this.subscriptions.push(
      this.matStepper._stepHeader.changes.subscribe((newStepHeaders) => {
        this.matStepHeaders = newStepHeaders.toArray();
      })
    );

    // Auf next/previous Aufrufe aus dem Service horchen und entsprechend reagieren
    this.subscriptions.push(
      this.stepperService
        .getObservable(this)
        .pipe(skip(1))
        .subscribe((next: boolean | null) => {
          // Voraussetzung: Stepper nicht deaktiviert
          if (!this.luxDisabled()) {
            if (next === true) {
              const indexBeforeNext = this.luxCurrentStepNumber();
              this.checkValidation();
              this.matStepper.next();
              // Navigation wurde blockiert (z.B. linearer Stepper, Step ungültig) → Event emittieren.
              // Emittiert wird der aktuelle Step-Index – also der Step, der validiert werden muss.
              if (this.matStepper.selectedIndex === indexBeforeNext) {
                this.luxCheckValidation.emit(indexBeforeNext);
              }
              if (this.matStepper.selectedIndex < this.matStepHeaders.length) {
                this.matStepHeaders[this.matStepper.selectedIndex].focus();
              }
            } else if (next === false) {
              this.matStepper.previous();
              if (this.matStepper.selectedIndex < this.matStepHeaders.length) {
                this.matStepHeaders[this.matStepper.selectedIndex].focus();
              }
            }
          }
        })
    );

    // Änderungen an den Icons jedes einzelnen Steps führt zu Neugenerierung aller individuellen Icons
    // ==> Material erlaubt leider nur alle Icons identisch zu ändern, nicht für jeden Step einzeln, deshalb
    // generieren wir selbst die Icons.
    this.luxSteps().forEach((luxStep: LuxStepComponent) => {
      this.subscriptions.push(
        luxStep.getIconChangeObsv().subscribe((iconChange: boolean) => {
          if (this.luxUseCustomIcons() && iconChange) {
            this.updateIcons();
          }
        })
      );
    });

    this.setFocusedCSS(this.luxCurrentStepNumber());
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  fixRoleAttributes() {
    // Workaround: Der Stepper setzt die Rolle "tablist" auf den Header, was nicht korrekt ist.
    // Für den vertikalen Stepper wurde keine einfacher Workaround gefunden.
    if (!this.luxVerticalStepper()) {
      if (this.elementRef && this.elementRef.nativeElement) {
        const stepperElements = this.elementRef.nativeElement.getElementsByClassName('mat-stepper-horizontal');
        if (stepperElements.length > 0) {
          stepperElements[0].removeAttribute('role');
        }

        const headerElements = this.elementRef.nativeElement.getElementsByClassName('mat-horizontal-stepper-header-container');
        if (headerElements.length > 0) {
          headerElements[0].setAttribute('role', 'tablist');
        }
      }
    }
  }

  /**
   * Wird beim Wechsel des aktuellen Steps (Klick auf Tab oder .next()/.previous() Aufruf) aufgerufen.
   * @param selectionEvent
   */
  onStepChanged(selectionEvent: StepperSelectionEvent) {
    this.luxCurrentStepNumber.set(selectionEvent.selectedIndex);
    this.luxStepChanged.emit(selectionEvent);

    const matStepHeaders: NodeListOf<any> = this.elementRef.nativeElement.querySelectorAll('mat-step-header');
    if (matStepHeaders.item(selectionEvent.selectedIndex).className.indexOf('lux-step-header-touched') === -1) {
      matStepHeaders.item(selectionEvent.selectedIndex).className += ' lux-step-header-touched';
    }

    this.setFocusedCSS(selectionEvent.selectedIndex);
  }

  /**
   * Generiert die individuellen Icons für die Steps.
   */
  generateCustomIcons() {
    let index = 0;
    this.matStepLabels.forEach((stepLabel: ViewContainerRef) => {
      this.generateCustomIconForStep(stepLabel, this.luxSteps()[index]);
      index++;
    });
  }

  /**
   * Entfernt die eigenen Icons für die Steps.
   */
  clearCustomIcons() {
    this.matStepLabels.forEach((stepLabel: ViewContainerRef) => {
      stepLabel.clear();
    });
  }

  /**
   * Stößt die Validierungsprüfung für den aktuell sichtbaren Step und dessen StepControl (wenn vorhanden) an.
   */
  checkValidation() {
    const stepControl = this.luxSteps()[this.luxCurrentStepNumber()].luxStepControl();
    if (stepControl) {
      LuxUtil.showValidationErrors(stepControl);
    }
  }

  onStepClicked(event: number) {
    this.luxStepClicked.emit(event);

    // Aufgrund der Event-Bubbling-Reihenfolge (selectionChange vor click) wurde luxCurrentStepNumber
    // bereits auf den neuen Step aktualisiert, wenn dieser Handler feuert.
    // Nur wenn der aktuelle Index NICHT dem geklickten Index entspricht, wurde die Navigation blockiert
    // (z.B. linearer Stepper, ungültiger Step) → dann validieren und Event emittieren.
    const currentIndex = this.luxCurrentStepNumber();
    if (currentIndex !== event) {
      this.checkValidation();
      // Das Event könnte interessant sein, wenn die Property "luxCompleted" verwendet wird und kein Formular.
      // Emittiert wird der aktuelle Step-Index – also der Step, der validiert werden muss.
      this.luxCheckValidation.emit(currentIndex);
    }
  }

  /**
   * Generiert die Icons für einen einzelnen Step
   * @param stepLabel
   * @param luxStep
   */
  private generateCustomIconForStep(stepLabel: ViewContainerRef, luxStep: LuxStepComponent) {
    if (luxStep && luxStep.luxIconName()) {
      // Das edited und normal Icon generieren
      const componentIconEdited: ComponentRef<LuxIconComponent> = stepLabel.createComponent(LuxIconComponent);

      componentIconEdited.setInput('luxIconName', this.luxEditedIconName());
      componentIconEdited.setInput('luxIconSize', '1.25rem');
      componentIconEdited.setInput('luxRounded', true);
      componentIconEdited.setInput('luxMargin', '0 0 0 0');
      componentIconEdited.setInput('luxPadding', '0.625rem');
      componentIconEdited.location.nativeElement.className += ' lux-stepper-edited-icon';

      const componentIconNormal: ComponentRef<LuxIconComponent> = stepLabel.createComponent(LuxIconComponent);
      componentIconNormal.setInput('luxIconName', luxStep.luxIconName());
      componentIconNormal.setInput('luxIconSize', '1.25rem');
      componentIconNormal.setInput('luxRounded', true);
      componentIconNormal.setInput('luxMargin', '0 0 0 0');
      componentIconNormal.setInput('luxPadding', '0.625rem');
      componentIconNormal.location.nativeElement.className += ' lux-stepper-normal-icon';
    }
  }

  /**
   * Aktualisiert die aktuellen Icons, entfernt zunächst die individuellen Icons und
   * versucht anschließend diese neu zu generieren (nötig bei Änderungen).
   */
  private updateIcons() {
    if (this.matStepLabels) {
      this.clearCustomIcons();
      if (this.luxUseCustomIcons()) {
        this.generateCustomIcons();
      }
    }
  }

  private setFocusedCSS(index: number) {
    const matStepHeaders: NodeListOf<any> = this.elementRef.nativeElement.querySelectorAll('mat-step-header');
    if (matStepHeaders.item(index).className.indexOf('lux-step-header-touched') === -1) {
      matStepHeaders.item(index).className += ' lux-step-header-touched';
    }
  }
}
