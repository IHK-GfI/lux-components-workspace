import { Component, OnInit } from '@angular/core';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { LuxChatAiComponent } from '@ihk-gfi/lux-components/lux-chat-ai';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-chat-ai-example',
  imports: [
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    LuxChatAiComponent
  ],
  templateUrl: './chat-ai-example.component.html',
  styleUrl: './chat-ai-example.component.scss'
})
export class ChatAiExampleComponent implements OnInit {

  public loadedChatId?: string;

  constructor(private route: ActivatedRoute, private router: Router){}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const chatId = params['chatId'];

      if(chatId){
        this.loadedChatId = chatId;
      }
    })
  }

  public onChatIdChange(chatId?: string){
    if(chatId === undefined){
      this.router.navigate(["components-overview", "example", "chat-ai"]);
    }
    else {
      window.history.replaceState({}, "", `components-overview/example/chat-ai/${chatId}`);
    }
  }

  

}
