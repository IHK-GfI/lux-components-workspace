import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxMediaQueryObserverService } from '@ihk-gfi/lux-components';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideLuxTranslocoTesting } from '../../../src/testing/transloco-test.provider';
import { LuxTestHelper } from '../../../test-utils/src/test-utils/lux-test-helper';
import { LuxChatComponent } from './../lux-chat/lux-chat.component';
import { LuxChatPopupComponent } from './lux-chat-popup.component';
import { MockMediaObserverService } from '../../../src/lib/lux-util/testing/mock-media-observer.service';

@Component({
  standalone: true,
  imports: [LuxChatPopupComponent, LuxChatComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <lux-chat-popup>
      <lux-chat></lux-chat>
    </lux-chat-popup>
  `
})
class LuxChatPopupHostComponent {
  @ViewChild(LuxChatPopupComponent) popupComponent!: LuxChatPopupComponent;
  @ViewChild(LuxChatComponent) chatComponent!: LuxChatComponent;
}

describe('LuxChatPopupComponent', () => {
  let fixture: ComponentFixture<LuxChatPopupHostComponent>;
  let hostComponent: LuxChatPopupHostComponent;
  let popupComponent: LuxChatPopupComponent;
  let chatComponent: LuxChatComponent;
  let mediaQueryService: MockMediaObserverService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxChatPopupHostComponent],
      providers: [provideLuxTranslocoTesting(), { provide: LuxMediaQueryObserverService, useClass: MockMediaObserverService }]
    }).compileComponents();

    fixture = TestBed.createComponent(LuxChatPopupHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    popupComponent = hostComponent.popupComponent;
    chatComponent = hostComponent.chatComponent;
    mediaQueryService = TestBed.inject(LuxMediaQueryObserverService) as unknown as MockMediaObserverService;
  });

  it('sollte erstellt werden', () => {
    expect(popupComponent).toBeTruthy();
  });

  // ---------------------------------------------------------------------------
  // onChatIconClicked
  // ---------------------------------------------------------------------------
  describe('onChatIconClicked', () => {
    it('sollte chatOpened ohne Parameter umschalten', () => {
      expect(popupComponent.luxChatOpened()).toBe(false);

      popupComponent.onChatIconClicked();
      expect(popupComponent.luxChatOpened()).toBe(true);

      popupComponent.onChatIconClicked();
      expect(popupComponent.luxChatOpened()).toBe(false);
    });

    it('sollte chatOpened auf den übergebenen Wert setzen', () => {
      popupComponent.onChatIconClicked(true);
      expect(popupComponent.luxChatOpened()).toBe(true);

      popupComponent.onChatIconClicked(false);
      expect(popupComponent.luxChatOpened()).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // Template
  // ---------------------------------------------------------------------------
  describe('Template', () => {
    it('sollte den Chat-Container initial nicht rendern', () => {
      const chatContainer = fixture.debugElement.query(By.css('.lux-chat-popup-inner-container'));
      expect(chatContainer).toBeNull();
    });

    it('sollte den Chat-Container beim Klick auf den Floating-Button anzeigen', () => {
      const floatingButton = fixture.debugElement.query(By.css('.lux-chat-popup-floating-button'));

      floatingButton.triggerEventHandler('click', new Event('click'));
      fixture.detectChanges();

      const chatContainer = fixture.debugElement.query(By.css('.lux-chat-popup-inner-container'));
      expect(chatContainer).not.toBeNull();
    });

    it('sollte die Fullscreen-Klasse setzen, wenn fullScreen=true ist', () => {
      popupComponent.luxChatOpened.set(true);
      popupComponent.mobileView.set(false);
      popupComponent.luxFullScreen.set(true);
      fixture.detectChanges();

      const chatContainer = fixture.debugElement.query(By.css('.lux-chat-popup-inner-container'));
      expect(chatContainer.classes['lux-chat-popup-inner-container-fullscreen']).toBe(true);
    });

    it('sollte die Fullscreen-Klasse setzen, wenn mobileView=true ist', () => {
      popupComponent.luxChatOpened.set(true);
      popupComponent.mobileView.set(true);
      popupComponent.luxFullScreen.set(false);
      fixture.detectChanges();

      const chatContainer = fixture.debugElement.query(By.css('.lux-chat-popup-inner-container'));
      expect(chatContainer.classes['lux-chat-popup-inner-container-fullscreen']).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // Content Child Integration
  // ---------------------------------------------------------------------------
  describe('Content Child Integration', () => {
    it('sollte chatPopupMode für das Chat-Child standardmäßig auf true setzen', async () => {
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      expect(chatComponent.chatPopupMode()).toBe(true);
    });

    it('sollte chatOpened auf false setzen, wenn chatClose emittiert wird', async () => {
      popupComponent.luxChatOpened.set(true);

      chatComponent.chatClose.emit();
      await LuxTestHelper.wait(fixture);

      expect(popupComponent.luxChatOpened()).toBe(false);
    });

    it('sollte fullScreen aktualisieren, wenn chatFullscreen emittiert wird', async () => {
      chatComponent.chatFullscreen.emit(true);
      await LuxTestHelper.wait(fixture);
      expect(popupComponent.luxFullScreen()).toBe(true);

      chatComponent.chatFullscreen.emit(false);
      await LuxTestHelper.wait(fixture);
      expect(popupComponent.luxFullScreen()).toBe(false);
    });

    it('sollte das Fullscreen-Icon im Chat-Header aktualisieren, wenn luxFullScreen von aussen gesetzt wird (OnPush)', async () => {
      popupComponent.luxChatOpened.set(true);
      await LuxTestHelper.wait(fixture);

      popupComponent.luxFullScreen.set(true);
      await LuxTestHelper.wait(fixture);

      expect(chatComponent._chatFullscreen()).toBe(true);
      const fullscreenIcon = fixture.debugElement.query(By.css('.lux-chat-header lux-button mat-icon'));
      expect(fullscreenIcon.nativeElement.getAttribute('data-mat-icon-name')).toBe('lux-interface-arrows-shrink-1');
    });

    it('sollte beim Umschalten des Vollbildmodus keine weiteren Subscriptions auf den Chat anlegen', async () => {
      popupComponent.luxChatOpened.set(true);
      await LuxTestHelper.wait(fixture);

      const closeSubscribeSpy = vi.spyOn(chatComponent.chatClose, 'subscribe');
      const fullscreenSubscribeSpy = vi.spyOn(chatComponent.chatFullscreen, 'subscribe');

      // Jede Umschaltung lässt den Fullscreen-Effect erneut laufen. Die Verdrahtung mit dem Chat darf
      // dabei nicht erneut erfolgen, sonst würden sich die Handler vervielfachen.
      for (let i = 0; i < 3; i++) {
        chatComponent.onFullscreenChatClicked();
        await LuxTestHelper.wait(fixture);
      }

      expect(popupComponent.luxFullScreen()).toBe(true);
      expect(closeSubscribeSpy).not.toHaveBeenCalled();
      expect(fullscreenSubscribeSpy).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Media Query
  // ---------------------------------------------------------------------------
  describe('Media Query', () => {
    it('sollte mobileView initial auf false setzen, wenn activeMediaQuery nicht xs/sm ist', () => {
      expect(popupComponent.mobileView()).toBe(false);
    });

    it('sollte mobileView auf true setzen, wenn xs oder sm emittiert wird', async () => {
      mediaQueryService.emitMediaQuery('xs');
      await LuxTestHelper.wait(fixture);
      expect(popupComponent.mobileView()).toBe(true);

      mediaQueryService.emitMediaQuery('sm');
      await LuxTestHelper.wait(fixture);
      expect(popupComponent.mobileView()).toBe(true);
    });

    it('sollte mobileView auf false setzen, wenn md emittiert wird', async () => {
      mediaQueryService.emitMediaQuery('xs');
      await LuxTestHelper.wait(fixture);
      expect(popupComponent.mobileView()).toBe(true);

      mediaQueryService.emitMediaQuery('md');
      await LuxTestHelper.wait(fixture);
      expect(popupComponent.mobileView()).toBe(false);
    });

    it('sollte die Fullscreen-Klasse im DOM aktualisieren, wenn eine Media-Query-Aenderung von aussen kommt (OnPush-Regression)', async () => {
      popupComponent.luxChatOpened.set(true);
      fixture.detectChanges();

      mediaQueryService.emitMediaQuery('xs');
      await LuxTestHelper.wait(fixture);

      const chatContainer = fixture.debugElement.query(By.css('.lux-chat-popup-inner-container'));
      expect(chatContainer.classes['lux-chat-popup-inner-container-fullscreen']).toBe(true);
    });
  });
});
