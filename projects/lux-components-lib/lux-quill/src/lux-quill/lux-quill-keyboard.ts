import type Quill from 'quill/core';

/** Zustand der Tastaturbedienung eines Editors. */
export interface LuxQuillKeyboardState {
  /**
   * true, nachdem Escape gedrückt wurde: Der nächste Tab bzw. Shift+Tab rückt nicht ein, sondern
   * verlässt den Editor (WCAG 2.1.2 "Keine Tastaturfalle"). Jede andere Taste und ein Blur setzen
   * den Zustand zurück.
   */
  tabReleased: boolean;
}

export interface LuxQuillKeyboardCallbacks {
  /** Liefert true, wenn das Einrücken in der aktuellen Konfiguration erlaubt ist. */
  isIndentEnabled: () => boolean;
  /** Liefert true, wenn Links in der aktuellen Konfiguration erlaubt sind. */
  isLinkEnabled: () => boolean;
  /** Öffnet den Dialog zum Einfügen/Bearbeiten eines Links. */
  openLinkDialog: () => void;
}

/** Tasten, die den Zustand "tabReleased" nicht zurücksetzen. */
export const LUX_QUILL_RELEASE_KEYS = ['Escape', 'Tab', 'Shift'];

/**
 * Tastatur-Bindings für das Quill-Keyboard-Modul.
 *
 * Die Quill-Defaults "indent", "outdent", "tab" und "remove tab" werden mit null abgeschaltet und durch
 * eigene Bindings ersetzt: Tab und Shift+Tab rücken immer ein bzw. aus (auch in normalen Absätzen) und
 * fügen kein Tabulatorzeichen ein. Eigene Namen sind nötig, weil Quill die Modul-Optionen tief mit den
 * Defaults mischt - unter gleichem Namen bliebe z.B. deren format-Einschränkung erhalten.
 * Ein Handler-Rückgabewert true bedeutet: Quill verhindert das Standardverhalten des Browsers nicht.
 */
export function luxQuillKeyboardBindings(state: LuxQuillKeyboardState, callbacks: LuxQuillKeyboardCallbacks): Record<string, unknown> {
  const indentHandler = (quill: Quill, modifier: '+1' | '-1') => {
    if (state.tabReleased || !callbacks.isIndentEnabled()) {
      return true;
    }
    quill.format('indent', modifier, 'user');
    return false;
  };

  return {
    indent: null,
    outdent: null,
    tab: null,
    'remove tab': null,
    'lux-indent': {
      key: 'Tab',
      handler(this: { quill: Quill }) {
        return indentHandler(this.quill, '+1');
      }
    },
    'lux-outdent': {
      key: 'Tab',
      shiftKey: true,
      handler(this: { quill: Quill }) {
        return indentHandler(this.quill, '-1');
      }
    },
    'lux-release-tab': {
      key: 'Escape',
      handler() {
        state.tabReleased = true;
        return true;
      }
    },
    'lux-link': {
      // Großbuchstabe z.B. bei aktiver Feststelltaste.
      key: ['k', 'K'],
      shortKey: true,
      handler() {
        if (!callbacks.isLinkEnabled()) {
          return true;
        }
        callbacks.openLinkDialog();
        return false;
      }
    }
  };
}
