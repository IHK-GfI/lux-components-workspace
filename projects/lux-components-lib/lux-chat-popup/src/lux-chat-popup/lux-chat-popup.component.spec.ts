
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LuxMediaQueryObserverService } from '@ihk-gfi/lux-components';
import { LuxChatComponent } from '@ihk-gfi/lux-components/lux-chat';
import { Subject } from 'rxjs';
import { provideLuxTranslocoTesting } from '../../../src/testing/transloco-test.provider';
import { LuxChatPopupComponent } from './lux-chat-popup.component';

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
      providers: [
        provideLuxTranslocoTesting(),
        { provide: LuxMediaQueryObserverService, useClass: MockMediaQueryObserverService }
      ]
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
      expect(popupComponent.luxChatOpened()).toBeFalse();

      popupComponent.onChatIconClicked();
      expect(popupComponent.luxChatOpened()).toBeTrue();

      popupComponent.onChatIconClicked();
      expect(popupComponent.luxChatOpened()).toBeFalse();
    });

    it('sollte chatOpened auf den übergebenen Wert setzen', () => {
      popupComponent.onChatIconClicked(true);
      expect(popupComponent.luxChatOpened()).toBeTrue();

      popupComponent.onChatIconClicked(false);
      expect(popupComponent.luxChatOpened()).toBeFalse();
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
      expect(chatContainer.classes['lux-chat-popup-inner-container-fullscreen']).toBeTrue();
    });

    it('sollte die Fullscreen-Klasse setzen, wenn mobileView=true ist', () => {
      popupComponent.luxChatOpened.set(true);
      popupComponent.mobileView = true;
      popupComponent.luxFullScreen.set(false);
      fixture.detectChanges();

      const chatContainer = fixture.debugElement.query(By.css('.lux-chat-popup-inner-container'));
      expect(chatContainer.classes['lux-chat-popup-inner-container-fullscreen']).toBeTrue();
    });
  });

  // ---------------------------------------------------------------------------
  // Content Child Integration
  // ---------------------------------------------------------------------------
  describe('Content Child Integration', () => {
    it('sollte showFullscreenButton und showCloseButton für das Chat-Child standardmäßig auf true setzen', fakeAsync(() => {
      fixture.detectChanges();
      tick();

      expect(chatComponent.showFullscreenButton()).toBeTrue();
      expect(chatComponent.showCloseButton()).toBeTrue();
    }));

    it('sollte chatOpened auf false setzen, wenn chatClose emittiert wird', fakeAsync(() => {
      popupComponent.luxChatOpened.set(true);

      chatComponent.chatClose.emit();
      tick();

      expect(popupComponent.luxChatOpened()).toBeFalse();
    }));

    it('sollte fullScreen aktualisieren, wenn chatFullscreen emittiert wird', fakeAsync(() => {
      chatComponent.chatFullscreen.emit(true);
      tick();
      expect(popupComponent.luxFullScreen()).toBeTrue();

      chatComponent.chatFullscreen.emit(false);
      tick();
      expect(popupComponent.luxFullScreen()).toBeFalse();
    }));
  });

  // ---------------------------------------------------------------------------
  // Media Query
  // ---------------------------------------------------------------------------
  describe('Media Query', () => {
    it('sollte mobileView initial auf false setzen, wenn activeMediaQuery nicht xs/sm ist', () => {
      expect(popupComponent.mobileView).toBeFalse();
    });

    it('sollte mobileView auf true setzen, wenn xs oder sm emittiert wird', fakeAsync(() => {
      mediaQueryService.emitMediaQuery('xs');
      tick();
      expect(popupComponent.mobileView).toBeTrue();

      mediaQueryService.emitMediaQuery('sm');
      tick();
      expect(popupComponent.mobileView).toBeTrue();
    }));

    it('sollte mobileView auf false setzen, wenn md emittiert wird', fakeAsync(() => {
      mediaQueryService.emitMediaQuery('xs');
      tick();
      expect(popupComponent.mobileView).toBeTrue();

      mediaQueryService.emitMediaQuery('md');
      tick();
      expect(popupComponent.mobileView).toBeFalse();
    }));
  });

  // ---------------------------------------------------------------------------
  // ngOnDestroy
  // ---------------------------------------------------------------------------
  describe('ngOnDestroy', () => {
    it('sollte alle gespeicherten Subscriptions abmelden', () => {
      const unsubscribeSpyA = jasmine.createSpy('unsubscribeA');
      const unsubscribeSpyB = jasmine.createSpy('unsubscribeB');

      popupComponent.subscriptions = [
        { unsubscribe: unsubscribeSpyA },
        { unsubscribe: unsubscribeSpyB }
      ];

      popupComponent.ngOnDestroy();

      expect(unsubscribeSpyA).toHaveBeenCalled();
      expect(unsubscribeSpyB).toHaveBeenCalled();
    });
  });
});
