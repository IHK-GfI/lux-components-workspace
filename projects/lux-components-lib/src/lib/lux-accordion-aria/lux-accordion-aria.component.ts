import { NgClass } from '@angular/common';
import { AccordionGroup } from '@angular/aria/accordion';
import { Component, DestroyRef, OnDestroy, computed, contentChildren, forwardRef, inject, input } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { LuxPanelAriaComponent } from '../lux-panel-aria/lux-panel-aria.component';
import { LuxPanelAriaHeaderCustomComponent } from '../lux-panel-aria/lux-panel-aria-subcomponents/lux-panel-aria-header-custom.component';
import { LuxAccordionColor, LuxAccordionColors } from '../lux-util/lux-colors.enum';

export declare type LuxAccordionMulti = boolean;
export declare type LuxAccordionCloseOthers = boolean;
export declare type LuxAriaTogglePosition = 'before' | 'after' | undefined;

/**
 * Standalone accordion component based on Angular CDK
 * Provides similar API to Material accordion using Angular Aria directives.
 */
@Component({
  selector: 'lux-accordion-aria',
  templateUrl: './lux-accordion-aria.component.html',
  styleUrls: ['./lux-accordion-aria.component.scss'],
  standalone: true,
  imports: [NgClass],
  // AccordionGroup as host directive so its ACCORDION_GROUP provider reaches projected lux-panel-aria content
  hostDirectives: [AccordionGroup],
  host: { class: 'lux-flex lux-flex-auto' }
})
export class LuxAccordionAriaComponent implements OnDestroy {
  private static accordionIdCounter = 0;
  private readonly destroyRef = inject(DestroyRef);

  changed$ = new Subject<string>();
  readonly id = `lux-accordion-aria-${LuxAccordionAriaComponent.accordionIdCounter++}`;

  luxMulti = input<LuxAccordionMulti>(false);
  luxColor = input<LuxAccordionColor | undefined>('primary');
  luxDisabled = input<boolean | undefined>(undefined);
  luxHideToggle = input<boolean | undefined>(undefined);
  luxDynamicHeaderHeight = input<boolean | undefined>(undefined);
  luxExpandedHeaderHeight = input<string | undefined>(undefined);
  luxCollapsedHeaderHeight = input<string | undefined>(undefined);
  luxTogglePosition = input<LuxAriaTogglePosition>(undefined);

  private readonly customHeaders = contentChildren(LuxPanelAriaHeaderCustomComponent, { descendants: true });

  // AccordionGroup's own contentChildren query can't see triggers nested inside the lux-panel-aria
  // component's own view (content queries never cross a child component's template boundary), so
  // closing other panels when luxMulti is false must be done manually via this sibling list.
  private readonly panels = contentChildren(
    forwardRef(() => LuxPanelAriaComponent),
    { descendants: true }
  );

  readonly effectiveLuxTogglePosition = computed<LuxAriaTogglePosition>(() =>
    this.customHeaders().length > 0 ? 'before' : this.luxTogglePosition()
  );

  protected resolvedLuxColor = computed<LuxAccordionColor | undefined>(
    () => LuxAccordionColors.find((entry) => entry === this.luxColor()) ?? undefined
  );

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

        const validColor = this.resolvedLuxColor();

        if (validColor !== state.luxColor) {
          console.warn(`Ungültige luxColor '${state.luxColor}' für lux-accordion-aria. Erlaubt: ${LuxAccordionColors.join(', ')}`);
        }

        previousState = state;
      });
  }

  ngOnDestroy() {
    this.changed$.complete();
  }

  /** Called by a lux-panel-aria child once it expands; collapses its siblings unless luxMulti is set. */
  notifyPanelExpanded(expandedPanel: LuxPanelAriaComponent): void {
    if (this.luxMulti()) {
      return;
    }
    this.panels().forEach((panel) => {
      if (panel !== expandedPanel) {
        panel.collapse();
      }
    });
  }
}
