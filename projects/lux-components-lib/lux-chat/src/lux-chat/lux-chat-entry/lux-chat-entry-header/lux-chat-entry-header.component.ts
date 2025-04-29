import { CommonModule } from '@angular/common';
import { Component, ContentChild, TemplateRef, ViewChild } from '@angular/core';
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
  
  @ViewChild("core", { read: TemplateRef, static: true }) public templateRef!: TemplateRef<any>;
  @ContentChild(TemplateRef) headerTemplateRef?: TemplateRef<any>;

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
