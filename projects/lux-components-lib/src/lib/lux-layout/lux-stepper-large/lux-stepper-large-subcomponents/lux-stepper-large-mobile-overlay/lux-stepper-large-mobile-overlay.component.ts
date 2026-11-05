import { NgClass, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, OnInit, viewChildren } from '@angular/core';
import { LuxButtonComponent } from '../../../../lux-action/lux-button/lux-button.component';
import { LuxUtil } from '../../../../lux-util/lux-util';
import { LuxStepperLargeComponent } from '../../lux-stepper-large.component';
import { LUX_STEPPER_LARGE_OVERLAY_DATA, LuxStepperLargeMobileOverlayData } from './lux-stepper-large-mobile-overlay-data';
import { LuxStepperLargeMobileOverlayRef } from './lux-stepper-large-mobile-overlay-ref';

@Component({
  selector: 'lux-stepper-large-mobile-overlay',
  templateUrl: './lux-stepper-large-mobile-overlay.component.html',
  styleUrls: ['./lux-stepper-large-mobile-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'handleKeydown($event)'
  },
  imports: [NgClass, NgTemplateOutlet, LuxButtonComponent]
})
export class LuxStepperLargeMobileOverlayComponent implements OnInit, AfterViewInit {
  readonly links = viewChildren('links', { read: ElementRef });

  overlayRef = inject<LuxStepperLargeMobileOverlayRef>(LuxStepperLargeMobileOverlayRef);
  data = inject<LuxStepperLargeMobileOverlayData>(LUX_STEPPER_LARGE_OVERLAY_DATA);
  stepperComponent!: LuxStepperLargeComponent;

  ngOnInit(): void {
    this.stepperComponent = this.data.stepperComponent;

    LuxUtil.assertNonNull('stepperComponent', this.stepperComponent);
  }

  ngAfterViewInit() {
    const links = this.links();
    if (links.length > 0) {
      const activeLink = links.find(
        (element) => element.nativeElement && element.nativeElement.classList && !!element.nativeElement.classList.contains('active-link')
      );
      if (activeLink && activeLink.nativeElement) {
        activeLink.nativeElement.focus();
      }
    }
  }

  handleKeydown(keyboardEvent: KeyboardEvent) {
    if (LuxUtil.isKeyEscape(keyboardEvent)) {
      this.overlayRef.close();
    }
  }

  onNavLink(stepIndex: number) {
    if (this.stepperComponent.currentStepNumber !== stepIndex) {
      this.overlayRef.close();
      this.stepperComponent.onNavLink(stepIndex);
    }
  }
}
