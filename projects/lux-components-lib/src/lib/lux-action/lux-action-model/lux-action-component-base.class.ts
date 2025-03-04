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
  @Input() luxRounded? = false;
  @Input() luxFlat? = false;
  @Input() luxStroked? = false;

  @Output() luxClicked = new EventEmitter<Event>();
}
