import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, HostBinding, Input, inject } from '@angular/core';
import { MatError, MatHint } from '@angular/material/form-field';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxIconComponent } from '../../lux-icon/lux-icon/lux-icon.component';
import { LuxFormComponentBase } from '../lux-form-model/lux-form-component-base.class';

export const luxFormControlSelektor = 'lux-form-control-wrapper';

@Component({
  selector: 'lux-form-control-wrapper',
  templateUrl: './lux-form-control-wrapper.component.html',
  imports: [NgClass, NgTemplateOutlet, MatError, MatHint, LuxIconComponent, LuxAriaLabelDirective, TranslocoPipe]
})
export class LuxFormControlWrapperComponent {
  private cdr = inject(ChangeDetectorRef);

  focused = false;

  @HostBinding('class.lux-form-control-no-top-label') _luxNoTopLabel = false;
  @HostBinding('class.lux-form-control-no-labels') _luxNoLabels = false;
  @HostBinding('class.lux-form-control-no-bottom-label') _luxNoBottomLabel = false;

  /**
   * Die zugrunde liegende FormComponent
   */
  @Input() luxFormComponent!: LuxFormComponentBase;
  @Input() luxFormComponentElementRef!: ElementRef;
  @Input() luxIgnoreDefaultLabel = false;
  @Input() luxCounterLabel = '';
  @Input() luxHideCounterLabel = false;
  @Input() luxLabelLongFormat = false;
  @Input() luxNoInputRow = false;
  @Input() luxDisplayClearErrorButton = false;

  /**
   * Dient dazu, bei einer Component den Label-Container auszublenden.
   * @param noLabel
   */
  @Input() set luxNoTopLabel(noLabel: boolean) {
    this._luxNoTopLabel = noLabel;
  }

  get luxNoTopLabel(): boolean {
    return this._luxNoTopLabel;
  }

  /**
   * Dient dazu, bei einer Component den Label-Container und den Misc-Container auszublenden.
   * @param noLabel
   */
  @Input() set luxNoLabels(noLabel: boolean) {
    this._luxNoLabels = noLabel;
  }

  get luxNoLabels(): boolean {
    return this._luxNoLabels;
  }

  /**
   * Dient dazu, bei einer Component den Misc-Container auszublenden.
   * @param noLabel
   */
  @Input() set luxNoBottomLabel(noLabel: boolean) {
    this._luxNoBottomLabel = noLabel;
  }

  get luxNoBottomLabel(): boolean {
    return this._luxNoBottomLabel;
  }

  /**
   * Gibt wieder, ob der Fehler für diese FormComponent dargestellt werden soll.
   */
  shouldDisplayError() {
    return this.luxFormComponent.errorMessage && this.luxFormComponent.formControl.touched && !this.luxFormComponent.luxReadonly;
  }

  shouldDisplayMisc() {
    return !this.luxNoBottomLabel && !this.luxNoLabels;
  }

  shouldDisplayLabelByProperty() {
    return !this.luxFormComponent.formLabelComponent && this.luxFormComponent.luxLabel;
  }

  shouldDisplayHintByProperty() {
    return this.luxFormComponent.formHintComponent && !this.luxFormComponent.luxHint;
  }

  /**
   * Aktiviert den Fokus dieser Component.
   */
  focusin() {
    this.focused = true;
    this.cdr.detectChanges();
  }

  /**
   * Deaktiviert den Fokus dieser Component.
   */
  focusout() {
    this.focused = false;
    this.cdr.detectChanges();
  }

  onCloseErrorMessage() {
    this.luxFormComponent.errorMessage = undefined;
    this.luxFormComponent.formControl.updateValueAndValidity();
  }
}
