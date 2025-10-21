import { Directionality } from '@angular/cdk/bidi';
import { ESCAPE } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, OverlayRef, PositionStrategy, ScrollStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import { Component, ComponentRef, ElementRef, EventEmitter, inject, Input, NgZone, Output, ViewContainerRef, DOCUMENT } from '@angular/core';
import { MAT_DATEPICKER_SCROLL_STRATEGY, MatDateSelectionModel } from '@angular/material/datepicker';
import { MatFormField } from '@angular/material/form-field';
import { merge, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LuxThemePalette } from '../../../lux-util/lux-colors.enum';
import { LuxDateFilterAcFn } from '../../lux-datepicker-ac/lux-datepicker-ac.component';
import { LuxDatetimeOverlayContentAcComponent } from './lux-datetime-overlay-content-ac.component';

@Component({
  selector: 'lux-datetime-overlay-ac',
  template: ''
})
export class LuxDatetimeOverlayAcComponent {
  private elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private ngZone = inject(NgZone);
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private document = inject(DOCUMENT, { optional: true });
  private _dir = inject(Directionality, { optional: true });
  private _formField = inject(MatFormField, { optional: true });

  @Input() luxPickerInput!: HTMLInputElement;
  @Input() luxStartView: 'month' | 'year' | 'multi-year' = 'month';
  @Input() luxStartDate: Date | null = null;
  @Input() luxStartTime: number[] = [];
  @Input() luxMinDate: Date | null = null;
  @Input() luxMaxDate: Date | null = null;

  @Output() luxSelected = new EventEmitter<Date>();
  @Output() openedStream = new EventEmitter<void>();
  @Output() closedStream = new EventEmitter<void>();

  stateChanges = new Subject<void>();
  hasBackdrop = true;
  opened = false;
  scrollStrategy: () => ScrollStrategy;
  _selectedDate?: string;
  _luxCustomFilter: LuxDateFilterAcFn = () => true;

  // Code des Interfaces "MatDatepickerPanel<MatDatepickerControl<any>, any, any>" - Start
  id = '';
  disabled = false;
  color: LuxThemePalette = 'primary';
  registerInput(input: any): MatDateSelectionModel<any> {
    return null as any;
  }
  // Code des Interfaces "MatDatepickerPanel<MatDatepickerControl<any>, any, any>" - Ende

  get luxCustomFilter() {
    return this._luxCustomFilter;
  }

  @Input()
  set luxCustomFilter(customFilterFn: LuxDateFilterAcFn | undefined) {
    this._luxCustomFilter = customFilterFn ?? (() => true);
  }

  get selectedDate() {
    return this._selectedDate;
  }

  @Input()
  set selectedDate(date: string | undefined) {
    this._selectedDate = date;
  }

  dateTimePortal?: ComponentPortal<LuxDatetimeOverlayContentAcComponent>;
  lastFocusedElement: Element | null = null;
  overlayRef?: OverlayRef;
  overlayComponentRef?: ComponentRef<LuxDatetimeOverlayContentAcComponent> | null;
  datepickerInput: any;

  constructor() {
    const scrollStrategy = inject(MAT_DATEPICKER_SCROLL_STRATEGY);

    this.scrollStrategy = scrollStrategy;
  }

  onOk(date: Date) {
    this.luxSelected.emit(date);
    this.close();
  }

  open(): void {
    if (this.opened) {
      return;
    }

    if (this.document) {
      this.lastFocusedElement = this.document.activeElement;
    }

    this.openOverlay();
    this.opened = true;
  }

  private openOverlay(): void {
    if (!this.dateTimePortal) {
      this.dateTimePortal = new ComponentPortal<LuxDatetimeOverlayContentAcComponent>(
        LuxDatetimeOverlayContentAcComponent,
        this.viewContainerRef
      );
    }

    if (!this.overlayRef) {
      this.createOverlay();
    }

    if (this.overlayRef && !this.overlayRef.hasAttached()) {
      this.overlayComponentRef = this.overlayRef.attach(this.dateTimePortal);
      this.overlayComponentRef.instance.dateTimePicker = this;
    }
  }

  private createOverlay(): void {
    const overlayConfig = new OverlayConfig({
      positionStrategy: this._createOverlayPositionStrategy(),
      hasBackdrop: this.hasBackdrop,
      backdropClass: 'mat-overlay-transparent-backdrop',
      direction: this._dir as any,
      scrollStrategy: this.scrollStrategy(),
      panelClass: 'lux-datetimepicker-overlay'
    });

    this.overlayRef = this.overlay.create(overlayConfig);
    this.overlayRef.overlayElement.setAttribute('role', 'dialog');

    merge(
      this.overlayRef.backdropClick(),
      this.overlayRef.detachments(),
      this.overlayRef.keydownEvents().pipe(
        filter((event) => {
          return event.keyCode === ESCAPE;
        })
      )
    ).subscribe((event) => {
      if (event) {
        event.preventDefault();
      }

      if (this.hasBackdrop && event) {
        this.cancel();
      } else {
        this.close();
      }
    });
  }

  public cancel(): void {
    this.close();
  }

  close(): void {
    if (!this.opened) {
      return;
    }
    if (this.overlayRef && this.overlayRef.hasAttached()) {
      this.overlayRef.detach();
    }

    if (this.dateTimePortal && this.dateTimePortal.isAttached) {
      this.dateTimePortal.detach();
    }

    if (this.lastFocusedElement instanceof HTMLElement) {
      this.lastFocusedElement.focus();
    }

    setTimeout(() => {
      if (this.opened) {
        this.opened = false;
        this.lastFocusedElement = null;
      }
    });
  }

  private _createOverlayPositionStrategy(): PositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo(this.luxPickerInput)
      .withTransformOriginOn('.lux-datetime-overlay-content')
      .withFlexibleDimensions(true)
      .withViewportMargin(8)
      .withLockedPosition()
      .withPositions([
        {
          originX: 'start',
          originY: 'bottom',
          overlayX: 'start',
          overlayY: 'top'
        },
        {
          originX: 'start',
          originY: 'top',
          overlayX: 'start',
          overlayY: 'bottom'
        },
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top'
        },
        {
          originX: 'end',
          originY: 'top',
          overlayX: 'end',
          overlayY: 'bottom'
        }
      ]);
  }
}
