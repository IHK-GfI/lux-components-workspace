import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, TemplateRef, computed, contentChild, inject, input, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxAriaInvalidDirective } from '../../lux-directives/lux-aria/lux-aria-invalid.directive';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxAriaLabelledbyDirective } from '../../lux-directives/lux-aria/lux-aria-labelledby.directive';
import { LuxAriaRequiredDirective } from '../../lux-directives/lux-aria/lux-aria-required.directive';
import { LuxTagIdDirective } from '../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxRenderPropertyPipe } from '../../lux-pipes/lux-render-property/lux-render-property.pipe';
import { LuxMediaQueryObserverService } from '../../lux-util/lux-media-query-observer.service';
import { LuxFormControlWrapperComponent } from '../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxFormSelectableBase } from '../lux-form-model/lux-form-selectable-base.class';

@Component({
  selector: 'lux-radio-ac',
  templateUrl: './lux-radio-ac.component.html',
  styleUrls: ['./lux-radio-ac.component.scss'],
  host: {
    class: 'lux-pb-3'
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxFormControlWrapperComponent,
    FormsModule,
    ReactiveFormsModule,
    MatRadioGroup,
    NgClass,
    MatRadioButton,
    NgTemplateOutlet,
    LuxAriaInvalidDirective,
    LuxAriaRequiredDirective,
    LuxAriaDescribedbyDirective,
    LuxAriaLabelDirective,
    LuxAriaLabelledbyDirective,
    LuxTagIdDirective,
    LuxRenderPropertyPipe
  ]
})
export class LuxRadioAcComponent<O = any, V = any> extends LuxFormSelectableBase<O, V> {
  private mediaObserver = inject(LuxMediaQueryObserverService);

  readonly forceVertical = signal(false);

  // Potenziell eingebettetes Template für Darstellung der Labels
  readonly tempRef = contentChild(TemplateRef);

  readonly luxGroupName = input('');
  readonly luxOrientationVertical = input(true);

  readonly focused = signal(false);

  readonly isVertical = computed(() => this.luxOrientationVertical() || this.forceVertical());

  readonly describedBy = computed(() => {
    if (this.errorMessage()) {
      return this.uid() + '-error';
    }

    const hasHint = !!this.formHintComponent() || !!this.luxHint();
    return hasHint && (!this.luxHintShowOnlyOnFocus() || this.focused()) ? this.uid() + '-hint' : undefined;
  });

  constructor() {
    super();

    this.mediaObserver
      .getMediaQueryChangedAsObservable()
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.forceVertical.set(this.mediaObserver.isXS()));

    this.forceVertical.set(this.mediaObserver.isXS());
  }

  onFocusIn(e: FocusEvent) {
    this.focused.set(true);
    this.luxFocusIn.emit(e);
  }

  onFocusOut(e: FocusEvent) {
    this.focused.set(false);
    this.luxFocusOut.emit(e);
  }

  isDisabled(option: any): boolean {
    return option ? Object.hasOwn(option, 'disabled') && option.disabled === true : false;
  }
}
