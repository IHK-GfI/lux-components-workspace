import { Injectable, inject } from '@angular/core';
import { Observable, Subscriber } from "rxjs";
import { LuxChatAiSummaryDto } from "./lux-chat-ai-summary.dto";
import { LuxChatAiMessageDto } from "./lux-chat-ai-message.dto";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LuxChatDto } from './lux-chat-ai.dto';

@Injectable({
  providedIn: 'root'
})
export class LuxChatAiService {

    private http = inject(HttpClient);

    public baseUrl?: string;

    public createNewChat(): Observable<LuxChatDto> {
        return this.http.post<LuxChatDto>(`${this.baseUrl}/chat/new`, {});
    }

    public getChatById(chatId: string): Observable<LuxChatDto> {
        return this.http.get<LuxChatDto>(`${this.baseUrl}/chat/${chatId}`);
    }

    public getAllChats(): Observable<LuxChatAiSummaryDto[]> {
        return this.http.get<LuxChatAiSummaryDto[]>(`${this.baseUrl}/chat/history`);
    }

    public postChatMessageStream(content: string, chatId: string, userName: string): Observable<LuxChatAiMessageDto> {
        console.log("### POST: ", content, chatId);
        const body = JSON.stringify({ content });
        // return this.http.post<LuxChatAiMessageDto>(`${this.baseUrl}/chat/${chatId}/message`, body);

        return new Observable<LuxChatAiMessageDto>(observer => {
            fetch(`${this.baseUrl}/chat/${chatId}/message`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body,
            })
            .then(response => {
                const reader = response.body?.getReader();
                if (!reader) {
                    observer.error('Reader not available');
                    return;
                }

                const decoder = new TextDecoder('utf-8');
                let bufferedString = '';  // Buffer to accumulate the string data
                const readChunk = () => {
                    reader.read().then(({ done, value }) => {
                        if (done) {
                            observer.complete();
                            return;
                        }

                        try {
                            const chunk = decoder.decode(value, { stream: true });
                            bufferedString += chunk;  // Append to buffer
                            const messages = this.extractCompleteJsonMessages(bufferedString)
                            messages.forEach((msg) => {
                                bufferedString = bufferedString.slice(msg.length)
                                parseAndEmit(msg, observer);
                            });
                            readChunk();
                        } catch (error) {
                            console.error('Error while reading chunk:', error);
                            observer.error(error);
                        }
                    })
                    .catch(err => {
                        observer.error(err);
                    });
                };

                const parseAndEmit = (jsonString: string, observer: Subscriber<LuxChatAiMessageDto>) => {
                    try {
                        const jsonObj = JSON.parse(jsonString) as LuxChatAiMessageDto;
                        observer.next(jsonObj);
                    } catch (error) {
                        console.log(`JSON parse error ignored: ${(error as Error).message}`);
                        console.log(jsonString)
                    }

                };
                readChunk();
            }).catch(err => observer.error(err));
        });
    }

    private extractCompleteJsonMessages(input: string): string[] {
        const result: string[] = [];
        let braceCount = 0;
        let buffer = '';
        let inString = false; // Track whether inside a string
        let escapeNext = false; // Track escape characters

        for (const char of input) {
            buffer += char;

            // Handle escape sequences
            if (escapeNext) {
                escapeNext = false; // Skip this character as it's escaped
                continue;
            }

            if (char === '\\') {
                escapeNext = true; // The next character is escaped
                continue;
            }

            if (char === '"') {
                inString = !inString; // Toggle the inString flag
            }

            // Adjust brace count only if not inside a string
            if (!inString) {
                if (char === '{') {
                    braceCount++;
                } else if (char === '}') {
                    braceCount--;
                }
            }

            // If brace count is zero, we have a complete JSON object
            if (braceCount === 0 && buffer.trim()) {
                result.push(buffer.trim());
                buffer = ''; // Reset buffer for the next JSON object
            }
        }

        return result;
  }

    public generateTitleForChat(chatId: string): Observable<string> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'text/plain'
        });
        return this.http.post<string>(`${this.baseUrl}/chat/${chatId}/title`, {}, { headers, responseType: 'text' as 'json' });
    }

}