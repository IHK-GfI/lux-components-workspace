// Wird über `setupFiles` in der `test`-Architect-Konfiguration von lux-components-lib geladen
// (siehe angular.json). Läuft nach der automatischen zone.js-Initialisierung, aber vor allen
// Spec-Dateien. Stopft jsdom-Lücken gegenüber echtem Chrome, die unter Karma nicht auftraten.

// jsdom implementiert weder scrollIntoView noch die Drag&Drop-DataTransfer-API (beides wird von
// LuxTestHelper bzw. Komponenten wie LuxTourHint/LuxList genutzt, unter echtem Chrome via Karma
// aber real vorhanden). Minimal-Polyfills, damit die betroffenen Tests unter jsdom nicht crashen.
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = () => {};
}

if (typeof (globalThis as any).DataTransfer === 'undefined') {
  class LuxTestDataTransferItemList {
    private readonly _files: File[] = [];
    add(file: File): void {
      this._files.push(file);
    }
    get length(): number {
      return this._files.length;
    }
    [Symbol.iterator](): IterableIterator<File> {
      return this._files[Symbol.iterator]();
    }
  }
  class LuxTestDataTransfer {
    readonly items = new LuxTestDataTransferItemList();
    get files(): File[] {
      return Array.from(this.items as unknown as Iterable<File>);
    }
  }
  (globalThis as any).DataTransfer = LuxTestDataTransfer;
}

// jsdom implementiert `innerText` nicht (layout-abhängig, jsdom hat keine Layout-Engine) und liefert
// stattdessen `undefined`. Viele Tests lesen `element.innerText`; textContent als Näherung reicht für
// die hier genutzten reinen Text-Assertions aus.
if (!Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'innerText')) {
  Object.defineProperty(HTMLElement.prototype, 'innerText', {
    get(this: HTMLElement) {
      return this.textContent;
    },
    set(this: HTMLElement, value: string) {
      this.textContent = value;
    },
    configurable: true
  });
}

// jsdom implementiert HTMLCanvasElement.getContext('2d') nicht (liefert null), ohne das native
// 'canvas'-npm-Paket zu installieren. LuxMenuComponent nutzt Canvas zur Textbreitenmessung
// (getTextWidth); ein minimaler Mock-Context reicht aus, da es hier nur um plausible, nicht
// pixelgenaue Breiten geht (jsdom hat ohnehin keine echte Layout-Engine).
if (document.createElement('canvas').getContext('2d') === null) {
  (HTMLCanvasElement.prototype as any).getContext = function (contextId: string) {
    if (contextId !== '2d') {
      return null;
    }
    return {
      font: '',
      measureText: (text: string) => ({ width: text.length * 7 })
    };
  };
}

if (typeof (globalThis as any).DragEvent === 'undefined') {
  class LuxTestDragEvent extends MouseEvent {
    readonly dataTransfer: unknown;
    constructor(type: string, eventInitDict?: MouseEventInit & { dataTransfer?: unknown }) {
      super(type, eventInitDict);
      this.dataTransfer = eventInitDict?.dataTransfer ?? null;
    }
  }
  (globalThis as any).DragEvent = LuxTestDragEvent;
}
