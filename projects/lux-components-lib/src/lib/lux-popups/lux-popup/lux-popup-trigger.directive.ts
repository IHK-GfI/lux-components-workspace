import { Directive, ElementRef, OnDestroy, effect, inject, input, signal } from '@angular/core';
import { LuxPopupComponent } from './lux-popup.component';
import { LuxPopupCloseReason, LuxPopupPosition } from './lux-popup.types';

@Directive({
  selector: '[luxPopupTriggerFor]',
  exportAs: 'luxPopupTrigger',
  host: {
    '[attr.aria-haspopup]': 'ariaHasPopup',
    '[attr.aria-controls]': 'ariaControls()',
    '[attr.aria-expanded]': 'ariaExpanded()',
    '(mouseenter)': 'handleMouseEnter()',
    '(mouseleave)': 'handleMouseLeave()',
    '(focusin)': 'handleFocusIn()',
    '(focusout)': 'handleFocusOut($event)',
    '(click)': 'handleClick($event)',
    '(longpress)': 'handleLongPress()',
    '(touchend)': 'handleTouchEnd()'
  }
})
export class LuxPopupTriggerDirective implements OnDestroy {
  readonly luxPopupTriggerFor = input<LuxPopupComponent | undefined>(undefined);
  readonly luxPopupPosition = input<LuxPopupPosition>('above');
  readonly luxPopupShowDelay = input(500);
  readonly luxPopupHideDelay = input(120);
  readonly luxPopupDisabled = input(false);

  public readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  ariaControls = signal<string | undefined>(undefined);
  ariaExpanded = signal<'true' | 'false' | undefined>(undefined);

  private popup = signal<LuxPopupComponent | undefined>(undefined);
  private showTimeoutId?: number;
  private hideTimeoutId?: number;
  private activePopup?: LuxPopupComponent;

  get ariaHasPopup() {
    const popup = this.popup();
    if (!popup) {
      return undefined;
    }

    return popup.luxPersistent() ? 'dialog' : 'true';
  }

  constructor() {
    this.setupPopupBindingEffect();
    this.setupDisabledEffect();
  }

  open() {
    const popup = this.popup();
    if (!popup || this.luxPopupDisabled()) {
      return;
    }

    if (!popup.isOpenFor(this)) {
      popup.open(this);
    }
  }

  close(reason: LuxPopupCloseReason = 'program') {
    const popup = this.popup();
    if (!popup || !popup.isOpenFor(this)) {
      return;
    }

    popup.close(reason);
  }

  toggle() {
    const popup = this.popup();
    if (!popup || this.luxPopupDisabled()) {
      return;
    }

    popup.toggle(this);
  }

  onPopupOpened(component: LuxPopupComponent) {
    if (this.popup() !== component) {
      this.popup.set(component);
    }
    this.ariaControls.set(component.popupId);
    this.activePopup = component;
    this.applyAriaExpanded(component, true);
  }

  onPopupClosed(_reason: LuxPopupCloseReason) {
    this.clearTimers();
    this.applyAriaExpanded(this.activePopup, false);
    this.activePopup = undefined;
  }

  handleMouseEnter() {
    if (this.shouldIgnorePointerInteraction()) {
      return;
    }

    this.scheduleShow();
  }

  handleMouseLeave() {
    if (this.shouldIgnorePointerInteraction()) {
      return;
    }

    this.scheduleHide('pointer-leave');
  }

  handleFocusIn() {
    const popup = this.popup();
    if (this.luxPopupDisabled() || !popup) {
      return;
    }

    if (popup.luxPersistent()) {
      return;
    }

    this.scheduleShow();
  }

  handleFocusOut(event: FocusEvent) {
    const popup = this.popup();
    if (!popup || popup.luxPersistent()) {
      return;
    }

    if (event.relatedTarget && this.elementRef.nativeElement.contains(event.relatedTarget as Node)) {
      return;
    }

    this.scheduleHide('trigger-blur');
  }

  handleClick(event: Event) {
    const popup = this.popup();
    if (!popup || this.luxPopupDisabled()) {
      return;
    }

    if (!popup.luxPersistent()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.toggle();
  }

  handleLongPress() {
    if (this.shouldIgnorePointerInteraction()) {
      return;
    }

    this.open();
  }

  handleTouchEnd() {
    if (this.shouldIgnorePointerInteraction()) {
      return;
    }

    this.scheduleHide('pointer-leave');
  }

  ngOnDestroy() {
    this.clearTimers();
    const popup = this.popup();
    if (popup?.isOpenFor(this)) {
      popup.close('program');
    }
  }

  private shouldIgnorePointerInteraction(): boolean {
    const popup = this.popup();
    return this.luxPopupDisabled() || !popup || popup.luxPersistent();
  }

  private scheduleShow() {
    const popup = this.popup();
    if (!popup || popup.luxPersistent()) {
      return;
    }

    this.clearHideTimeout();
    if (this.showTimeoutId) {
      return;
    }

    const delay = Math.max(this.luxPopupShowDelay(), 0);
    this.showTimeoutId = window.setTimeout(() => {
      this.showTimeoutId = undefined;
      this.open();
    }, delay);
  }

  private scheduleHide(reason: LuxPopupCloseReason) {
    const popup = this.popup();
    if (!popup || popup.luxPersistent()) {
      return;
    }

    this.clearShowTimeout();
    this.clearHideTimeout();
    if (!popup.isOpenFor(this)) {
      return;
    }

    const delay = Math.max(this.luxPopupHideDelay(), 0);
    this.hideTimeoutId = window.setTimeout(() => {
      this.hideTimeoutId = undefined;
      this.close(reason);
    }, delay);
  }

  private clearTimers() {
    this.clearShowTimeout();
    this.clearHideTimeout();
  }

  private clearShowTimeout() {
    if (this.showTimeoutId) {
      clearTimeout(this.showTimeoutId);
      this.showTimeoutId = undefined;
    }
  }

  private clearHideTimeout() {
    if (this.hideTimeoutId) {
      clearTimeout(this.hideTimeoutId);
      this.hideTimeoutId = undefined;
    }
  }

  private applyAriaExpanded(component: LuxPopupComponent | undefined, isOpen: boolean) {
    if (!component || !component.luxPersistent()) {
      this.ariaExpanded.set(undefined);
      return;
    }

    this.ariaExpanded.set(isOpen ? 'true' : 'false');
  }

  private setupPopupBindingEffect() {
    effect(() => {
      const popup = this.luxPopupTriggerFor();
      const previousPopup = this.popup();

      this.popup.set(popup);

      if (previousPopup && previousPopup !== popup && previousPopup.isOpenFor(this)) {
        previousPopup.close('program');
      } else {
        this.close('program');
      }

      this.ariaControls.set(popup?.popupId);
      this.applyAriaExpanded(popup, false);
    });
  }

  private setupDisabledEffect() {
    effect(() => {
      if (!this.luxPopupDisabled()) {
        return;
      }

      this.close('program');
      this.applyAriaExpanded(this.activePopup ?? this.popup(), false);
    });
  }
}
