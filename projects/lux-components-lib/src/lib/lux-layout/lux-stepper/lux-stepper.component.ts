import { CdkStepHeader, StepperSelectionEvent } from '@angular/cdk/stepper';
import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewContainerRef,
  inject
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
  imports: [LuxStepperVerticalComponent, NgClass, LuxStepperHorizontalComponent]
})
export class LuxStepperComponent implements AfterViewInit, OnDestroy, OnInit {
  stepperService = inject(LuxStepperHelperService);
  private cdr = inject(ChangeDetectorRef);
  private cfr = inject(ComponentFactoryResolver);
  private elementRef = inject(ElementRef);
  private queryService = inject(LuxMediaQueryObserverService);

  private readonly _DEFAULT_PREV_BTN_CONF: ILuxStepperButtonConfig = {
    label: $localize`:@@luxc.stepper.back.btn:Zurück`
  };
  private readonly _DEFAULT_NEXT_BTN_CONF: ILuxStepperButtonConfig = {
    label: $localize`:@@luxc.stepper.next.btn:Weiter`
  };
  private readonly _DEFAULT_FIN_BTN_CONF: ILuxStepperButtonConfig = {
    label: $localize`:@@luxc.stepper.finish.btn:Abschließen`,
    color: 'primary'
  };

  @ContentChildren(LuxStepComponent) luxSteps!: QueryList<LuxStepComponent>;

  @Output() luxFinishButtonClicked = new EventEmitter<void>();
  @Output() luxStepChanged = new EventEmitter<StepperSelectionEvent>();
  @Output() luxCurrentStepNumberChange = new EventEmitter<number>();
  @Output() luxCheckValidation = new EventEmitter<number>();
  @Output() luxStepClicked = new EventEmitter<number>();

  matStepper!: MatStepper;
  matStepLabels!: ViewContainerRef[];
  matStepHeaders!: CdkStepHeader[];

  stepperConfiguration: ILuxStepperConfiguration = {
    luxCurrentStepNumber: 0,
    luxShowNavigationButtons: true,
    luxHorizontalStepAnimationActive: true,
    luxEditedIconName: 'lux-interface-edit-pencil'
  };

  private subscriptions: Subscription[] = [];
  mobileView?: boolean;
  subscription?: Subscription;
  constructor() {
    // Die Default-Konfiguration präventiv als Startwert setzen
    this.luxPreviousButtonConfig = this._DEFAULT_PREV_BTN_CONF;
    this.luxNextButtonConfig = this._DEFAULT_NEXT_BTN_CONF;
    this.luxFinishButtonConfig = this._DEFAULT_FIN_BTN_CONF;
    // Den Stepper im Helper-Service bekannt machen
    this.stepperService.registerStepper(this);
  }
  ngOnInit() {
    this.subscription = this.queryService.getMediaQueryChangedAsObservable().subscribe((query) => {
      this.mobileView = query === 'xs' || query === 'sm';
    });
  }

  ngAfterViewInit() {
    // Änderungen an den steps sollten auch dem Konfigurationsobjekt bekannt gemacht werden
    this.subscriptions.push(
      this.luxSteps.changes.subscribe(() => {
        this.stepperConfiguration.luxSteps = this.luxSteps.toArray();
        this.cdr.detectChanges();
        this.updateIcons();
      })
    );
    // Initial die aktuellen steps in die Konfiguration schreiben
    this.stepperConfiguration.luxSteps = this.luxSteps.toArray();
    this.cdr.detectChanges();

    // Falls initial bereits bestimmt wurde, dass individuelle Icons genutzt werden, diese generieren
    if (this.stepperConfiguration.luxUseCustomIcons) {
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
          if (!this.stepperConfiguration.luxDisabled) {
            if (next === true) {
              this.checkValidation();
              this.matStepper.next();
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
    this.luxSteps.toArray().forEach((luxStep: LuxStepComponent) => {
      this.subscriptions.push(
        luxStep.getIconChangeObsv().subscribe((iconChange: boolean) => {
          if (this.stepperConfiguration.luxUseCustomIcons && iconChange) {
            this.updateIcons();
          }
        })
      );
    });

    this.setFocusedCSS(this.luxCurrentStepNumber);
    this.cdr.detectChanges();
  }

  fixRoleAttributes() {
    // Workaround: Der Stepper setzt die Rolle "tablist" auf den Header, was nicht korrekt ist.
    // Für den vertikalen Stepper wurde keine einfacher Workaround gefunden.
    if (!this.luxVerticalStepper) {
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Wird beim Wechsel des aktuellen Steps (Klick auf Tab oder .next()/.previous() Aufruf) aufgerufen.
   * @param selectionEvent
   */
  onStepChanged(selectionEvent: StepperSelectionEvent) {
    this.luxCurrentStepNumber = selectionEvent.selectedIndex;
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
    const factory = this.cfr.resolveComponentFactory(LuxIconComponent);
    let index = 0;
    this.matStepLabels.forEach((stepLabel: ViewContainerRef) => {
      this.generateCustomIconForStep(stepLabel, this.luxSteps.toArray()[index], factory);
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
    const stepControl = this.luxSteps.toArray()[this.stepperConfiguration.luxCurrentStepNumber ?? 0].luxStepControl;
    if (stepControl) {
      LuxUtil.showValidationErrors(stepControl);
    }
  }

  onStepClicked(event: number) {
    this.luxStepClicked.emit(event);

    this.checkValidation();
    // Das Event könnte interessant sein, wenn die Property "luxCompleted" verwendet wird und kein Formular.
    this.luxCheckValidation.emit(event);
  }

  /**
   * Generiert die Icons für einen einzelnen Step
   * @param stepLabel
   * @param luxStep
   * @param factory
   */
  private generateCustomIconForStep(stepLabel: ViewContainerRef, luxStep: LuxStepComponent, factory: ComponentFactory<LuxIconComponent>) {
    if (luxStep && luxStep.luxIconName) {
      // Das edited und normal Icon generieren
      const componentIconEdited: ComponentRef<LuxIconComponent> = stepLabel.createComponent(factory);
      const instanceIconEdited: LuxIconComponent = componentIconEdited.instance;

      instanceIconEdited.luxIconName = this.luxEditedIconName;
      instanceIconEdited.luxIconSize = '1.25rem';
      instanceIconEdited.luxRounded = true;
      instanceIconEdited.luxMargin = '0 0.5rem 0 0';
      instanceIconEdited.luxPadding = '0.625rem';
      componentIconEdited.location.nativeElement.className += ' lux-stepper-edited-icon';

      const componentIconNormal: ComponentRef<LuxIconComponent> = stepLabel.createComponent(factory);
      const instanceIconNormal: LuxIconComponent = componentIconNormal.instance;
      instanceIconNormal.luxIconName = luxStep.luxIconName;
      instanceIconNormal.luxIconSize = '1.25rem';
      instanceIconNormal.luxRounded = true;
      instanceIconNormal.luxMargin = '0 0.5rem 0 0';
      instanceIconNormal.luxPadding = '0.625rem';
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
      if (this.stepperConfiguration.luxUseCustomIcons) {
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

  /**** Getter/Setter luxCurrentStepNumber ****/
  get luxCurrentStepNumber() {
    return this.stepperConfiguration.luxCurrentStepNumber ?? 0;
  }

  @Input() set luxCurrentStepNumber(step: number) {
    if (step !== this.luxCurrentStepNumber) {
      setTimeout(() => {
        // OutOfBound-Steps abfangen
        step = step < 0 ? 0 : step;
        step = step >= this.luxSteps.length ? this.luxSteps.length - 1 : step;

        this.stepperConfiguration.luxCurrentStepNumber = step;
        this.luxCurrentStepNumberChange.emit(this.stepperConfiguration.luxCurrentStepNumber);
      });
    }
  }

  /**** Getter/Setter luxUseCustomIcons ****/
  get luxUseCustomIcons() {
    return this.stepperConfiguration.luxUseCustomIcons ?? false;
  }

  @Input() set luxUseCustomIcons(use: boolean) {
    this.stepperConfiguration.luxUseCustomIcons = use;
    setTimeout(() => {
      this.updateIcons();
    });
  }

  /**** Getter/Setter luxEditedIconName ****/
  get luxEditedIconName() {
    return this.stepperConfiguration.luxEditedIconName ?? '';
  }

  @Input() set luxEditedIconName(iconName: string) {
    this.stepperConfiguration.luxEditedIconName = iconName;
    this.updateIcons();
  }

  /**** Getter/Setter luxVerticalStepper ****/
  get luxVerticalStepper() {
    return this.stepperConfiguration.luxVerticalStepper!;
  }

  @Input() set luxVerticalStepper(vertical: boolean) {
    this.stepperConfiguration.luxVerticalStepper = vertical;

    if (!vertical) {
      setTimeout(() => {
        this.fixRoleAttributes();
      });
    }
  }

  /**** Getter/Setter luxLinear ****/
  get luxLinear() {
    return this.stepperConfiguration.luxLinear ?? true;
  }

  @Input() set luxLinear(linear: boolean) {
    this.stepperConfiguration.luxLinear = linear;
  }

  /**** Getter/Setter luxDisabled ****/
  get luxDisabled() {
    return this.stepperConfiguration.luxDisabled ?? false;
  }

  @Input() set luxDisabled(disabled: boolean) {
    this.stepperConfiguration.luxDisabled = disabled;
  }

  /**** Getter/Setter luxShowNavigationButtons ****/
  get luxShowNavigationButtons() {
    return this.stepperConfiguration.luxShowNavigationButtons ?? true;
  }

  @Input() set luxShowNavigationButtons(showNavButtons: boolean) {
    this.stepperConfiguration.luxShowNavigationButtons = showNavButtons;
  }

  /**** Getter/Setter luxHorizontalStepAnimationActive ****/
  get luxHorizontalStepAnimationActive() {
    return this.stepperConfiguration.luxHorizontalStepAnimationActive ?? false;
  }

  @Input() set luxHorizontalStepAnimationActive(animationActive: boolean) {
    this.stepperConfiguration.luxHorizontalStepAnimationActive = animationActive;
  }

  /**** Getter/Setter luxPreviousButtonConfig ****/
  get luxPreviousButtonConfig() {
    return this.stepperConfiguration.luxPreviousButtonConfig!;
  }

  @Input() set luxPreviousButtonConfig(config: ILuxStepperButtonConfig | undefined) {
    this.stepperConfiguration.luxPreviousButtonConfig = config ? config : this._DEFAULT_PREV_BTN_CONF;
  }

  /**** Getter/Setter luxNextButtonConfig ****/
  get luxNextButtonConfig(): ILuxStepperButtonConfig | undefined {
    return this.stepperConfiguration.luxNextButtonConfig!;
  }

  @Input() set luxNextButtonConfig(config: ILuxStepperButtonConfig | undefined) {
    this.stepperConfiguration.luxNextButtonConfig = config ? config : this._DEFAULT_NEXT_BTN_CONF;
  }

  /**** Getter/Setter luxFinishButtonConfig ****/
  get luxFinishButtonConfig() {
    return this.stepperConfiguration.luxFinishButtonConfig!;
  }

  @Input() set luxFinishButtonConfig(config: ILuxStepperButtonConfig | undefined) {
    this.stepperConfiguration.luxFinishButtonConfig = config ? config : this._DEFAULT_FIN_BTN_CONF;
  }
}
