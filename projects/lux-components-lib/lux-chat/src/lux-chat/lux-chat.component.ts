import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  contentChild,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  LuxAriaLabelDirective,
  LuxAutofocusDirective,
  LuxButtonComponent,
  LuxDividerComponent,
  LuxTextareaAcComponent
} from '@ihk-gfi/lux-components';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { LuxChatController } from './lux-chat-controller';
import { LuxChatData } from './lux-chat-data';
import { LuxChatMessageData } from './lux-chat-message-data';
import { LuxChatRelativeUntilTimestamp } from './lux-chat-relative-until-timestamp.pipe';
import { LuxChatEntryComponent } from './lux-chat-subcomponents/lux-chat-entry.component';
import { LuxChatHeaderComponent } from './lux-chat-subcomponents/lux-chat-header.component';

const HEADER_SHOW_TIME_OFFSET = 1000 * 60 * 10;
const DAY_IN_MILLIS = 1000 * 60 * 60 * 24;

@Component({
  selector: 'lux-chat',
  providers: [{ provide: LuxChatController, useExisting: LuxChatComponent }],
  imports: [
    CommonModule,
    LuxButtonComponent,
    LuxDividerComponent,
    LuxTextareaAcComponent,
    LuxAriaLabelDirective,
    TranslocoPipe,
    LuxChatRelativeUntilTimestamp,
    LuxAutofocusDirective
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lux-chat.component.html'
})
export class LuxChatComponent extends LuxChatController {
  private tService = inject(TranslocoService);

  public luxChatData = input<LuxChatData>();
  public luxChatUserName = input<string>();
  public chatPopupMode = model<boolean>();
  public luxAutoFocus = input<boolean>(false);

  public chatInput = '';

  public chatBase = viewChild<ElementRef>('chatBase');

  public luxChatOutput = output<string>();
  public chatClose = output<void>();
  public chatFullscreen = output<boolean>();
  public _chatFullscreen = signal(false);

  public luxChatHeaderComponent = contentChild(LuxChatHeaderComponent);
  public luxChatEntryComponent = contentChild(LuxChatEntryComponent);

  public locale = signal('de-DE');

  constructor() {
    super();

    this.tService.langChanges$.pipe(takeUntilDestroyed()).subscribe((lang) => {
      this.locale.set(this.parseMatLocale(lang));
    });

    // Darstellungsdaten der Nachrichten (eigene Nachricht, Datumstrenner, Zeitangabe) ableiten.
    // LuxChatData.messages ist signalbasiert, deshalb läuft dieser Effect bei jeder neuen Nachricht
    // (addMessage() bzw. Zuweisung von messages) und bei einem neuen Nutzernamen erneut.
    effect(() => {
      const messages = this.luxChatData()?.messages ?? [];
      const userName = this.luxChatUserName();

      messages.forEach((message, index) => {
        message.metadata['_isUser'] = message.user === userName;
        this.updateTimeSplits(message, index);
      });
    });
  }

  public checkShowDateSplit(item: LuxChatMessageData, index: number): boolean {
    //No message previously
    if (index <= 0) return true;

    //Previous message
    const prevItem = this.luxChatData()?.messages[index - 1];

    if (!prevItem) return true;

    //Prev Entry was more than a day ago
    return this.calcDiff(prevItem.time, item.time) >= 1;
  }

  private calcDiff(a: Date, b: Date) {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / DAY_IN_MILLIS);
  }

  public checkShowEntryHeaderTime(item: LuxChatMessageData, index: number): boolean {
    //No message previously
    if (index <= 0) return true;

    //Previous message
    const prevItem = this.luxChatData()?.messages[index - 1];

    if (!prevItem) return true;

    //Time difference is greater than [10 minutes]
    if (item.time.getTime() > prevItem.time.getTime() + HEADER_SHOW_TIME_OFFSET) return true;

    //Users are different
    return prevItem.user !== item.user;
  }

  public onChatEntered(event: Event): void {
    //Prevent Enter key from being processed
    event.preventDefault();

    // Wie beim Senden-Button (nur bei vorhandener Eingabe sichtbar) keine leere Nachricht ausgeben
    if (!this.chatInput) {
      return;
    }

    this.luxChatOutput.emit(this.chatInput);

    this.chatInput = '';

    this.scrollToBottom();
  }

  public onChatEnterButtonPressed(): void {
    this.luxChatOutput.emit(this.chatInput);

    this.chatInput = '';

    this.scrollToBottom();
  }

  public onCloseChatClicked(): void {
    this.chatClose.emit();
  }

  public onFullscreenChatClicked(): void {
    const fullscreen = !this._chatFullscreen();
    this._chatFullscreen.set(fullscreen);
    this.chatFullscreen.emit(fullscreen);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.chatBase()?.nativeElement;
      el.scrollTo({
        top: el.scrollHeight - el.clientHeight,
        left: 0
      });
    }, 2);
  }

  private parseMatLocale(matLocale: string) {
    let locale;

    switch (matLocale) {
      case 'de':
        locale = 'de-DE';
        break;
      case 'en':
        locale = 'en-US';
        break;
      case 'fr':
        locale = 'fr-FR';
        break;
      default:
        locale = matLocale;
    }

    return locale;
  }

  private updateTimeSplits(message: LuxChatMessageData, index: number): void {
    //Show Date split ?
    message.metadata['_showDateSplit'] = this.checkShowDateSplit(message, index);

    //Show Entry Header Time ?
    message.metadata['_showEntryHeaderTime'] = this.checkShowEntryHeaderTime(message, index);
  }
}
