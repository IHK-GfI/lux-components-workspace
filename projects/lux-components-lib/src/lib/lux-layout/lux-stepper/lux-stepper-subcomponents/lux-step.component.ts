import { ChangeDetectionStrategy, Component, contentChild, effect, input, TemplateRef, viewChild } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, map, Observable, of, startWith, switchMap } from 'rxjs';
import { LuxStepHeaderComponent } from './lux-step-header.component';

@Component({
  selector: 'lux-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #header>
      <ng-content select="lux-step-header"></ng-content>
    </ng-template>
    <ng-template #content>
      <ng-content select="lux-step-content"></ng-content>
    </ng-template>
  `
})
export class LuxStepComponent {
  private _iconChange = new BehaviorSubject<boolean>(false);

  readonly defaultHeaderTemplate = viewChild.required<TemplateRef<any>>('header');
  readonly defaultContentTemplate = viewChild.required<TemplateRef<any>>('content');
  readonly luxStepHeader = contentChild(LuxStepHeaderComponent);
  readonly projectedHeaderTemplate = contentChild('header', { descendants: true, read: TemplateRef });
  readonly projectedContentTemplate = contentChild('content', { descendants: true, read: TemplateRef });

  readonly luxIconSize = input('1x');
  readonly luxOptional = input(false);
  readonly luxEditable = input(true);
  readonly luxCompleted = input(true);
  readonly luxStepControl = input<FormGroup | undefined>();
  readonly luxIconName = input<string | undefined>();

  /**
   * FormGroup.valid ist eine reine (nicht-reaktive) Getter-Eigenschaft. Ein direktes Lesen in
   * isCompleted() würde von Angular nicht als Signal-Abhängigkeit erkannt werden - Konsumenten wie
   * lux-stepper-nav-buttons (OnPush) würden dann nie neu geprüft, wenn sich die Formular-Validität
   * durch Nutzereingaben ändert. Über statusChanges wird die Validität in ein Signal überführt.
   */
  private readonly stepControlValid = toSignal(
    toObservable(this.luxStepControl).pipe(
      switchMap((stepControl) => (stepControl ? stepControl.statusChanges.pipe(startWith(stepControl.status), map(() => stepControl.valid)) : of(undefined)))
    ),
    { initialValue: undefined }
  );

  constructor() {
    effect(() => {
      this.luxIconName();
      this._iconChange.next(true);
    });
  }

  get headerTemplate(): TemplateRef<any> {
    return this.projectedHeaderTemplate() ?? this.defaultHeaderTemplate();
  }

  get contentTemplate(): TemplateRef<any> {
    return this.projectedContentTemplate() ?? this.defaultContentTemplate();
  }

  get hasHeader(): boolean {
    return (
      !!this.luxStepHeader() ||
      !!this.projectedHeaderTemplate() ||
      (this.constructor !== LuxStepComponent && !!this.defaultHeaderTemplate())
    );
  }

  getIconChangeObsv(): Observable<boolean> {
    return this._iconChange.asObservable();
  }

  /**
   * Gibt an, ob der Step als abgeschlossen gilt.
   *
   * Möglichkeiten:
   *  1. Hat ein luxStepControl, welches valid ist
   *  2. Der Wert luxCompleted ist true
   *  3. Der Wert luxOptional ist true
   */
  isCompleted() {
    const stepControl = this.luxStepControl();
    if (stepControl) {
      return this.stepControlValid() ?? stepControl.valid;
    }
    return this.luxCompleted() || this.luxOptional();
  }
}
