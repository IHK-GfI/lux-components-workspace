import { Component, ContentChild, ElementRef, Input, ViewChild } from '@angular/core';
import { LuxChatHeaderComponent } from './lux-chat-header/lux-chat-header.component';
import { LuxChatInputComponent } from './lux-chat-input/lux-chat-input.component';
import { LuxChatData } from './lux-chat-data';
import { CommonModule } from '@angular/common';
import { LuxChatEntryComponent } from "./lux-chat-entry/lux-chat-entry.component";
import { LuxChatControlRef } from './lux-chat-control-ref';
import { ScrollController } from './lux-chat-scroll-controller';
import { LuxDividerComponent, LuxRelativeTimestampPipe, LuxTextareaAcComponent } from '@ihk-gfi/lux-components';

@Component({
  selector: 'lux-chat',
  imports: [
    CommonModule,
    LuxDividerComponent,
    LuxChatHeaderComponent,
    LuxChatInputComponent,
    LuxChatEntryComponent,
    LuxTextareaAcComponent,
    LuxRelativeTimestampPipe
],
  templateUrl: './lux-chat.component.html',
  styleUrl: './lux-chat.component.scss'
})
export class LuxChatComponent implements LuxChatControlRef {
  
  @ContentChild(LuxChatHeaderComponent) 
  public compChatHeader?: LuxChatHeaderComponent;

  @ContentChild(LuxChatEntryComponent)
  public compChatEntry?: LuxChatEntryComponent;

  @ContentChild(LuxChatInputComponent)
  public compChatInput?: LuxChatInputComponent;

  @ViewChild("chatBase", { read: ElementRef })
  public chatBase!: ElementRef;

  private _chatData?: LuxChatData;

  @Input()
  public set chatData(chatData: LuxChatData){
    chatData.initControl(this);
    this._chatData = chatData;
  }

  public get chatData(): LuxChatData | undefined {
    return this._chatData;
  }

  @Input()
  public userName = "User";

  public get chat(): LuxChatData | undefined {
    return this._chatData;
  }

  public chatInput = "";
  public chatAutoScroll = true;
  private scrollController = new ScrollController();


  public onChatEntered(event: Event): void {
    event.stopPropagation();

    this.chatData?.addChatEntry(this.userName, this.chatInput, new Date());
    //this.chatOut.emit(this.chatInput);

    this.chatInput = ""
  }

  public scrollToBottom(smoothScrolling = true) {
    if(!this.chatAutoScroll) return;

    this.doScrollToBottom(smoothScrolling);
  }

  public scrollToBottomForced(smoothScrolling = true) {
    this.chatAutoScroll = true;
    this.doScrollToBottom(smoothScrolling);
  }

  private doScrollToBottom(smoothScrolling = true){
    setTimeout(() =>{
      const baseEl = this.chatBase.nativeElement;
      this.scrollController.scrollTo(baseEl, baseEl.scrollHeight, 100, 10, smoothScrolling);
    }, 2);
  }

  public onChatScroll(e: any){
    const scrollTop = this.chatBase.nativeElement.scrollTop;
    const scrollHeight = this.chatBase.nativeElement.scrollHeight;
    const elHeight = this.chatBase.nativeElement.clientHeight;

    if(scrollHeight <= elHeight) return;

    if(this.chatAutoScroll && e.deltaY < 0){
      this.chatAutoScroll = false;
    }
    else if(!this.chatAutoScroll && e.deltaY > 0){
      if(scrollTop + e.deltaY + elHeight >= scrollHeight){
        this.chatAutoScroll = true;
      }
    }
  }

}
