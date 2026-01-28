import { Directionality } from '@angular/cdk/bidi';
import { ConnectedPosition, Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { DOCUMENT, NgTemplateOutlet } from '@angular/common';
import {
  Component,
  ContentChild,
  EventEmitter,
  NgZone,
  OnDestroy,
  Output,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  effect,
  inject,
  input
} from '@angular/core';
import { Subscription } from 'rxjs';
import { LuxPopupActionsDirective } from './lux-popup-actions.directive';
import { LuxPopupTriggerDirective } from './lux-popup-trigger.directive';
import { LuxPopupCloseReason, LuxPopupPosition } from './lux-popup.types';

let nextPopupId = 0;

@Component({
  selector: 'lux-popup',
  templateUrl: './lux-popup.component.html',
  exportAs: 'luxPopup',
  imports: [NgTemplateOutlet]
})
export class LuxPopupComponent implements OnDestroy {
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private zone = inject(NgZone);
  private dir = inject(Directionality, { optional: true });
  private document = inject(DOCUMENT);
  private scrollDispatcher = inject(ScrollDispatcher);

  @ContentChild(LuxPopupActionsDirective) actions?: LuxPopupActionsDirective;
  @ViewChild('popupTemplate', { static: true }) popupTemplate!: TemplateRef<unknown>;

  readonly luxTitle = input<string | undefined>();
  readonly luxPersistent = input(false);
  readonly luxMinWidth = input(220);
  readonly luxMaxWidth = input(360);
  readonly luxAriaLabel = input<string | undefined>();

  @Output() luxOpened = new EventEmitter<void>();
  @Output() luxClosed = new EventEmitter<LuxPopupCloseReason>();

  popupId = `lux-popup-${nextPopupId++}`;

  private overlayRef?: OverlayRef;
  private portal?: TemplatePortal<unknown>;
  private documentPointerDownListener?: (event: Event) => void;
  private documentKeydownListener?: (event: KeyboardEvent) => void;
  private currentTrigger?: LuxPopupTriggerDirective;
  private pendingCloseReason: LuxPopupCloseReason = 'program';
  private focusedElementBeforeOpen?: HTMLElement | null;
  private scrollSubscription?: Subscription;

  constructor() {
    this.setupOverlaySizeEffect();
    this.setupPersistentClassEffect();
  }

  get role(): 'dialog' | 'tooltip' {
    return this.luxPersistent() ? 'dialog' : 'tooltip';
  }

  get minWidthPx() {
    return Math.max(0, this.luxMinWidth());
  }

  get maxWidthPx() {
    return Math.max(this.minWidthPx, this.luxMaxWidth());
  }

  open(trigger: LuxPopupTriggerDirective) {
    if (this.currentTrigger === trigger && this.isOpen()) {
      return;
    }

    if (this.document.activeElement instanceof HTMLElement) {
      this.focusedElementBeforeOpen = this.document.activeElement;
    }

    this.currentTrigger = trigger;

    const overlayConfig = this.buildOverlayConfig(trigger);
    if (!this.overlayRef) {
      this.overlayRef = this.overlay.create(overlayConfig);
      this.overlayRef.detachments().subscribe(() => this.handleOverlayDetached());
    } else {
      if (overlayConfig.positionStrategy) {
        this.overlayRef.updatePositionStrategy(overlayConfig.positionStrategy);
      }
      if (overlayConfig.scrollStrategy) {
        this.overlayRef.updateScrollStrategy(overlayConfig.scrollStrategy);
      }
      this.syncPanelClasses(overlayConfig.panelClass);
    }

    if (!this.portal) {
      this.portal = new TemplatePortal(this.popupTemplate, this.viewContainerRef);
    }

    if (!this.overlayRef.hasAttached()) {
      this.overlayRef.attach(this.portal);
      this.applyOverlaySize();
    }

    this.focusPopupIfNeeded();

    this.currentTrigger.onPopupOpened(this);
    this.addOverlayListeners();
    this.luxOpened.emit();
  }

  close(reason: LuxPopupCloseReason = 'program') {
    if (!this.overlayRef || !this.overlayRef.hasAttached()) {
      return;
    }

    this.pendingCloseReason = reason;
    this.overlayRef.detach();

    if (this.luxPersistent() && this.shouldRestoreFocus(reason)) {
      this.focusedElementBeforeOpen?.focus();
    }
  }

  toggle(trigger: LuxPopupTriggerDirective) {
    if (this.isOpenFor(trigger)) {
      this.close('toggle');
    } else {
      this.open(trigger);
    }
  }

  private shouldRestoreFocus(reason: LuxPopupCloseReason): boolean {
    switch (reason) {
      case 'outside':
      case 'pointer-leave':
      case 'trigger-blur':
      case 'scroll':
        return false;
      default:
        return true;
    }
  }

  isOpen(): boolean {
    return !!this.overlayRef?.hasAttached();
  }

  isOpenFor(trigger: LuxPopupTriggerDirective): boolean {
    return this.currentTrigger === trigger && this.isOpen();
  }

  ngOnDestroy() {
    this.removeOverlayListeners();
    this.overlayRef?.dispose();
  }

  private handleOverlayDetached() {
    if (!this.currentTrigger) {
      this.removeOverlayListeners();
      return;
    }

    const reason = this.pendingCloseReason;
    this.pendingCloseReason = 'program';
    this.currentTrigger.onPopupClosed(reason);
    this.currentTrigger = undefined;
    this.removeOverlayListeners();
    this.luxClosed.emit(reason);
  }

  private buildOverlayConfig(trigger: LuxPopupTriggerDirective): OverlayConfig {
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(trigger.elementRef)
      .withFlexibleDimensions(false)
      .withViewportMargin(8)
      .withPush(true);

    positionStrategy.withPositions(this.buildPreferredPositions(trigger.luxPopupPosition()));

    return {
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      disposeOnNavigation: true,
      panelClass: this.resolvePanelClasses()
    };
  }

  private buildPreferredPositions(position: LuxPopupPosition): ConnectedPosition[] {
    const order: LuxPopupPosition[] = [position, 'below', 'above', 'after', 'before', 'left', 'right'];
    const seen = new Set<string>();

    return order
      .map((option) => this.mapPosition(option))
      .filter((pos): pos is ConnectedPosition => {
        const key = JSON.stringify(pos);
        if (!pos || seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
  }

  private mapPosition(position: LuxPopupPosition): ConnectedPosition {
    const isRtl = this.dir?.value === 'rtl';
    const beforeX = isRtl ? 'end' : 'start';
    const afterX = isRtl ? 'start' : 'end';
    const offset = 8;

    switch (position) {
      case 'below':
        return { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: offset };
      case 'above':
        return { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -offset };
      case 'after':
        return { originX: afterX, originY: 'center', overlayX: beforeX, overlayY: 'center', offsetX: offset };
      case 'before':
        return { originX: beforeX, originY: 'center', overlayX: afterX, overlayY: 'center', offsetX: -offset };
      case 'left':
        return { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -offset };
      case 'right':
        return { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: offset };
      default:
        return { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: offset };
    }
  }

  private resolvePanelClasses(): string[] {
    const classes = ['lux-popup-panel'];
    classes.push(this.luxPersistent() ? 'lux-popup-panel--persistent' : 'lux-popup-panel--transient');
    return classes;
  }

  private syncPanelClasses(panelClasses?: string | string[]) {
    if (!this.overlayRef) {
      return;
    }

    const classes = Array.isArray(panelClasses) ? panelClasses : panelClasses ? [panelClasses] : [];
    if (!classes.length) {
      return;
    }

    const classList = this.overlayRef.overlayElement.classList;
    classList.remove('lux-popup-panel--persistent', 'lux-popup-panel--transient');
    classes.forEach((panelClass) => classList.add(panelClass));
  }

  private addOverlayListeners() {
    if (this.documentPointerDownListener || !this.overlayRef) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      this.documentPointerDownListener = (event: Event) => this.handleDocumentPointerDown(event);
      this.documentKeydownListener = (event: KeyboardEvent) => this.handleDocumentKeydown(event);

      this.document.addEventListener('pointerdown', this.documentPointerDownListener!, true);
      this.document.addEventListener('keydown', this.documentKeydownListener!, true);
    });

    this.subscribeToScrollEvents();
  }

  private removeOverlayListeners() {
    if (this.documentPointerDownListener) {
      this.document.removeEventListener('pointerdown', this.documentPointerDownListener, true);
      this.documentPointerDownListener = undefined;
    }
    if (this.documentKeydownListener) {
      this.document.removeEventListener('keydown', this.documentKeydownListener, true);
      this.documentKeydownListener = undefined;
    }

    this.unsubscribeFromScrollEvents();
  }

  private handleDocumentPointerDown(event: Event) {
    if (!this.overlayRef || !this.currentTrigger) {
      return;
    }
    const target = event.target as Node | null;
    const overlayElement = this.overlayRef.overlayElement;
    const triggerElement = this.currentTrigger.elementRef.nativeElement;

    if (target && (overlayElement.contains(target) || triggerElement.contains(target))) {
      return;
    }

    // Listener läuft außerhalb der Angular-Zone, daher Close-Aufruf bewusst wieder hineinführen
    this.zone.run(() => this.close('outside'));
  }

  private handleDocumentKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape' || !this.isOpen()) {
      return;
    }

    event.stopPropagation();
    // Listener läuft außerhalb der Angular-Zone, daher sicherstellen, dass Change Detection den Escape-Schluss mitbekommt
    this.zone.run(() => this.close('escape'));
  }

  private applyOverlaySize() {
    if (!this.overlayRef) {
      return;
    }

    this.overlayRef.updateSize({
      minWidth: this.minWidthPx,
      maxWidth: this.maxWidthPx
    });
  }

  private focusPopupIfNeeded() {
    if (!this.luxPersistent()) {
      return;
    }

    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        const element = this.overlayRef?.overlayElement.querySelector('.lux-popup') as HTMLElement | null;
        element?.focus();
      });
    });
  }

  handlePopupKeydown(event: KeyboardEvent) {
    if (!this.luxPersistent() || !this.overlayRef) {
      return;
    }

    if (event.key === 'Escape') {
      event.stopPropagation();
      event.preventDefault();
      this.close('escape');
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const overlayElement = this.overlayRef.overlayElement;
    const target = event.target as HTMLElement | null;

    if (!target || !overlayElement.contains(target)) {
      return;
    }

    const focusables = this.getFocusableElements(overlayElement);
    if (!focusables.length) {
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (!event.shiftKey && target === last) {
      event.preventDefault();
      this.close();
      this.focusTriggerElement();
      return;
    }

    if (event.shiftKey && target === first) {
      event.preventDefault();
      this.close();
      this.focusTriggerElement();
      return;
    }
  }

  private focusTriggerElement() {
    const triggerElement = this.focusedElementBeforeOpen as HTMLElement | null;
    triggerElement?.focus();
  }

  private getFocusableElements(root: HTMLElement): HTMLElement[] {
    const selector = 'a[href], area[href], button, input, select, textarea, [tabindex]';
    const elements = [root, ...Array.from(root.querySelectorAll<HTMLElement>(selector))];
    const seen = new Set<HTMLElement>();

    return elements.filter((element) => {
      if (seen.has(element)) {
        return false;
      }
      if (!this.isFocusable(element)) {
        return false;
      }
      seen.add(element);
      return true;
    });
  }

  private isFocusable(element: HTMLElement): boolean {
    if (element.tabIndex < 0 || element.hasAttribute('disabled')) {
      return false;
    }

    const hasRect = element.offsetWidth > 0 || element.offsetHeight > 0 || element.getClientRects().length > 0;
    if (!hasRect) {
      return false;
    }

    const inertAncestor = element.closest('[inert]');
    return !inertAncestor;
  }

  private subscribeToScrollEvents() {
    if (this.scrollSubscription) {
      return;
    }

    this.scrollSubscription = this.scrollDispatcher.scrolled(0).subscribe(() => {
      if (!this.isOpen()) {
        return;
      }
      this.zone.run(() => this.close('scroll'));
    });
  }

  private unsubscribeFromScrollEvents() {
    if (!this.scrollSubscription) {
      return;
    }

    this.scrollSubscription.unsubscribe();
    this.scrollSubscription = undefined;
  }

  private setupOverlaySizeEffect() {
    effect(() => {
      this.luxMinWidth();
      this.luxMaxWidth();
      if (this.overlayRef?.hasAttached()) {
        this.applyOverlaySize();
      }
    });
  }

  private setupPersistentClassEffect() {
    effect(() => {
      this.luxPersistent();
      if (this.overlayRef?.hasAttached()) {
        this.syncPanelClasses(this.resolvePanelClasses());
      }
    });
  }
}
