import { Directive, ElementRef, HostBinding, HostListener, OnDestroy, effect, inject, input } from '@angular/core';
import { LuxPopupComponent } from './lux-popup.component';
import { LuxPopupCloseReason, LuxPopupPosition } from './lux-popup.types';

@Directive({
  selector: '[luxPopupTriggerFor]',
  exportAs: 'luxPopupTrigger'
})
export class LuxPopupTriggerDirective implements OnDestroy {
  private popup?: LuxPopupComponent;
  private showTimeoutId?: number;
  private hideTimeoutId?: number;
  private activePopup?: LuxPopupComponent;
  readonly luxPopupTriggerFor = input<LuxPopupComponent | undefined>(undefined);
  readonly luxPopupPosition = input<LuxPopupPosition>('above');
  readonly luxPopupShowDelay = input(500);
  readonly luxPopupHideDelay = input(120);
  readonly luxPopupDisabled = input(false);

  @HostBinding('attr.aria-haspopup')
  get ariaHasPopup() {
    if (!this.popup) {
      return undefined;
    }

    return this.popup.luxPersistent() ? 'dialog' : 'true';
  }

  @HostBinding('attr.aria-controls') ariaControls?: string;
  @HostBinding('attr.aria-expanded') ariaExpanded?: 'true' | 'false';

  public readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    this.setupPopupBindingEffect();
    this.setupDisabledEffect();
  }

  open() {
    if (!this.popup || this.luxPopupDisabled()) {
      return;
    }

    if (!this.popup.isOpenFor(this)) {
      this.popup.open(this);
    }
  }

  close(reason: LuxPopupCloseReason = 'program') {
    if (!this.popup || !this.popup.isOpenFor(this)) {
      return;
    }

    this.popup.close(reason);
  }

  toggle() {
    if (!this.popup || this.luxPopupDisabled()) {
      return;
    }

    this.popup.toggle(this);
  }

  onPopupOpened(component: LuxPopupComponent) {
    if (this.popup !== component) {
      this.popup = component;
    }
    this.ariaControls = component.popupId;
    this.activePopup = component;
    this.applyAriaExpanded(component, true);
  }

  onPopupClosed(_reason: LuxPopupCloseReason) {
    this.clearTimers();
    this.applyAriaExpanded(this.activePopup, false);
    this.activePopup = undefined;
  }

  @HostListener('mouseenter')
  handleMouseEnter() {
    if (this.shouldIgnorePointerInteraction()) {
      return;
    }

    this.scheduleShow();
  }

  @HostListener('mouseleave')
  handleMouseLeave() {
    if (this.shouldIgnorePointerInteraction()) {
      return;
    }

    this.scheduleHide('pointer-leave');
  }

  @HostListener('focusin')
  handleFocusIn() {
    if (this.luxPopupDisabled() || !this.popup) {
      return;
    }

    if (this.popup.luxPersistent()) {
      return;
    }

    this.scheduleShow();
  }

  @HostListener('focusout', ['$event'])
  handleFocusOut(event: FocusEvent) {
    if (!this.popup || this.popup.luxPersistent()) {
      return;
    }

    if (event.relatedTarget && this.elementRef.nativeElement.contains(event.relatedTarget as Node)) {
      return;
    }

    this.scheduleHide('trigger-blur');
  }

  @HostListener('click', ['$event'])
  handleClick(event: Event) {
    if (!this.popup || this.luxPopupDisabled()) {
      return;
    }

    if (!this.popup.luxPersistent()) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.toggle();
  }

  @HostListener('longpress')
  handleLongPress() {
    if (this.shouldIgnorePointerInteraction()) {
      return;
    }

    this.open();
  }

  @HostListener('touchend')
  handleTouchEnd() {
    if (this.shouldIgnorePointerInteraction()) {
      return;
    }

    this.scheduleHide('pointer-leave');
  }

  ngOnDestroy() {
    this.clearTimers();
    if (this.popup?.isOpenFor(this)) {
      this.popup.close('program');
    }
  }

  private shouldIgnorePointerInteraction(): boolean {
    return this.luxPopupDisabled() || !this.popup || this.popup.luxPersistent();
  }

  private scheduleShow() {
    if (!this.popup || this.popup.luxPersistent()) {
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
    if (!this.popup || this.popup.luxPersistent()) {
      return;
    }

    this.clearShowTimeout();
    this.clearHideTimeout();
    if (!this.popup.isOpenFor(this)) {
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
      this.ariaExpanded = undefined;
      return;
    }

    this.ariaExpanded = isOpen ? 'true' : 'false';
  }

  private setupPopupBindingEffect() {
    effect(() => {
      const popup = this.luxPopupTriggerFor();
      const previousPopup = this.popup;

      this.popup = popup;

      if (previousPopup && previousPopup !== popup && previousPopup.isOpenFor(this)) {
        previousPopup.close('program');
      } else {
        this.close('program');
      }

      this.ariaControls = popup?.popupId;
      this.applyAriaExpanded(popup, false);
    });
  }

  private setupDisabledEffect() {
    effect(() => {
      if (!this.luxPopupDisabled()) {
        return;
      }

      this.close('program');
      this.applyAriaExpanded(this.activePopup ?? this.popup, false);
    });
  }
}
