import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NgClass } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostBinding, Input, Output, ViewChild, inject } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxPaginatorIntl } from '../../lux-util/lux-paginator-intl';
import { visibilityTrigger } from './lux-message-box-model/lux-message-box.animations';
import { ILuxMessageChangeEvent, ILuxMessageCloseEvent } from './lux-message-box-model/lux-message-events.interface';
import { ILuxMessage } from './lux-message-box-model/lux-message.interface';
import { LuxMessageComponent } from './lux-message-box-subcomponents/lux-message.component';

@Component({
  selector: 'lux-message-box',
  templateUrl: './lux-message-box.component.html',
  animations: [visibilityTrigger],
  providers: [{ provide: MatPaginatorIntl, useClass: LuxPaginatorIntl }],
  imports: [LuxAriaLabelDirective, LuxMessageComponent, NgClass, MatPaginator, TranslocoPipe]
})
export class LuxMessageBoxComponent {
  private liveAnnouncer = inject(LiveAnnouncer);
  private tService = inject(TranslocoService);

  private _luxMessages: ILuxMessage[] = [];
  private _luxMaximumDisplayed = 1;
  private _luxIndex = 0;

  displayedMessages: ILuxMessage[] = [];

  @HostBinding('class.mat-elevation-z4') boxShadow = true;

  @ViewChild('messagebox', { static: false }) messageBoxElRef?: ElementRef;

  @Output() luxMessageChanged = new EventEmitter<ILuxMessageChangeEvent>();
  @Output() luxMessageClosed = new EventEmitter<ILuxMessageCloseEvent>();
  @Output() luxMessageBoxClosed = new EventEmitter<void>();
  @Output() luxMessagesChange = new EventEmitter<ILuxMessage[]>();

  @Input() luxGrabFocus = false;
  @Input() set luxIndex(index: number) {
    if (index < 0) {
      index = 0;
    }
    if (index > this.luxMessages.length) {
      index = this.luxMessages.length;
    }

    this._luxIndex = index;
    this.updateDisplayedMessages(index);
  }

  get luxIndex(): number {
    return this._luxIndex;
  }

  @Input() set luxMaximumDisplayed(max: number) {
    if (max < 0) {
      max = 0;
    }
    this._luxMaximumDisplayed = max;

    this.updateDisplayedMessages(this.luxIndex);
  }

  get luxMaximumDisplayed(): number {
    return this._luxMaximumDisplayed;
  }

  @Input() set luxMessages(messages: ILuxMessage[]) {
    if (messages && messages.length > 0) {
      this._luxMessages = messages;
      this.updateDisplayedMessages(this.luxIndex);

      setTimeout(() => {
        if (this.luxGrabFocus) {
          if (this.messageBoxElRef) {
            this.messageBoxElRef.nativeElement.focus();
          }
        } else {
          let messageText = '';
          if (messages.length === 1) {
            messageText += this.tService.translate('luxc.message.announce.1_message');
          } else {
            messageText += this.tService.translate('luxc.message.announce.x_messages', { count: messages.length });
          }
          messages.forEach((message) => (messageText += message.text + '\n'));
          this.liveAnnouncer.announce(messageText);
        }
      });
    } else {
      // Wenn es vorher Werte gab, ein Closed-Event ausgeben
      if (this.luxMessages.length > 0) {
        this.luxMessageBoxClosed.emit();
      }
      this._luxMessages = [];
      this.liveAnnouncer.announce(this.tService.translate('luxc.message.announce.0_messages'));
    }

    this.luxMessagesChange.emit(this._luxMessages);
  }

  get luxMessages(): ILuxMessage[] {
    return this._luxMessages;
  }

  /**
   * Wird aufgerufen, wenn der Close-Button für eine MessageBox aufgerufen wurde.
   *
   * Gibt eine Event-Payload mit der betroffenen Nachricht mit Index weiter.
   * @param closedMessage
   */
  messageClosed(closedMessage: ILuxMessage) {
    const eventPayload: ILuxMessageCloseEvent = {
      index: this.luxMessages.findIndex((compareMessage: ILuxMessage) => compareMessage === closedMessage),
      message: closedMessage
    };
    this.luxMessageClosed.emit(eventPayload);

    this.luxMessages = this.luxMessages.filter((message: ILuxMessage) => message !== closedMessage);
  }

  /**
   * Aktualisiert die angezeigten Nachrichten und den Paginator,
   * gibt außerdem das Change-Event mit den angezeigten/vorherigen Nachrichten.
   * @param pageEvent
   */
  pageChanged(pageEvent: PageEvent) {
    const previousDisplayedMessages = [...this.displayedMessages];
    const previousIndex = this.luxIndex;

    this.updateDisplayedMessages(pageEvent.pageIndex);

    const messageChangePayload: ILuxMessageChangeEvent = {
      currentPage: {
        index: this.luxIndex,
        messages: [...this.displayedMessages]
      },
      previousPage: {
        index: previousIndex,
        messages: previousDisplayedMessages
      }
    };

    this.luxMessageChanged.emit(messageChangePayload);
  }

  /**
   * Aktualisiert die aktuell angezeigten Nachrichten anhand des Index.
   * @param pageIndex
   */
  updateDisplayedMessages(pageIndex: number) {
    const start = pageIndex * this.luxMaximumDisplayed;
    const end = start + this.luxMaximumDisplayed;

    // Wenn der luxIndex und der PageIndex ungleich sind, den luxIndex aktualisieren
    if (this.luxIndex !== pageIndex) {
      this._luxIndex = pageIndex;
    }

    // Checken, ob der Index nicht die Array-Größe sprengt
    if (this.luxIndex > this.luxMessages.length) {
      this._luxIndex = this.luxMessages.length;
    }

    if (this.luxIndex < 0) {
      this._luxIndex = 0;
    }

    // Nachrichten aktualisieren
    this.displayedMessages = this.luxMessages.slice(start, end);

    // Wenn die angezeigten Nachrichten leer sind, aber noch weitere vorhanden sind, die vorherige Seite anzeigen
    if (this.displayedMessages.length === 0 && this.luxMessages.length > 0 && this.luxIndex > 0) {
      this.updateDisplayedMessages(this.luxIndex - 1);
    }
  }
}
