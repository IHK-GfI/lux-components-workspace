import { computed, OutputEmitterRef, OutputRefSubscription, Signal, signal, untracked } from '@angular/core';

/**
 * Ersetzt das bei output() weggefallene EventEmitter.observed: Zählt die über subscribe()
 * angemeldeten Listener (Template-Bindings, outputToObservable, manuelle Subscriptions)
 * und liefert ein Signal, das true ist, solange mindestens ein Listener angemeldet ist.
 *
 * Template-Listener werden im Creation-Pass des Parent-Templates angemeldet, also vor dem
 * ersten Change Detection der Komponente selbst. Das Signal ist daher bereits beim ersten
 * Rendern korrekt.
 *
 * Muss nach dem Output-Feld deklariert werden:
 * ```ts
 * readonly luxClicked = output<Event>();
 * protected readonly luxClickedObserved = luxOutputObserved(this.luxClicked);
 * ```
 */
export function luxOutputObserved<T>(outputRef: OutputEmitterRef<T>): Signal<boolean> {
  const listenerCount = signal(0);
  const originalSubscribe = outputRef.subscribe.bind(outputRef);

  outputRef.subscribe = (callback: (value: T) => void): OutputRefSubscription => {
    const subscription = originalSubscribe(callback);
    // subscribe läuft u. a. während der Template-Ausführung des Parents; untracked erlaubt dort den Signal-Write.
    untracked(() => listenerCount.update((count) => count + 1));

    let active = true;
    return {
      unsubscribe: () => {
        if (active) {
          active = false;
          subscription.unsubscribe();
          untracked(() => listenerCount.update((count) => count - 1));
        }
      }
    };
  };

  return computed(() => listenerCount() > 0);
}
