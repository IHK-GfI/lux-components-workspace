import { NgClass } from '@angular/common';
import { CdkAccordion } from '@angular/cdk/accordion';
import { AfterViewInit, Component, DestroyRef, OnDestroy, computed, inject, input, viewChild } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { LuxTogglePosition } from '../lux-layout/lux-accordion/lux-accordion.component';
import { LuxAccordionColor, LuxAccordionColors } from '../lux-util/lux-colors.enum';
import { LuxUtil } from '../lux-util/lux-util';

export declare type LuxAccordionMulti = boolean;
export declare type LuxAccordionCloseOthers = boolean;

/**
 * Standalone accordion component based on Angular CDK
 * Provides similar API to Material accordion but uses aria-compliant CDK implementation
 */
@Component({
  selector: 'lux-accordion-aria',
  templateUrl: './lux-accordion-aria.component.html',
  styleUrls: ['./lux-accordion-aria.component.scss'],
  standalone: true,
  imports: [NgClass, CdkAccordion],
  host: { class: 'lux-flex lux-flex-auto' }
})
export class LuxAccordionAriaComponent implements AfterViewInit, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  changed$ = new Subject<string>();

  luxMulti = input<LuxAccordionMulti>(false);
  luxColor = input<LuxAccordionColor | undefined>('primary');
  luxDisabled = input<boolean | undefined>(undefined);
  luxHideToggle = input<boolean | undefined>(undefined);
  luxDynamicHeaderHeight = input<boolean | undefined>(undefined);
  luxExpandedHeaderHeight = input<string | undefined>(undefined);
  luxCollapsedHeaderHeight = input<string | undefined>(undefined);
  luxTogglePosition = input<LuxTogglePosition>(undefined);

  cdkAccordion = viewChild.required(CdkAccordion);

  private readonly accordionState = computed(() => ({
    luxColor: this.luxColor(),
    luxDisabled: this.luxDisabled(),
    luxHideToggle: this.luxHideToggle(),
    luxDynamicHeaderHeight: this.luxDynamicHeaderHeight(),
    luxExpandedHeaderHeight: this.luxExpandedHeaderHeight(),
    luxCollapsedHeaderHeight: this.luxCollapsedHeaderHeight(),
    luxTogglePosition: this.luxTogglePosition()
  }));

  constructor() {
    let previousState: ReturnType<typeof this.accordionState> | undefined;

    toObservable(this.accordionState)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => {
        const changedProperties = previousState
          ? (Object.keys(state) as (keyof typeof state)[]).filter((key) => previousState?.[key] !== state[key])
          : (Object.keys(state) as (keyof typeof state)[]);

        changedProperties.forEach((propertyName) => {
          this.changed$.next(propertyName);
        });

        const validColor = LuxAccordionColors.find((entry) => entry === state.luxColor) ?? undefined;

        if (validColor !== state.luxColor) {
          console.warn(`Ungültige luxColor '${state.luxColor}' für lux-accordion-aria. Erlaubt: ${LuxAccordionColors.join(', ')}`);
        }

        previousState = state;
      });
  }

  ngAfterViewInit() {
    LuxUtil.assertNonNull('cdkAccordion', this.cdkAccordion());
  }

  ngOnDestroy() {
    this.changed$.complete();
  }
}
