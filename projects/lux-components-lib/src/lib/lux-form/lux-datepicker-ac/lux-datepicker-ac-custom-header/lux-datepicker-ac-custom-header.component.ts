import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { MatCalendar, MatDatepickerIntl, yearsPerPage } from '@angular/material/datepicker';
import { TranslocoPipe } from '@jsverse/transloco';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LuxButtonComponent } from '../../../lux-action/lux-button/lux-button.component';
import { LuxAriaLabelDirective } from '../../../lux-directives/lux-aria/lux-aria-label.directive';

@Component({
  selector: 'lux-datepicker-ac-custom-header',
  templateUrl: './lux-datepicker-ac-custom-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxButtonComponent, LuxAriaLabelDirective, TranslocoPipe]
})
export class LuxDatepickerAcCustomHeaderComponent<D> implements OnDestroy {
  private _calendar = inject<MatCalendar<D>>(MatCalendar);
  private _dateAdapter = inject<DateAdapter<D>>(DateAdapter);
  private _dateFormats = inject<MatDateFormats>(MAT_DATE_FORMATS);
  private _datepickerIntl = inject(MatDatepickerIntl);

  private _destroyed = new Subject<void>();

  constructor() {
    const _calendar = this._calendar;
    const cdr = inject(ChangeDetectorRef);

    merge(_calendar.stateChanges, this._datepickerIntl.changes)
      .pipe(takeUntil(this._destroyed))
      .subscribe(() => cdr.markForCheck());
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  get periodLabel() {
    const activeDate = this._calendar.activeDate;

    if (this._calendar.currentView === 'month') {
      return this._dateAdapter.format(activeDate, this._dateFormats.display.monthYearLabel);
    }

    if (this._calendar.currentView === 'year') {
      return this._dateAdapter.getYearName(activeDate);
    }

    const activeYear = this._dateAdapter.getYear(activeDate);
    const startingYear = this._calendar.maxDate
      ? this._dateAdapter.getYear(this._calendar.maxDate) - yearsPerPage + 1
      : this._calendar.minDate
        ? this._dateAdapter.getYear(this._calendar.minDate)
        : 0;
    const offset = (((activeYear - startingYear) % yearsPerPage) + yearsPerPage) % yearsPerPage;
    const firstYear = activeYear - offset;

    return this._datepickerIntl.formatYearRange(
      this._dateAdapter.getYearName(this._dateAdapter.createDate(firstYear, 0, 1)),
      this._dateAdapter.getYearName(this._dateAdapter.createDate(firstYear + yearsPerPage - 1, 0, 1))
    );
  }

  get navigationPeriod(): 'month' | 'year' | 'range' {
    switch (this._calendar.currentView) {
      case 'month':
        return 'month';
      case 'year':
        return 'year';
      case 'multi-year':
        return 'range';
    }
  }

  previousClicked() {
    this.navigate(-1);
  }

  nextClicked() {
    this.navigate(1);
  }

  currentPeriodClicked() {
    this._calendar.currentView = this._calendar.currentView === 'month' ? 'multi-year' : 'month';
  }

  private navigate(direction: 1 | -1) {
    const { activeDate, currentView } = this._calendar;

    this._calendar.activeDate =
      currentView === 'month'
        ? this._dateAdapter.addCalendarMonths(activeDate, direction)
        : this._dateAdapter.addCalendarYears(activeDate, direction * (currentView === 'year' ? 1 : yearsPerPage));
  }
}
