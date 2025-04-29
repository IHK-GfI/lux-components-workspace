import { Component } from '@angular/core';
import { LuxDividerComponent, LuxIconComponent } from '@ihk-gfi/lux-components';
import { LuxChatComponent, LuxChatData, LuxChatEntryActionsComponent, LuxChatEntryComponent } from '@ihk-gfi/lux-components/lux-chat';

@Component({
  selector: 'app-chat-example',
  imports: [
    LuxChatComponent,
    LuxChatEntryComponent,
    LuxChatEntryActionsComponent,
    LuxIconComponent,
    LuxDividerComponent
  ],
  templateUrl: './chat-example.component.html',
  styleUrl: './chat-example.component.scss'
})
export class ChatExampleComponent {

  public chatData = new LuxChatData("My Chat", new Date(20194.487900243057 * (1000 * 60 * 60 * 24)));

  constructor(){
    const DAY_IN_MILLIS = (1000 * 60 * 60 * 24);
    this.chatData.addChatEntry("User3", "Hello World!", new Date(new Date().getTime() - 366 * DAY_IN_MILLIS));
    this.chatData.addChatEntry("User3", "Hello World!", new Date(new Date().getTime() - 300 * DAY_IN_MILLIS));
    this.chatData.addChatEntry("User3", "Hello World!", new Date(new Date().getTime() - 200 * DAY_IN_MILLIS));
    this.chatData.addChatEntry("User3", "Hello World!", new Date(new Date().getTime() - 100 * DAY_IN_MILLIS));
    this.chatData.addChatEntry("User1", "Hello World!", new Date(20199.487900243057 * DAY_IN_MILLIS));
    this.chatData.addChatEntry("User2", "Hello World!", new Date(20200.487900243057 * DAY_IN_MILLIS));
    this.chatData.addChatEntry("User1", "Hello World!", new Date(20201.487900243057 * DAY_IN_MILLIS));
    this.chatData.addChatEntry("User1", "Hello World!", new Date(20202.487900243057 * DAY_IN_MILLIS));
    this.chatData.addChatEntry("User2", "Hello World!", new Date());
    this.chatData.addChatEntry("User1", "Hello World!", new Date());
    this.chatData.addChatEntry("User1", "Hello World!", new Date());
    this.chatData.addChatEntry("User1", "Hello World!", new Date(20203.487900243057 * DAY_IN_MILLIS));
    this.chatData.addChatEntry("User1", "Hello World!", new Date(20204.487900243057 * DAY_IN_MILLIS));
    this.chatData.addChatEntry("User1", "Hello World!", new Date(20205.487900243057 * DAY_IN_MILLIS));
    this.chatData.addChatEntry("User1", "Hello World!", new Date(20206.487900243057 * DAY_IN_MILLIS));
    this.chatData.addChatEntry("User1", "Hello World!", new Date(20207.487900243057 * DAY_IN_MILLIS));
  }

}
