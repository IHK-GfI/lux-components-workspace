import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface LuxSseRequestOptions {
  headers?: HeadersInit;
  credentials?: RequestCredentials;
  signal?: AbortSignal;
  fetchFn?: typeof fetch;
}

interface LuxSseParserState {
  buffer: string;
  decoder: TextDecoder;
}

export interface LuxSseEvent {
    type: string;
    data: string;
}

@Injectable({
  providedIn: 'root'
})
export class LuxSseService {
  public postStream(url: string, body: BodyInit | null, options: LuxSseRequestOptions = {}): Observable<LuxSseEvent> {
    return new Observable<LuxSseEvent>((observer) => {
      const abortController = new AbortController();
      const removeAbortListener = this.forwardAbort(options.signal, abortController);
      const headers = new Headers(options.headers);
      const payload = this.normalizeBody(body, headers);

      if (!headers.has('Accept')) {
        headers.set('Accept', 'text/event-stream');
      }

      (options.fetchFn ?? fetch)(url, {
        method: 'POST',
        body: payload,
        credentials: options.credentials,
        headers,
        signal: abortController.signal
      })
        .then(async (response) => {
          if (!response.ok) {
            observer.error(new Error(`HTTP error ${response.status}`));
            return;
          }

          const contentType = response.headers.get('Content-Type') ?? '';
          if (!contentType.toLowerCase().includes('text/event-stream')) {
            observer.error(new Error(`Expected content type "text/event-stream" but received "${contentType || 'unknown'}"`));
            return;
          }

          const reader = response.body?.getReader();
          if (!reader) {
            observer.error(new Error('ReadableStream reader not available'));
            return;
          }

          const parserState: LuxSseParserState = {
            buffer: '',
            decoder: new TextDecoder('utf-8')
          };

          try {
            while (true) {
              const { done, value } = await reader.read();

              if (done) {
                this.flushBufferedEvent(parserState, observer);
                observer.complete();
                return;
              }

              if (value) {
                this.parseChunk(value, parserState, observer);
              }
            }
          } catch (error) {
            if (!this.wasAborted(abortController.signal, options.signal, error)) {
              observer.error(error);
            }
          }
        })
        .catch((error) => {
          if (!this.wasAborted(abortController.signal, options.signal, error)) {
            observer.error(error);
          }
        });

      return () => {
        removeAbortListener();
        abortController.abort();
      };
    });
  }

  private normalizeBody(body: BodyInit | null, headers: Headers): BodyInit | null {
    if (body === null) {
      return null;
    }

    if (typeof body === 'string' || body instanceof Blob || body instanceof FormData || body instanceof URLSearchParams || body instanceof ArrayBuffer) {
      return body;
    }

    if (ArrayBuffer.isView(body)) {
      return body;
    }

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return JSON.stringify(body);
  }

  private parseChunk(chunk: Uint8Array, parserState: LuxSseParserState, observer: { next(value: LuxSseEvent): void }): void {
    parserState.buffer += parserState.decoder.decode(chunk, { stream: true });
    parserState.buffer = parserState.buffer.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    let boundaryIndex = parserState.buffer.indexOf('\n\n');
    while (boundaryIndex !== -1) {
      const rawEvent = parserState.buffer.slice(0, boundaryIndex);
      parserState.buffer = parserState.buffer.slice(boundaryIndex + 2);
      this.emitEventData(rawEvent, observer);
      boundaryIndex = parserState.buffer.indexOf('\n\n');
    }
  }

  private flushBufferedEvent(parserState: LuxSseParserState, observer: { next(value: LuxSseEvent): void }): void {
    const trailingChunk = parserState.decoder.decode();
    if (trailingChunk) {
      parserState.buffer += trailingChunk;
    }

    const remainingEvent = parserState.buffer.trim();
    if (remainingEvent) {
      this.emitEventData(remainingEvent, observer);
    }
  }

  private emitEventData(rawEvent: string, observer: { next(value: LuxSseEvent): void }): void {
    const dataLines: string[] = [];

    const eventSplit = rawEvent.split('\n');

    if(eventSplit.length != 2) {
        console.error("INVALID STATE: eventSplit.length > 2 is: " + eventSplit.length, rawEvent);
        return;
    }

    const splitEventType = eventSplit[0];

    if(!splitEventType.startsWith("event: ")){
        console.error("INVALID STATE: splitEventType.startsWith(\"event: \") is: " + splitEventType, rawEvent);
        return;
    }

    const splitEventTypeValue = splitEventType.substring("event: ".length);


    const splitData = eventSplit[1];

    if(!splitData.startsWith("data: ")){
        console.error("INVALID STATE: splitData.startsWith(\"data: \") is: " + splitData, rawEvent);
        return;
    }

    const splitDataValue = splitData.substring("data: ".length);

    observer.next({
        type: splitEventTypeValue,
        data: splitDataValue
    });
  }

  private forwardAbort(signal: AbortSignal | undefined, abortController: AbortController): () => void {
    if (!signal) {
      return () => undefined;
    }

    if (signal.aborted) {
      abortController.abort();
      return () => undefined;
    }

    const abortHandler = () => abortController.abort();
    signal.addEventListener('abort', abortHandler, { once: true });

    return () => signal.removeEventListener('abort', abortHandler);
  }

  private wasAborted(internalSignal: AbortSignal, externalSignal: AbortSignal | undefined, error: unknown): boolean {
    return internalSignal.aborted || externalSignal?.aborted === true || error instanceof DOMException && error.name === 'AbortError';
  }
}