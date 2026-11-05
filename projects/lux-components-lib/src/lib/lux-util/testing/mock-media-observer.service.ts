import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Test-Ersatz für den LuxMediaQueryObserverService. Der aktuelle Breakpoint lässt sich über
 * emitMediaQuery() (bzw. mediaQueryChanged.next()) setzen; activeMediaQuery und die Vergleiche
 * (isSmallerOrEqual) folgen ihm wie im echten Service.
 */
@Injectable()
export class MockMediaObserverService implements OnDestroy {
  mediaQueryChanged: BehaviorSubject<string> = new BehaviorSubject<string>('md');

  ngOnDestroy() {
    this.mediaQueryChanged.complete();
  }

  public get activeMediaQuery(): string {
    return this.mediaQueryChanged.getValue();
  }

  public getMediaQueryChangedAsObservable(): Observable<string> {
    return this.mediaQueryChanged.asObservable();
  }

  /** Simuliert einen Wechsel des Breakpoints (z.B. 'xs' für ein Smartphone). */
  public emitMediaQuery(query: string) {
    this.mediaQueryChanged.next(query);
  }

  public isSmallerOrEqual(query: string): boolean {
    return MockMediaObserverService.sizeAsNumber(this.activeMediaQuery) - MockMediaObserverService.sizeAsNumber(query) <= 0;
  }

  // Dieselbe Reihenfolge wie im LuxMediaQueryObserverService, unbekannte Werte zählen als 0.
  private static sizeAsNumber(query: string): number {
    return ['xs', 'sm', 'md', 'lg', 'xl'].indexOf(query) + 1;
  }
}
