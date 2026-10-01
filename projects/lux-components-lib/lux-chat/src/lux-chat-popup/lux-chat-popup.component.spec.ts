import { describe, it, beforeEach, expect } from 'vitest';
import { Component, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxMediaQueryObserverService } from '@ihk-gfi/lux-components';
import { LuxChatComponent } from './../lux-chat/lux-chat.component';
import { Subject } from 'rxjs';
import { provideLuxTranslocoTesting } from '../../../src/testing/transloco-test.provider';
import { LuxChatPopupComponent } from './lux-chat-popup.component';
import { LuxTestHelper } from '../../../test-utils/src/test-utils/lux-test-helper';

class MockMediaQueryObserverService {
  public activeMediaQuery = 'lg';
  private mediaQueryChangedSubject = new Subject<string>();

  public getMediaQueryChangedAsObservable() {
    return this.mediaQueryChangedSubject.asObservable();
  }

  public emitMediaQuery(query: string) {
    this.mediaQueryChangedSubject.next(query);
  }
}

@Component({
  standalone: true,
  imports: [LuxChatPopupComponent, LuxChatComponent],
  // eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection -- TODO: Test-Host der aus develop übernommenen Komponente, Umstellung auf OnPush folgt separat
  changeDetection: ChangeDetectionStrategy.Eager,
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
  let mediaQueryService: MockMediaQueryObserverService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxChatPopupHostComponent],
      providers: [provideLuxTranslocoTesting(), { provide: LuxMediaQueryObserverService, useClass: MockMediaQueryObserverService }]
    }).compileComponents();

    fixture = TestBed.createComponent(LuxChatPopupHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();

    popupComponent = hostComponent.popupComponent;
    chatComponent = hostComponent.chatComponent;
    mediaQueryService = TestBed.inject(LuxMediaQueryObserverService) as unknown as MockMediaQueryObserverService;
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
      popupComponent.mobileView = false;
      popupComponent.luxFullScreen.set(true);
      fixture.detectChanges();

      const chatContainer = fixture.debugElement.query(By.css('.lux-chat-popup-inner-container'));
      expect(chatContainer.classes['lux-chat-popup-inner-container-fullscreen']).toBe(true);
    });

    it('sollte die Fullscreen-Klasse setzen, wenn mobileView=true ist', () => {
      popupComponent.luxChatOpened.set(true);
      popupComponent.mobileView = true;
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
  });

  // ---------------------------------------------------------------------------
  // Media Query
  // ---------------------------------------------------------------------------
  describe('Media Query', () => {
    it('sollte mobileView initial auf false setzen, wenn activeMediaQuery nicht xs/sm ist', () => {
      expect(popupComponent.mobileView).toBe(false);
    });

    it('sollte mobileView auf true setzen, wenn xs oder sm emittiert wird', async () => {
      mediaQueryService.emitMediaQuery('xs');
      await LuxTestHelper.wait(fixture);
      expect(popupComponent.mobileView).toBe(true);

      mediaQueryService.emitMediaQuery('sm');
      await LuxTestHelper.wait(fixture);
      expect(popupComponent.mobileView).toBe(true);
    });

    it('sollte mobileView auf false setzen, wenn md emittiert wird', async () => {
      mediaQueryService.emitMediaQuery('xs');
      await LuxTestHelper.wait(fixture);
      expect(popupComponent.mobileView).toBe(true);

      mediaQueryService.emitMediaQuery('md');
      await LuxTestHelper.wait(fixture);
      expect(popupComponent.mobileView).toBe(false);
    });
  });
});
