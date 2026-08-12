import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LuxChatData, LuxChatPopupComponent } from '@ihk-gfi/lux-components/lux-chat';
import { LuxChatAiComponent } from '@ihk-gfi/lux-components/lux-chat-ai';
import { LuxToggleAcComponent } from '@ihk-gfi/lux-components';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';

@Component({
  selector: 'app-chat-ai-example',
  imports: [
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    LuxChatPopupComponent,
    LuxChatAiComponent,
    LuxToggleAcComponent,
    CommonModule
],
  templateUrl: './chat-ai-example.component.html'
})
export class ChatAiExampleComponent {

  public showChatPopup = true;
  public loadedChatId?: string;
  public luxChatShowMetadata = false;

  public chatData = new LuxChatData("Neuer Chat", new Date(), []);

  public onChatIdChange(chatId?: string){
    this.loadedChatId = chatId;
  }

}