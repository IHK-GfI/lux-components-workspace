import { Directive, input, output } from '@angular/core';
import { LuxThemePalette } from '../../lux-util/lux-colors.enum';

/**
 * Base-Klasse der LuxActionComponents.
 *
 * Enthält die Inputs/Outputs, die allen Action-Components gleich sind.
 */
@Directive()
export class LuxActionComponentBaseClass {
  readonly luxLabel = input<string | undefined>('');
  readonly luxColor = input<LuxThemePalette | undefined>(undefined);
  readonly luxRaised = input<boolean | undefined>(false);
  readonly luxIconName = input<string | undefined>('');
  readonly luxIconShowRight = input<boolean | undefined>(false);
  readonly luxTagId = input<string | undefined>(undefined);
  readonly luxDisabled = input<boolean | undefined>(false);
  /**
   * Markiert die Action als wahrnehmbar deaktiviert (aria-disabled): sichtbar und
   * fokussierbar, Screenreader sagen "deaktiviert" an, die Aktion wird aber nicht
   * ausgeführt. Statt luxClicked wird luxClickNotAllowed emittiert. Bewusst ohne
   * eigenes Styling, die Anwendung reagiert über luxClickNotAllowed.
   * Abgrenzung: luxDisabled entfernt die Action aus der Tastaturreihenfolge,
   * luxHidden blendet sie komplett aus.
   * Hinweis: Wird derzeit von lux-button und lux-menu-item umgesetzt;
   * lux-link und lux-link-plain werten dieses Flag noch nicht aus.
   */
  luxDisabledAria = input<boolean | undefined>(false);
  readonly luxRounded = input<boolean | undefined>(false);
  readonly luxFlat = input<boolean | undefined>(false);
  readonly luxStroked = input<boolean | undefined>(false);

  luxClicked = output<Event>();
}
