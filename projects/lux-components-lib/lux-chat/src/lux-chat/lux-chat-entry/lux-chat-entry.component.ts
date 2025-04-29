import { Component, ContentChild, TemplateRef, ViewChild } from '@angular/core';
import { LuxChatEntryHeaderComponent } from './lux-chat-entry-header/lux-chat-entry-header.component';
import { LuxChatEntryContentComponent } from './lux-chat-entry-content/lux-chat-entry-content.component';
import { LuxChatEntryFooterComponent } from './lux-chat-entry-footer/lux-chat-entry-footer.component';
import { LuxChatEntryActionsComponent } from './lux-chat-entry-actions/lux-chat-entry-actions.component';
import { LuxChatDataEntry } from '../lux-chat-data-entry';
import { CommonModule } from '@angular/common';
import { LuxRelativeTimestampPipe } from '@ihk-gfi/lux-components';

const DAY_IN_MILLIS = 1000 * 60 * 60 * 24;

@Component({
  selector: 'lux-chat-entry',
  imports: [
    CommonModule,
    LuxChatEntryHeaderComponent,
    LuxChatEntryContentComponent,
    LuxChatEntryFooterComponent,
    LuxRelativeTimestampPipe
  ],
  templateUrl: './lux-chat-entry.component.html',
  styleUrl: './lux-chat-entry.component.scss'
})
export class LuxChatEntryComponent {

  @ViewChild("core", { read: TemplateRef, static: true }) public templateRef!: TemplateRef<any>;

  @ContentChild(LuxChatEntryHeaderComponent) public chatEntryHeader?: LuxChatEntryHeaderComponent;
  @ContentChild(LuxChatEntryContentComponent) public chatEntryContent?: LuxChatEntryContentComponent;
  @ContentChild(LuxChatEntryFooterComponent) public chatEntryFooter?: LuxChatEntryFooterComponent;
  @ContentChild(LuxChatEntryActionsComponent) public chatEntryActions?: LuxChatEntryActionsComponent;

  public checkShowDateSplit(item: LuxChatDataEntry): boolean {
    const chat = item.chatControlRef.chat;
    if(chat === undefined) return true;

    const chatData = chat.data;
    const index = chatData.indexOf(item);

    //No message previously
    if(index <= 0) return true;

    const prevItem = chatData[index - 1];

    //Prev Entry was more than a day ago
    return this.calcDiff(prevItem.time, item.time) >= 1;
  }

  private calcDiff(a: Date, b: Date) {
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / DAY_IN_MILLIS);
  }

}
