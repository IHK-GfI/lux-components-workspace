import { Directive, EventEmitter, Input, Output } from '@angular/core';
import { LuxThemePalette } from '../../lux-util/lux-colors.enum';

/**
 * Base-Klasse der LuxActionComponents.
 *
 * Enthält die Inputs/Outputs, die allen Action-Components gleich sind.
 */
@Directive()
export class LuxActionComponentBaseClass {
  @Input() luxLabel? = '';
  @Input() luxColor?: LuxThemePalette;
  @Input() luxRaised? = false;
  @Input() luxIconName? = '';
  @Input() luxIconShowRight? = false;
  @Input() luxTagId?: string;
  @Input() luxDisabled? = false;
  /**
   * Markiert die Action als wahrnehmbar deaktiviert (aria-disabled): sichtbar und
   * fokussierbar, Screenreader sagen "deaktiviert" an, die Aktion wird aber nicht
   * ausgeführt. Statt luxClicked wird luxClickNotAllowed emittiert. Bewusst ohne
   * eigenes Styling, die Anwendung reagiert über luxClickNotAllowed.
   * Abgrenzung: luxDisabled entfernt die Action aus der Tastaturreihenfolge,
   * luxHidden blendet sie komplett aus.
   */
  @Input() luxDisabledAria? = false;
  @Input() luxRounded? = false;
  @Input() luxFlat? = false;
  @Input() luxStroked? = false;

  @Output() luxClicked = new EventEmitter<Event>();
}
