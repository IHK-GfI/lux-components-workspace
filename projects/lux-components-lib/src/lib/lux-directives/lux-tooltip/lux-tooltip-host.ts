import { InjectionToken } from '@angular/core';
import type { LuxTooltipDirective } from './lux-tooltip.directive';

/**
 * Komponente, an der die LuxTooltipDirective auf demselben Element angemeldet wird, damit die Komponente
 * den Tooltip z.B. beim Fokussieren selbst ein- und ausblenden kann (LuxButton, LuxLink, LuxMenu, ...).
 */
export interface LuxTooltipHost {
  registerTooltip(tooltip: LuxTooltipDirective): void;
}

/**
 * Über diesen Token stellen sich Tooltip-Hosts der LuxTooltipDirective bereit. Die Direktive kennt dadurch
 * keine konkreten Komponenten, sonst entstünden Import-Zyklen (z.B. LuxMenuComponent importiert die Direktive
 * in ihren `imports` und die Direktive importierte LuxMenuComponent für `inject()`).
 */
export const LUX_TOOLTIP_HOST = new InjectionToken<LuxTooltipHost>('LUX_TOOLTIP_HOST');
