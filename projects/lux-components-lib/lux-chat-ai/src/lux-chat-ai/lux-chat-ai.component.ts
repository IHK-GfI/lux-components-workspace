import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, input, model, output, viewChild } from '@angular/core';
import { LuxChatComponent, LuxChatData, LuxChatEntryComponent, LuxChatMessageData, LuxChatController } from '@ihk-gfi/lux-components/lux-chat'
import { LuxChatAiService } from './lux-chat-ai.service';
import { LuxSnackbarService } from '@ihk-gfi/lux-components';
import { LuxMarkdownComponent } from '@ihk-gfi/lux-components/lux-markdown';
import { LuxSanitizeConfig } from '@ihk-gfi/lux-components/lux-html';
import { LuxChatAiJsonViewerComponent } from './lux-chat-ai-json-viewer.component';


@Component({
  selector: 'lux-chat-ai',
  providers: [{ provide: LuxChatController, useExisting: LuxChatAiComponent}],
  imports: [
    CommonModule,
    LuxChatComponent,
    LuxChatEntryComponent,
    LuxMarkdownComponent,
    LuxChatAiJsonViewerComponent
],
  templateUrl: './lux-chat-ai.component.html'
})
export class LuxChatAiComponent extends LuxChatController {

  public sanitizeConfig: LuxSanitizeConfig = {
    forbiddenTags: ["code", "pre"],
    addAllowedAttrs: ["target"]
  };

  private luxChatAiService = inject(LuxChatAiService);
  private luxSnackbarService = inject(LuxSnackbarService);
  private changeDetection = inject(ChangeDetectorRef);

  public luxChat = viewChild<LuxChatComponent>('luxChat');

  get _chatFullscreen(): boolean {
    return this.luxChat()?._chatFullscreen ?? false;
  }

  set _chatFullscreen(value: boolean) {
    const chat = this.luxChat();
    if (chat) chat._chatFullscreen = value;
  }

  public luxBaseUrl = input<string>();
  public luxUserName = input<string>("Benutzer");
  public luxAssistantName = input<string>("Chat-AI");
  public luxStandardWelcomeMessage = input("Hallo, wie kann ich Ihnen weiterhelfen?");

  public luxChatId = model<string>();
  public luxChatData!: LuxChatData;

  public luxAutoFocus = input<boolean>(false);
  public chatPopupMode = model<boolean>();
  
  public chatClose = output<void>();
  public chatFullscreen = output<boolean>();

  public luxChatShowMetadata = input<boolean>(false);

  public luxChatTitleClicked = output<void>();

  constructor(){
    super();

    effect(() => {
      const chatId = this.luxChatId();
      this.loadChat(chatId);
    });

    effect(() => {
      const luxChat = this.luxChat();

      if(!luxChat) {
        return;
      }

      luxChat.chatClose.subscribe(() => this.chatClose.emit());
      luxChat.chatFullscreen.subscribe((v) => this.chatFullscreen.emit(v));
    }); 
  }

  public onChatTitleClicked(){
    this.luxChatTitleClicked.emit();
  }

  private loadEmptyChat(){
    if(this.luxChatData && this.luxChatData.metadata.chat_id === undefined) return;
    this.luxChatData = new LuxChatData("Kein Titel", new Date());
    this.luxChatData.addMessage(new LuxChatMessageData(this.luxAssistantName(), this.luxStandardWelcomeMessage(), new Date()));
  }

  public onMessageEntered(input: string): void {
    event?.stopPropagation();

    if(input.trim().length === 0){
      return;
    }

    if (!this.luxChatData.metadata.chat_id) {
      this.createNewChat(input);
    } else {
      this.postMessage(input);
    }
  }

  public onChatContentReferenceClicked(event: MouseEvent){
    const target = event.target as HTMLElement;

    if (target.tagName === 'A' && target.classList.contains('lux-chat-ai-content-link')) {
      event.preventDefault(); // Prevent navigation

      const sourceLink = target.getAttribute('data-source-link');

      if(sourceLink) {
        window.open(sourceLink, '_blank');
      }
    }
  }

  private createNewChat(chatInput: string){
    this.luxChatAiService.createNewChat(this.luxBaseUrl()).subscribe({
      next: (response) => {
        const id = response.chat_id;
        this.loadChat(id, () => {
          this.postMessage(chatInput, () => {
            this.luxChatId.set(id);
          });
        });
      },
      error: (error) => {
        this.luxSnackbarService.openText("Fehler beim Erstellen eines neuen Chats. (Eventuell keine Verbindung zum Server möglich)", 5000);
        console.log(error);
      } 
    });
  }

  private postMessage(query: string, callback?: () => void) {
    const curChatId = this.luxChatData.metadata.chat_id;

    let replyEntry: LuxChatMessageData | undefined = undefined;
    this.luxChatData.addMessage(new LuxChatMessageData(this.luxUserName(), query, new Date()));

    this.luxChatAiService.postChatMessageStream(this.luxBaseUrl(), query, curChatId).subscribe({
      next: (streamedData) => {

        if(replyEntry === undefined){

          replyEntry = new LuxChatMessageData(this.luxAssistantName(), "", new Date());
          replyEntry.metadata.message_id = "-";
          replyEntry.metadata.sources = [];
          replyEntry.metadata.internal_messages = [];

          this.luxChatData.addMessage(replyEntry);
        }


        if(streamedData.type === 'content_delta'){
          const data = streamedData.data.replaceAll("\n", "\\n");
          const jsonData = JSON.parse(data);
          replyEntry.content += jsonData.delta;


          const lenInternalMessages = replyEntry.metadata.internal_messages.length;
          const lastInternalMessage = lenInternalMessages === 0 ? undefined : replyEntry.metadata.internal_messages[lenInternalMessages-1];
    
          if(lastInternalMessage && lastInternalMessage.type === 'content'){
            lastInternalMessage.content += jsonData.delta;
            lastInternalMessage._visible_content = this.getChatContentWithLinks(replyEntry, lastInternalMessage.content);
          }
          else {
            const newInternalMessage = {
              type: 'content',
              content: jsonData.delta,
              _visible_content: this.getChatContentWithLinks(replyEntry, jsonData.delta)
            };

            replyEntry.metadata.internal_messages.push(newInternalMessage);
            this.prepareInternalMessage(replyEntry, newInternalMessage);
          }
        }
        else if(streamedData.type === 'done'){
          const jsonData = JSON.parse(streamedData.data);
          replyEntry.metadata.message_id = jsonData.message_id;
          replyEntry.metadata.created_at = jsonData.created_at;

          if(typeof(replyEntry.metadata.created_at) === 'string'){
            replyEntry.metadata.created_at = new Date(replyEntry.metadata.created_at);
          }
        }
        else if(streamedData.type === 'tool_call'){
          const jsonData = JSON.parse(streamedData.data);

          replyEntry.metadata.internal_messages.push({
            type: 'tool_call',
            id: jsonData.tool_call_id,
            name: jsonData.tool_name,
            args: jsonData.args,
            _visible_name: `Rufe ${this.getVisibleToolName(jsonData.tool_name)} auf... `
          });
        }
        else if(streamedData.type === 'tool_result'){
          const jsonData = JSON.parse(streamedData.data);

          for(const int_msg of replyEntry.metadata.internal_messages){
            if(int_msg.id === jsonData.tool_call_id){
              int_msg.type = 'tool_result';
              int_msg.result = jsonData.sources;
              int_msg._visible_name = `Daten von ${this.getVisibleToolName(jsonData.tool_name)} geholt.`;

              break;
            }
          }


          replyEntry.metadata.sources.push(
            ...jsonData.sources
          );
        }
        else if(streamedData.type === 'error'){
          const jsonData = JSON.parse(streamedData.data);

          replyEntry.content += jsonData.message;
          replyEntry.metadata.created_at = new Date();

          replyEntry.metadata.internal_messages.push({
            type: 'error',
            error_message: jsonData.message
          });
        }
        else {
          console.warn("Unprocessed event: " + streamedData.type, streamedData.data);
        }
        
        this.luxChatData.scrollToBottom();
        this.changeDetection.detectChanges();
      },
      error: (error) => {
        console.error('Stream error:', error);
        //TODO: Localization
        this.luxSnackbarService.openText("Fehler beim Senden der Nachricht. Bitte versuchen Sie es erneut.", 5000);
        if(callback) callback();
      },
      complete: () => {
        if(replyEntry){
          if(replyEntry.metadata?.internal_messages){
            for(const intMessage of replyEntry.metadata.internal_messages){
              this.prepareInternalMessage(replyEntry, intMessage);
            }
          }

          this.checkTitleGeneration();
        }

        if(callback) callback();
      }
    });
  }

  private checkTitleGeneration() {
    if(this.luxChatData.messages.length == 3 || this.luxChatData.messages.length == 7) {
      this.doTitleGeneration();
    }
  }

  private doTitleGeneration(){
    this.luxChatAiService.generateTitleForChat(this.luxBaseUrl(), this.luxChatData.metadata.chat_id).subscribe({
      next: title => this.luxChatData.title = title,
      error: err => {
        console.error('Fehler beim Generieren eines Titels:', err);
        this.luxSnackbarService.openText("Chat Titel konnten nicht erzeugt werden. (Eventuell keine Verbindung zum Server möglich)", 5000);
      }
    });
  }

  private loadChat(chatId?: string, callback?: () => void) {
    let loadedChatData : LuxChatData | undefined = undefined;

    if(chatId === undefined){
      this.loadEmptyChat();
      if(callback) callback();
    }
    else {
      this.luxChatAiService.getChatById(this.luxBaseUrl(), chatId).subscribe({
        next: (response) => {
          if(typeof(response.created_at) === 'string'){
            response.created_at = new Date(response.created_at);
          }

          if(typeof(response.updated_at) === 'string'){
            response.updated_at = new Date(response.updated_at);
          }

          loadedChatData = new LuxChatData(response.title, response.created_at);
          loadedChatData.metadata.chat_id = response.chat_id;
          
          loadedChatData.addMessage(new LuxChatMessageData(this.luxAssistantName(), this.luxStandardWelcomeMessage(), response.created_at));

          for(const entry of response.messages){
            if(typeof(entry.created_at) === 'string'){
              entry.created_at = new Date(entry.created_at);
            }

            let sender_name;
            if(entry.sender_role == 'Human'){
                sender_name = this.luxUserName();
            }
            else {
                sender_name = this.luxAssistantName();
            }

            const loadedMessage = new LuxChatMessageData(sender_name, entry.content, entry.created_at);
            loadedMessage.metadata.chat_id = entry.chat_id;
            loadedMessage.metadata.message_id = entry.message_id;
            loadedMessage.metadata.sources = entry.sources;
            loadedMessage.metadata.internal_messages = entry.internal_messages || [];

            //TODO: Tmp for now as a fix
            for(const int_message of loadedMessage.metadata.internal_messages){
              if(int_message.type === 'ai'){
                int_message.type = "content";
              }
              else if(int_message.type === 'tool'){
                int_message.type = 'tool_result';
                int_message.result = int_message.sources;
                delete int_message.sources;
                int_message._visible_name = `Daten von ${this.getVisibleToolName(int_message.name)} geholt.`;
                delete int_message.content;
              }
              else if(int_message.type === 'content'){
                if(int_message.content === '' && int_message.tool_calls){
                  int_message.type = 'tool_call';
                  int_message.result = int_message.sources;
                  int_message._visible_name = `TEST ${this.getVisibleToolName(int_message.name)} geholt.`;
                }
              }
            }

            //TODO: Tmp for now as a fix
            if(loadedMessage.user === this.luxUserName()) {
              loadedMessage.metadata.internal_messages.push({
                type: 'content',
                content: loadedMessage.content
              });
            }
            

            loadedChatData.addMessage(loadedMessage);
          }

          this.luxChatData = loadedChatData;
        },
        error: (error) => {
          this.loadEmptyChat();

          console.error('Fehler beim laden eines Chats:', error);
          this.luxSnackbarService.openText("Chat mit der id [" + chatId + "] konnten nicht geladen werden. (Eventuell keine Verbindung zum Server möglich)", 5000);
          if(callback) callback();
        },
        complete: () => {
          if(loadedChatData){
            for(const chatMessage of loadedChatData.messages){
              if(chatMessage.metadata?.internal_messages){
                for(const intMessage of chatMessage.metadata.internal_messages){
                  this.prepareInternalMessage(chatMessage, intMessage);
                }
              }
            }
          }

          if(callback) callback();
        }
      });
    }
  }

  private prepareInternalMessage(chatMessageData: LuxChatMessageData, internalMessage: any){
    if(internalMessage.type === 'content' && internalMessage.content){
      internalMessage._visible_content = this.getChatContentWithLinks(chatMessageData, internalMessage.content);
    }
  }

  private getChatContentWithLinks(chatMessageData: LuxChatMessageData, content: string): string {
    const referenceKeyRegex = /\[[A-Z]{2,3}-[A-Za-z0-9]{6,8}(?:\([0-9]+\))?\]/g;

    const replacedString = content.replace(referenceKeyRegex, (match: string) => {
      let link = "#";
      let linkLabel = "Invalid Link";

      if(chatMessageData.metadata.sources){
        for(const source of chatMessageData.metadata.sources){
          if(match === source.reference_code){
            link = source.link;

            if(source.link_label){
              linkLabel = source.link_label;
            }
            else if(source.filename){
              linkLabel = source.filename;
            }
            else {
              linkLabel = "File: " + (source.title ?? "No File Name");
            }

            break;
          }
        }
      }

      const linkReplacement = `<a class="lux-chat-ai-content-link" data-source-link="${link}" href="#">${linkLabel}</a>`;
      return linkReplacement.replaceAll(/\s+/g, " "); // More than 6 whitespaces produce weird Behaviours for the LuxMarkdown Component -> We reduce multiple Whitespaces to one.
    });

    return replacedString;
  }

  private getVisibleToolName(name: string): string {
    const re = /(\b[a-z](?!\s))/g;

    name = name.replaceAll("_", " ");
    name = name.replace(re, (x) => x.toUpperCase());
    
    return "[" + name + "]";
  }

}
