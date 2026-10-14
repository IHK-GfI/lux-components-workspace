import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type LuxSkeletonVariant = 'text' | 'rect' | 'circle';

/**
 * Dekorativer Lade-Platzhalter, der immer vor assistiven Technologien verborgen ist.
 * Silhouetten werden aus den Varianten text, rect und circle zusammengesetzt.
 *
 * @example
 * ```html
 * <lux-skeleton luxVariant="text" [luxCount]="3"></lux-skeleton>
 * <lux-skeleton luxVariant="rect" luxHeight="4em"></lux-skeleton>
 * <lux-skeleton luxVariant="circle" luxWidth="2.5em"></lux-skeleton>
 * ```
 */
@Component({
  selector: 'lux-skeleton',
  templateUrl: './lux-skeleton.component.html',
  styleUrl: './lux-skeleton.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[style.--lux-skeleton-width]': 'luxWidth() ?? null',
    '[style.--lux-skeleton-height]': 'luxHeight() ?? null',
    '[class.lux-skeleton--static]': '!luxAnimated()'
  }
})
export class LuxSkeletonComponent {
  /** Form des Platzhalters. */
  readonly luxVariant = input<LuxSkeletonVariant>('text');

  /** CSS-Länge; bei circle der Durchmesser. Der Standardwert hängt von der Variante ab. */
  readonly luxWidth = input<string>();

  /**
   * Feste CSS-Länge (z. B. 16px, 4em); wird bei circle ignoriert. Der Standardwert hängt von der Variante ab.
   * Prozentangaben werden nicht unterstützt, da der Platzhalter keine Bezugshöhe hat.
   */
  readonly luxHeight = input<string>();

  /** Anzahl der untereinander dargestellten Platzhalter; bei text wird die letzte Zeile kürzer dargestellt. */
  readonly luxCount = input(1);

  /** Schaltet die Puls-Animation ab, z. B. für visuelle Regressionstests. */
  readonly luxAnimated = input(true);

  protected readonly items = computed(() => Array.from({ length: Math.max(1, this.luxCount()) }));
}
