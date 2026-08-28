import { NgClass, NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, OnInit, viewChildren } from '@angular/core';
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
  imports: [NgClass, NgTemplateOutlet, LuxButtonComponent]
})
export class LuxStepperLargeMobileOverlayComponent implements OnInit, AfterViewInit {
  overlayRef = inject<LuxStepperLargeMobileOverlayRef>(LuxStepperLargeMobileOverlayRef);
  data = inject<LuxStepperLargeMobileOverlayData>(LUX_STEPPER_LARGE_OVERLAY_DATA);

  readonly links = viewChildren('links', { read: ElementRef });

  stepperComponent!: LuxStepperLargeComponent;

  @HostListener('document:keydown', ['$event'])
  handleKeydown(keyboardEvent: KeyboardEvent) {
    if (LuxUtil.isKeyEscape(keyboardEvent)) {
      this.overlayRef.close();
    }
  }

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

  onNavLink(stepIndex: number) {
    if (this.stepperComponent.currentStepNumber !== stepIndex) {
      this.overlayRef.close();
      this.stepperComponent.onNavLink(stepIndex);
    }
  }
}
