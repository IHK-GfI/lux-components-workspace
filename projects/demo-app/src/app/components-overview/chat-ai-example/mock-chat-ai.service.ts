import { Injectable } from '@angular/core';
import { LuxChatAiDataDto, LuxChatAiService, LuxChatAiSummaryDto } from '@ihk-gfi/lux-components/lux-chat-ai';
import { concatMap, Observable, of, throwError, timer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MockLuxChatAiService extends LuxChatAiService {

    private chatDto?: LuxChatAiDataDto = undefined;

    public override createNewChat(_url: string | undefined): Observable<LuxChatAiDataDto> {
        const data: LuxChatAiDataDto = {
            chat_id: "chat1",
            title: "New Chat",
            created_at: new Date(),
            updated_at: new Date(),
            messages: []
        }

        this.chatDto = data;

        return of(data);
    }

    public override getChatById(_url: string | undefined, _chatId: string): Observable<LuxChatAiDataDto> {

        if(this.chatDto){
            return of(this.chatDto);
        }
        else {
            return throwError(() => new Error("Chat not created yet!"));
        }
    }

    public override getAllChats(_url: string | undefined): Observable<LuxChatAiSummaryDto[]> {
        if(!this.chatDto){
            return of([]);
        }

        const list: LuxChatAiSummaryDto[] = [
            {
                chat_id: this.chatDto.chat_id,
                title: this.chatDto.title,
                created_at: this.chatDto.created_at,
                updated_at: this.chatDto.updated_at
            }
        ];

        return of(list);
    }

    public override postChatMessageStream(_url: string | undefined, content: string, _chatId: string): Observable<{type: string, data: string}> {
        const message_id = this.chatDto?.messages.length ?? 0;

        const messages = [];
        const times = [];

        const message = "Hallo, wie kann ich Ihnen helfen?\n Das ist jedoch eine vorgefertigte Nachricht und ich kann Ihnen leider doch nicht helfen :(\n Einen schönen Tag noch! [TES-100001]"
        const chunkSize = 3;


        this.chatDto?.messages.push({
            sender_role: "Human",
            created_at: new Date(),
            content: content,
            chat_id: "chat1",
            message_id: message_id,
            sources: [],
            internal_messages: undefined
        });


        const test_tool_id = "001";
        const test_tool_name = "test_tool";

        const test_source = {
            "name": "Test Pdf 1",
            "reference_code": "[TES-100001]",
            "description": "Test Inhalt",
            "link": "#",
            "link_label": "Test-Ticket-Label"
        };

        const test_source_str = JSON.stringify(test_source);

        this.chatDto?.messages.push({
            sender_role: "Assistant",
            created_at: new Date(),
            content: message,
            chat_id: "chat1",
            message_id: message_id+1,
            sources: [
                test_source
            ],
            internal_messages: [
                {
                    type: 'tool',
                    id: test_tool_id,
                    name: test_tool_name,
                    args: {
                        "query": "Test Query",
                        "keywords": ["Test", "Query"]
                    },
                    sources: [
                        test_source
                    ]
                },
                {
                    type: 'content',
                    content: message
                }
            ]
        });


        times.push(0);
        messages.push(
            {
                type: 'tool_call',
                data: `{
                    "tool_call_id": "${test_tool_id}",
                    "tool_name": "${test_tool_name}",
                    "args": {
                        "query": "Test Query",
                        "keywords": ["Test", "Query"]
                    }
                }`
            }
        );


        times.push(2000);
        messages.push(
            {
                type: 'tool_result',
                data: `{
                    "tool_call_id": "${test_tool_id}",
                    "tool_name": "${test_tool_name}",
                    "sources": [
                        ${test_source_str}
                    ]
                }`
            }
        );

        for(let i=0;i<message.length;i+=chunkSize){
            const pos2 = Math.min(i + chunkSize, message.length);
            const substr = message.substring(i, pos2);

            times.push(100);
            messages.push({
                type: "content_delta",
                data: `{"delta": "${substr}"}`
            });
        }

        times.push(100);
        messages.push({
            type: "done",
            data: `{"message_id": "${message_id+1}", "created_at": "${new Date()}"}`
        });
        


        const valuesWithDelays = [];
        for(let i=0;i<messages.length;i++){
            const message = messages[i];
            const time = times[i];
            valuesWithDelays.push({
                data: message,
                delay: time
            });
        }

        return of(...valuesWithDelays).pipe(
            concatMap(item =>
                timer(item.delay).pipe(
                    concatMap(() => of(item.data))
                )
            )
        );
    }

    public override generateTitleForChat(_url: string | undefined, _chatId: string): Observable<string> {
        const title = "Generierter Test-Titel!";

        if(this.chatDto){
            this.chatDto.title = title;
        }

        return of(title);
    }
}