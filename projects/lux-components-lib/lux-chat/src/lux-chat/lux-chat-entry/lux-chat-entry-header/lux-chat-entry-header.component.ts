import { CommonModule } from '@angular/common';
import { Component, contentChild, TemplateRef, viewChild } from '@angular/core';
import { LuxChatDataEntry } from '../../lux-chat-data-entry';

const HEADER_SHOW_TIME_OFFSET = 1000 * 60 * 10;

@Component({
  selector: 'lux-chat-entry-header',
  imports: [
    CommonModule
  ],
  templateUrl: './lux-chat-entry-header.component.html',
  styleUrl: './lux-chat-entry-header.component.scss'
})
export class LuxChatEntryHeaderComponent {

  public templateRef = viewChild.required<TemplateRef<any>>("core");
  public headerTemplateRef = contentChild(TemplateRef);

  checkShowHeader(item: LuxChatDataEntry): boolean {
    const chat = item.chatControlRef.chat;
    if(chat === undefined) return true;

    const chatData = chat.data;
    const index = chatData.indexOf(item);

    //No message previously
    if(index <= 0) return true;

    const prevItem = chatData[index - 1];
    
    //Users are different
    if(prevItem.user !== item.user) return true;

    //Time difference is greater than [10 minutes]
    return (item.time.getTime() > (prevItem.time.getTime() + HEADER_SHOW_TIME_OFFSET));
  }

}
