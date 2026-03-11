export type ManualTabIntent = 'manual-tab-forward' | 'manual-tab-backward';
export type PendingCloseFocusAction = 'restore-trigger' | 'preserve-external-focus' | ManualTabIntent;

export function isMeaningfullyFocusedElement(element: Element | null): element is HTMLElement {
  return element instanceof HTMLElement && element !== document.body && element !== document.documentElement;
}

export function isOutsideSelectContext(
  target: EventTarget | null,
  selectHost?: HTMLElement | null,
  panelElement?: HTMLElement | null
): boolean {
  if (!(target instanceof Node)) {
    return false;
  }

  return !(selectHost?.contains(target) ?? false) && !(panelElement?.contains(target) ?? false);
}

export function shouldRestoreTriggerFocus(
  activeElement: Element | null,
  selectHost?: HTMLElement | null,
  panelElement?: HTMLElement | null
): boolean {
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
