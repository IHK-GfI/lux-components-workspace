import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslocoService } from '@jsverse/transloco';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { provideLuxTranslocoTesting } from '../../../src/testing/transloco-test.provider';
import { LuxTestHelper } from '../../../test-utils/src/test-utils/lux-test-helper';
import { LuxChatData } from './lux-chat-data';
import { LuxChatMessageData } from './lux-chat-message-data';
import { LuxChatComponent } from './lux-chat.component';

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
    it('sollte den Nachrichteninhalt rendern', async () => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);
      luxChatData.messages.push(createMessage('User1', 'Hallo Welt', now));

      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.componentRef.setInput('luxChatUserName', 'User1');
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      const entries = fixture.debugElement.queryAll(By.css('.lux-chat-entry-card p'));
      expect(entries.length).toBe(1);
      expect(entries[0].nativeElement.textContent.trim()).toBe('Hallo Welt');
    });

    it('sollte mehrere Nachrichten rendern', async () => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);
      luxChatData.messages.push(createMessage('User1', 'Erste Nachricht', now));
      luxChatData.messages.push(createMessage('User2', 'Zweite Nachricht', addMinutes(now, 1)));
      luxChatData.messages.push(createMessage('User1', 'Dritte Nachricht', addMinutes(now, 2)));

      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.componentRef.setInput('luxChatUserName', 'User1');
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      const entries = fixture.debugElement.queryAll(By.css('.lux-chat-entry-card p'));
      expect(entries.length).toBe(3);
    });

    it('sollte _isUser=true für Nachrichten des aktuellen Benutzers setzen', async () => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);
      const msg = createMessage('MaxMustermann', 'Hallo', now);
      luxChatData.messages.push(msg);

      fixture.componentRef.setInput('luxChatUserName', 'MaxMustermann');
      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      expect(msg.metadata['_isUser']).toBe(true);
    });

    it('sollte _isUser=false für Nachrichten anderer Benutzer setzen', async () => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);
      const msg = createMessage('AndereUser', 'Hallo', now);
      luxChatData.messages.push(msg);

      fixture.componentRef.setInput('luxChatUserName', 'MaxMustermann');
      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      expect(msg.metadata['_isUser']).toBe(false);
    });

    it('sollte _isUser für Nachrichten setzen, die über addMessage hinzugefügt wurden', async () => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);

      fixture.componentRef.setInput('luxChatUserName', 'User1');
      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      const msg = createMessage('User1', 'Neue Nachricht', now);
      luxChatData.addMessage(msg);
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      expect(msg.metadata['_isUser']).toBe(true);
    });

    it('sollte eine über addMessage hinzugefügte Nachricht im DOM rendern (OnPush-Regression)', async () => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);
      luxChatData.messages.push(createMessage('User1', 'Erste Nachricht', now));

      fixture.componentRef.setInput('luxChatUserName', 'User1');
      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      luxChatData.addMessage(createMessage('User2', 'Nachricht von aussen', addMinutes(now, 1)));
      fixture.detectChanges();

      const entries = fixture.debugElement.queryAll(By.css('.lux-chat-entry-card p'));
      expect(entries.length).toBe(2);
      expect(entries[1].nativeElement.textContent.trim()).toBe('Nachricht von aussen');
    });

    it('sollte einen geänderten Titel derselben LuxChatData-Instanz im Header rendern (OnPush)', async () => {
      const luxChatData = new LuxChatData('Alt', new Date());

      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      luxChatData.title = 'Neu';
      await LuxTestHelper.wait(fixture);

      const title = fixture.debugElement.query(By.css('.lux-chat-header-title-text'));
      expect(title.nativeElement.textContent.trim()).toBe('Neu');
    });

    it('sollte ein neu zugewiesenes messages-Array derselben LuxChatData-Instanz rendern (OnPush)', async () => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);

      fixture.componentRef.setInput('luxChatUserName', 'User1');
      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      const msg = createMessage('User1', 'Zugewiesen', now);
      luxChatData.messages = [msg];
      await LuxTestHelper.wait(fixture);

      const entries = fixture.debugElement.queryAll(By.css('.lux-chat-entry-card p'));
      expect(entries.length).toBe(1);
      expect(entries[0].nativeElement.textContent.trim()).toBe('Zugewiesen');
      expect(msg.metadata['_isUser']).toBe(true);
    });

    it('sollte bei JSON.stringify title, createdAt, messages und metadata ausgeben', () => {
      const createdAt = new Date('2026-01-01T10:00:00.000Z');
      const luxChatData = new LuxChatData('Test', createdAt, [createMessage('User1', 'Hallo', createdAt)]);
      luxChatData.metadata = { id: 4711 };

      const json = JSON.parse(JSON.stringify(luxChatData));

      expect(json.title).toBe('Test');
      expect(json.createdAt).toBe('2026-01-01T10:00:00.000Z');
      expect(json.messages.length).toBe(1);
      expect(json.messages[0].content).toBe('Hallo');
      expect(json.metadata).toEqual({ id: 4711 });
    });

    it('sollte eigene Nachrichten auf der rechten Seite rendern', async () => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);
      luxChatData.messages.push(createMessage('MaxMustermann', 'Eigene Nachricht', now));

      fixture.componentRef.setInput('luxChatUserName', 'MaxMustermann');
      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      const container = fixture.debugElement.query(By.css('.lux-chat-entry-container'));
      expect(container.classes['lux-chat-entry-container-right']).toBe(true);
      expect(container.classes['lux-chat-entry-container-left']).toBeFalsy();
    });

    it('sollte Nachrichten anderer Benutzer auf der linken Seite rendern', async () => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);
      luxChatData.messages.push(createMessage('AndereUser', 'Fremde Nachricht', now));

      fixture.componentRef.setInput('luxChatUserName', 'MaxMustermann');
      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      const container = fixture.debugElement.query(By.css('.lux-chat-entry-container'));
      expect(container.classes['lux-chat-entry-container-left']).toBe(true);
      expect(container.classes['lux-chat-entry-container-right']).toBeFalsy();
    });

    it('sollte einen Datumstrenner für Nachrichten von verschiedenen Tagen anzeigen', async () => {
      const today = new Date();
      const yesterday = addDays(today, -1);
      const luxChatData = new LuxChatData('Test', today);
      luxChatData.messages.push(createMessage('User1', 'Gestern', yesterday));
      luxChatData.messages.push(createMessage('User1', 'Heute', today));

      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.componentRef.setInput('luxChatUserName', 'User1');
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      const dateSplits = fixture.debugElement.queryAll(By.css('.lux-chat-entry-date-split'));
      expect(dateSplits.length).toBe(2);
    });

    it('sollte keinen doppelten Datumstrenner für Nachrichten desselben Tages anzeigen', async () => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);
      luxChatData.messages.push(createMessage('User1', 'Erste', now));
      luxChatData.messages.push(createMessage('User1', 'Zweite', addMinutes(now, 5)));

      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.componentRef.setInput('luxChatUserName', 'User1');
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      const dateSplits = fixture.debugElement.queryAll(By.css('.lux-chat-entry-date-split'));
      expect(dateSplits.length).toBe(1);
    });
  });

  // ---------------------------------------------------------------------------
  // chatPopupMode
  // ---------------------------------------------------------------------------
  describe('chatPopupMode', () => {
    it('sollte keine Header-Buttons rendern, wenn der Input false ist', async () => {
      fixture.componentRef.setInput('chatPopupMode', false);
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      const buttons = fixture.debugElement.queryAll(By.css('.lux-chat-header lux-button'));
      expect(buttons.length).toBe(0);
    });

    it('sollte beide Buttons rendern, wenn der Inputs true ist', async () => {
      fixture.componentRef.setInput('chatPopupMode', true);
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      const buttons = fixture.debugElement.queryAll(By.css('.lux-chat-header lux-button'));
      expect(buttons.length).toBe(2);
    });
  });

  // ---------------------------------------------------------------------------
  // onFullscreenChatClicked
  // ---------------------------------------------------------------------------
  describe('onFullscreenChatClicked', () => {
    it('sollte _chatFullscreen von false auf true umschalten', () => {
      expect(component._chatFullscreen()).toBe(false);
      component.onFullscreenChatClicked();
      expect(component._chatFullscreen()).toBe(true);
    });

    it('sollte _chatFullscreen beim zweiten Aufruf wieder auf false setzen', () => {
      component.onFullscreenChatClicked();
      component.onFullscreenChatClicked();
      expect(component._chatFullscreen()).toBe(false);
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

      expect(emitted).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // onChatEntered
  // ---------------------------------------------------------------------------
  describe('onChatEntered', () => {
    it('sollte preventDefault auf dem übergebenen Event aufrufen', async () => {
      component.chatInput = 'Test';
      const mockEvent = { preventDefault: vi.fn() } as unknown as Event;

      component.onChatEntered(mockEvent);
      await LuxTestHelper.wait(fixture, 2);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('sollte luxChatOutput mit dem aktuellen chatInput-Wert emittieren', async () => {
      let emittedValue = '';
      component.luxChatOutput.subscribe((val: string) => (emittedValue = val));
      component.chatInput = 'Meine Nachricht';
      const mockEvent = { preventDefault: vi.fn() } as unknown as Event;

      component.onChatEntered(mockEvent);
      await LuxTestHelper.wait(fixture, 2);

      expect(emittedValue).toBe('Meine Nachricht');
    });

    it('sollte chatInput nach dem Senden auf eine leere Zeichenkette zurücksetzen', async () => {
      component.chatInput = 'Zu sendender Text';
      const mockEvent = { preventDefault: vi.fn() } as unknown as Event;

      component.onChatEntered(mockEvent);
      await LuxTestHelper.wait(fixture, 2);

      expect(component.chatInput).toBe('');
    });

    it('sollte bei leerer Eingabe nichts emittieren', async () => {
      const emitSpy = vi.spyOn(component.luxChatOutput, 'emit');
      component.chatInput = '';
      const mockEvent = { preventDefault: vi.fn() } as unknown as Event;

      component.onChatEntered(mockEvent);
      await LuxTestHelper.wait(fixture, 2);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(emitSpy).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // checkShowDateSplit
  // ---------------------------------------------------------------------------
  describe('checkShowDateSplit', () => {
    it('sollte true für Index 0 (erste Nachricht) zurückgeben', () => {
      const msg = createMessage('User1', 'hi', new Date());
      expect(component.checkShowDateSplit(msg, 0)).toBe(true);
    });

    it('sollte true zurückgeben, wenn die vorherige Nachricht von einem anderen Tag stammt', async () => {
      const today = new Date();
      const yesterday = addDays(today, -1);
      const luxChatData = new LuxChatData('Test', today);
      luxChatData.messages.push(createMessage('User1', 'Gestern', yesterday));
      luxChatData.messages.push(createMessage('User1', 'Heute', today));

      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      const todayMsg = luxChatData.messages[1];
      expect(component.checkShowDateSplit(todayMsg, 1)).toBe(true);
    });

    it('sollte false zurückgeben, wenn die vorherige Nachricht vom gleichen Tag stammt', async () => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);
      luxChatData.messages.push(createMessage('User1', 'Erste', now));
      luxChatData.messages.push(createMessage('User1', 'Zweite', addMinutes(now, 5)));

      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      const secondMsg = luxChatData.messages[1];
      expect(component.checkShowDateSplit(secondMsg, 1)).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // checkShowEntryHeaderTime
  // ---------------------------------------------------------------------------
  describe('checkShowEntryHeaderTime', () => {
    it('sollte true für Index 0 (erste Nachricht) zurückgeben', () => {
      const msg = createMessage('User1', 'hi', new Date());
      expect(component.checkShowEntryHeaderTime(msg, 0)).toBe(true);
    });

    it('sollte true zurückgeben, wenn der Zeitunterschied größer als 10 Minuten ist', async () => {
      const now = new Date();
      const elevenMinutesLater = addMinutes(now, 11);
      const luxChatData = new LuxChatData('Test', now);
      luxChatData.messages.push(createMessage('User1', 'Erste', now));
      luxChatData.messages.push(createMessage('User1', 'Zweite', elevenMinutesLater));

      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      const secondMsg = luxChatData.messages[1];
      expect(component.checkShowEntryHeaderTime(secondMsg, 1)).toBe(true);
    });

    it('sollte true zurückgeben, wenn sich der Absender wechselt (innerhalb von 10 Minuten)', async () => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);
      luxChatData.messages.push(createMessage('User1', 'Erste', now));
      luxChatData.messages.push(createMessage('User2', 'Zweite', addMinutes(now, 1)));

      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      const secondMsg = luxChatData.messages[1];
      expect(component.checkShowEntryHeaderTime(secondMsg, 1)).toBe(true);
    });

    it('sollte false zurückgeben, wenn derselbe Benutzer innerhalb von 10 Minuten schreibt', async () => {
      const now = new Date();
      const luxChatData = new LuxChatData('Test', now);
      luxChatData.messages.push(createMessage('User1', 'Erste', now));
      luxChatData.messages.push(createMessage('User1', 'Zweite', addMinutes(now, 5)));

      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      const secondMsg = luxChatData.messages[1];
      expect(component.checkShowEntryHeaderTime(secondMsg, 1)).toBe(false);
    });

    it('sollte true zurückgeben, genau an der 10-Minuten-Grenze', async () => {
      const now = new Date();
      const tenMinutesOneMsLater = new Date(now.getTime() + 10 * 60 * 1000 + 1);
      const luxChatData = new LuxChatData('Test', now);
      luxChatData.messages.push(createMessage('User1', 'Erste', now));
      luxChatData.messages.push(createMessage('User1', 'Zweite', tenMinutesOneMsLater));

      fixture.componentRef.setInput('luxChatData', luxChatData);
      fixture.detectChanges();
      await LuxTestHelper.wait(fixture);

      const secondMsg = luxChatData.messages[1];
      expect(component.checkShowEntryHeaderTime(secondMsg, 1)).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // locale
  // ---------------------------------------------------------------------------
  describe('locale', () => {
    it('sollte locale auf "en-US" aktualisieren, wenn die Sprache auf "en" wechselt', async () => {
      const translocoService = TestBed.inject(TranslocoService);
      translocoService.setActiveLang('en');
      await LuxTestHelper.wait(fixture);

      expect(component.locale()).toBe('en-US');
    });

    it('sollte locale auf "fr-FR" aktualisieren, wenn die Sprache auf "fr" wechselt', async () => {
      const translocoService = TestBed.inject(TranslocoService);
      translocoService.setActiveLang('fr');
      await LuxTestHelper.wait(fixture);

      expect(component.locale()).toBe('fr-FR');
    });
  });
});
