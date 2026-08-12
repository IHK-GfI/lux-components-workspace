import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslocoService } from '@jsverse/transloco';
import { provideLuxTranslocoTesting } from '../../../src/testing/transloco-test.provider';
import { LuxChatComponent } from './lux-chat.component';
import { LuxChatData } from './lux-chat-data';
import { LuxChatMessageData } from './lux-chat-message-data';

function createMessage(user: string, content: string, time: Date): LuxChatMessageData {
  return new LuxChatMessageData(user, content, time);
}

function addMinutes(date: Date, minutes: number): Date {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

describe('LuxChatComponent', () => {
  let component: LuxChatComponent;
  let fixture: ComponentFixture<LuxChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxChatComponent],
      providers: [provideLuxTranslocoTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(LuxChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('sollte erstellt werden', () => {
    expect(component).toBeTruthy();
  });

  // ---------------------------------------------------------------------------
  // luxChatData
  // ---------------------------------------------------------------------------
  describe('luxChatData', () => {
    it('sollte den Nachrichteninhalt rendern', fakeAsync(() => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);
      luxChatData.messages.push(createMessage('User1', 'Hallo Welt', now));

      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.componentRef.setInput('luxChatUserName', 'User1');
      fixture.detectChanges();
      tick();

      const entries = fixture.debugElement.queryAll(By.css('.lux-chat-entry-card p'));
      expect(entries.length).toBe(1);
      expect(entries[0].nativeElement.textContent.trim()).toBe('Hallo Welt');
    }));

    it('sollte mehrere Nachrichten rendern', fakeAsync(() => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);
      luxChatData.messages.push(createMessage('User1', 'Erste Nachricht', now));
      luxChatData.messages.push(createMessage('User2', 'Zweite Nachricht', addMinutes(now, 1)));
      luxChatData.messages.push(createMessage('User1', 'Dritte Nachricht', addMinutes(now, 2)));

      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.componentRef.setInput('luxChatUserName', 'User1');
      fixture.detectChanges();
      tick();

      const entries = fixture.debugElement.queryAll(By.css('.lux-chat-entry-card p'));
      expect(entries.length).toBe(3);
    }));

    it('sollte _isUser=true für Nachrichten des aktuellen Benutzers setzen', fakeAsync(() => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);
      const msg = createMessage('MaxMustermann', 'Hallo', now);
      luxChatData.messages.push(msg);

      fixture.componentRef.setInput('luxChatUserName', 'MaxMustermann');
      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      tick();

      expect(msg.metadata['_isUser']).toBeTrue();
    }));

    it('sollte _isUser=false für Nachrichten anderer Benutzer setzen', fakeAsync(() => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);
      const msg = createMessage('AndereUser', 'Hallo', now);
      luxChatData.messages.push(msg);

      fixture.componentRef.setInput('luxChatUserName', 'MaxMustermann');
      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      tick();

      expect(msg.metadata['_isUser']).toBeFalse();
    }));

    it('sollte _isUser für Nachrichten setzen, die über addMessage hinzugefügt wurden', fakeAsync(() => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);

      fixture.componentRef.setInput('luxChatUserName', 'User1');
      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      tick();

      const msg = createMessage('User1', 'Neue Nachricht', now);
      luxChatData.addMessage(msg);
      fixture.detectChanges();
      tick();

      expect(msg.metadata['_isUser']).toBeTrue();
    }));

    it('sollte eigene Nachrichten auf der rechten Seite rendern', fakeAsync(() => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);
      luxChatData.messages.push(createMessage('MaxMustermann', 'Eigene Nachricht', now));

      fixture.componentRef.setInput('luxChatUserName', 'MaxMustermann');
      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      tick();

      const container = fixture.debugElement.query(By.css('.lux-chat-entry-container'));
      expect(container.classes['lux-chat-entry-container-right']).toBeTrue();
      expect(container.classes['lux-chat-entry-container-left']).toBeFalsy();
    }));

    it('sollte Nachrichten anderer Benutzer auf der linken Seite rendern', fakeAsync(() => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);
      luxChatData.messages.push(createMessage('AndereUser', 'Fremde Nachricht', now));

      fixture.componentRef.setInput('luxChatUserName', 'MaxMustermann');
      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      tick();

      const container = fixture.debugElement.query(By.css('.lux-chat-entry-container'));
      expect(container.classes['lux-chat-entry-container-left']).toBeTrue();
      expect(container.classes['lux-chat-entry-container-right']).toBeFalsy();
    }));

    it('sollte einen Datumstrenner für Nachrichten von verschiedenen Tagen anzeigen', fakeAsync(() => {
      const today = new Date();
      const yesterday = addDays(today, -1);
      const luxChatData = new LuxChatData('Test', today);
      luxChatData.messages.push(createMessage('User1', 'Gestern', yesterday));
      luxChatData.messages.push(createMessage('User1', 'Heute', today));

      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.componentRef.setInput('luxChatUserName', 'User1');
      fixture.detectChanges();
      tick();

      const dateSplits = fixture.debugElement.queryAll(By.css('.lux-chat-entry-date-split'));
      expect(dateSplits.length).toBe(2);
    }));

    it('sollte keinen doppelten Datumstrenner für Nachrichten desselben Tages anzeigen', fakeAsync(() => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);
      luxChatData.messages.push(createMessage('User1', 'Erste', now));
      luxChatData.messages.push(createMessage('User1', 'Zweite', addMinutes(now, 5)));

      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.componentRef.setInput('luxChatUserName', 'User1');
      fixture.detectChanges();
      tick();

      const dateSplits = fixture.debugElement.queryAll(By.css('.lux-chat-entry-date-split'));
      expect(dateSplits.length).toBe(1);
    }));
  });

  // ---------------------------------------------------------------------------
  // showFullscreenButton / showCloseButton
  // ---------------------------------------------------------------------------
  describe('showFullscreenButton und showCloseButton', () => {
    it('sollte keine Header-Buttons rendern, wenn beide Inputs false sind', fakeAsync(() => {
      fixture.componentRef.setInput('showFullscreenButton', false);
      fixture.componentRef.setInput('showCloseButton', false);
      fixture.detectChanges();
      tick();

      const buttons = fixture.debugElement.queryAll(By.css('.lux-chat-header lux-button'));
      expect(buttons.length).toBe(0);
    }));

    it('sollte nur den Vollbild-Button rendern, wenn showFullscreenButton=true', fakeAsync(() => {
      fixture.componentRef.setInput('showFullscreenButton', true);
      fixture.componentRef.setInput('showCloseButton', false);
      fixture.detectChanges();
      tick();

      const buttons = fixture.debugElement.queryAll(By.css('.lux-chat-header lux-button'));
      expect(buttons.length).toBe(1);
    }));

    it('sollte nur den Schließen-Button rendern, wenn showCloseButton=true', fakeAsync(() => {
      fixture.componentRef.setInput('showFullscreenButton', false);
      fixture.componentRef.setInput('showCloseButton', true);
      fixture.detectChanges();
      tick();

      const buttons = fixture.debugElement.queryAll(By.css('.lux-chat-header lux-button'));
      expect(buttons.length).toBe(1);
    }));

    it('sollte beide Buttons rendern, wenn beide Inputs true sind', fakeAsync(() => {
      fixture.componentRef.setInput('showFullscreenButton', true);
      fixture.componentRef.setInput('showCloseButton', true);
      fixture.detectChanges();
      tick();

      const buttons = fixture.debugElement.queryAll(By.css('.lux-chat-header lux-button'));
      expect(buttons.length).toBe(2);
    }));
  });

  // ---------------------------------------------------------------------------
  // onFullscreenChatClicked
  // ---------------------------------------------------------------------------
  describe('onFullscreenChatClicked', () => {
    it('sollte _chatFullscreen von false auf true umschalten', () => {
      expect(component._chatFullscreen).toBeFalse();
      component.onFullscreenChatClicked();
      expect(component._chatFullscreen).toBeTrue();
    });

    it('sollte _chatFullscreen beim zweiten Aufruf wieder auf false setzen', () => {
      component.onFullscreenChatClicked();
      component.onFullscreenChatClicked();
      expect(component._chatFullscreen).toBeFalse();
    });

    it('sollte chatFullscreen mit dem neuen Wert emittieren', () => {
      const emittedValues: boolean[] = [];
      component.chatFullscreen.subscribe((val: boolean) => emittedValues.push(val));

      component.onFullscreenChatClicked();
      expect(emittedValues).toEqual([true]);

      component.onFullscreenChatClicked();
      expect(emittedValues).toEqual([true, false]);
    });
  });

  // ---------------------------------------------------------------------------
  // onCloseChatClicked
  // ---------------------------------------------------------------------------
  describe('onCloseChatClicked', () => {
    it('sollte chatClose emittieren', () => {
      let emitted = false;
      component.chatClose.subscribe(() => (emitted = true));

      component.onCloseChatClicked();

      expect(emitted).toBeTrue();
    });
  });

  // ---------------------------------------------------------------------------
  // onChatEntered
  // ---------------------------------------------------------------------------
  describe('onChatEntered', () => {
    it('sollte preventDefault auf dem übergebenen Event aufrufen', fakeAsync(() => {
      component.chatInput = 'Test';
      const mockEvent = { preventDefault: jasmine.createSpy('preventDefault') } as unknown as Event;

      component.onChatEntered(mockEvent);
      tick(2);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    }));

    it('sollte luxChatOutput mit dem aktuellen chatInput-Wert emittieren', fakeAsync(() => {
      let emittedValue = '';
      component.luxChatOutput.subscribe((val: string) => (emittedValue = val));
      component.chatInput = 'Meine Nachricht';
      const mockEvent = { preventDefault: jasmine.createSpy() } as unknown as Event;

      component.onChatEntered(mockEvent);
      tick(2);

      expect(emittedValue).toBe('Meine Nachricht');
    }));

    it('sollte chatInput nach dem Senden auf eine leere Zeichenkette zurücksetzen', fakeAsync(() => {
      component.chatInput = 'Zu sendender Text';
      const mockEvent = { preventDefault: jasmine.createSpy() } as unknown as Event;

      component.onChatEntered(mockEvent);
      tick(2);

      expect(component.chatInput).toBe('');
    }));
  });

  // ---------------------------------------------------------------------------
  // isMessageFromUser
  // ---------------------------------------------------------------------------
  describe('isMessageFromUser', () => {
    it('sollte true zurückgeben, wenn die Nachricht vom aktuellen Benutzer stammt', fakeAsync(() => {
      fixture.componentRef.setInput('luxChatUserName', 'User1');
      fixture.detectChanges();
      tick();

      const msg = createMessage('User1', 'hi', new Date());
      expect(component.isMessageFromUser(msg)).toBeTrue();
    }));

    it('sollte false zurückgeben, wenn die Nachricht von einem anderen Benutzer stammt', fakeAsync(() => {
      fixture.componentRef.setInput('luxChatUserName', 'User1');
      fixture.detectChanges();
      tick();

      const msg = createMessage('User2', 'hi', new Date());
      expect(component.isMessageFromUser(msg)).toBeFalse();
    }));
  });

  // ---------------------------------------------------------------------------
  // checkShowDateSplit
  // ---------------------------------------------------------------------------
  describe('checkShowDateSplit', () => {
    it('sollte true für Index 0 (erste Nachricht) zurückgeben', () => {
      const msg = createMessage('User1', 'hi', new Date());
      expect(component.checkShowDateSplit(msg, 0)).toBeTrue();
    });

    it('sollte true zurückgeben, wenn die vorherige Nachricht von einem anderen Tag stammt', fakeAsync(() => {
      const today = new Date();
      const yesterday = addDays(today, -1);
      const luxChatData = new LuxChatData('Test', today);
      luxChatData.messages.push(createMessage('User1', 'Gestern', yesterday));
      luxChatData.messages.push(createMessage('User1', 'Heute', today));

      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      tick();

      const todayMsg = luxChatData.messages[1];
      expect(component.checkShowDateSplit(todayMsg, 1)).toBeTrue();
    }));

    it('sollte false zurückgeben, wenn die vorherige Nachricht vom gleichen Tag stammt', fakeAsync(() => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);
      luxChatData.messages.push(createMessage('User1', 'Erste', now));
      luxChatData.messages.push(createMessage('User1', 'Zweite', addMinutes(now, 5)));

      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      tick();

      const secondMsg = luxChatData.messages[1];
      expect(component.checkShowDateSplit(secondMsg, 1)).toBeFalse();
    }));
  });

  // ---------------------------------------------------------------------------
  // checkShowEntryHeaderTime
  // ---------------------------------------------------------------------------
  describe('checkShowEntryHeaderTime', () => {
    it('sollte true für Index 0 (erste Nachricht) zurückgeben', () => {
      const msg = createMessage('User1', 'hi', new Date());
      expect(component.checkShowEntryHeaderTime(msg, 0)).toBeTrue();
    });

    it('sollte true zurückgeben, wenn der Zeitunterschied größer als 10 Minuten ist', fakeAsync(() => {
      const now = new Date();
      const elevenMinutesLater = addMinutes(now, 11);
      const luxChatData = new LuxChatData('Test', now);
      luxChatData.messages.push(createMessage('User1', 'Erste', now));
      luxChatData.messages.push(createMessage('User1', 'Zweite', elevenMinutesLater));

      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      tick();

      const secondMsg = luxChatData.messages[1];
      expect(component.checkShowEntryHeaderTime(secondMsg, 1)).toBeTrue();
    }));

    it('sollte true zurückgeben, wenn sich der Absender wechselt (innerhalb von 10 Minuten)', fakeAsync(() => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);
      luxChatData.messages.push(createMessage('User1', 'Erste', now));
      luxChatData.messages.push(createMessage('User2', 'Zweite', addMinutes(now, 1)));

      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      tick();

      const secondMsg = luxChatData.messages[1];
      expect(component.checkShowEntryHeaderTime(secondMsg, 1)).toBeTrue();
    }));

    it('sollte false zurückgeben, wenn derselbe Benutzer innerhalb von 10 Minuten schreibt', fakeAsync(() => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);
      luxChatData.messages.push(createMessage('User1', 'Erste', now));
      luxChatData.messages.push(createMessage('User1', 'Zweite', addMinutes(now, 5)));

      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      tick();

      const secondMsg = luxChatData.messages[1];
      expect(component.checkShowEntryHeaderTime(secondMsg, 1)).toBeFalse();
    }));

    it('sollte true zurückgeben, genau an der 10-Minuten-Grenze', fakeAsync(() => {
      const now = new Date();
      const tenMinutesOneMsLater = new Date(now.getTime() + 10 * 60 * 1000 + 1);
      const luxChatData = new LuxChatData('Test', now);
      luxChatData.messages.push(createMessage('User1', 'Erste', now));
      luxChatData.messages.push(createMessage('User1', 'Zweite', tenMinutesOneMsLater));

      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      tick();

      const secondMsg = luxChatData.messages[1];
      expect(component.checkShowEntryHeaderTime(secondMsg, 1)).toBeTrue();
    }));
  });

  // ---------------------------------------------------------------------------
  // locale
  // ---------------------------------------------------------------------------
  describe('locale', () => {
    it('sollte locale auf "en-US" aktualisieren, wenn die Sprache auf "en" wechselt', fakeAsync(() => {
      const translocoService = TestBed.inject(TranslocoService);
      translocoService.setActiveLang('en');
      tick();

      expect(component.locale).toBe('en-US');
    }));

    it('sollte locale auf "fr-FR" aktualisieren, wenn die Sprache auf "fr" wechselt', fakeAsync(() => {
      const translocoService = TestBed.inject(TranslocoService);
      translocoService.setActiveLang('fr');
      tick();

      expect(component.locale).toBe('fr-FR');
    }));
  });
});
