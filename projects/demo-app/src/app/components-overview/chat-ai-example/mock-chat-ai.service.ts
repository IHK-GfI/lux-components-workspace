import { Injectable } from "@angular/core";
import { LuxChatAiMessageDto, LuxChatAiService, LuxChatAiSummaryDto, LuxChatDto } from "@ihk-gfi/lux-components/lux-chat-ai";
import { interval, Observable, of, throwError } from "rxjs";
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MockLuxChatAiService extends LuxChatAiService {

  private assistantName = "Mock Chat-AI";
  private chat1: LuxChatDto = {
    chat_id: "0",
    title: "Chat 1",
    created_at: new Date(),
    updated_at: new Date(),
    messages: []
  };
  private chat2: LuxChatDto = {
    chat_id: "1",
    title: "Chat 2",
    created_at: new Date(),
    updated_at: new Date(),
    messages: []
  };

  private assistant_answers = [
    { content: "Hallo, das ist ein Mockup für eine KI, die Ihnen antworten würde.", 
      contexts: [] },
    { content: "Das ist ein Beispiel mit einer Quelle [OTR-23032885 (1)], auf die verlinkt wird.", 
      contexts: [
        {context_id: "1", content: "Hier würde die Information, die der Bot zum beantworten der Frage genommen hat, stehen.", link: "https://www.google.de/", link_label: "Google Homepage", reference_code: "[OTR-23032885 (1)]", title: "Lorem Ipsum Titel"},
        {context_id: "2", content: "Ein zweiter Kontext, der aber nicht benutzt wird.", link: "https://www.youtube.de/", link_label: "Youtube", reference_code: "[OTR-23032885 (2)]", title: "Der 2. Anhang"}] },
    { content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus nulla error voluptatem. Tempora, omnis sed amet beatae autem recusandae quasi aliquam non molestias, at inventore laudantium. Facere eveniet quisquam ut.", 
      contexts: [] },
    { content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis in unde ducimus, dignissimos ea error quisquam consectetur nihil ratione est, cupiditate eveniet, suscipit magni iure! Quas eum quo officia. Quae!", 
      contexts: [] },
    { content: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet libero laudantium magnam, similique quaerat itaque saepe molestiae impedit architecto consectetur aut nam dignissimos voluptas necessitatibus voluptatem maiores perferendis possimus fuga.", 
      contexts: [] },
  ];
  private chunk_size = 3;
  private interval_time = 30;

  private chats: LuxChatDto[] = [
    this.chat1,
    this.chat2
  ];

  constructor(){
    super();

    this.chat1.messages.push({
      chat_id: this.chat1.chat_id,
      message_id: "" + this.chat1.messages.length,
      content: "Frage mich etwas :D",
      sender_name: this.assistantName,
      created_at: new Date(),
      contexts: []
    });

    
    this.chat2.messages.push({
      chat_id: this.chat2.chat_id,
      message_id: "" + this.chat2.messages.length,
      content: "Hallo, wie geht es Ihnen?",
      sender_name: this.assistantName,
      created_at: new Date(),
      contexts: []
    });

    this.chat2.messages.push({
      chat_id: this.chat2.chat_id,
      message_id: "" + this.chat2.messages.length,
      content: "Sie können mich zu allen Themen etwas fragen.",
      sender_name: this.assistantName,
      created_at: new Date(),
      contexts: []
    });
  }

  public override createNewChat(): Observable<LuxChatDto> {
    const data: LuxChatDto = {
        chat_id: "" + this.chats.length,
        title: "Neuer leerer Chat (" + (this.chats.length - 1) + ")",
        created_at: new Date(),
        updated_at: new Date(),
        messages: [
          {
            chat_id: "" + this.chats.length,
            message_id: "0",
            content: "Hallo, wie kann ich Ihnen weiterhelfen?",
            sender_name: this.assistantName,
            created_at: new Date(),
            contexts: []
          }
        ]
    };

    this.chats.push(data);

    return of(data);
  }

  private _getChatById(chatId: string): LuxChatDto {
    const id = Number(chatId);
    if(id < 0 || id >= this.chats.length) {
      throw new Error("Chat with id [" + chatId + "] does not exist!");
    }

    const data = this.chats[id];
    return data;
  }

  public override getChatById(chatId: string): Observable<LuxChatDto> {
    try {
      return of(this._getChatById(chatId));
    }
    catch(error){
      return throwError(() => error);
    }
  }

  public override getAllChats(): Observable<LuxChatAiSummaryDto[]> {
    const data: LuxChatAiSummaryDto[] = [];

    for(const chat of this.chats){
      data.push({
        chat_id: chat.chat_id,
        title: chat.title,
        created_at: chat.created_at,
        updated_at: chat.created_at
      });
    }

    return of(data);
  }

  public override postChatMessageStream(query: string, chatId: string, userName: string): Observable<LuxChatAiMessageDto> {
    const theChat = this._getChatById(chatId);
    theChat.messages.push({
      chat_id: chatId,
      message_id: "" + theChat.messages.length,
      content: query,
      created_at: new Date(),
      sender_name: userName,
      contexts: []
    });

    const messageId = theChat.messages.length;

    const index = Math.floor((messageId - 1) / 2) % this.assistant_answers.length;
    const answer = this.assistant_answers[index];

    const values: LuxChatAiMessageDto[] = [];

    const contexts = [];
    for(const ctx of answer.contexts){
      contexts.push({
        context_id: ctx.context_id,
        message_id: "" + messageId,
        title: ctx.title,
        link: ctx.link,
        link_label: ctx.link_label,
        content: ctx.content,
        reference_code: ctx.reference_code
      });
    }

    theChat.messages.push({
      chat_id: chatId,
      message_id: "" + messageId,
      content: answer.content,
      created_at: new Date(),
      sender_name: this.assistantName,
      contexts
    });



    for(let i=0;i<answer.contexts.length;i++){
      values.push({
        chat_id: chatId,
        message_id: "" + messageId,
        content: "",
        created_at: new Date(),
        sender_name: this.assistantName,
        contexts: [contexts[i]]
      });
    }

    for(let i=0;i<answer.content.length;i+=this.chunk_size){
      values.push({
        chat_id: chatId,
        message_id: "" + messageId,
        content: answer.content.substring(i, i+this.chunk_size),
        created_at: new Date(),
        sender_name: this.assistantName,
        contexts: []
      });
    }

    return interval(this.interval_time)
      .pipe(
        take(values.length),
        map(i => values[i])
      );
  }


  override generateTitleForChat(chatId: string): Observable<string> {
    const titles = [
      "Generierter Titel [" + chatId + "]",
      "Chat mit Inhalt [" + chatId + "]",
      "Test Titel [" + chatId + "]"
    ]

    const title = titles[Math.floor(Math.random() * titles.length)];
    console.log("GENERATING TITLE: [" + title + "] ... ");

    const chat = this._getChatById(chatId);
    if(chat) chat.title = title;
    return of(
      title
    );
  }

}