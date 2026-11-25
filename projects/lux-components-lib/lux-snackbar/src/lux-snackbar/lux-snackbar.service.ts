import { AriaLivePoliteness, LiveAnnouncer } from '@angular/cdk/a11y';
import {
  createGlobalPositionStrategy,
  createNoopScrollStrategy,
  createOverlayRef,
  GlobalPositionStrategy,
  OverlayRef
} from '@angular/cdk/overlay';
import { ComponentPortal, ComponentType } from '@angular/cdk/portal';
import { afterNextRender, DOCUMENT, inject, Injectable, Injector, OnDestroy } from '@angular/core';
import { LuxAppService, LuxSnackbarOpener, LuxSnackbarType } from '@ihk-gfi/lux-components';
import { Subscription } from 'rxjs';
import { LuxSnackbarComponent } from './lux-snackbar-component/lux-snackbar.component';
import { LUX_SNACKBAR_TYPE_DEFAULTS, LuxSnackbarConfig } from './lux-snackbar-config';
import { LuxSnackbarContainerComponent } from './lux-snackbar-container/lux-snackbar-container.component';
import { LUX_SNACKBAR_DATA } from './lux-snackbar-data';
import { LUX_SNACKBAR_LIMITS, LuxSnackbarLimits } from './lux-snackbar-limits';
import { LuxSnackbarRef } from './lux-snackbar-ref';
import { LuxSnackbarStack } from './lux-snackbar-stack';

/**
 * Über den LuxSnackbarService können Snackbar-Nachrichten angezeigt werden.
 *
 * Mehrere Nachrichten werden untereinander angezeigt (neueste oben). Wie viele gleichzeitig sichtbar sind,
 * legen die Limits fest (provideLuxSnackbar() bzw. setLimits(), Default: 1). Weitere Nachrichten werden im
 * Hinweis "und X weitere Nachrichten" zusammengefasst und lassen sich aufklappen.
 */
@Injectable({
  providedIn: 'root'
})
export class LuxSnackbarService implements LuxSnackbarOpener, OnDestroy {
  /** Abstand zum Header bzw. zur rechten Kante des Inhalts (neben dessen Scrollleiste). */
  private static readonly OFFSET = 4;
  /** Platz unterhalb der Liste für den Hinweis "und X weitere" bzw. "Weniger anzeigen" (inkl. Abstand zur Liste). */
  private static readonly MORE_SPACE = 52;

  private readonly injector = inject(Injector);
  private readonly document = inject(DOCUMENT);
  private readonly appService = inject(LuxAppService);
  private readonly liveAnnouncer = inject(LiveAnnouncer);
  private readonly stack = new LuxSnackbarStack();
  private readonly resizeSubscription: Subscription;
  private overlayRef?: OverlayRef;
  private positionStrategy?: GlobalPositionStrategy;
  private nextId = 0;

  constructor() {
    const limits = inject(LUX_SNACKBAR_LIMITS, { optional: true });
    if (limits) {
      this.stack.setLimits(limits);
    }

    this.resizeSubscription = this.appService.resize$.subscribe(() => this.updatePosition());
  }

  ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
    this.stack.destroy();
    this.overlayRef?.dispose();
  }

  /**
   * Öffnet eine Snackbar-Nachricht anhand der übergebenen Konfiguration.
   * @param duration Eine Dauer in Msec (z.B. 2000 = 2 Sekunden). Wenn die Nachricht permanent angezeigt werden soll,
   * muss der Wert 0 angegeben werden.
   * @param config Die Konfiguration der Nachricht (Text, Icon, Action, Farben, Typ).
   * @returns Die Referenz auf die Nachricht (onAction(), afterDismissed(), dismiss()).
   */
  open(duration: number, config?: LuxSnackbarConfig): LuxSnackbarRef {
    const normalized = this.normalizeConfig(config);
    // Ohne Action ließe sich die Nachricht sonst nicht schließen: bei Dauer 0 nie, sonst nicht, solange sie
    // verborgen ist oder die Timer pausieren (Maus/Fokus über der Snackbar, aufgeklappte Liste).
    normalized.showCloseButton ??= !normalized.action;
    const { ref } = this.addMessage(LuxSnackbarComponent, duration, normalized, normalized.type, this.getPanelClasses(normalized));

    if (normalized.text) {
      this.liveAnnouncer.announce(normalized.text, this.getPoliteness(normalized.type));
    }

    return ref;
  }

  /**
   * Öffnet eine Snackbar-Nachricht mit einem Text.
   * @param message Ein Text.
   * @param duration Eine Dauer in Msec (z.B. 2000 = 2 Sekunden). Wenn die Nachricht permanent angezeigt werden soll,
   * muss der Wert 0 angegeben werden.
   * @param actionName Eine Bezeichnung (z.B. Wiederherstellen) für die Action. Dieser Parameter ist optional.
   * @returns Die Referenz auf die Nachricht (onAction(), afterDismissed(), dismiss()).
   */
  openText(message: string, duration: number, actionName?: string): LuxSnackbarRef {
    return this.open(duration, { text: message, action: actionName });
  }

  /**
   * Öffnet eine Snackbar-Nachricht, in der die übergebene Komponente angezeigt wird.
   * Die Komponente erhält die Daten über inject(LUX_SNACKBAR_DATA) und die Referenz über inject(LuxSnackbarRef).
   * @param component Die Komponente, die angezeigt werden soll.
   * @param duration Eine Dauer in Msec (z.B. 2000 = 2 Sekunden). Wenn die Nachricht permanent angezeigt werden soll,
   * muss der Wert 0 angegeben werden.
   * @param data Ein Datenobjekt, das an die Komponente weitergereicht wird.
   * @param type Der Typ der Nachricht (für die Limits pro Typ).
   * @returns Die Referenz auf die Nachricht (onAction(), afterDismissed(), dismiss()).
   */
  openComponent<D = unknown>(component: ComponentType<unknown>, duration = 0, data?: D, type?: LuxSnackbarType): LuxSnackbarRef {
    const { id, ref } = this.addMessage(component, duration, data, type, this.getPanelClasses({ type }));
    this.announceRenderedMessage(id, type);
    return ref;
  }

  /**
   * Schließt alle Snackbar-Nachrichten.
   */
  dismiss() {
    this.stack.dismissAll();
  }

  /**
   * Ändert, wie viele Nachrichten gleichzeitig sichtbar sind.
   * @param limits Die neuen Limits (gesamt und/oder je Typ).
   */
  setLimits(limits: LuxSnackbarLimits) {
    this.stack.setLimits(limits);
  }

  private addMessage(
    component: ComponentType<unknown>,
    duration: number,
    data: unknown,
    type: LuxSnackbarType | undefined,
    panelClasses: string[]
  ) {
    const id = this.nextId++;
    const ref = new LuxSnackbarRef(() => this.removeMessage(id));
    const injector = Injector.create({
      parent: this.injector,
      providers: [
        { provide: LuxSnackbarRef, useValue: ref },
        { provide: LUX_SNACKBAR_DATA, useValue: data }
      ]
    });

    this.ensureOverlay();
    // Auch ohne Resize kann sich die Scrollleiste des Inhalts ändern (z.B. nach Navigation), deshalb neu ausrichten.
    this.updatePosition();
    this.stack.add({ id, ref, type, duration: duration > 0 ? duration : 0, component, injector, panelClasses });
    this.bringToFront();

    return { id, ref };
  }

  private removeMessage(id: number) {
    // Liegt der Fokus in der Nachricht (z.B. auf dem geklickten Ok-Button), verschwindet er mit ihr. Firefox und
    // Safari melden das nicht per focusout, die Timer blieben sonst dauerhaft pausiert.
    if (this.findMessageElement(id)?.contains(this.document.activeElement)) {
      this.stack.setFocused(false);
    }

    this.stack.remove(id);
  }

  /**
   * Sagt den Text einer eigenen Komponente an, sobald sie gerendert ist. Die neueste Nachricht ist immer
   * sichtbar (die Limits behalten die neuesten), ihr Element steht also nach dem Rendern bereit.
   */
  private announceRenderedMessage(id: number, type: LuxSnackbarType | undefined) {
    afterNextRender(
      () => {
        const element = this.findMessageElement(id);
        const text = element ? this.getReadableText(element) : '';
        if (text) {
          this.liveAnnouncer.announce(text, this.getPoliteness(type));
        }
      },
      { injector: this.injector }
    );
  }

  /**
   * Liefert den Text eines Elements so, wie ein Screenreader ihn liest: Texte aus verschiedenen Elementen mit
   * Leerzeichen getrennt (textContent würde z.B. "Text" und "Ok" zu "TextOk" verbinden), ohne aria-hidden-Inhalte.
   */
  private getReadableText(element: Element): string {
    const parts: string[] = [];
    const walker = this.document.createTreeWalker(element, NodeFilter.SHOW_TEXT);

    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (!node.parentElement?.closest('[aria-hidden="true"]')) {
        parts.push(node.textContent ?? '');
      }
    }

    return parts.join(' ').replace(/\s+/g, ' ').trim();
  }

  private findMessageElement(id: number): Element | null | undefined {
    return this.overlayRef?.overlayElement.querySelector(`[data-lux-snackbar-id="${id}"]`);
  }

  private getPoliteness(type: LuxSnackbarType | undefined): AriaLivePoliteness {
    return type === 'error' ? 'assertive' : 'polite';
  }

  private normalizeConfig(config?: LuxSnackbarConfig): LuxSnackbarConfig {
    const normalized = new LuxSnackbarConfig({});

    Object.entries(config ?? {}).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        (normalized as Record<string, unknown>)[key] = typeof value === 'string' ? value.trim() : value;
      }
    });

    // Der Typ kann zur Laufzeit beliebig sein (z.B. aus Backend-Daten); unbekannte Typen haben keine Defaults.
    const defaults = normalized.type ? LUX_SNACKBAR_TYPE_DEFAULTS[normalized.type] : undefined;
    if (defaults) {
      normalized.iconName = normalized.iconName || defaults.iconName;
      normalized.iconColor = normalized.iconColor || defaults.iconColor;
    }

    return normalized;
  }

  private getPanelClasses(config: Pick<LuxSnackbarConfig, 'type' | 'textColor' | 'actionColor' | 'iconColor'>): string[] {
    const panelClasses = ['lux-snackbar'];

    if (config.type) {
      panelClasses.push('lux-snackbar-type-' + config.type);
    }

    if (config.textColor) {
      panelClasses.push('lux-snackbar-color-text-' + config.textColor);
    }

    if (config.actionColor) {
      panelClasses.push('lux-snackbar-color-action-' + config.actionColor);
    }

    if (config.iconColor) {
      panelClasses.push('lux-snackbar-color-icon-' + config.iconColor);
    }

    return panelClasses;
  }

  private ensureOverlay() {
    if (this.overlayRef) {
      return;
    }

    this.positionStrategy = createGlobalPositionStrategy(this.injector);
    this.overlayRef = createOverlayRef(this.injector, {
      positionStrategy: this.positionStrategy,
      scrollStrategy: createNoopScrollStrategy(),
      panelClass: 'lux-snackbar-overlay-pane'
    });

    const containerInjector = Injector.create({
      parent: this.injector,
      providers: [{ provide: LuxSnackbarStack, useValue: this.stack }]
    });
    this.overlayRef.attach(new ComponentPortal(LuxSnackbarContainerComponent, null, containerInjector));
    // Das Overlay bleibt dauerhaft bestehen; nur die Nachrichten und der Hinweis "und X weitere" nehmen Klicks an
    // (pointer-events: auto in lux-snackbar-container), der Rest der Fläche lässt sie zur Seite durch.
    // Erst nach attach() setzen, da attach() pointer-events am Pane zurücksetzt.
    this.overlayRef.overlayElement.style.pointerEvents = 'none';
    this.updatePosition();
  }

  /**
   * Holt die Snackbar vor andere Overlays (z.B. einen danach geöffneten Dialog), wie es die frühere
   * Material-Snackbar durch ein neues Overlay pro Nachricht tat. Liegt der Fokus in der Snackbar, bleibt sie
   * unverändert, da das erneute Anzeigen des Popovers den Fokus entfernen würde.
   */
  private bringToFront() {
    const host = this.overlayRef?.hostElement;
    if (!host || host.contains(this.document.activeElement)) {
      return;
    }

    if (host.hasAttribute('popover')) {
      try {
        host.hidePopover();
        host.showPopover();
      } catch {
        // Popover-API nicht verfügbar
      }
    } else if (host.nextSibling) {
      host.parentNode?.appendChild(host);
    }
  }

  private updatePosition() {
    if (!this.overlayRef || !this.positionStrategy) {
      return;
    }

    // Die Snackbar darf weder den Header noch die Scrollleiste des Inhalts verdecken.
    const top = this.appService.getAppTop() + this.appService.getHeaderHeight() + LuxSnackbarService.OFFSET;
    const right = this.getRightEdgeOffset() + LuxSnackbarService.OFFSET;

    this.positionStrategy.top(top + 'px').right(right + 'px');
    this.overlayRef.updatePosition();

    const bottom = this.getContentBottom() - LuxSnackbarService.OFFSET;
    this.stack.maxListHeight.set(Math.max(120, bottom - top - LuxSnackbarService.MORE_SPACE));
  }

  /**
   * Unterkante der Fläche, die die Snackbar nutzen darf: das Ende von lux-app-content (also oberhalb des Footers),
   * höchstens die Fensterunterkante. Ohne messbares lux-app-content: Fensterunterkante abzüglich Footer.
   */
  private getContentBottom(): number {
    const viewportHeight = this.document.defaultView?.innerHeight ?? 0;
    const contentRect = this.appService.appContentEl?.getBoundingClientRect();

    if (contentRect?.height) {
      return Math.min(viewportHeight, contentRect.bottom);
    }

    return viewportHeight - this.appService.getFooterHeight();
  }

  /**
   * Abstand vom rechten Rand des Overlays bis zur nutzbaren Fläche des Inhalts: alles rechts von lux-app-content
   * plus die Scrollleiste von lux-app-content selbst. Die Scrollleiste des Dokuments liegt ohnehin außerhalb
   * des Overlays.
   */
  private getRightEdgeOffset(): number {
    // Das Overlay ist position: fixed und endet bereits vor der Scrollleiste des Dokuments; gemessen wird deshalb
    // gegen die Breite ohne diese Scrollleiste.
    const documentWidth = this.document.documentElement.clientWidth;
    const contentEl = this.appService.appContentEl;
    const contentRect = contentEl?.getBoundingClientRect();

    // Ohne Layout (Breite 0, z.B. noch nicht gerendert oder das Dokument scrollt selbst) gibt es nichts abzuziehen.
    if (!contentEl || !contentRect?.width || !documentWidth) {
      return 0;
    }

    const outsideContent = documentWidth - contentRect.right;
    const contentScrollbar = contentEl.offsetWidth - contentEl.clientWidth;
    return Math.max(0, outsideContent) + Math.max(0, contentScrollbar);
  }
}
