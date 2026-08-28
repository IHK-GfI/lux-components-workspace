import { ModelSignal, OutputRef } from '@angular/core';

export abstract class LuxChatController {
  abstract chatPopupMode: ModelSignal<boolean | undefined>;
  abstract chatClose: OutputRef<void>;
  abstract chatFullscreen: OutputRef<boolean>;
  abstract _chatFullscreen: boolean;
}
