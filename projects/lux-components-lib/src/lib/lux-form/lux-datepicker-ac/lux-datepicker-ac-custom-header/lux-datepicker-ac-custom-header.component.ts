import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, inject } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LuxButtonComponent } from '../../../lux-action/lux-button/lux-button.component';

@Component({
  selector: 'lux-datepicker-ac-custom-header',
  templateUrl: './lux-datepicker-ac-custom-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxButtonComponent]
})
export class LuxDatepickerAcCustomHeaderComponent<D> implements OnDestroy {
  private _calendar = inject<MatCalendar<D>>(MatCalendar);
  private _dateAdapter = inject<DateAdapter<D>>(DateAdapter);
  private _dateFormats = inject<MatDateFormats>(MAT_DATE_FORMATS);

  private _destroyed = new Subject<void>();

  constructor() {
    const _calendar = this._calendar;
    const cdr = inject(ChangeDetectorRef);

    _calendar.stateChanges.pipe(takeUntil(this._destroyed)).subscribe(() => cdr.markForCheck());
  }

  ngOnDestroy() {
    this._destroyed.next();
    this._destroyed.complete();
  }

  get periodLabel() {
    return this._dateAdapter.format(this._calendar.activeDate, this._dateFormats.display.monthYearLabel);
  }
  previousClicked(mode: 'month' | 'year') {
    this._calendar.activeDate =
      mode === 'month'
        ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1)
        : this._dateAdapter.addCalendarYears(this._calendar.activeDate, -1);
  }

  nextClicked(mode: 'month' | 'year') {
    this._calendar.activeDate =
      mode === 'month'
        ? this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1)
        : this._dateAdapter.addCalendarYears(this._calendar.activeDate, 1);
  }

  currentPeriodClicked() {
    this._calendar.currentView = 'multi-year';
  }
}
