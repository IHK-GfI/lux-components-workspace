/**
 * Die {@link Hit}-Klasse repräsentiert einen Treffer, der Anhand des verwendeten Selektors gefunden wurde.
 */
export class Hit {
  placeholder: string;
  selector: string;
  row: number;
  elementContent: string;
  element: Element;

  /**
   * Der Konstruktor der {@link Hit}-Klasse.
   *
   * @param placeholder Der Platzhalter des Treffers. Im Nachgang wird der {@link HtmlManipulator} den Platzhalter des Treffers
   *                    in der HTML-Ausgabe durch den transformierten HTML-Inhalt ersetzen.
   * @param selector Der CSS-Selektor.
   * @param elementContent Der HTML-Inhalt des Elements und NICHT des gesamten HTML-Templates.
   * @param element Das {@link Element}.
   * @param row Die Startzeile im HTML-Template.
   */
  constructor(placeholder: string, selector: string, elementContent: string, element: Element, row: number) {
    this.placeholder = placeholder;
    this.elementContent = elementContent;
    this.row = row;
    this.selector = selector;
    this.element = element;
  }
}
