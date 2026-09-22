import { SPACE } from '@angular/cdk/keycodes';
import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { vi } from 'vitest';

export class LuxTestHelper {
  /**
   * @param input
   * @param value
   * @param fixture
   */
  public static async setInputValue(input: any, value: any, fixture: any): Promise<void> {
    if (input) {
      input.value = value;
      input.dispatchEvent(LuxTestHelper.createFakeEvent('input'));
      await LuxTestHelper.wait(fixture);
    } else {
      console.error('UNIT-TEST FEHLER: input ist nicht definiert.');
    }
  }

  /**
   * Wartet asynchrone Aufrufe ab und ruft die ChangeDetection auf.
   * `tickDuration` wird, falls angegeben, als Wartezeit abgewartet.
   * Sind Vitest-Fake-Timer aktiv (vi.useFakeTimers()), wird die virtuelle Zeit vorgespult statt real zu
   * warten - das spart bei Specs mit vielen wait()-Aufrufen reale Wall-Clock-Zeit. Ohne Fake-Timer (Default)
   * verhält sich wait() unverändert wie zuvor: ein echter setTimeout-Tick garantiert, dass auch Microtask-
   * Ketten von ggf. nicht zone.js-gepatchten nativen Promises (z.B. vi.fn().mockResolvedValue()) durchlaufen
   * sind, bevor es weitergeht - fixture.whenStable() allein wartet darauf nicht zuverlässig.
   * @param fixture
   * @param tickDuration
   */
  public static async wait(fixture: any, tickDuration?: number): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
    if (vi.isFakeTimers()) {
      if (tickDuration) {
        await vi.advanceTimersByTimeAsync(tickDuration);
      } else {
        await vi.runAllTimersAsync();
      }
    } else {
      await new Promise((resolve) => setTimeout(resolve, tickDuration ?? 0));
    }
    fixture.detectChanges();
  }

  /**
   * Sendet ein Klick-Event ab und wartet dann.
   * @param fixture
   * @param debugElement
   */
  public static async click(fixture: any, debugElement: DebugElement): Promise<void> {
    debugElement.triggerEventHandler('click', null);
    await LuxTestHelper.wait(fixture);
  }

  /**
   * Utility to dispatch any event on a Node.
   * @param node
   * @param event
   */
  public static dispatchEvent(node: Node | Window, event: Event): Event {
    node.dispatchEvent(event);
    return event;
  }

  /**
   * Shorthand to dispatch a fake event on a specified node.
   * @param node
   * @param type
   * @param canBubble
   */
  public static dispatchFakeEvent(node: Node | Window, type: string, canBubble?: boolean): Event {
    return LuxTestHelper.dispatchEvent(node, LuxTestHelper.createFakeEvent(type, canBubble));
  }

  /**
   * Shorthand to dispatch a keyboard event with a specified key code.
   * @param node
   * @param type
   * @param keyCode
   * @param target
   */
  public static dispatchKeyboardEvent(node: Node, type: string, keyCode: number, target?: Element): KeyboardEvent {
    return LuxTestHelper.dispatchEvent(node, LuxTestHelper.createKeyboardEvent(type, keyCode, target)) as KeyboardEvent;
  }

  /**
   * Focuses an input and sets its value. Dispatches a fake input event afterwards.
   * @param element
   * @param value
   * @param noInputEvent
   */
  public static typeInElement(element: HTMLInputElement, value: string, noInputEvent?: boolean) {
    element.focus();
    element.value = value;
    if (!noInputEvent) {
      LuxTestHelper.dispatchFakeEvent(element, 'input');
    }
  }

  /**
   * Inserts data into an input field, that has to update asynchronous before calling a callback-function
   * Allows to use RxJs Interval-Timers within the Target-Components.
   * @param text
   * @param fixture
   * @param element
   * @param callback
   */
  public static async typeInElementAsync(
    text: string,
    fixture: ComponentFixture<any>,
    element: HTMLInputElement,
    callback: () => void | Promise<void>
  ): Promise<void> {
    if (vi.isFakeTimers()) {
      await vi.runAllTimersAsync();
    }
    await fixture.whenStable();
    LuxTestHelper.typeInElement(element, text);
    fixture.detectChanges();

    if (vi.isFakeTimers()) {
      await vi.runAllTimersAsync();
    }
    await fixture.whenStable();
    LuxTestHelper.dispatchKeyboardEvent(element, 'keydown', SPACE);
    fixture.detectChanges();

    if (vi.isFakeTimers()) {
      await vi.runAllTimersAsync();
    }
    await fixture.whenStable();
    await callback();
  }

  /**
   * Dispatches a keydown event from an element.
   * @param type
   * @param keyCode
   * @param target
   * @param key
   */
  public static createKeyboardEvent(type: string, keyCode: number, target?: Element, key?: string) {
    const event = new KeyboardEvent(type, { bubbles: true, cancelable: true, key });

    // Webkit Browsers don't set the keyCode when calling the constructor.
    // See related bug https://bugs.webkit.org/show_bug.cgi?id=16735
    Object.defineProperties(event, {
      keyCode: { get: () => keyCode },
      target: { get: () => target }
    });

    return event;
  }

  /**
   * Creates a fake event object with any desired event type.
   * @param type
   * @param canBubble
   * @param cancelable
   */
  public static createFakeEvent(type: string, canBubble = false, cancelable = true): Event {
    let event;
    if (typeof Event === 'function') {
      event = new Event(type);
    } else {
      event = document.createEvent('Event');
      event.initEvent(type, canBubble, cancelable);
    }

    return event;
  }

  public static createDropEvent(files: { name: string; type: string }[]): DragEvent {
    const dataTransfer = new DataTransfer();
    files.forEach((file) => {
      dataTransfer.items.add(LuxTestHelper.createFileBrowserSafe(file.name, file.type));
    });

    return new DragEvent('drop', { dataTransfer });
  }

  /**
   * Erstellt ein leeres File-Objekt mit Namen und Typ via Blob-Constructor (um Edge/IE-Fehler zu vermeiden).
   * @param name
   * @param type
   */
  public static createFileBrowserSafe(name: string, type: string) {
    return new File([''], name, { type: type });
  }
}
