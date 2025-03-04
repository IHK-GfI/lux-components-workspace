import { JSDOM } from 'jsdom';
import { replaceFirst } from '../util';
import { Hit } from './hit';
import { ManipulatorFn } from './manipulator-functions';

export const ATTR_NOT_PROCESSED = 'data-lux-not-processed';
export const PLACEHOLDER = `@@@element@@@`;

/**
 * Der {@link HtmlManipulator} ist für die Manipulation der HTML-Templates zuständig.
 *
 * Warum verwendet der {@link HtmlManipulator} eigene Funktionen, um den HTML-Inhalt anzupassen,
 * anstatt die bereitgestellten Methoden von JSDOm (serialize()) bzw. Cheerio (xml() oder html() zu verwenden?
 *
 * Die serialize-Methode von JSDOM wandelt alle Attribute in Kleinschrift um, sodass die Angular-Attribute nicht mehr
 * funktionieren. Cheerio kann konfiguriert werden, sodass die Camel-Case-Namen erhalten bleiben,
 * aber dort werden z.B. die leeren Ent-Tags ersetzt. Zusätzlich bricht Cheerio manchmal in komplexeren Templates an Stellen um,
 * sodass das Template im Anschluss nicht mehr kompiliert.
 *
 * @example JSDOM
 * Input: <lux-input luxLabel="Lorem ipsum"></lux-input>
 * Output: <lux-input luxlabel="Lorem ipsum"></lux-input>
 *
 * @example Cheerio
 * Input: <lux-input></lux-input>
 * Output: <lux-input/>
 */
export class HtmlManipulator {
  private htmlContent: string;
  private readonly selector: string;
  private readonly manipulatorFNs: ManipulatorFn[];

  private constructor(htmlContent: string, selector: string, manipulatorFns: ManipulatorFn[]) {
    this.htmlContent = htmlContent;
    this.selector = selector;
    this.manipulatorFNs = manipulatorFns ?? [];
  }

  /**
   * Diese Methode ermittelt alle betroffenen HTML-Elemente anhand des übergebenen Selektors und versieht diese mit dem temporären
   * {@link ATTR_NOT_PROCESSED}-Attribut.
   *
   * @example Selektor - lux-card
   * <div>
   *   <lux-card luxTitle="Test">
   *     <lux-card-content>
   *       <p>Lorem ipsum</p>
   *     </lux-card-content>
   *   </lux-card>
   * </div>
   *
   * <div>
   *   <lux-card data-lux-not-processed luxTitle="Test">
   *     <lux-card-content>
   *       <p>Lorem ipsum</p>
   *     </lux-card-content>
   *   </lux-card>
   * </div>
   *
   * @param htmlContent Der HTML-Inhalt.
   * @param selector Der CSS-Selektor.
   */
  static prepare(htmlContent: string, selector: string): string {
    const dom = new JSDOM(htmlContent, { includeNodeLocations: true });
    const elements = dom.window.document.querySelectorAll(selector);

    let counter = 0;
    elements.forEach((el) => {
      const location = dom.nodeLocation(el);
      const startIndex = location?.startOffset ?? -1;
      const endIndex = location?.endOffset ?? -1;

      htmlContent = this.addUnprocessedAttr(htmlContent, el.tagName, startIndex, endIndex, counter++);
    });

    return htmlContent;
  }

  /**
   * Diese Methode transformiert den übergebenen HTML-Inhalt mit den Manipulator-Funktionen.
   *
   * @param htmlContent Der HTML-Inhalt.
   * @param selector Der CSS-Selektor.
   * @param manipulatorFns Die Funktionen manipulieren den HTML-Inhalt.
   */
  static transform(htmlContent: string, selector: string, ...manipulatorFns: ManipulatorFn[]): string {
    return new HtmlManipulator(htmlContent, selector, manipulatorFns).do();
  }

  /**
   * Diese Methode liefert die Anzahl der mit dem Selektor gefundenen Elemente zurück.
   *
   * @param htmlContent Der HTML-Inhalt.
   * @param selector Der CSS-Selektor.
   */
  static count(htmlContent: string, selector: string): number {
    return new JSDOM(htmlContent, { includeNodeLocations: false }).window.document.querySelectorAll(selector).length;
  }

  private do(): string {
    this.htmlContent = HtmlManipulator.prepare(this.htmlContent, this.selector);

    // Hier wird der erste Treffer gesetzt. Zusätzlich wird im Ergebnis-HTML anstelle des Elements ein Platzhalter eingesetzt.
    // Dieser Platzhalter wird im Nachgang wieder durch das manipulierte HTML des Elements ersetzt.
    let hit = this.next();
    while (hit) {
      // Hier wird der HTML-Inhalt des Elements über die Manipulator-Funktionen angepasst.
      this.manipulatorFNs.forEach((fn) => fn(hit!));

      // Jetzt muss das unprocessed-Attribut, das in der prepare-Methode gesetzt wurde, wieder entfernt werden.
      const updatedHtml = replaceFirst(hit.elementContent, ' ' + ATTR_NOT_PROCESSED, '');

      // Zum Schluss muss der veränderte HTML-Inhalt des Elements wieder an die Stelle des Platzhalters im Ergebnis-HTML eingesetzt werden.
      // Der Platzhalter im Ergebnis wird durch die next-Methode gesetzt.
      this.htmlContent = this.htmlContent.replace(hit.placeholder, updatedHtml);

      // Hier wird der nächste Treffer gesetzt.
      // Details siehe den next()-Aufruf weiter oben.
      hit = this.next();
    }

    return this.htmlContent;
  }

  private next(): Hit | null {
    const dom = new JSDOM(this.htmlContent, { includeNodeLocations: true });
    const element = dom.window.document.querySelector(`*[${ATTR_NOT_PROCESSED}]`);

    if (element) {
      const location = dom.nodeLocation(element);
      if (location && location.startOffset >= 0 && location.endOffset >= 0) {
        const start = location.startOffset;
        const end = location.endOffset;

        // Der Hit auf denen die Manipulator-Funktionen arbeiten, bekommen nur den HTML-Inhalt des Elements und
        // nicht den gesamten Inhalt.
        const hitContent = this.htmlContent.slice(start, end);

        // Für das HTML des Elements wird der Platzhalter eingesetzt.
        this.htmlContent = this.htmlContent.slice(0, start) + PLACEHOLDER + this.htmlContent.slice(end, this.htmlContent.length);

        return new Hit(PLACEHOLDER, this.selector, hitContent, element, location.startLine);
      }
    }

    return null;
  }

  private static addUnprocessedAttr(htmlContent: string, tagName: string, startIndex: number, endIndex: number, counter: number) {
    if (startIndex >= 0 && endIndex >= 0) {
      const position = startIndex + (tagName.length + 1) + counter * (ATTR_NOT_PROCESSED.length + 1); /* +1 für die Leerzeichen */
      htmlContent = [htmlContent.slice(0, position), ' ' + ATTR_NOT_PROCESSED, htmlContent.slice(position)].join('');
    }
    return htmlContent;
  }
}
