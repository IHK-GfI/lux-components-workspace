export type ManualTabIntent = 'manual-tab-forward' | 'manual-tab-backward';
export type PendingCloseFocusAction = 'restore-trigger' | 'preserve-external-focus' | ManualTabIntent;

export class LuxSelectFilterFocusController {
  private pendingCloseFocusAction: PendingCloseFocusAction = 'restore-trigger';

  reset(): void {
    this.pendingCloseFocusAction = 'restore-trigger';
  }

  queueManualTabNavigation(isBackward: boolean): void {
    this.pendingCloseFocusAction = isBackward ? 'manual-tab-backward' : 'manual-tab-forward';
  }

  preserveExternalFocus(): void {
    this.pendingCloseFocusAction = 'preserve-external-focus';
  }

  handleDocumentPointerdown(target: EventTarget | null, selectHost?: HTMLElement | null, panelElement?: HTMLElement | null): void {
    if (isOutsideSelectContext(target, selectHost, panelElement)) {
      this.preserveExternalFocus();
    }
  }

  consumeCloseAction(): PendingCloseFocusAction {
    const currentAction = this.pendingCloseFocusAction;
    this.pendingCloseFocusAction = 'restore-trigger';
    return currentAction;
  }

  shouldRestoreTriggerFocus(activeElement: Element | null, selectHost?: HTMLElement | null, panelElement?: HTMLElement | null): boolean {
    return shouldRestoreTriggerFocus(activeElement, selectHost, panelElement);
  }
}

function isMeaningfullyFocusedElement(element: Element | null): element is HTMLElement {
  return element instanceof HTMLElement && element !== document.body && element !== document.documentElement;
}

function isOutsideSelectContext(target: EventTarget | null, selectHost?: HTMLElement | null, panelElement?: HTMLElement | null): boolean {
  if (!(target instanceof Node)) {
    return false;
  }

  return !(selectHost?.contains(target) ?? false) && !(panelElement?.contains(target) ?? false);
}

function shouldRestoreTriggerFocus(activeElement: Element | null, selectHost?: HTMLElement | null, panelElement?: HTMLElement | null): boolean {
  if (!isMeaningfullyFocusedElement(activeElement)) {
    return true;
  }

  if (!activeElement.isConnected) {
    return true;
  }

  if (panelElement?.contains(activeElement)) {
    return true;
  }

  return selectHost?.contains(activeElement) ?? false;
}
