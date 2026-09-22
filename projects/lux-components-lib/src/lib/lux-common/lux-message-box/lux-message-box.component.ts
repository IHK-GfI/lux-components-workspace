import { LiveAnnouncer } from '@angular/cdk/a11y';
import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild
} from '@angular/core';
import { LuxPageEvent, LuxPaginatorComponent } from '@ihk-gfi/lux-components/lux-paginator';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { LuxAriaLabelDirective } from '../../lux-directives/lux-aria/lux-aria-label.directive';
import { ILuxMessageChangeEvent, ILuxMessageCloseEvent } from './lux-message-box-model/lux-message-events.interface';
import { ILuxMessage } from './lux-message-box-model/lux-message.interface';
import { LuxMessageComponent } from './lux-message-box-subcomponents/lux-message.component';

@Component({
  selector: 'lux-message-box',
  templateUrl: './lux-message-box.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.mat-elevation-z4]': 'boxShadow()'
  },
  imports: [LuxAriaLabelDirective, LuxMessageComponent, NgClass, LuxPaginatorComponent, TranslocoPipe]
})
export class LuxMessageBoxComponent {
  readonly luxGrabFocus = input(false);
  readonly luxIndex = model(0);
  readonly luxMaximumDisplayed = model(1);
  readonly luxMessages = model<ILuxMessage[]>([]);

  luxMessageChanged = output<ILuxMessageChangeEvent>();
  luxMessageClosed = output<ILuxMessageCloseEvent>();
  luxMessageBoxClosed = output<void>();

  readonly messageBoxElRef = viewChild<ElementRef>('messagebox');

  boxShadow = signal(true);

  private readonly liveAnnouncer = inject(LiveAnnouncer);
  private readonly tService = inject(TranslocoService);
  private previousMessages: ILuxMessage[] = [];

  private readonly clampedMaximumDisplayed = computed(() => Math.max(0, this.luxMaximumDisplayed()));

  private readonly totalPages = computed(() => {
    const max = this.clampedMaximumDisplayed();
    const length = this.luxMessages().length;

    if (max <= 0) {
      return length > 0 ? 1 : 0;
    }

    return Math.ceil(length / max);
  });

  readonly clampedIndex = computed(() => {
    const lastPageIndex = Math.max(0, this.totalPages() - 1);
    return Math.min(Math.max(this.luxIndex(), 0), lastPageIndex);
  });

  readonly displayedMessages = computed(() => {
    const max = this.clampedMaximumDisplayed();
    const start = this.clampedIndex() * max;
    const end = start + max;
    return this.luxMessages().slice(start, end);
  });

  constructor() {
    effect(() => {
      const messages = this.luxMessages();
      const hadMessages = this.previousMessages.length > 0;

      if (messages && messages.length > 0) {
        setTimeout(() => {
          if (this.luxGrabFocus()) {
            this.messageBoxElRef()?.nativeElement.focus();
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
        if (hadMessages) {
          this.luxMessageBoxClosed.emit();
        }
        this.liveAnnouncer.announce(this.tService.translate('luxc.message.announce.0_messages'));
      }

      this.previousMessages = messages;
    });
  }

  /**
   * Wird aufgerufen, wenn der Close-Button für eine MessageBox aufgerufen wurde.
   *
   * Gibt eine Event-Payload mit der betroffenen Nachricht mit Index weiter.
   * @param closedMessage
   */
  messageClosed(closedMessage: ILuxMessage) {
    const eventPayload: ILuxMessageCloseEvent = {
      index: this.luxMessages().findIndex((compareMessage: ILuxMessage) => compareMessage === closedMessage),
      message: closedMessage
    };
    this.luxMessageClosed.emit(eventPayload);

    this.luxMessages.update((messages) => messages.filter((message: ILuxMessage) => message !== closedMessage));
  }

  /**
   * Aktualisiert die angezeigten Nachrichten und den Paginator,
   * gibt außerdem das Change-Event mit den angezeigten/vorherigen Nachrichten.
   * @param pageEvent
   */
  pageChanged(pageEvent: LuxPageEvent) {
    const previousDisplayedMessages = [...this.displayedMessages()];
    const previousIndex = this.clampedIndex();

    this.luxIndex.set(pageEvent.pageIndex);

    const messageChangePayload: ILuxMessageChangeEvent = {
      currentPage: {
        index: this.clampedIndex(),
        messages: [...this.displayedMessages()]
      },
      previousPage: {
        index: previousIndex,
        messages: previousDisplayedMessages
      }
    };

    this.luxMessageChanged.emit(messageChangePayload);
  }
}
