import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

export const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const timeDeltas = [
  { id: 'year', days: 672, dayUnit: 336 },
  { id: 'month', days: 56, dayUnit: 28 },
  { id: 'week', days: 14, dayUnit: 7 },
  { id: 'day', days: 2, dayUnit: 1 }
];

export const timeDeltasRelative = [
  { id: 'tomorrow', days: 1 },
  { id: 'yesterday', days: -1 },
  { id: 'today', days: 0 }
];

@Pipe({ name: 'luxChatRelativeUntilTimestamp' })
export class LuxChatRelativeUntilTimestamp implements PipeTransform {
  private tService = inject(TranslocoService);

  transform(timestamp: number | Date | null, defaultText = '', prefix?: string, relativeUntilMin?: number, relativeUntilMax?: number, locale?: string): string {
    if (!timestamp) {
      return defaultText;
    }

    const now = new Date();
    const then = timestamp instanceof Date ? timestamp : new Date(timestamp);

    const delta = this.calcDiff(now, then);
    let timeName = null;

    let showAsRelative = true;
    if((relativeUntilMin || relativeUntilMin === 0) && delta <= relativeUntilMin) {
      showAsRelative = false;
    } else if((relativeUntilMax || relativeUntilMax === 0) && delta > relativeUntilMax){
      showAsRelative = false;
    }

    if(showAsRelative){
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
    } else {
      const weekdayLong = then.toLocaleString(locale, { weekday: 'long' });
      const monthNameLong = then.toLocaleString(locale, { month: 'long' });
      
      timeName = weekdayLong + ", " + then.getDate() + ". " + monthNameLong;

      if(then.getFullYear() < now.getFullYear()){
        const year = then.toLocaleString(locale, { year: 'numeric' })
        timeName += " " + year;
      }
    }

    return timeName ?? '';
  }

  private calcDiff(a: Date, b: Date) {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / MS_PER_DAY);
  }
}
