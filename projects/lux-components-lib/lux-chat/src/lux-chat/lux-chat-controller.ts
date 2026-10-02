import { ModelSignal, OutputRef, WritableSignal } from '@angular/core';

export abstract class LuxChatController {
  abstract chatPopupMode: ModelSignal<boolean | undefined>;
  abstract chatClose: OutputRef<void>;
  abstract chatFullscreen: OutputRef<boolean>;
  abstract _chatFullscreen: WritableSignal<boolean>;
}
