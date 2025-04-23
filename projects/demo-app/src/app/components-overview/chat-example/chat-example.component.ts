import { Component } from '@angular/core';
import { LuxChatComponent } from "../../../../../lux-components-lib/src/lib/lux-chat/lux-chat.component";
import { LuxChatData, LuxChatEntryActionsComponent, LuxChatEntryComponent } from '../../../../../lux-components-lib/src/public_api';
import { LuxIconComponent } from '@ihk-gfi/lux-components';

@Component({
  selector: 'app-chat-example',
  imports: [
    LuxChatComponent,
    LuxChatEntryComponent,
    LuxChatEntryActionsComponent,
    LuxIconComponent
  ],
  templateUrl: './chat-example.component.html',
  styleUrl: './chat-example.component.scss'
})
export class ChatExampleComponent {

  public chatData = new LuxChatData("My Chat", new Date());

  constructor(){
    this.chatData.addChatEntry("User1", "Hello World!", new Date());
    this.chatData.addChatEntry("User2", "Hello World!", new Date());
    this.chatData.addChatEntry("User1", "Hello World!", new Date());
    this.chatData.addChatEntry("User1", "Hello World!", new Date());
    this.chatData.addChatEntry("User1", "Hello World!", new Date());
    this.chatData.addChatEntry("User1", "Hello World!", new Date());
  }

}
