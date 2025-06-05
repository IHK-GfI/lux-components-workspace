import { Component, inject, TemplateRef, ViewChild } from '@angular/core';
import { LuxButtonComponent, LuxDialogService, LuxDividerComponent, LuxIconComponent, LuxInputAcComponent, LuxSelectAcComponent } from '@ihk-gfi/lux-components';
import { LuxChatComponent, LuxChatData, LuxChatEntryActionsComponent, LuxChatEntryContentComponent, LuxChatEntryComponent, LuxChatHeaderComponent, LuxChatInputComponent, LuxChatEntryHeaderComponent, LuxChatSidebarComponent, Side } from '@ihk-gfi/lux-components/lux-chat';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { DatePipe } from '@angular/common';
import { ExampleBaseOptionsActionsComponent } from "../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-options-actions.component";
import { ChatExampleCodeDialogComponent } from './chat-example-code-dialog/chat-example-code-dialog.component';
import { LuxToggleAcComponent } from "../../../../../lux-components-lib/src/lib/lux-form/lux-toggle-ac/lux-toggle-ac.component";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY_IN_MILLIS = 24 * HOUR;
const now = new Date();
const nowTime = now.getTime();

const startOfThisYear = new Date(now.getFullYear(), 0, 1).getTime();
const endOfLastYear = startOfThisYear - DAY_IN_MILLIS;

@Component({
  selector: 'app-chat-example',
  imports: [
    LuxChatComponent,
    LuxChatEntryComponent,
    LuxChatEntryHeaderComponent,
    LuxChatEntryActionsComponent,
    LuxChatInputComponent,
    LuxChatSidebarComponent,
    LuxButtonComponent,
    LuxChatEntryContentComponent,
    LuxChatHeaderComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent,
    LuxInputAcComponent,
    LuxSelectAcComponent,
    LuxDividerComponent,
    LuxIconComponent,
    DatePipe,
    ExampleBaseOptionsActionsComponent,
    LuxToggleAcComponent,
    
],
  templateUrl: './chat-example.component.html',
  styleUrl: './chat-example.component.scss'
})
export class ChatExampleComponent {

  private dialogService = inject(LuxDialogService);

  private groupChat = new LuxChatData("Mein Gruppen Chat", new Date("2024-11-05T10:30:00Z"))
  private nutzerAChat = new LuxChatData("Chat mit Nutzer A", new Date("2022-01-14T22:11:00Z"))

  public allChats = [
    this.groupChat,
    this.nutzerAChat
  ];

  public chatData = this.groupChat;

  public userName = "Nutzer";

  public advancedHeaderOptions = [
    {id: 0, label: "Default", content: "<lux-chat-header>\n\t<p class=\"default-chat-header-title\">\n\t\t<b>{{ chatData?.title }}</b><br/>\n\t\t@if(chatData){\n\t\t\tErstellt: <b>{{ chatData!.created_at | luxRelativeTimestamp:undefined:undefined:-11:0 }}</b>\n\t\t}\n\t</p>\n</lux-chat-header>"},
    {id: 1, label: "H1 Titel", content: "<lux-chat-header>\n\t<h1>{{chatData.title}}</h1>\n</lux-chat-header>"},
    {id: 2, label: "H3 Titel", content: "<lux-chat-header>\n\t<h3>{{chatData.title}}</h3>\n</lux-chat-header>"},
    {id: 3, label: "Titel und Anzahl Nachrichten", content: "<lux-chat-header>\n\t<p>\n\t\t<b>{{chatData.title}}</b><br>\n\t\t{{chatData.data.length}} Einträge.\n\t</p>\n</lux-chat-header>"},
    {id: 4, label: "Header mit Button zur Historie.", content: "<lux-chat-header>\n\t<div style=\"display: flex; flex-direction: row; align-items: center; justify-content: flex-start; gap: 20px;\">\n\t\t<lux-icon role=\"button\" (click)=\"doShowHistory()\" style=\"cursor: pointer;\" [luxIconName]=\"sidebarHistoryVisible ? 'lux-book-readme' : 'lux-hand-held'\" [luxRounded]=\"true\"></lux-icon>\n\t\t<p>\n\t\t\t<b>{{ chatData.title }}</b><br/>\n\t\t\tErstellt am: <b>{{ chatData.created_at | date:'dd.MM.yyyy, HH:mm:ss' }}</b>\n\t\t</p>\n\t</div>\n</lux-chat-header>"}
  ];
  public advancedHeaderTemplate: {id: number, label: string, content: string} = this.advancedHeaderOptions[0];

  public advancedEntryHeaderOptions = [
    {id: 0, label: "Default", content: "<lux-chat-entry-header>\n\t<ng-template let-item #default>\n\t\t@if(checkShowHeader(item)){\n\t\t\t<span *ngIf=\"!item.isUser\">{{item.user}}</span>\n\t\t\t<span>{{item.time | date:'HH:mm'}}</span>\n\t\t}\n\t</ng-template>\n</lux-chat-entry-header>"},
    {id: 1, label: "Basic Benutzername und Zeit", content: "<lux-chat-entry-header>\n\t<ng-template let-item>\n\t\t<span>{{item.user}}</span>\n\t\t<span>{{item.time | date:'HH:mm'}}</span>\n\t</ng-template>\n</lux-chat-entry-header>"},
  ];
  public advancedEntryHeaderTemplate: {id: number, label: string, content: string} = this.advancedEntryHeaderOptions[0];

  public advancedEntryContentOptions = [
    {id: 0, label: "Default", content: "<lux-chat-entry-content>\n\t<ng-template let-item #default>\n\t\t<lux-markdown [luxSanitizeConfig]=\"sanitizeConfig\" luxData=\"{{item.content}}\"></lux-markdown>\n\t</ng-template>\n</lux-chat-entry-content>"},
    {id: 1, label: "Basic", content: "<lux-chat-entry-content>\n\t<ng-template let-item>{{item.content}}</ng-template>\n</lux-chat-entry-content>"},
    {id: 2, label: "Basic mit Button", content: "<lux-chat-entry-content>\n\t<ng-template let-item>\n\t\t<div style=\"padding-bottom: 6px;\">\n\t\t\t{{item.content}}<br>\n\t\t\t<lux-button luxLabel=\"Quellen\" (luxClicked)=\"onSourcesClicked()\" [luxRaised]=\"true\"></lux-button>\n\t\t</div>\n\t</ng-template>\n</lux-chat-entry-content>"},
  ];
  public advancedEntryContentTemplate: {id: number, label: string, content: string} = this.advancedEntryContentOptions[0];

  public advancedEntryActionsOptions = [
    {id: 0, label: "Default", content: ""},
    {id: 1, label: "Bewerten", content: "<lux-chat-entry-actions>\n\t<ng-template>\n\t\t<lux-icon luxIconName=\"lux-mail-smiley-happy-face\"></lux-icon>\n\t\t<lux-icon luxIconName=\"lux-mail-smiley-straight-face\"></lux-icon>\n\t\t<lux-icon luxIconName=\"lux-mail-smiley-sad-face\"></lux-icon>\n\t\t<lux-icon luxIconName=\"lux-interface-favorite-like-1\"></lux-icon>\n\t\t<lux-icon luxIconName=\"lux-interface-favorite-dislike-1\"></lux-icon>\n\t</ng-template>\n</lux-chat-entry-actions>"},
    {id: 2, label: "Punkt Punkt Punkt", content: "<lux-chat-entry-actions>\n\t<ng-template>\n\t\t<lux-icon luxIconName=\"lux-interface-setting-menu-horizontal\"></lux-icon>\n\t</ng-template>\n</lux-chat-entry-actions>"}
  ];
  public advancedEntryActionsTemplate: {id: number, label: string, content: string} = this.advancedEntryActionsOptions[0];


  public advancedInputOptions = [
    {id: 0, label: "Default", content: "<lux-chat-input>\n\t<lux-textarea-ac luxTagId=\"chatInput\" [(luxValue)]=\"chatInput\" luxAutocomplete=\"off\" [luxNoTopLabel]=\"true\" [luxNoBottomLabel]=\"true\"\n[luxMaxRows]=\"4\"\n(keyup.enter)=\"onChatEntered($event)\"></lux-textarea-ac>\n</lux-chat-input>"},
    {id: 1, label: "Input mit Senden Button", content: "<lux-chat-input>\n\t<div style=\"display: flex; flex-direction: row; gap: 8px;\">\n\t\t<lux-input-ac style=\"flex: 1 0 auto;\" luxTagId=\"chatInput\" [(luxValue)]=\"chatInput\" luxAutocomplete=\"off\" [luxNoTopLabel]=\"true\" [luxNoBottomLabel]=\"true\"\n(keyup.enter)=\"onChatEntered($event)\"></lux-input-ac>\n\t\t<lux-button style=\"flex: 0 0 auto; margin: auto;\" luxLabel=\"Senden\" [luxRaised]=\"true\" (luxClicked)=\"onChatEntered()\"></lux-button>\n\t</div>\n</lux-chat-input>"}
  ];
  public advancedInputTemplate: {id: number, label: string, content: string} = this.advancedInputOptions[0];

  public chatInput = "";

  public sidebarHistorySide: Side = 'left';
  public sidebarHistoryVisible = false;
  public sidebarHistoryOverlay = true;


  public showChatEntryActions = false;

  @ViewChild('generateCodeDialog', {read: TemplateRef})
  public generateCodeDialogTemplate?: TemplateRef<any>;

  constructor(){
    this.initGroupChat();
    this.initNutzerAChat();
  }

  private initGroupChat(){
    this.groupChat.addChatEntry("Nutzer A", "Erster Eintrag!", new Date("2024-11-05T10:30:00Z"));
    this.groupChat.addChatEntry("Nutzer B", "Hey, ich bin Nutzer B.", new Date("2024-11-05T10:32:00Z"));
    this.groupChat.addChatEntry("Nutzer B", "Wenn ich innerhalb von 5 Minuten schreibe, dann wird die Zeitangabe zusammengefasst.", new Date("2024-11-05T10:34:00Z"));
    this.groupChat.addChatEntry("Nutzer A", "...", new Date("2024-11-05T10:37:00Z"));
    this.groupChat.addChatEntry("Nutzer C", "Hey, ich bin neu hier.", new Date("2024-11-05T10:37:00Z"));
    this.groupChat.addChatEntry("Nutzer A", "Hallo Nutzer C.", new Date("2024-11-06T09:12:00Z"));

    this.groupChat.addChatEntry("Nutzer A", "Ich freue mich schon auf das neue Jahr!", new Date(endOfLastYear + (20 * HOUR + 3 * MINUTE)));
    this.groupChat.addChatEntry("Nutzer A", "Frohes neues !!!", new Date(startOfThisYear));

    this.groupChat.addChatEntry("Nutzer B", "Wie ihr sehen könnt wird nun bei der \"Zeit-Trennlinie\" nicht mehr das Jahr angegeben, da wir uns nun im aktuellen Jahr befinden!", new Date(startOfThisYear + 2 * MINUTE));
    this.groupChat.addChatEntry("Nutzer A", "?? Du wolltest 'Frohes neues' schreiben oder?", new Date(startOfThisYear + 5 * MINUTE));
    
    this.groupChat.addChatEntry("Nutzer B", "Diese Nachricht wurde vor 2 Tagen geschrieben.", new Date(nowTime - 2 * DAY_IN_MILLIS));
    this.groupChat.addChatEntry("Nutzer B", "Diese Nachricht wurde gestern geschrieben.", new Date(nowTime - 1 * DAY_IN_MILLIS));
    this.groupChat.addChatEntry("Nutzer B", "Diese Nachricht wurde heute geschrieben.", new Date(nowTime - 1 * HOUR));
    this.groupChat.addChatEntry("Nutzer B", "Wie ihr sehen könnt wird für heute und gestern eine relative Bezeichnung gewählt.", new Date(nowTime - 1 * HOUR + 2 * MINUTE));
    this.groupChat.addChatEntry("Nutzer A", "... Ich habe mich das schon länger gefragt, aber wem erklärst du das eigentlich?!", new Date(nowTime - 10 * MINUTE));
    this.groupChat.addChatEntry("Nutzer B", "Schreib du doch auch mal was, damit Nutzer A weiss wen ich meine.", new Date(nowTime - 6 * MINUTE));

    this.groupChat.chatDataOut.subscribe(entry => {
      if(entry.isUser){
        setTimeout(()=> {
          this.groupChat.addChatEntry("Nutzer A", "Hallo [" + entry.user + "].", new Date());
        }, 1000);
      }
    });
  }

  private initNutzerAChat(){
    const curUsername = this.userName;
    this.nutzerAChat.addChatEntry("Nutzer A", "Hey, wie geht es dir?", new Date("2022-01-14T22:11:00Z"));
    this.nutzerAChat.addChatEntry(curUsername, "Hallo, wer bist du?", new Date("2022-01-14T23:00:00Z"));
    this.nutzerAChat.addChatEntry(curUsername, "Ich habe dich anscheinend noch nicht eingespeichert.", new Date("2022-01-14T23:01:00Z"));
    this.nutzerAChat.addChatEntry("Nutzer A", "...", new Date("2022-01-15T08:21:00Z"));
    this.nutzerAChat.addChatEntry("Nutzer A", "Luke, ich bin dein Vater!", new Date("2022-01-15T08:21:10Z"));
  }

  public doShowHistory(): void {
    this.sidebarHistoryVisible = !this.sidebarHistoryVisible;
  }

  public onHistoryChatClicked(chat: LuxChatData): void {
    this.chatData = chat;
    this.sidebarHistoryVisible = false;
  }

  public onChatEntered(event?: Event): void {
    event?.stopPropagation();

    this.chatData?.addChatEntry(this.userName, this.chatInput, new Date());

    this.chatInput = ""
  }

  public generateAndShowCode(){
    let content = "<lux-chat userName=\"" + this.userName + "\" [chatData]=\"chatData\">\n";

    if(this.advancedHeaderTemplate.id != 0){
      content += this.cleanAndAddTabs(this.advancedHeaderTemplate.content, 1);
    }

    let entryAdded = false;

    if(this.advancedEntryHeaderTemplate.id != 0){
      if(!entryAdded){
        entryAdded = true;
        content += "\t<lux-chat-entry>\n";
      }

      content += this.cleanAndAddTabs(this.advancedEntryHeaderTemplate.content, 2);
    }

    if(this.advancedEntryContentTemplate.id != 0){
      if(!entryAdded){
        entryAdded = true;
        content += "\t<lux-chat-entry>\n";
      }

      content += this.cleanAndAddTabs(this.advancedEntryContentTemplate.content, 2);
    }

    if(this.advancedEntryActionsTemplate.id != 0){
      if(!entryAdded){
        entryAdded = true;
        content += "\t<lux-chat-entry>\n";
      }

      content += this.cleanAndAddTabs(this.advancedEntryActionsTemplate.content, 2);
    }

    if(entryAdded){
      content += "\t</lux-chat-entry>\n";
    }

    if(this.advancedInputTemplate.id != 0){
      content += this.cleanAndAddTabs(this.advancedInputTemplate.content, 1);
    }


    content += "</lux-chat>";

    this.dialogService.openComponent(ChatExampleCodeDialogComponent, undefined, content);
  }

  private cleanAndAddTabs(content: string, tabs: number){
    const split = content.split("\n");
    let res = "";
    for(const item of split){
      res += "\t".repeat(tabs) + item + "\n";
    }

    return res;
  }

}
