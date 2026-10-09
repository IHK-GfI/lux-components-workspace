import Quill, { Delta, Parchment } from 'quill/core';
import Bold from 'quill/formats/bold';
import Header from 'quill/formats/header';
import Indent from 'quill/formats/indent';
import Italic from 'quill/formats/italic';
import Link from 'quill/formats/link';
import List from 'quill/formats/list';
import Underline from 'quill/formats/underline';
import { LuxQuillConfig, LuxQuillToolbarItem } from './lux-quill-config';

/** Name des Quill-Formats für die Optik der Überschriften (unabhängig von der HTML-Semantik). */
export const LUX_QUILL_HEADING_FORMAT = 'lux-heading';

/** CSS-Klassen-Präfix der Überschriften, z.B. "lux-quill-heading-1". */
export const LUX_QUILL_HEADING_CLASS = 'lux-quill-heading';

/** Optische Überschriften-Stufe: 1 = Überschrift 1, 2 = Überschrift 2. */
export type LuxQuillHeadingStyle = 1 | 2;

/**
 * Block-Attribut, das die Optik einer Überschrift über eine CSS-Klasse festlegt.
 * Ergebnis: `<p class="lux-quill-heading-1">` (visual) bzw. `<h1 class="lux-quill-heading-1">` (semantic).
 */
export const LuxQuillHeadingClass = new Parchment.ClassAttributor(LUX_QUILL_HEADING_FORMAT, LUX_QUILL_HEADING_CLASS, {
  scope: Parchment.Scope.BLOCK,
  whitelist: ['1', '2']
});

let formatsRegistered = false;

/**
 * Registriert die von lux-quill genutzten Quill-Formate einmalig in der globalen Quill-Registry.
 *
 * Bewusst nicht auf Modulebene: Die Library ist als "sideEffects: false" markiert, ein reiner
 * Seiteneffekt beim Import könnte vom Bundler entfernt werden. Welche Formate ein Editor tatsächlich
 * erlaubt, steuert pro Instanz die Quill-Option "formats" (siehe luxQuillFormats()).
 */
export function luxQuillRegisterFormats() {
  if (formatsRegistered) {
    return;
  }
  formatsRegistered = true;

  // overwrite = true: Hat die Anwendung bereits das komplette Quill-Paket importiert, sind dieselben
  // Formate schon registriert. Ohne overwrite gäbe Quill dafür Warnungen aus.
  Quill.register(
    {
      'formats/bold': Bold,
      'formats/italic': Italic,
      'formats/underline': Underline,
      'formats/link': Link,
      'formats/list': List,
      'formats/indent': Indent,
      'formats/header': Header,
      [`formats/${LUX_QUILL_HEADING_FORMAT}`]: LuxQuillHeadingClass
    },
    true
  );
}

const TOOLBAR_FORMATS: Partial<Record<LuxQuillToolbarItem, string>> = {
  bold: 'bold',
  italic: 'italic',
  underline: 'underline',
  bulletList: 'list',
  orderedList: 'list',
  indent: 'indent',
  outdent: 'indent',
  link: 'link'
};

/**
 * Liefert die Whitelist der Quill-Formate für eine Konfiguration. Formate außerhalb der Whitelist
 * gehen beim Laden und Einfügen verloren - das wirkt zugleich als Sanitizing.
 */
export function luxQuillFormats(config: LuxQuillConfig): string[] {
  const formats = new Set<string>();

  config.toolbar.forEach((item) => {
    const format = TOOLBAR_FORMATS[item];
    if (format) {
      formats.add(format);
    }
  });

  if (config.headingMode !== 'none') {
    formats.add(LUX_QUILL_HEADING_FORMAT);
  }
  if (config.headingMode === 'semantic') {
    formats.add('header');
  }

  config.formats.forEach((format) => formats.add(format));

  return [...formats];
}

/**
 * Liefert die Block-Attribute für eine Überschrift (style 1/2) bzw. für normalen Text (style null)
 * passend zur Konfiguration.
 */
export function luxQuillHeadingAttributes(config: LuxQuillConfig, style: LuxQuillHeadingStyle | null): Record<string, unknown> {
  if (style === null || config.headingMode === 'none') {
    return { header: null, [LUX_QUILL_HEADING_FORMAT]: null };
  }

  return {
    header: config.headingMode === 'semantic' ? config.headingLevels[style - 1] : null,
    [LUX_QUILL_HEADING_FORMAT]: String(style)
  };
}

/**
 * Clipboard-Matcher für Überschriften (beim Einfügen und beim Setzen eines Wertes):
 * Bildet beliebige Überschriften (h1-h6) sowie die Lux-Überschriften-Klassen auf die zwei
 * Stufen der Konfiguration ab. Bei headingMode 'none' wird daraus normaler Text.
 */
export function luxQuillHeadingMatcher(config: LuxQuillConfig): [string, (node: Node, delta: Delta) => Delta] {
  const selector = `h1, h2, h3, h4, h5, h6, .${LUX_QUILL_HEADING_CLASS}-1, .${LUX_QUILL_HEADING_CLASS}-2`;

  return [
    selector,
    (node: Node, delta: Delta) => {
      const style = config.headingMode === 'none' ? null : headingStyleOf(node as Element, config);
      return applyBlockAttributes(delta, luxQuillHeadingAttributes(config, style));
    }
  ];
}

function headingStyleOf(element: Element, config: LuxQuillConfig): LuxQuillHeadingStyle {
  // Die Klasse beschreibt die gewünschte Optik und hat deshalb Vorrang vor der Ebene des Tags.
  if (element.classList.contains(`${LUX_QUILL_HEADING_CLASS}-1`)) {
    return 1;
  }
  if (element.classList.contains(`${LUX_QUILL_HEADING_CLASS}-2`)) {
    return 2;
  }

  const level = Number(element.tagName.substring(1));
  return level <= config.headingLevels[0] ? 1 : 2;
}

/**
 * Setzt Block-Attribute auf die Zeilenumbrüche eines Deltas (dort liegen in Quill die Block-Formate)
 * und entfernt sie von den Text-Einfügungen. Attribute mit dem Wert null werden entfernt.
 */
function applyBlockAttributes(delta: Delta, blockAttributes: Record<string, unknown>): Delta {
  const blockKeys = Object.keys(blockAttributes);
  const result = new Delta();

  delta.ops.forEach((op) => {
    if (typeof op.insert !== 'string') {
      result.push(op);
      return;
    }

    const inlineAttributes = withoutKeys(op.attributes, blockKeys);
    const parts = op.insert.split('\n');
    parts.forEach((part, index) => {
      if (part) {
        result.insert(part, inlineAttributes);
      }
      if (index < parts.length - 1) {
        result.insert('\n', withoutNulls({ ...op.attributes, ...blockAttributes }));
      }
    });
  });

  return result;
}

function withoutKeys(attributes: Record<string, unknown> | undefined, keys: string[]): Record<string, unknown> | undefined {
  if (!attributes) {
    return undefined;
  }
  const copy = { ...attributes };
  keys.forEach((key) => delete copy[key]);
  return Object.keys(copy).length > 0 ? copy : undefined;
}

function withoutNulls(attributes: Record<string, unknown>): Record<string, unknown> | undefined {
  const copy: Record<string, unknown> = {};
  Object.keys(attributes).forEach((key) => {
    if (attributes[key] !== null && attributes[key] !== undefined) {
      copy[key] = attributes[key];
    }
  });
  return Object.keys(copy).length > 0 ? copy : undefined;
}

/**
 * Bereitet das HTML aus quill.getSemanticHTML() auf.
 *
 * Quill 2.0.3 wandelt dort jedes Leerzeichen in "&nbsp;" um (Text-Blots, siehe quill/core/editor.js).
 * Das verhindert Zeilenumbrüche in der Ausgabe. Echte geschützte Leerzeichen (U+00A0) bleiben dabei
 * als Zeichen erhalten und sind von den Entities unterscheidbar. Einzelne Leerzeichen werden wieder zu
 * normalen Leerzeichen, Folgen von Leerzeichen abwechselnd zu "&nbsp;" und " ", damit sie sichtbar bleiben.
 */
export function luxQuillNormalizeHtml(html: string): string {
  return html.replace(/(?:&nbsp;)+/g, (run) => {
    const count = run.length / '&nbsp;'.length;
    if (count === 1) {
      return ' ';
    }

    let result = '';
    for (let i = 0; i < count; i++) {
      result += i % 2 === 0 ? '&nbsp;' : ' ';
    }
    return result;
  });
}
