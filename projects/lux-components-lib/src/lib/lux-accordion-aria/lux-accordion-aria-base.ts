import { Signal } from '@angular/core';

export type LuxAccordionAriaTogglePosition = 'before' | 'after' | undefined;

export abstract class LuxAccordionAriaBase {
  abstract readonly luxDisabled: Signal<boolean | undefined>;
  abstract readonly luxHideToggle: Signal<boolean | undefined>;
  abstract readonly luxDynamicHeaderHeight: Signal<boolean | undefined>;
  abstract readonly luxExpandedHeaderHeight: Signal<string | undefined>;
  abstract readonly luxCollapsedHeaderHeight: Signal<string | undefined>;
  abstract readonly effectiveLuxTogglePosition: Signal<LuxAccordionAriaTogglePosition>;
  abstract readonly luxStickyHeader: Signal<boolean | undefined>;
  abstract readonly luxStickyHeaderOffset: Signal<string | undefined>;

  abstract registerPanel(panel: LuxAccordionAriaPanel): void;
  abstract unregisterPanel(panel: LuxAccordionAriaPanel): void;
  abstract notifyPanelExpanded(expandedPanel: LuxAccordionAriaPanel): void;
}

export interface LuxAccordionAriaPanel {
  collapse(): void;
}
