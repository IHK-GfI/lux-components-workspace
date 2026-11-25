import { LiveAnnouncer } from '@angular/cdk/a11y';
import { ChangeDetectionStrategy, Component, effect, inject, Injector, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LUX_SNACKBAR_OPENER, LuxAppService, LuxSnackbarType } from '@ihk-gfi/lux-components';
import { LuxA11yTestHelper } from '@ihk-gfi/lux-components/test-utils';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { provideLuxTranslocoTesting } from '../../../src/testing/transloco-test.provider';
import { LUX_SNACKBAR_DATA } from './lux-snackbar-data';
import { provideLuxSnackbar } from './lux-snackbar.provider';
import { LuxSnackbarRef } from './lux-snackbar-ref';
import { LuxSnackbarService } from './lux-snackbar.service';
import { LuxSnackbarMessage, LuxSnackbarStack } from './lux-snackbar-stack';

describe('LuxSnackbarService', () => {
  let service: LuxSnackbarService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [provideLuxTranslocoTesting()]
    });
    service = TestBed.inject(LuxSnackbarService);
  });

  afterEach(async () => {
    if (vi.isFakeTimers()) {
      await vi.runAllTimersAsync();
    }
    vi.useRealTimers();
  });

  describe('Limits', () => {
    it('Sollte standardmäßig nur die neueste Nachricht anzeigen und die übrigen zusammenfassen', async () => {
      service.openText('A', 0);
      service.openText('B', 0);
      service.openText('C', 0);
      await render();

      expect(texts()).toEqual(['C']);
      expect(moreButton()?.textContent?.trim()).toEqual('und 2 weitere Nachrichten');
    });

    it('Sollte maxVisible berücksichtigen', async () => {
      service.setLimits({ maxVisible: 2 });
      service.openText('A', 0);
      service.openText('B', 0);
      service.openText('C', 0);
      await render();

      expect(texts()).toEqual(['C', 'B']);
      expect(moreButton()?.textContent?.trim()).toEqual('und 1 weitere Nachricht');
    });

    it('Sollte keinen Hinweis anzeigen, wenn alle Nachrichten sichtbar sind', async () => {
      service.setLimits({ maxVisible: 3 });
      service.openText('A', 0);
      service.openText('B', 0);
      await render();

      expect(texts()).toEqual(['B', 'A']);
      expect(moreButton()).toBeNull();
    });

    it('Sollte Limits je Typ berücksichtigen', async () => {
      service.setLimits({ maxVisiblePerType: { info: 2, error: 1 } });
      service.open(0, { text: 'Info 1', type: 'info' });
      service.open(0, { text: 'Fehler 1', type: 'error' });
      service.open(0, { text: 'Info 2', type: 'info' });
      service.open(0, { text: 'Erfolg 1', type: 'success' });
      service.open(0, { text: 'Info 3', type: 'info' });
      service.open(0, { text: 'Fehler 2', type: 'error' });
      service.open(0, { text: 'Erfolg 2', type: 'success' });
      await render();

      // Neueste zuerst; success hat kein eigenes Limit und nutzt maxVisible (Default 1).
      expect(texts()).toEqual(['Erfolg 2', 'Fehler 2', 'Info 3', 'Info 2']);
      expect(moreButton()?.textContent?.trim()).toEqual('und 3 weitere Nachrichten');
    });

    it('Sollte setLimits() aus einem effect() aufrufen lassen, ohne den effect erneut auszulösen', async () => {
      service.openText('A', 0);
      service.openText('B', 0);
      const maxVisible = signal(1);
      let runs = 0;

      TestBed.runInInjectionContext(() =>
        effect(() => {
          runs++;
          service.setLimits({ maxVisible: maxVisible() });
        })
      );
      await render();
      expect(runs).toBe(1);

      maxVisible.set(2);
      await render();
      expect(runs).toBe(2);
      expect(texts()).toEqual(['B', 'A']);
    });

    it('Sollte Limits kleiner als 1 als 1 behandeln', () => {
      const messages = [createMessage(1), createMessage(2), createMessage(3)];

      expect(LuxSnackbarStack.applyLimits(messages, { maxVisible: 0 }).length).toBe(1);
      expect(LuxSnackbarStack.applyLimits(messages, { maxVisible: -5 }).length).toBe(1);
      expect(LuxSnackbarStack.applyLimits(messages, { maxVisible: 2.7 }).length).toBe(2);
      expect(LuxSnackbarStack.applyLimits(messages, { maxVisiblePerType: { info: 0 } }).length).toBe(1);
    });

    it('Sollte Limits aus provideLuxSnackbar() übernehmen und LUX_SNACKBAR_OPENER belegen', async () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [provideLuxTranslocoTesting(), provideLuxSnackbar({ maxVisible: 2 })]
      });
      service = TestBed.inject(LuxSnackbarService);

      expect(TestBed.inject(LUX_SNACKBAR_OPENER)).toBe(service);

      TestBed.inject(LUX_SNACKBAR_OPENER).open(0, { text: 'A' });
      service.openText('B', 0);
      service.openText('C', 0);
      await render();

      expect(texts()).toEqual(['C', 'B']);
    });
  });

  describe('Aufklappen', () => {
    it('Sollte alle Nachrichten aufklappen und wieder zuklappen', async () => {
      service.openText('A', 0);
      service.openText('B', 0);
      service.openText('C', 0);
      await render();

      const button = moreButton() as HTMLButtonElement;
      expect(button.getAttribute('aria-expanded')).toEqual('false');
      expect(button.getAttribute('aria-controls')).toEqual(document.querySelector('.lux-snackbar-list')?.id);

      button.click();
      await render();

      expect(texts()).toEqual(['C', 'B', 'A']);
      expect(moreButton()?.textContent?.trim()).toEqual('Weniger anzeigen');
      expect(moreButton()?.getAttribute('aria-expanded')).toEqual('true');
      expect(document.querySelector('.lux-snackbar-list')?.classList).toContain('lux-snackbar-list-expanded');

      moreButton()?.click();
      await render();

      expect(texts()).toEqual(['C']);
      expect(moreButton()?.textContent?.trim()).toEqual('und 2 weitere Nachrichten');
    });

    it('Sollte nachrückende Nachrichten als "nachträglich sichtbar" kennzeichnen, neue nicht', () => {
      // Steuert die Einblend-Animation: nachrückende Nachrichten blenden nur ein (lux-snackbar--reveal),
      // neue springen herein (lux-snackbar--enter). jsdom spielt keine CSS-Animationen ab, deshalb am Stack geprüft.
      const stack = new LuxSnackbarStack();
      stack.add(createMessage(1));
      stack.add(createMessage(2));
      expect(stack.isRevealed(2)).toBe(false);

      stack.remove(2);
      expect(stack.isRevealed(1)).toBe(true);

      stack.add(createMessage(3));
      expect(stack.isRevealed(3)).toBe(false);

      stack.add(createMessage(4));
      stack.toggleExpanded();
      expect(stack.isRevealed(4)).toBe(false);
      expect(stack.isRevealed(3)).toBe(true);
      stack.destroy();
    });

    it('Sollte automatisch zuklappen, wenn keine Nachricht mehr verborgen ist', async () => {
      service.openText('A', 0);
      const refB = service.openText('B', 0);
      await render();

      moreButton()?.click();
      await render();
      expect(texts()).toEqual(['B', 'A']);

      refB.dismiss();
      await render();

      expect(texts()).toEqual(['A']);
      expect(moreButton()).toBeNull();

      service.openText('C', 0);
      await render();
      expect(texts()).toEqual(['C']);
    });
  });

  describe('Anzeigedauer', () => {
    it('Sollte eine Nachricht nach ihrer Dauer schließen', async () => {
      service.openText('A', 1000);
      await render();

      await vi.advanceTimersByTimeAsync(999);
      await render();
      expect(texts()).toEqual(['A']);

      await vi.advanceTimersByTimeAsync(1);
      await render();
      expect(texts()).toEqual([]);
    });

    it('Sollte eine Nachricht mit Dauer 0 stehen lassen', async () => {
      service.openText('A', 0);
      await render();

      await vi.advanceTimersByTimeAsync(60000);
      await render();
      expect(texts()).toEqual(['A']);
    });

    it('Sollte den Timer erst starten, wenn die Nachricht sichtbar ist', async () => {
      service.openText('A', 1000);
      await vi.advanceTimersByTimeAsync(400);
      service.openText('B', 1000);
      await render();
      expect(texts()).toEqual(['B']);

      // B läuft ab, A war 600ms verborgen und hat noch 600ms Restzeit.
      await vi.advanceTimersByTimeAsync(1000);
      await render();
      expect(texts()).toEqual(['A']);

      await vi.advanceTimersByTimeAsync(599);
      await render();
      expect(texts()).toEqual(['A']);

      await vi.advanceTimersByTimeAsync(1);
      await render();
      expect(texts()).toEqual([]);
    });

    it('Sollte die Timer pausieren, solange die Maus über der Snackbar ist', async () => {
      service.openText('A', 1000);
      await render();
      await vi.advanceTimersByTimeAsync(500);

      container().dispatchEvent(new MouseEvent('mouseenter'));
      await vi.advanceTimersByTimeAsync(5000);
      await render();
      expect(texts()).toEqual(['A']);

      container().dispatchEvent(new MouseEvent('mouseleave'));
      await vi.advanceTimersByTimeAsync(499);
      await render();
      expect(texts()).toEqual(['A']);

      await vi.advanceTimersByTimeAsync(1);
      await render();
      expect(texts()).toEqual([]);
    });

    it('Sollte die Timer pausieren, solange die Liste aufgeklappt ist', async () => {
      service.openText('A', 1000);
      service.openText('B', 1000);
      await render();

      moreButton()?.click();
      await render();
      await vi.advanceTimersByTimeAsync(5000);
      await render();
      expect(texts()).toEqual(['B', 'A']);

      moreButton()?.click();
      await render();
      await vi.advanceTimersByTimeAsync(1000);
      await render();
      expect(texts()).toEqual(['A']);
    });

    it('Sollte neue Timer nicht pausieren, wenn die letzte Nachricht unter der Maus verschwindet', async () => {
      service.openText('A', 0);
      await render();
      container().dispatchEvent(new MouseEvent('mouseenter'));

      (document.querySelector('.lux-snackbar-close') as HTMLButtonElement).click();
      await render();
      expect(texts()).toEqual([]);

      // Ohne Mausbewegung kommt kein mouseleave.
      service.openText('B', 1000);
      await render();
      await vi.advanceTimersByTimeAsync(1000);
      await render();
      expect(texts()).toEqual([]);
    });

    it('Sollte die Timer fortsetzen, wenn die fokussierte Nachricht geschlossen wird', async () => {
      // Firefox und Safari (wie jsdom) feuern beim Entfernen des fokussierten Buttons kein focusout.
      // In TestBed sind Animationen aus: Der Weg muss auch ohne (animate.leave) funktionieren.
      service.openText('A', 1000);
      service.openText('B', 0);
      await render();

      const closeButton = document.querySelector('.lux-snackbar-close') as HTMLButtonElement;
      closeButton.focus();
      closeButton.click();
      await render();
      expect(texts()).toEqual(['A']);

      await vi.advanceTimersByTimeAsync(1000);
      await render();
      expect(texts()).toEqual([]);
    });
  });

  describe('Referenz', () => {
    it('Sollte afterDismissed() beim Schließen über die Ref benachrichtigen', async () => {
      const ref = service.openText('A', 0, 'Ok');
      const dismissSpy = vi.fn();
      const actionSpy = vi.fn();
      ref.afterDismissed().subscribe(dismissSpy);
      ref.onAction().subscribe(actionSpy);
      await render();

      ref.dismiss();
      ref.dismiss();
      await render();

      expect(dismissSpy).toHaveBeenCalledTimes(1);
      expect(dismissSpy).toHaveBeenCalledWith({ dismissedByAction: false });
      expect(actionSpy).not.toHaveBeenCalled();
      expect(texts()).toEqual([]);
    });

    it('Sollte afterDismissed() nach Ablauf der Dauer benachrichtigen', async () => {
      const ref = service.openText('A', 1000);
      const dismissSpy = vi.fn();
      ref.afterDismissed().subscribe(dismissSpy);

      await vi.advanceTimersByTimeAsync(1000);

      expect(dismissSpy).toHaveBeenCalledWith({ dismissedByAction: false });
    });

    it('Sollte mit dismiss() alle Nachrichten schließen', async () => {
      const refs = [service.openText('A', 0), service.openText('B', 0), service.openText('C', 0)];
      const dismissSpies = refs.map((ref) => {
        const spy = vi.fn();
        ref.afterDismissed().subscribe(spy);
        return spy;
      });
      await render();

      service.dismiss();
      await render();

      dismissSpies.forEach((spy) => expect(spy).toHaveBeenCalledTimes(1));
      expect(texts()).toEqual([]);
      expect(moreButton()).toBeNull();
    });
  });

  describe('Barrierefreiheit', () => {
    it('Sollte Text-Nachrichten per LiveAnnouncer ansagen', async () => {
      const announceSpy = vi.spyOn(TestBed.inject(LiveAnnouncer), 'announce');

      service.open(0, { text: 'Hinweis', type: 'info' });
      service.open(0, { text: 'Fehler', type: 'error' });
      service.openText('Ohne Typ', 0);

      expect(announceSpy).toHaveBeenCalledWith('Hinweis', 'polite');
      expect(announceSpy).toHaveBeenCalledWith('Fehler', 'assertive');
      expect(announceSpy).toHaveBeenCalledWith('Ohne Typ', 'polite');
    });

    it('Sollte eigene Komponenten nach dem Rendern ansagen', async () => {
      const announceSpy = vi.spyOn(TestBed.inject(LiveAnnouncer), 'announce');

      service.openComponent(MockSnackbarContentComponent, 0, { text: 'Upload fehlgeschlagen' }, 'error');
      await render();

      expect(announceSpy).toHaveBeenCalledWith('Upload fehlgeschlagen Schließen', 'assertive');
    });

    describe('axe', () => {
      beforeAll(() => LuxA11yTestHelper.addA11yMatchers());

      it('Sollte eine Nachricht mit Icon und Action ohne Verstöße darstellen', async () => {
        service.open(0, { text: 'Der Antrag wurde gespeichert.', type: 'success', action: 'Rückgängig' });
        await render();

        expect(document.querySelector('.lux-snackbar-icon')).not.toBeNull();
        await LuxA11yTestHelper.expectNoA11yViolations(container());
      });

      it('Sollte den Hinweis "und X weitere" ohne Verstöße darstellen', async () => {
        service.open(0, { text: 'Es sind neue Informationen verfügbar.', type: 'info' });
        service.open(0, { text: 'Die Datei konnte nicht hochgeladen werden.', type: 'error', action: 'Ok' });
        await render();

        expect(moreButton()?.getAttribute('aria-expanded')).toEqual('false');
        await LuxA11yTestHelper.expectNoA11yViolations(container());
      });

      it('Sollte die aufgeklappte Liste ohne Verstöße darstellen', async () => {
        service.open(0, { text: 'Es sind neue Informationen verfügbar.', type: 'info' });
        service.open(0, { text: 'Die Datei konnte nicht hochgeladen werden.', type: 'error', action: 'Ok' });
        await render();
        moreButton()?.click();
        await render();

        expect(texts().length).toBe(2);
        expect(moreButton()?.getAttribute('aria-expanded')).toEqual('true');
        await LuxA11yTestHelper.expectNoA11yViolations(container());
      });
    });

    it('Sollte die Nachrichten als benannte Region ausweisen', async () => {
      await render();
      service.openText('A', 0);
      await render();

      expect(container().getAttribute('role')).toEqual('region');
      expect(container().getAttribute('aria-label')).toEqual('Benachrichtigungen');

      service.dismiss();
      await render();

      expect(container().getAttribute('role')).toBeNull();
    });
  });

  describe('Ok-Button zum Schließen', () => {
    it('Sollte ohne Action automatisch angezeigt werden', async () => {
      const ref = service.openText('A', 0);
      const dismissSpy = vi.fn();
      ref.afterDismissed().subscribe(dismissSpy);
      await render();

      const closeButton = document.querySelector('.lux-snackbar-close') as HTMLButtonElement;
      expect(closeButton).not.toBeNull();
      expect(closeButton.textContent?.trim()).toEqual('Ok');

      closeButton.click();
      await render();

      expect(dismissSpy).toHaveBeenCalledWith({ dismissedByAction: false });
      expect(texts()).toEqual([]);
    });

    it('Sollte auch bei Nachrichten mit Anzeigedauer ohne Action angezeigt werden', async () => {
      // Sonst ließe sich die Nachricht nicht schließen, solange die Timer pausieren (z.B. aufgeklappte Liste).
      service.openText('Mit Dauer', 1000);
      await render();

      expect(document.querySelector('.lux-snackbar-close')).not.toBeNull();
    });

    it('Sollte mit Action nicht automatisch angezeigt werden', async () => {
      service.setLimits({ maxVisible: 2 });
      service.openText('Mit Action', 0, 'Ok');
      service.openText('Mit Action und Dauer', 1000, 'Ok');
      await render();

      expect(texts()).toEqual(['Mit Action und Dauer', 'Mit Action']);
      expect(document.querySelector('.lux-snackbar-close')).toBeNull();
    });

    it('Sollte sich über showCloseButton erzwingen und abschalten lassen', async () => {
      service.setLimits({ maxVisible: 2 });
      service.open(1000, { text: 'Erzwungen', action: 'Ok', showCloseButton: true });
      service.open(1000, { text: 'Abgeschaltet', showCloseButton: false });
      await render();

      const closeButtons = document.querySelectorAll('.lux-snackbar-close');
      expect(closeButtons.length).toBe(1);
      expect(closeButtons[0].closest('.lux-snackbar')?.querySelector('.lux-snackbar-text')?.textContent?.trim()).toEqual('Erzwungen');
    });
  });

  describe('openComponent', () => {
    it('Sollte Daten und Ref an die Komponente weitergeben', async () => {
      const ref = service.openComponent(MockSnackbarContentComponent, 0, { text: 'Eigener Inhalt' }, 'warning');
      const dismissSpy = vi.fn();
      ref.afterDismissed().subscribe(dismissSpy);
      await render();

      const contentEl = document.querySelector('.mock-snackbar-content') as HTMLElement;
      expect(contentEl.querySelector('.mock-snackbar-text')?.textContent).toEqual('Eigener Inhalt');
      expect(contentEl.closest('.lux-snackbar')?.classList).toContain('lux-snackbar-type-warning');

      (contentEl.querySelector('button') as HTMLButtonElement).click();
      await render();

      expect(dismissSpy).toHaveBeenCalledWith({ dismissedByAction: true });
      expect(document.querySelector('.mock-snackbar-content')).toBeNull();
    });
  });

  describe('Unbekannter Typ', () => {
    it('Sollte die Nachricht ohne Typ-Defaults anzeigen', async () => {
      service.open(0, { text: 'Unbekannt', type: 'danger' as LuxSnackbarType });
      await render();

      expect(texts()).toEqual(['Unbekannt']);
      expect(document.querySelector('.lux-snackbar-icon')).toBeNull();
    });
  });

  describe('Klickfläche', () => {
    it('Sollte Klicks außerhalb der Nachrichten zur Seite durchlassen', async () => {
      service.openText('A', 0);
      await render();

      const pane = document.querySelector('.lux-snackbar-overlay-pane') as HTMLElement;
      const list = document.querySelector('.lux-snackbar-list') as HTMLElement;
      expect(pane.style.pointerEvents).toEqual('none');
      expect(list.classList).not.toContain('lux-snackbar-list-empty');

      service.dismiss();
      await render();

      expect(list.classList).toContain('lux-snackbar-list-empty');
    });
  });

  describe('Position', () => {
    it('Sollte die Snackbar unterhalb des Headers positionieren', async () => {
      const appService = TestBed.inject(LuxAppService);
      vi.spyOn(appService, 'getAppTop').mockReturnValue(10);
      vi.spyOn(appService, 'getHeaderHeight').mockReturnValue(64);

      service.openText('A', 0);
      await render();

      const pane = document.querySelector('.lux-snackbar-overlay-pane') as HTMLElement;
      expect(pane.style.marginTop).toEqual('78px');
      expect(pane.style.marginRight).toEqual('4px');

      vi.spyOn(appService, 'getHeaderHeight').mockReturnValue(100);
      appService.onResize();
      await render();

      expect(pane.style.marginTop).toEqual('114px');
    });

    it('Sollte die Liste oberhalb des Footers enden lassen', async () => {
      const appService = TestBed.inject(LuxAppService);
      vi.spyOn(appService, 'getAppTop').mockReturnValue(10);
      vi.spyOn(appService, 'getHeaderHeight').mockReturnValue(64);
      const contentEl = document.createElement('div');
      // lux-app-content endet bei 600px, darunter liegt der Footer.
      vi.spyOn(contentEl, 'getBoundingClientRect').mockReturnValue({ bottom: 600, height: 526 } as DOMRect);
      appService.appContentEl = contentEl;

      service.openText('A', 0);
      await render();

      // 600 - 4 (Abstand) - 78 (Oberkante der Liste) - 52 (Platz für "Weniger anzeigen")
      expect((document.querySelector('.lux-snackbar-list') as HTMLElement).style.maxHeight).toEqual('466px');
      appService.appContentEl = undefined;
    });

    it('Sollte ohne lux-app-content den Footer vom Fenster abziehen', async () => {
      const appService = TestBed.inject(LuxAppService);
      vi.spyOn(appService, 'getAppTop').mockReturnValue(10);
      vi.spyOn(appService, 'getHeaderHeight').mockReturnValue(64);
      vi.spyOn(appService, 'getFooterHeight').mockReturnValue(60);

      service.openText('A', 0);
      await render();

      const expected = window.innerHeight - 60 - 4 - 78 - 52;
      expect((document.querySelector('.lux-snackbar-list') as HTMLElement).style.maxHeight).toEqual(expected + 'px');
    });

    it('Sollte die Scrollleiste des Inhalts nicht überdecken', async () => {
      const appService = TestBed.inject(LuxAppService);
      const contentEl = document.createElement('div');
      // Inhalt endet 20px vor dem rechten Rand des Dokuments und hat selbst
      // eine 15px breite Scrollleiste (offsetWidth - clientWidth).
      Object.defineProperty(document.documentElement, 'clientWidth', { value: 1000, configurable: true });
      vi.spyOn(contentEl, 'getBoundingClientRect').mockReturnValue({ right: 980, width: 500 } as DOMRect);
      Object.defineProperty(contentEl, 'offsetWidth', { value: 500, configurable: true });
      Object.defineProperty(contentEl, 'clientWidth', { value: 485, configurable: true });
      appService.appContentEl = contentEl;

      service.openText('A', 0);
      await render();

      const pane = document.querySelector('.lux-snackbar-overlay-pane') as HTMLElement;
      expect(pane.style.marginRight).toEqual('39px');

      // Die Scrollleiste verschwindet (z.B. kürzerer Inhalt): Die nächste Nachricht richtet sich neu aus.
      Object.defineProperty(contentEl, 'clientWidth', { value: 500, configurable: true });
      service.openText('B', 0);
      await render();

      expect(pane.style.marginRight).toEqual('24px');
      appService.appContentEl = undefined;
      delete (document.documentElement as unknown as Record<string, unknown>)['clientWidth'];
    });
  });
});

@Component({
  template: `
    <div class="mock-snackbar-content">
      <span class="mock-snackbar-text">{{ data.text }}</span>
      <button type="button" (click)="ref.dismissWithAction()">Schließen</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
class MockSnackbarContentComponent {
  readonly data = inject<{ text: string }>(LUX_SNACKBAR_DATA);
  readonly ref = inject(LuxSnackbarRef);
}

async function render() {
  TestBed.tick();
  await Promise.resolve();
  TestBed.tick();
}

function container(): HTMLElement {
  return document.querySelector('.lux-snackbar-container') as HTMLElement;
}

function texts(): string[] {
  return Array.from(document.querySelectorAll('.lux-snackbar-list .lux-snackbar-text')).map((el) => el.textContent?.trim() ?? '');
}

function moreButton(): HTMLButtonElement | null {
  return document.querySelector('.lux-snackbar-more-button');
}

function createMessage(id: number): LuxSnackbarMessage {
  return {
    id,
    ref: new LuxSnackbarRef(() => {}),
    type: 'info',
    duration: 0,
    component: MockSnackbarContentComponent,
    injector: Injector.NULL,
    panelClasses: []
  };
}
