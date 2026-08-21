import { Component, ContentChild, Input, TemplateRef, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { LuxStepHeaderComponent } from './lux-step-header.component';

@Component({
  selector: 'lux-step',
  changeDetection: ChangeDetectionStrategy.Eager,
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
  private _luxIconName?: string = undefined;

  @ViewChild('header', { static: true }) defaultHeaderTemplate!: TemplateRef<any>;
  @ViewChild('content', { static: true }) defaultContentTemplate!: TemplateRef<any>;
  @ContentChild(LuxStepHeaderComponent) luxStepHeader?: LuxStepHeaderComponent;
  @ContentChild('header', { descendants: true, read: TemplateRef }) projectedHeaderTemplate?: TemplateRef<any>;
  @ContentChild('content', { descendants: true, read: TemplateRef }) projectedContentTemplate?: TemplateRef<any>;

  @Input() luxIconSize = '1x';
  @Input() luxOptional = false;
  @Input() luxEditable = true;
  @Input() luxCompleted = true;
  @Input() luxStepControl?: FormGroup;

  get headerTemplate(): TemplateRef<any> {
    return this.projectedHeaderTemplate ?? this.defaultHeaderTemplate;
  }

  get contentTemplate(): TemplateRef<any> {
    return this.projectedContentTemplate ?? this.defaultContentTemplate;
  }

  get hasHeader(): boolean {
    return (
      !!this.luxStepHeader || !!this.projectedHeaderTemplate || (this.constructor !== LuxStepComponent && !!this.defaultHeaderTemplate)
    );
  }

  get luxIconName(): string | undefined {
    return this._luxIconName;
  }

  @Input()
  set luxIconName(iconName: string | undefined) {
    this._luxIconName = iconName;
    this._iconChange.next(true);
  }

  getIconChangeObsv(): Observable<boolean> {
    return this._iconChange.asObservable();
  }

  constructor() {}

  /**
   * Gibt an, ob der Step als abgeschlossen gilt.
   *
   * Möglichkeiten:
   *  1. Hat ein luxStepControl, welches valid ist
   *  2. Der Wert luxCompleted ist true
   *  3. Der Wert luxOptional ist true
   */
  isCompleted() {
    if (this.luxStepControl) {
      return this.luxStepControl.valid;
    }
    return this.luxCompleted || this.luxOptional;
  }
}
