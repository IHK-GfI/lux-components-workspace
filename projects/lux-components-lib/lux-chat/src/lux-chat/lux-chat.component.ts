import { Component, effect, ElementRef, inject, input, model, output, viewChild } from '@angular/core';
import { LuxChatData } from './lux-chat-data';
import { LuxChatMessageData } from './lux-chat-message-data';
import { CommonModule } from '@angular/common';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { LuxDividerComponent, LuxTextareaAcComponent, LuxAriaLabelDirective, LuxButtonComponent } from '@ihk-gfi/lux-components';
import { LuxChatRelativeUntilTimestamp } from "./lux-chat-relative-until-timestamp.pipe";
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const HEADER_SHOW_TIME_OFFSET = 1000 * 60 * 10;
const DAY_IN_MILLIS = 1000 * 60 * 60 * 24;

@Component({
  selector: 'lux-chat',
  imports: [
    CommonModule,
    LuxButtonComponent,
    LuxDividerComponent,
    LuxTextareaAcComponent,
    LuxAriaLabelDirective,
    TranslocoPipe,
    LuxChatRelativeUntilTimestamp
],
  templateUrl: './lux-chat.component.html'
})
export class LuxChatComponent {
  
  private tService = inject(TranslocoService);

  public luxChatData = input<LuxChatData>();
  public luxChatUserName = input<string>();
  public showFullscreenButton = model<boolean>();
  public showCloseButton = model<boolean>();

  public chatInput = "";

  public chatBase = viewChild<ElementRef>("chatBase");

  public luxChatOutput = output<string>();
  public chatClose = output<void>();
  public chatFullscreen = output<boolean>();
  public _chatFullscreen = false;


  public locale = "de-DE";

  constructor(){
    this.tService.langChanges$.pipe(takeUntilDestroyed()).subscribe((lang) => {
      this.locale = this.parseMatLocale(lang);
    });

    //Init Chat Data with username
    effect(() => {
      const _chatData = this.luxChatData();
      const _userName = this.luxChatUserName();

      if(!_chatData?.messages) return;

      for(const message of _chatData.messages){
        message.metadata["_isUser"] = message.user === _userName;
      }
    });

    //Init Chat Data for time splits
    effect(() => {
      const _chatData = this.luxChatData();
      if(!_chatData) return;
      
      _chatData.messageAddedEvents.subscribe((message) => {
        message.metadata["_isUser"] = message.user === this.luxChatUserName();
        
        const _innerChatData = this.luxChatData();
        if(!_innerChatData) return;

        this.updateTimeSplits(message, _innerChatData.messages.length-1);
      });

      for(let index=0; index < _chatData.messages.length; index++){
        const message = _chatData.messages[index];
        this.updateTimeSplits(message, index);
      }
    });

  }

  public isMessageFromUser(item: LuxChatMessageData): boolean {
    return item.user === this.luxChatUserName();
  }

  public checkShowDateSplit(item: LuxChatMessageData, index: number): boolean {
    //No message previously
    if(index <= 0) return true;

    //Previous message
    const prevItem = this.luxChatData()?.messages[index - 1];

    if(!prevItem) return true;

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
    if(index <= 0) return true;

    //Previous message
    const prevItem = this.luxChatData()?.messages[index - 1];

    if(!prevItem) return true;

    //Time difference is greater than [10 minutes]
    if(item.time.getTime() > (prevItem.time.getTime() + HEADER_SHOW_TIME_OFFSET)) return true;

    //Users are different
    return prevItem.user !== item.user;
  }

  public onChatEntered(event: Event): void {
    //Prevent Enter key from being processed
    event.preventDefault();

    this.luxChatOutput.emit(this.chatInput)

    this.chatInput = "";

    this.scrollToBottom();
  }

  public onCloseChatClicked(): void {
    this.chatClose.emit();
  }

  public onFullscreenChatClicked(): void {
    this._chatFullscreen = !this._chatFullscreen;
    this.chatFullscreen.emit(this._chatFullscreen);
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

  private parseMatLocale(matLocale: string){
    let locale;

    switch (matLocale) {
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
        locale = matLocale;
    }

    return locale;
  }

  private updateTimeSplits(message: LuxChatMessageData, index: number): void {
    //Show Date split ?
    message.metadata["_showDateSplit"] = this.checkShowDateSplit(message, index);
    
    //Show Entry Header Time ?
    message.metadata["_showEntryHeaderTime"] = this.checkShowEntryHeaderTime(message, index);
  }
}
