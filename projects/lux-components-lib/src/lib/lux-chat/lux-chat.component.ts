import { Component, ContentChild, Input } from '@angular/core';
import { LuxDividerComponent } from '@ihk-gfi/lux-components';
import { LuxChatHeaderComponent } from './lux-chat-header/lux-chat-header.component';
import { LuxChatInputComponent } from './lux-chat-input/lux-chat-input.component';
import { LuxInputAcComponent } from "../lux-form/lux-input-ac/lux-input-ac.component";
import { LuxChatData } from './lux-chat-data';
import { CommonModule } from '@angular/common';
import { LuxChatEntryComponent } from "./lux-chat-entry/lux-chat-entry.component";
import { LuxChatControlRef } from './lux-chat-control-ref';

@Component({
  selector: 'lux-chat',
  imports: [
    CommonModule,
    LuxDividerComponent,
    LuxChatHeaderComponent,
    LuxChatInputComponent,
    LuxInputAcComponent,
    LuxChatEntryComponent
],
  templateUrl: './lux-chat.component.html',
  styleUrl: './lux-chat.component.scss'
})
export class LuxChatComponent implements LuxChatControlRef {
  
  @ContentChild(LuxChatHeaderComponent) 
  public chatHeader?: LuxChatHeaderComponent;

  @ContentChild(LuxChatEntryComponent)
  public chatEntry?: LuxChatEntryComponent;

  @ContentChild(LuxChatInputComponent)
  public chatInput?: LuxChatInputComponent;

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


}
