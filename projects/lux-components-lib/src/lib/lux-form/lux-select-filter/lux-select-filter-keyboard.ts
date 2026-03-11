import { LuxUtil } from '../../lux-util/lux-util';
import { PendingCloseFocusAction } from './lux-select-filter-focus';

export type LuxSelectFilterKeyboardSource = 'input' | 'panel';
export type VisibleBoundary = 'start' | 'end';
export type FilterKeyboardOutcome = 'ignored' | 'handled' | PendingCloseFocusAction;

export interface LuxSelectFilterKeyboardHost {
  isPanelOpen(): boolean;
  isEventFromFilterInput(event: KeyboardEvent): boolean;
  isListNavigationModifierAllowed(event: KeyboardEvent): boolean;
  moveActiveVisibleOption(step: 1 | -1): void;
  moveActiveVisibleOptionByPage(direction: 1 | -1): void;
  moveToVisibleBoundary(boundary: VisibleBoundary): void;
  selectActiveOrFirstVisibleOption(): void;
}

export function handleSelectFilterKeyboard(
  event: KeyboardEvent,
  source: LuxSelectFilterKeyboardSource,
  host: LuxSelectFilterKeyboardHost
): FilterKeyboardOutcome {
  if (!host.isPanelOpen()) {
    return 'ignored';
  }

  if (source === 'panel' && host.isEventFromFilterInput(event)) {
    return 'ignored';
  }

  if (LuxUtil.isKeyTab(event)) {
    return handleTab(event, source);
  }

  if ((LuxUtil.isKeyPageDown(event) || LuxUtil.isKeyPageUp(event)) && host.isListNavigationModifierAllowed(event)) {
    stopHandledEvent(event);
    host.moveActiveVisibleOptionByPage(LuxUtil.isKeyPageDown(event) ? 1 : -1);
    return 'handled';
  }

  if ((LuxUtil.isKeyHome(event) || LuxUtil.isKeyEnd(event)) && host.isListNavigationModifierAllowed(event)) {
    stopHandledEvent(event);
    host.moveToVisibleBoundary(LuxUtil.isKeyHome(event) ? 'start' : 'end');
    return 'handled';
  }

  if (LuxUtil.isKeyArrowDown(event) || LuxUtil.isKeyArrowUp(event)) {
    stopHandledEvent(event);
    host.moveActiveVisibleOption(LuxUtil.isKeyArrowDown(event) ? 1 : -1);
    return 'handled';
  }

  if (LuxUtil.isKeyEnter(event)) {
    stopHandledEvent(event);
    host.selectActiveOrFirstVisibleOption();
    return 'handled';
  }

  return 'ignored';
}

function handleTab(event: KeyboardEvent, source: LuxSelectFilterKeyboardSource): FilterKeyboardOutcome {
  if (source === 'panel') {
    return 'preserve-external-focus';
  }

  stopHandledEvent(event);
  return event.shiftKey ? 'manual-tab-backward' : 'manual-tab-forward';
}

function stopHandledEvent(event: KeyboardEvent): void {
  event.preventDefault();
  event.stopPropagation();
}
