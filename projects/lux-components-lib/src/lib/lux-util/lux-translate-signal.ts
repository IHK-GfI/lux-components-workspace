import { computed, inject, Signal } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

/**
 * Übersetzt einen LUX-Key als Signal, das einem Sprachwechsel folgt.
 *
 * Ersatz für translateSignal() aus Transloco: Dieses übernimmt den TRANSLOCO_SCOPE aus dem
 * Injector der konsumierenden App (z.B. provideTranslocoScope('todos')) und sucht dann nach
 * "todos.luxc.…". Die LUX-Keys liegen aber in den globalen Übersetzungen; translate() ignoriert
 * den Scope.
 *
 * Voraussetzung wie bei activeLang(): Die Übersetzungen der neuen Sprache sind vor
 * setActiveLang() geladen (so machen es der App-Initializer und lux-lang-select).
 *
 * Muss im Injection Context aufgerufen werden (z.B. im Feld-Initializer einer Komponente).
 *
 * @example
 * ```ts
 * private readonly defaultLabel = luxTranslateSignal('luxc.list.arialabel');
 * ```
 */
export function luxTranslateSignal(key: string, params?: Record<string, unknown>): Signal<string> {
  const tService = inject(TranslocoService);

  return computed(() => {
    tService.activeLang();
    return tService.translate(key, params);
  });
}
