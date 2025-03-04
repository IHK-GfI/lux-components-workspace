import { SPACE } from '@angular/cdk/keycodes';
import { DebugElement } from '@angular/core';
import { ComponentFixture, tick } from '@angular/core/testing';

export class LuxTestHelper {
  /**
   * Wichtig: aus fakeAsync-Block heraus aufrufen, da hier tick() genutzt wird.
   * @param input
   * @param value
   * @param fixture
   */
  public static setInputValue(input: any, value: any, fixture: any) {
    if (input) {
      input.value = value;
      input.dispatchEvent(LuxTestHelper.createFakeEvent('input'));
      LuxTestHelper.wait(fixture);
    } else {
      console.error('UNIT-TEST FEHLER: input ist nicht definiert.');
    }
  }

  /**
   * Wichtig: aus fakeAsync-Block heraus aufrufen, da hier tick() genutzt wird.
   * Wartet asynchrone Aufrufe ab und ruft die ChangeDetection auf
   * @param fixture
   * @param tickDuration
   */
  public static wait(fixture: any, tickDuration?: number) {
    fixture.detectChanges();
    tick(tickDuration);
    fixture.detectChanges();
  }

  /**
   * Wichtig: aus fakeAsync-Block heraus aufrufen, da hier tick() genutzt wird.
   * Sendet ein Klick-Event ab und wartet dann.
   * @param fixture
   * @param debugElement
   */
  public static click(fixture: any, debugElement: DebugElement) {
    debugElement.triggerEventHandler('click', null);
    LuxTestHelper.wait(fixture);
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

  /** Steuerung und triggern von Overlays implementieren */

  /**
   * Inserts data into an input field, that has to update asynchronous before calling a callback-function
   * Allows to use RxJs Interval-Timers within the Target-Components.
   * @param text
   * @param fixture
   * @param element
   * @param callback
   */
  public static typeInElementAsync(text: string, fixture: ComponentFixture<any>, element: HTMLInputElement, callback: () => void) {
    fixture.whenStable().then(() => {
      LuxTestHelper.typeInElement(element, text);
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        LuxTestHelper.dispatchKeyboardEvent(element, 'keydown', SPACE);
        fixture.detectChanges();

        fixture.whenStable().then(() => {
          callback();
        });
      });
    });
  }

  /**
   * Dispatches a keydown event from an element.
   * @param type
   * @param keyCode
   * @param target
   * @param key
   */
  public static createKeyboardEvent(type: string, keyCode: number, target?: Element, key?: string) {
    const event = document.createEvent('KeyboardEvent') as any;
    // Firefox does not support `initKeyboardEvent`, but supports `initKeyEvent`.
    const initEventFn = (event.initKeyEvent || event.initKeyboardEvent).bind(event);
    const originalPreventDefault = event.preventDefault;

    initEventFn(type, true, true, window, 0, 0, 0, 0, 0, keyCode);

    // Webkit Browsers don't set the keyCode when calling the init function.
    // See related bug https://bugs.webkit.org/show_bug.cgi?id=16735
    Object.defineProperties(event, {
      keyCode: { get: () => keyCode },
      key: { get: () => key },
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
