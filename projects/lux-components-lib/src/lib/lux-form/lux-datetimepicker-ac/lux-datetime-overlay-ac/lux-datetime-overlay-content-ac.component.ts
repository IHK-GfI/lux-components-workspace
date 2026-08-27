import { ComponentType } from '@angular/cdk/portal';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, inject, viewChild } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { MatError } from '@angular/material/form-field';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxButtonComponent } from '../../../lux-action/lux-button/lux-button.component';
import { LuxAriaLabelDirective } from '../../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxIconComponent } from '../../../lux-icon/lux-icon/lux-icon.component';
import { LuxCardActionsComponent } from '../../../lux-layout/lux-card/lux-card-subcomponents/lux-card-actions.component';
import { LuxCardContentComponent } from '../../../lux-layout/lux-card/lux-card-subcomponents/lux-card-content.component';
import { LuxCardComponent } from '../../../lux-layout/lux-card/lux-card.component';
import { LuxDividerComponent } from '../../../lux-layout/lux-divider/lux-divider.component';
import { LuxThemeService } from '../../../lux-theme/lux-theme.service';
import { LuxDatepickerAcCustomHeaderComponent } from '../../lux-datepicker-ac/lux-datepicker-ac-custom-header/lux-datepicker-ac-custom-header.component';
import { LuxInputAcComponent } from '../../lux-input-ac/lux-input-ac.component';
import { LuxDatetimeOverlayAcComponent } from './lux-datetime-overlay-ac.component';

@Component({
  selector: 'lux-datetime-overlay-content-ac',
  templateUrl: './lux-datetime-overlay-content-ac.component.html',
  styleUrls: ['./lux-datetime-overlay-content-ac.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatCalendar,
    LuxInputAcComponent,
    MatError,
    LuxCardComponent,
    LuxCardContentComponent,
    LuxDividerComponent,
    LuxCardActionsComponent,
    LuxButtonComponent,
    LuxIconComponent,
    LuxAriaLabelDirective,
    TranslocoPipe
  ]
})
export class LuxDatetimeOverlayContentAcComponent implements OnInit, AfterViewInit {
  private elementRef = inject(ElementRef);
  private themeService = inject(LuxThemeService);

  readonly hoursInputComponent = viewChild.required<LuxInputAcComponent>('hoursInput');
  readonly minutesInputComponent = viewChild.required<LuxInputAcComponent>('minutesInput');

  dateTimePicker!: LuxDatetimeOverlayAcComponent;
  selected: Date | null = null;
  startDate: Date | null = null;
  minCalendarDate: Date | null = null;
  maxCalendarDate: Date | null = null;
  _hours = '00';
  _minutes = '00';
  touched = false;
  customHeader?: ComponentType<any>;

  get hours() {
    return this._hours;
  }

  set hours(hours) {
    let newHours = hours;

    if (+newHours > 24) {
      newHours = '24';
    }

    if (+newHours < 0) {
      newHours = '00';
    }

    this._hours = newHours;
  }

  get minutes() {
    return this._minutes;
  }

  set minutes(minutes) {
    let newMinutes = minutes;

    if (+newMinutes > 59) {
      newMinutes = '59';
    }

    if (+newMinutes < 0) {
      newMinutes = '00';
    }

    this._minutes = newMinutes;
  }

  initDate(value?: string) {
    if (value) {
      const d = new Date(value);
      this.hours = d.getUTCHours() < 10 ? '0' + d.getUTCHours() : '' + d.getUTCHours();
      this.minutes = d.getUTCMinutes() < 10 ? '0' + d.getUTCMinutes() : '' + d.getUTCMinutes();
      // UTC-Datumskomponenten verwenden, damit bei UTC-Mitternacht in allen Zeitzonen
      // der korrekte Kalendermonat angezeigt wird (z.B. 2024-04-01T00:00Z → April, nicht März).
      // Lokales Mitternacht-Datum erstellen, damit mat-calendar (_getCellCompareValue) korrekt arbeitet.
      this.selected = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
      this.startDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    } else {
      const startDate = this.dateTimePicker.luxStartDate();
      const startTime = this.dateTimePicker.luxStartTime();

      if (startDate) {
        this.startDate = startDate;
        this.selected = startDate;
      }

      if (Array.isArray(startTime) && startTime.length === 2) {
        this.hours = startTime[0] < 10 ? '0' + startTime[0] : '' + startTime[0];
        this.minutes = startTime[1] < 10 ? '0' + startTime[1] : '' + startTime[1];
      } else {
        this.hours = '';
        this.minutes = '';
      }
    }

    const minDate = this.dateTimePicker.luxMinDate();
    if (minDate) {
      this.minCalendarDate = new Date(0);
      this.minCalendarDate.setUTCFullYear(minDate.getUTCFullYear(), minDate.getUTCMonth(), minDate.getUTCDate());
    }

    const maxDate = this.dateTimePicker.luxMaxDate();
    if (maxDate) {
      this.maxCalendarDate = new Date(0);
      this.maxCalendarDate.setUTCFullYear(maxDate.getUTCFullYear(), maxDate.getUTCMonth(), maxDate.getUTCDate());
    }
  }

  constructor() {
    if (this.themeService.getTheme().name === 'green') {
      this.customHeader = LuxDatepickerAcCustomHeaderComponent;
    }
  }

  ngOnInit(): void {
    this.initDate(this.dateTimePicker.selectedDate());
  }

  ngAfterViewInit() {
    const activeCell = this.elementRef.nativeElement.querySelector('.mat-calendar-body-active');
    if (activeCell) {
      activeCell.focus();
    }
  }

  incrementHour() {
    let hoursAsNumber = +this.hours + 1;

    if (hoursAsNumber > 24) {
      hoursAsNumber = 0;
    }

    this.hours = hoursAsNumber < 10 ? '0' + hoursAsNumber : '' + hoursAsNumber;
    this.selectHours();
  }

  decrementHour() {
    let hoursAsNumber = +this.hours - 1;

    if (hoursAsNumber < 0) {
      hoursAsNumber = 24;
    }

    this.hours = hoursAsNumber < 10 ? '0' + hoursAsNumber : '' + hoursAsNumber;
    this.selectHours();
  }

  incrementMinutes() {
    let minutesAsNumber = +this.minutes + 1;

    if (minutesAsNumber > 59) {
      minutesAsNumber = 0;
    }

    this.minutes = minutesAsNumber < 10 ? '0' + minutesAsNumber : '' + minutesAsNumber;
    this.selectMinutes();
  }

  decrementMinutes() {
    let minutesAsNumber = +this.minutes - 1;

    if (minutesAsNumber < 0) {
      minutesAsNumber = 59;
    }

    this.minutes = minutesAsNumber < 10 ? '0' + minutesAsNumber : '' + minutesAsNumber;
    this.selectMinutes();
  }

  fillHours() {
    const hoursAsNumber = +this.hours;
    this.hours = hoursAsNumber < 10 ? '0' + hoursAsNumber : '' + hoursAsNumber;
  }

  fillMinutes() {
    const minutesAsNumber = +this.minutes;
    this.minutes = minutesAsNumber < 10 ? '0' + minutesAsNumber : '' + minutesAsNumber;
  }

  onOk() {
    this.touched = true;

    if (this.selected && this.hours && this.minutes) {
      const resultDate = new Date(0);
      resultDate.setUTCFullYear(this.selected.getFullYear(), this.selected.getMonth(), this.selected.getDate());
      resultDate.setUTCHours(+this.hours, +this.minutes);

      this.dateTimePicker.onOk(resultDate);
    }
  }

  selectHours() {
    setTimeout(() => {
      this.hoursInputComponent().inputElement()?.nativeElement.select();
    });
  }

  selectMinutes() {
    setTimeout(() => {
      this.minutesInputComponent().inputElement()?.nativeElement.select();
    });
  }

  // für dem Customheader für das "Green"-Theme
  getHeaderByTheme() {
    const customHeader = LuxDatepickerAcCustomHeaderComponent;
    return this.themeService.getTheme().name === 'green' ? customHeader : (null as any);
  }
}
