import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';

export const day = $localize`:@@luxc.relative-timestamp.days:Tagen`;
export const week = $localize`:@@luxc.relative-timestamp.weeks:Wochen`;
export const month = $localize`:@@luxc.relative-timestamp.months:Monaten`;
export const year = $localize`:@@luxc.relative-timestamp.years:Jahren`;
export const today = $localize`:@@luxc.relative-timestamp.today:Heute`;
export const yesterday = $localize`:@@luxc.relative-timestamp.yesterday:Gestern`;
export const tomorrow = $localize`:@@luxc.relative-timestamp.tomorrow:Morgen`;
export const prefixFuture = $localize`:@@luxc.relative-timestamp.in:in`;
export const prefixPast = $localize`:@@luxc.relative-timestamp.ago:vor`;

export const MS_PER_DAY = 1000 * 60 * 60 * 24;

export const timeDeltas = [
  { name: year, days: 672, dayUnit: 336 },
  { name: month, days: 56, dayUnit: 28 },
  { name: week, days: 14, dayUnit: 7 },
  { name: day, days: 2, dayUnit: 1 }
];

export const timeDeltasRelative = [
  { name: tomorrow, days: 1 },
  { name: yesterday, days: -1 },
  { name: today, days: 0 }
];

@Pipe({ name: 'luxRelativeTimestamp' })
export class LuxRelativeTimestampPipe implements PipeTransform {
  private matDateLocale = inject(LOCALE_ID);

  transform(timestamp: number | Date | null, defaultText = '', prefix?: string, relativeUntilMin?: number, relativeUntilMax?: number): string {
    if (!timestamp) {
      return defaultText;
    }

    const now = new Date();
    const then = timestamp instanceof Date ? timestamp : new Date(timestamp);

    const delta = this.calcDiff(now, then);
    let timeName = null;

    let showAsRelative = true;
    if(relativeUntilMin !== undefined && delta <= relativeUntilMin) {
      showAsRelative = false;
    } else if(relativeUntilMax != undefined && delta > relativeUntilMax){
      showAsRelative = false;
    }

    if(showAsRelative){
      for (const timeDelta of timeDeltas) {
        const tempDelta = delta < 0 ? delta * -1 : delta;

        if (tempDelta >= timeDelta.days) {
          let timeUnits = timeDelta.name === day ? tempDelta : Math.floor(tempDelta / timeDelta.dayUnit);
          timeUnits *= timeUnits < 0 ? -1 : 1;

          if (!prefix) {
            if (delta < 0) {
              timeName = $localize`:@@luxc.relative-timestamp.past:${prefixPast} ${timeUnits} ${timeDelta.name}`;
            } else {
              timeName = $localize`:@@luxc.relative-timestamp.future:${prefixFuture} ${timeUnits} ${timeDelta.name}`;
            }
          } else {
            timeName = `${prefix} ${timeUnits} ${timeDelta.name}`;
          }
          break;
        }
      }

      if (timeName === null) {
        for (const timeDelta of timeDeltasRelative) {
          if (delta === timeDelta.days) {
            timeName = timeDelta.name;
            break;
          }
        }
      }
    } else {
      const locale = this.getLocale();
      const weekdayLong = then.toLocaleString(locale, { weekday: 'long' });
      const monthNameLong = then.toLocaleString(locale, { month: 'long' });
      
      timeName = weekdayLong + ", " + then.getDate() + ". " + monthNameLong;

      if(then.getUTCFullYear() < now.getUTCFullYear()){
        const year = then.toLocaleString(locale, { year: 'numeric' })
        timeName += " " + year;
      }
    }

    return timeName ?? '';
  }

  private getLocale(){
    let locale;

    switch (this.matDateLocale) {
      case 'de':
        locale = 'de-De';
        break;
      case 'en':
        locale = 'en-US';
        break;
      case 'fr':
        locale = 'fr-FR';
        break;
      default:
        locale = this.matDateLocale;
    }

    return locale;
  }

  private calcDiff(a: Date, b: Date) {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / MS_PER_DAY);
  }
}
