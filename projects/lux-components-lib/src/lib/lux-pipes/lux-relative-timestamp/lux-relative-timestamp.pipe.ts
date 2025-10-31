import { ChangeDetectorRef, inject, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Subscription } from 'rxjs';

export const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const timeDeltas = [
  { id: 'years', days: 672, dayUnit: 336 },
  { id: 'months', days: 56, dayUnit: 28 },
  { id: 'weeks', days: 14, dayUnit: 7 },
  { id: 'days', days: 2, dayUnit: 1 }
];

export const timeDeltasRelative = [
  { id: 'tomorrow', days: 1 },
  { id: 'yesterday', days: -1 },
  { id: 'today', days: 0 }
];

@Pipe({ name: 'luxRelativeTimestamp', pure: false })
export class LuxRelativeTimestampPipe implements PipeTransform, OnDestroy {
  private tService = inject(TranslocoService);
  // ChangeDetectorRef is only available when Angular creates the pipe inside a view. For unit tests
  // where we manually instantiate the pipe, we allow it to be optional to avoid NG0201.
  private cdr = inject(ChangeDetectorRef, { optional: true });
  private langSub?: Subscription;
  private lastArgs?: { timestamp: number | null; defaultText: string; prefix?: string };
  private lastResult = '';

  constructor() {
    // Bei Sprachwechsel erneute Berechnung forcieren
    this.langSub = this.tService.langChanges$.subscribe(() => {
      if (this.lastArgs) {
        this.lastResult = this.compute(this.lastArgs.timestamp, this.lastArgs.defaultText, this.lastArgs.prefix);
        this.cdr?.markForCheck();
      }
    });
  }

  transform(timestamp: number | null, defaultText = '', prefix?: string): string {
    this.lastArgs = { timestamp, defaultText, prefix };
    this.lastResult = this.compute(timestamp, defaultText, prefix);
    return this.lastResult;
  }

  private compute(timestamp: number | null, defaultText = '', prefix?: string): string {
    if (!timestamp) {
      return defaultText;
    }

    const now = new Date();
    const then = new Date(timestamp);

    const delta = this.calcDiff(now, then);
    let timeName = null;

    for (const timeDelta of timeDeltas) {
      const tempDelta = delta < 0 ? delta * -1 : delta;

      if (tempDelta >= timeDelta.days) {
        let timeUnits = timeDelta.id === 'days' ? tempDelta : Math.floor(tempDelta / timeDelta.dayUnit);
        timeUnits *= timeUnits < 0 ? -1 : 1;

        if (!prefix) {
          if (delta < 0) {
            timeName = this.tService.translate('luxc.relative-timestamp.past', {
              prefix: this.tService.translate('luxc.relative-timestamp.ago'),
              timeUnits: timeUnits,
              timeDelta: this.tService.translate('luxc.relative-timestamp.' + timeDelta.id)
            });
          } else {
            timeName = this.tService.translate('luxc.relative-timestamp.future', {
              prefix: this.tService.translate('luxc.relative-timestamp.in'),
              timeUnits: timeUnits,
              timeDelta: this.tService.translate('luxc.relative-timestamp.' + timeDelta.id)
            });
          }
        } else {
          timeName = `${prefix} ${timeUnits} ` + this.tService.translate('luxc.relative-timestamp.' + timeDelta.id);
        }
        break;
      }
    }

    if (timeName === null) {
      for (const timeDelta of timeDeltasRelative) {
        if (delta === timeDelta.days) {
          timeName = this.tService.translate('luxc.relative-timestamp.' + timeDelta.id);
          break;
        }
      }
    }
    return timeName ?? '';
  }

  private calcDiff(a: Date, b: Date) {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / MS_PER_DAY);
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }
}
