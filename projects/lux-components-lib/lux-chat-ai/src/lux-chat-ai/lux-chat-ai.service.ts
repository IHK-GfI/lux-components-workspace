import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { EMPTY, Observable } from "rxjs";
import { LuxChatAiSummaryDto } from "./lux-chat-ai-summary.dto";
import { LuxSseEvent, LuxSseService } from "./lux-sse.service";
import { LuxChatAiDataDto } from "./lux-chat-ai-data.dto";

@Injectable({
  providedIn: 'root'
})
export class LuxChatAiService {

    private http = inject(HttpClient);
    private sseService = inject(LuxSseService);

    public createNewChat(url: string | undefined): Observable<LuxChatAiDataDto> {
        return this.http.post<LuxChatAiDataDto>(`${url}/chats`, {});
    }

    public getChatById(url: string | undefined, chatId: string): Observable<LuxChatAiDataDto> {
        return this.http.get<LuxChatAiDataDto>(`${url}/chats/${chatId}`);
    }

    public getAllChats(url: string | undefined): Observable<LuxChatAiSummaryDto[]> {
        return this.http.get<LuxChatAiSummaryDto[]>(`${url}/chats`);
    }
    
    public postChatMessageStream(url: string | undefined, content: string, chatId: string): Observable<{type: string, data: string}> {
        const body = JSON.stringify({ content });
        return this.sseService.postStream(`${url}/chats/${chatId}/messages`, body, {headers: { 'Content-Type': 'application/json' }});
    }

    public generateTitleForChat(url: string | undefined, chatId: string): Observable<string> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'text/plain'
        });
        return this.http.post<string>(`${url}/chats/${chatId}/title`, {}, { headers, responseType: 'text' as 'json' });
    }

}