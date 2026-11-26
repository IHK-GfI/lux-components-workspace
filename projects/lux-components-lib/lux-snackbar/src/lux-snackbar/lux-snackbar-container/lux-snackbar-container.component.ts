import { NgClass, NgComponentOutlet } from '@angular/common';
import { AnimationCallbackEvent, ChangeDetectionStrategy, Component, computed, ElementRef, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { luxTranslateSignal } from '@ihk-gfi/lux-components';
import { TranslocoService } from '@jsverse/transloco';
import { LuxSnackbarStack } from '../lux-snackbar-stack';

let nextListId = 0;

/**
 * Zeigt die Nachrichten des Snackbar-Stacks im Overlay an (intern, wird vom LuxSnackbarService erzeugt).
 */
@Component({
  selector: 'lux-snackbar-container',
  templateUrl: './lux-snackbar-container.component.html',
  styleUrl: './lux-snackbar-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, NgComponentOutlet, MatButton]
})
export class LuxSnackbarContainerComponent {
  private static readonly LEAVE_DURATION = 150;

  readonly stack = inject(LuxSnackbarStack);
  readonly listId = 'lux-snackbar-list-' + nextListId++;
  readonly regionLabel = luxTranslateSignal('luxc.snackbar.region.arialabel');
  readonly lessLabel = luxTranslateSignal('luxc.snackbar.less.btn');

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly tService = inject(TranslocoService);
  private pendingLeaves: { event: AnimationCallbackEvent; top: number; left: number; width: number }[] = [];

  readonly hasMessages = computed(() => this.stack.messages().length > 0);
  readonly moreLabel = computed(() => {
    this.tService.activeLang();
    const count = this.stack.hiddenCount();
    return count === 1
      ? this.tService.translate('luxc.snackbar.more.one.btn')
      : this.tService.translate('luxc.snackbar.more.btn', { count });
  });

  onFocusOut(event: FocusEvent) {
    const next = event.relatedTarget;
    if (!(next instanceof Node) || !this.elementRef.nativeElement.contains(next)) {
      this.stack.setFocused(false);
    }
  }

  /**
   * Blendet eine Nachricht aus. Sie wird dafür an ihrer bisherigen Stelle aus dem Layout genommen, damit
   * nachrückende Nachrichten sofort ihren Platz einnehmen und die Liste nicht kurz doppelt so hoch wird
   * (die nachrückende Nachricht blendet darunter ein, beide überblenden sich).
   */
  onLeave(event: AnimationCallbackEvent) {
    const element = event.target as HTMLElement;

    if (typeof element.animate !== 'function' || this.prefersReducedMotion()) {
      event.animationComplete();
      return;
    }

    // Erst alle ausblendenden Nachrichten messen, dann gesammelt umstellen. Sonst würde z.B. beim Zuklappen
    // jede Nachricht gemessen, nachdem die vorige schon aus dem Layout genommen wurde, und sie lägen übereinander.
    this.pendingLeaves.push({ event, top: element.offsetTop, left: element.offsetLeft, width: element.offsetWidth });
    if (this.pendingLeaves.length === 1) {
      queueMicrotask(() => this.startLeaveAnimations());
    }
  }

  private startLeaveAnimations() {
    const leaves = this.pendingLeaves;
    this.pendingLeaves = [];

    for (const { event, top, left, width } of leaves) {
      const element = event.target as HTMLElement;
      element.style.position = 'absolute';
      element.style.top = `${top}px`;
      element.style.left = `${left}px`;
      element.style.width = `${width}px`;
      element.style.zIndex = '1';
      element.style.pointerEvents = 'none';

      const animation = element.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: LuxSnackbarContainerComponent.LEAVE_DURATION,
        easing: 'cubic-bezier(0.4, 0, 1, 1)',
        fill: 'forwards'
      });

      const complete = () => event.animationComplete();
      animation.finished.then(complete, complete);
    }
  }

  private prefersReducedMotion(): boolean {
    return typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}
