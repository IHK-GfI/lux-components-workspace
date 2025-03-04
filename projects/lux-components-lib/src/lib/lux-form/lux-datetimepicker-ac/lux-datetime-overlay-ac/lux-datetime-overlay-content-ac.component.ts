import { ComponentType } from '@angular/cdk/portal';
import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, OnInit, ViewChild, inject } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { MatError } from '@angular/material/form-field';
import { LuxButtonComponent } from '../../../lux-action/lux-button/lux-button.component';
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
    LuxIconComponent
  ]
})
export class LuxDatetimeOverlayContentAcComponent implements OnInit, AfterViewInit {
  private elementRef = inject(ElementRef);
  private themeService = inject(LuxThemeService);

  @ViewChild('hoursInput') hoursInputComponent!: LuxInputAcComponent;
  @ViewChild('minutesInput') minutesInputComponent!: LuxInputAcComponent;

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
      this.selected = new Date(value);
      this.hours = this.selected.getUTCHours() < 10 ? '0' + this.selected.getUTCHours() : '' + this.selected.getUTCHours();
      this.minutes = this.selected.getUTCMinutes() < 10 ? '0' + this.selected.getUTCMinutes() : '' + this.selected.getUTCMinutes();
      this.selected.setUTCHours(0, 0, 0, 0);
      this.startDate = new Date(this.selected.getTime());
    } else {
      if (this.dateTimePicker.luxStartDate) {
        this.startDate = this.dateTimePicker.luxStartDate;
        this.selected = this.startDate;
      }

      if (Array.isArray(this.dateTimePicker.luxStartTime) && this.dateTimePicker.luxStartTime.length === 2) {
        this.hours =
          this.dateTimePicker.luxStartTime[0] < 10 ? '0' + this.dateTimePicker.luxStartTime[0] : '' + this.dateTimePicker.luxStartTime[0];
        this.minutes =
          this.dateTimePicker.luxStartTime[1] < 10 ? '0' + this.dateTimePicker.luxStartTime[1] : '' + this.dateTimePicker.luxStartTime[1];
      } else {
        this.hours = '';
        this.minutes = '';
      }
    }

    if (this.dateTimePicker.luxMinDate) {
      this.minCalendarDate = new Date(0);
      this.minCalendarDate.setUTCFullYear(
        this.dateTimePicker.luxMinDate.getUTCFullYear(),
        this.dateTimePicker.luxMinDate.getUTCMonth(),
        this.dateTimePicker.luxMinDate.getUTCDate()
      );
    }

    if (this.dateTimePicker.luxMaxDate) {
      this.maxCalendarDate = new Date(0);
      this.maxCalendarDate.setUTCFullYear(
        this.dateTimePicker.luxMaxDate.getUTCFullYear(),
        this.dateTimePicker.luxMaxDate.getUTCMonth(),
        this.dateTimePicker.luxMaxDate.getUTCDate()
      );
    }
  }

  constructor() {
    if (this.themeService.getTheme().name === 'green') {
      this.customHeader = LuxDatepickerAcCustomHeaderComponent;
    }
  }

  ngOnInit(): void {
    this.initDate(this.dateTimePicker.selectedDate);
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
      this.hoursInputComponent.inputElement.nativeElement.select();
    });
  }

  selectMinutes() {
    setTimeout(() => {
      this.minutesInputComponent.inputElement.nativeElement.select();
    });
  }

  // für dem Customheader für das "Green"-Theme
  getHeaderByTheme() {
    const customHeader = LuxDatepickerAcCustomHeaderComponent;
    return this.themeService.getTheme().name === 'green' ? customHeader : (null as any);
  }
}
