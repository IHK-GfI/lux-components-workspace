import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, HostBinding, Input, OnDestroy, TemplateRef, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioButton, MatRadioGroup } from '@angular/material/radio';
import { Subscription } from 'rxjs';
import { LuxAriaDescribedbyDirective } from '../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxAriaInvalidDirective } from '../../lux-directives/lux-aria/lux-aria-invalid.directive';
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
    LuxAriaLabelledbyDirective,
    LuxTagIdDirective,
    LuxRenderPropertyPipe
  ]
})
export class LuxRadioAcComponent<O = any, V = any> extends LuxFormSelectableBase<O, V> implements OnDestroy {
  private mediaObserver = inject(LuxMediaQueryObserverService);

  forceVertical = false;

  // Potenziell eingebettetes Template für Darstellung der Labels
  @ContentChild(TemplateRef) tempRef?: TemplateRef<any>;

  @HostBinding('class.lux-pb-3') pb3 = true;
  @Input() luxGroupName = '';
  @Input() luxOrientationVertical = true;
  @Input() luxNoLabels = false;
  @Input() luxNoTopLabel = false;
  @Input() luxNoBottomLabel = false;

  focused = false;

  private mediaSubscription$: Subscription;

  constructor() {
    super();

    this.mediaSubscription$ = this.mediaObserver.getMediaQueryChangedAsObservable().subscribe(() => {
      this.forceVertical = this.mediaObserver.isXS();
    });
    this.forceVertical = this.mediaObserver.isXS();
  }

  get isVertical(): boolean {
    return this.luxOrientationVertical || this.forceVertical;
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.mediaSubscription$.unsubscribe();
  }

  onFocusIn(e: FocusEvent) {
    this.focused = true;
    this.luxFocusIn.emit(e);
  }

  onFocusOut(e: FocusEvent) {
    this.focused = false;
    this.luxFocusOut.emit(e);
  }

  descripedBy() {
    if (this.errorMessage) {
      return this.uid + '-error';
    } else {
      return (this.formHintComponent || this.luxHint) && (!this.luxHintShowOnlyOnFocus || (this.luxHintShowOnlyOnFocus && this.focused))
        ? this.uid + '-hint'
        : undefined;
    }
  }

  isDisabled(option: any): boolean {
    return option ? Object.hasOwn(option, 'disabled') && option.disabled === true : false;
  }
}
