import { NgClass } from '@angular/common';
import { AccordionGroup } from '@angular/aria/accordion';
import { Component, DestroyRef, OnDestroy, Signal, computed, contentChildren, inject, input } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { LuxPanelAriaHeaderCustomComponent } from '../lux-panel-aria/lux-panel-aria-subcomponents/lux-panel-aria-header-custom.component';
import { LuxModeType } from '../lux-layout/lux-accordion/lux-accordion.component';
import { LuxAccordionColor, LuxAccordionColors } from '../lux-util/lux-colors.enum';
import { LuxAccordionAriaBase, LuxAccordionAriaPanel, LuxAccordionAriaTogglePosition } from './lux-accordion-aria-base';

export declare type LuxAccordionMulti = boolean;
export type LuxAriaTogglePosition = LuxAccordionAriaTogglePosition;

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
  // 'disabled' is forwarded under the luxDisabled name so the group's own state stays the single source of truth
  hostDirectives: [{ directive: AccordionGroup, inputs: ['disabled: luxDisabled'] }],
  providers: [{ provide: LuxAccordionAriaBase, useExisting: LuxAccordionAriaComponent }],
  host: {
    class: 'lux-flex lux-flex-auto',
    '[class.lux-default]': "luxMode() === 'default'",
    '[class.lux-flat]': "luxMode() === 'flat'"
  }
})
export class LuxAccordionAriaComponent extends LuxAccordionAriaBase implements OnDestroy {
  private static accordionIdCounter = 0;
  private readonly destroyRef = inject(DestroyRef);
  private readonly panels = new Set<LuxAccordionAriaPanel>();
  // forwarded via hostDirectives inputs above, this is the single source of truth for the disabled state
  private readonly accordionGroup = inject(AccordionGroup, { self: true });

  changed$ = new Subject<string>();
  readonly id = `lux-accordion-aria-${LuxAccordionAriaComponent.accordionIdCounter++}`;

  luxMulti = input<LuxAccordionMulti>(false);
  luxMode = input<LuxModeType>('default');
  luxColor = input<LuxAccordionColor | undefined>('primary');
  readonly luxDisabled: Signal<boolean | undefined> = this.accordionGroup.disabled;
  luxHideToggle = input<boolean | undefined>(undefined);
  luxDynamicHeaderHeight = input<boolean | undefined>(undefined);
  luxExpandedHeaderHeight = input<string | undefined>(undefined);
  luxCollapsedHeaderHeight = input<string | undefined>(undefined);
  luxTogglePosition = input<LuxAriaTogglePosition>(undefined);
  luxStickyHeader = input<boolean | undefined>();
  luxStickyHeaderOffset = input<string | undefined>();

  private readonly customHeaders = contentChildren(LuxPanelAriaHeaderCustomComponent, { descendants: true });

  readonly effectiveLuxTogglePosition = computed<LuxAriaTogglePosition>(() =>
    this.customHeaders().length > 0 ? 'before' : this.luxTogglePosition()
  );

  protected resolvedLuxColor = computed<LuxAccordionColor | undefined>(
    () => LuxAccordionColors.find((entry) => entry === this.luxColor()) ?? undefined
  );

  private readonly accordionState = computed(() => ({
    luxColor: this.luxColor(),
    luxMode: this.luxMode(),
    luxDisabled: this.luxDisabled(),
    luxHideToggle: this.luxHideToggle(),
    luxDynamicHeaderHeight: this.luxDynamicHeaderHeight(),
    luxExpandedHeaderHeight: this.luxExpandedHeaderHeight(),
    luxCollapsedHeaderHeight: this.luxCollapsedHeaderHeight(),
    luxTogglePosition: this.luxTogglePosition()
  }));

  constructor() {
    super();
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

  registerPanel(panel: LuxAccordionAriaPanel): void {
    this.panels.add(panel);
  }

  unregisterPanel(panel: LuxAccordionAriaPanel): void {
    this.panels.delete(panel);
  }

  /** Called by a lux-panel-aria child once it expands; collapses its siblings unless luxMulti is set. */
  notifyPanelExpanded(expandedPanel: LuxAccordionAriaPanel): void {
    if (this.luxMulti()) {
      return;
    }
    this.panels.forEach((panel) => {
      if (panel !== expandedPanel) {
        panel.collapse();
      }
    });
  }
}
