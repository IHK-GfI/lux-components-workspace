import { Directionality } from '@angular/cdk/bidi';
import { ESCAPE } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, OverlayRef, PositionStrategy, ScrollStrategy } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

import {
  ChangeDetectionStrategy,
  Component,
  ComponentRef,
  DOCUMENT,
  EventEmitter,
  Output,
  ViewContainerRef,
  inject,
  input,
  output
} from '@angular/core';
import { MAT_DATEPICKER_SCROLL_STRATEGY, MatDateSelectionModel } from '@angular/material/datepicker';
import { merge, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { LuxThemePalette } from '../../../lux-util/lux-colors.enum';
import { LuxDateFilterAcFn } from '../../lux-datepicker-ac/lux-datepicker-ac.component';
import { LuxDatetimeOverlayContentAcComponent } from './lux-datetime-overlay-content-ac.component';

const defaultDateFilterFn: LuxDateFilterAcFn = () => true;

@Component({
  selector: 'lux-datetime-overlay-ac',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ''
})
export class LuxDatetimeOverlayAcComponent {
  readonly luxPickerInput = input.required<HTMLInputElement>();
  readonly luxStartView = input<'month' | 'year' | 'multi-year'>('month');
  readonly luxStartDate = input<Date | null>(null);
  readonly luxStartTime = input<number[]>([]);
  readonly luxMinDate = input<Date | null>(null);
  readonly luxMaxDate = input<Date | null>(null);
  readonly selectedDate = input<string | undefined>(undefined);

  readonly luxCustomFilter = input<LuxDateFilterAcFn, LuxDateFilterAcFn | undefined>(defaultDateFilterFn, {
    transform: (customFilterFn) => customFilterFn ?? defaultDateFilterFn
  });

  readonly luxSelected = output<Date>();

  // openedStream/closedStream werden vom Material-Interface MatDatepickerPanel als EventEmitter
  // erwartet (mat-datepicker-toggle [for]), deshalb hier bewusst kein output().
  @Output() readonly openedStream = new EventEmitter<void>();
  @Output() readonly closedStream = new EventEmitter<void>();

  stateChanges = new Subject<void>();
  hasBackdrop = true;
  opened = false;
  scrollStrategy: () => ScrollStrategy;

  // Code des Interfaces "MatDatepickerPanel<MatDatepickerControl<any>, any, any>" - Start
  id = '';
  disabled = false;
  color: LuxThemePalette = 'primary';
  // Code des Interfaces "MatDatepickerPanel<MatDatepickerControl<any>, any, any>" - Ende

  dateTimePortal?: ComponentPortal<LuxDatetimeOverlayContentAcComponent>;
  lastFocusedElement: Element | null = null;
  overlayRef?: OverlayRef;
  overlayComponentRef?: ComponentRef<LuxDatetimeOverlayContentAcComponent> | null;
  datepickerInput: any;

  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private document = inject(DOCUMENT, { optional: true });
  private _dir = inject(Directionality, { optional: true });

  constructor() {
    const scrollStrategy = inject(MAT_DATEPICKER_SCROLL_STRATEGY);

    this.scrollStrategy = scrollStrategy;
  }

  // Code des Interfaces "MatDatepickerPanel<MatDatepickerControl<any>, any, any>"
  registerInput(input: any): MatDateSelectionModel<any> {
    return null as any;
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

  private _createOverlayPositionStrategy(): PositionStrategy {
    return this.overlay
      .position()
      .flexibleConnectedTo(this.luxPickerInput())
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
