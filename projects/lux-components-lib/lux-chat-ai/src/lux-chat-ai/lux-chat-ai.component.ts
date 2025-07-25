import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, effect, inject, input, model } from '@angular/core';
import { LuxButtonComponent, LuxDividerComponent, LuxIconComponent, LuxInputAcComponent, LuxLinkComponent, LuxPanelComponent, LuxPanelContentComponent, LuxPanelHeaderDescriptionComponent, LuxPanelHeaderTitleComponent, LuxProgressComponent, LuxTabComponent, LuxTableColumnComponent, LuxTableColumnContentComponent, LuxTableColumnHeaderComponent, LuxTableComponent, LuxTabsComponent } from '@ihk-gfi/lux-components';
import { LuxChatComponent, LuxChatData, LuxChatDataEntry, LuxChatEntryActionsComponent, LuxChatEntryComponent, LuxChatEntryContentComponent, LuxChatHeaderComponent, LuxChatInputComponent, LuxChatSidebarComponent } from '@ihk-gfi/lux-components/lux-chat';
import { LuxChatAiService } from './lux-chat-ai.service';
import { LuxChatAiSummaryDto } from './lux-chat-ai-summary.dto';
import { LuxMarkdownComponent } from '@ihk-gfi/lux-components/lux-markdown';
import { LuxSanitizeConfig } from '@ihk-gfi/lux-components/lux-html';

@Component({
  selector: 'lux-chat-ai',
  imports: [
    DatePipe,
    LuxIconComponent,
    LuxButtonComponent,
    LuxInputAcComponent,
    LuxProgressComponent,
    LuxTabsComponent,
    LuxTabComponent,
    LuxPanelComponent,
    LuxPanelHeaderTitleComponent,
    LuxPanelHeaderDescriptionComponent,
    LuxPanelContentComponent,
    LuxLinkComponent,
    LuxMarkdownComponent,
    LuxChatComponent,
    LuxChatHeaderComponent,
    LuxChatEntryComponent,
    LuxChatSidebarComponent,
    LuxChatEntryActionsComponent,
    LuxChatEntryContentComponent,
    LuxChatInputComponent,
    LuxTableComponent,
    LuxTableColumnComponent,
    LuxTableColumnHeaderComponent,
    LuxTableColumnContentComponent,
    LuxDividerComponent
],
  templateUrl: './lux-chat-ai.component.html',
  styleUrl: './lux-chat-ai.component.scss'
})
export class LuxChatAiComponent {

  private luxChatAiService = inject(LuxChatAiService);
  private changeDetection = inject(ChangeDetectorRef);

  public sanitizeConfig: LuxSanitizeConfig = {
    forbiddenTags: ["code", "pre"],
  };

  public baseUrl = input<string>();
  public userName = input("Nutzer");
  public assistantName = input("Mock Chat-AI");
  public standardWelcomeMessage = input("Hallo, wie kann ich Ihnen weiterhelfen?");
  
  public chatId = model<string>();
  public chatData!: LuxChatData;
  
  public chatInput = "";

  public allChats?: LuxChatAiSummaryDto[];

  public sidebarHistoryVisible = false;
  public sidebarSourcesVisible = false;

  public activeReferenceEntry?: LuxChatDataEntry;
  public activeReferenceKey?: string;

  constructor(){
    effect(() => {
      this.luxChatAiService.baseUrl = this.baseUrl();
    });

    effect(() => {
      this.loadChat(this.chatId());
    })
  }

  private loadEmptyChat(){
    if(this.chatData && this.chatData.metadata.chat_id === undefined) return;
    this.chatData = new LuxChatData("Kein Titel", new Date());
    this.chatData.addChatEntry(this.assistantName(), this.standardWelcomeMessage(), new Date());
  }

  public onChatEntered(event?: Event): void {
    event?.stopPropagation();

    if(this.chatInput.trim().length === 0){
      return;
    }

    if (!this.chatData.metadata.chat_id) {
      this.createNewChat(this.chatInput);
    } else {
      this.postMessage(this.chatInput);
    }

    this.chatInput = ""
  }

  public doShowHistory(){
      this.sidebarHistoryVisible = !this.sidebarHistoryVisible;

      if(this.sidebarHistoryVisible && this.allChats === undefined){
        this.luxChatAiService.getAllChats().subscribe({
          next: (summaries) => {
            this.allChats = summaries;
          },
          error: (err) => {
            console.log("HISTORY ERROR:", err);
          }
        });
      }
  }

  public doShowSources(chatEntry: LuxChatDataEntry){
    this.sidebarSourcesVisible = true;
    this.activeReferenceEntry = chatEntry;
    this.activeReferenceKey = undefined;
  }

  public onChatContentReferenceClicked(event: MouseEvent){
    const target = event.target as HTMLElement;

    if (target.tagName === 'A' && target.classList.contains('referenceLink')) {
      event.preventDefault(); // Prevent navigation

      const match = target.getAttribute('data-reference-key');
      const message_id = target.getAttribute('data-message-id');
      if (match) {
        this.activeReferenceEntry = this.chatData.data.filter(entry => entry.metadata.message_id === message_id)[0];
        this.activeReferenceKey = match;
        this.sidebarSourcesVisible = true;
      }
    }
  }
  
  public onHistoryChatClicked(chatSummary?: LuxChatAiSummaryDto){
    this.sidebarHistoryVisible = false;
    this.chatId.set(chatSummary?.chat_id);
  }

  private createNewChat(chatInput: string){
    this.luxChatAiService.createNewChat().subscribe(response => {
      const id = response.chat_id;
      this.loadChat(id, () => {
        this.postMessage(chatInput, () => {
          this.chatId.set(id);
        });
      });
    });
  }

  private postMessage(query: string, callback?: () => void) {
    const curChatId = this.chatData.metadata.chat_id;

    let replyEntry: LuxChatDataEntry | undefined = undefined;
    this.chatData.addChatEntry(this.userName(), query, new Date());

    this.luxChatAiService.postChatMessageStream(query, curChatId).subscribe({
      next: (streamedData) => {
        if(replyEntry === undefined){
          if(typeof(streamedData.created_at) === 'string'){
            streamedData.created_at = new Date(streamedData.created_at);
          }

          let sender_name;
          if(streamedData.sender_role == 'Human'){
            sender_name = this.userName();
          }
          else {
            sender_name = this.assistantName();
          }

          replyEntry = this.chatData.addChatEntry(sender_name, "", streamedData.created_at);
          replyEntry.metadata.message_id = streamedData.message_id;
          replyEntry.metadata.uncompleted = true;
          replyEntry.metadata.contexts = [];
        }
        
        replyEntry.content += streamedData.content;
        
        if(streamedData.contexts?.length > 0){
          for(const context of streamedData.contexts){
            replyEntry.metadata.contexts.push(context);
          }
        }

        if(streamedData.internal_messages?.length > 0){
            replyEntry.metadata.internal_messages = streamedData.internal_messages;
        }

        this.chatData.scrollToBottom();
        this.changeDetection.detectChanges();
      },
      error: (error) => {
        console.error('Stream error:', error);
        if(callback) callback();
      },
      complete: () => {
        if(replyEntry){
          this.calculateUsedAndUnusedContext(replyEntry);
          replyEntry.metadata.content_with_links = undefined; //Triggers change detection and regenerates the content one last time.
          replyEntry.metadata.uncompleted = false;
          this.checkTitleGeneration();
        }
        if(callback) callback();
      }
    });
  }

  private checkTitleGeneration() {
    if(this.chatData.data.length == 3 || this.chatData.data.length == 7) {
      this.luxChatAiService.generateTitleForChat(this.chatData.metadata.chat_id).subscribe({
        next: title => this.chatData.title = title,
        error: err => console.error('Fehler beim Generieren eines Titels:', err)
      });
    }
  }

  private loadChat(chatId?: string, callback?: () => void) {
    if(chatId === undefined){
      this.loadEmptyChat();
      if(callback) callback();
    }
    else {
      this.luxChatAiService.getChatById(chatId).subscribe({
        next: (response) => {
          if(typeof(response.created_at) === 'string'){
            response.created_at = new Date(response.created_at);
          }

          if(typeof(response.updated_at) === 'string'){
            response.updated_at = new Date(response.updated_at);
          }

          const loadedChatData = new LuxChatData(response.title, response.created_at);
          loadedChatData.metadata.chat_id = response.chat_id;
          
          loadedChatData.addChatEntry(this.assistantName(), this.standardWelcomeMessage(), response.created_at);

          for(const entry of response.messages){
            if(typeof(entry.created_at) === 'string'){
              entry.created_at = new Date(entry.created_at);
            }

            let sender_name;
            if(entry.sender_role == 'Human'){
                sender_name = this.userName();
            }
            else {
                sender_name = this.assistantName();
            }

            const loadedMessage = loadedChatData.addChatEntry(sender_name, entry.content, entry.created_at);
            loadedMessage.metadata.chat_id = entry.chat_id;
            loadedMessage.metadata.message_id = entry.message_id;
            loadedMessage.metadata.contexts = entry.contexts;
            loadedMessage.metadata.internal_messages = entry.internal_messages;

            this.calculateUsedAndUnusedContext(loadedMessage);
          }

          this.chatData = loadedChatData;
        },
        error: (error) => {
          this.loadEmptyChat();
          this.chatId.set(undefined);
          if(callback) callback();
        },
        complete: () => {
          if(callback) callback();
        }
      });
    }
  }

  public getChatContentWithLinks(item: LuxChatDataEntry){
    //Generates content with links only if content_with_links does not exists or is 'uncompleted' to reduce calls
    if(item.metadata.content_with_links && !item.metadata.uncompleted) return item.metadata.content_with_links;

    const referenceKeyRegex = /\[(?:KB|SL|OTR)-\d{6,8}(?: \(\d+\))?\]/g;

    const replacedString = item.content.replace(referenceKeyRegex, (match) => {
      return `<a href="#" class="referenceLink" data-message-id="${item.metadata.message_id}" data-reference-key="${match}">${match}</a>`;
    });

    item.metadata.content_with_links = replacedString;

    return replacedString;
  }

  public cleanContent(content: string) {
    return content.replace(/<problem-lösung>|<\/problem-lösung>|<problem-beschreibung>|<\/problem-beschreibung>/g, '');
  }

  private calculateUsedAndUnusedContext(entry: LuxChatDataEntry){
    entry.metadata.usedContexts = [];
    entry.metadata.unusedContexts = [];
    
    for(const context of entry.metadata.contexts){
      if(entry.content.includes(context.reference_code)){
        entry.metadata.usedContexts.push(context);
      }
      else {
        entry.metadata.unusedContexts.push(context);
      }
    }
  }

  public getToolActivity(internal_messages: any[], message_content: string): string {
    let output = ''

    for(const msg of internal_messages) {
      if(output) {
        output += ' ✔<br>'
      }
      if(msg['type'] === 'ai') {
        output+="Führe " + msg['additional_kwargs']['tool_calls'][0]['function']['name'] + " aus"
      } else {
        output+="Verarbeite Ergebnis von " + msg['name']
      }
    }
    
    if(message_content) {
      output += ' ✔'
    }

    return output;
  }
}
