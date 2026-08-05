import { ModelSignal, OutputRef } from '@angular/core';

export abstract class LuxChatController {
  abstract showFullscreenButton: ModelSignal<boolean | undefined>;
  abstract showCloseButton: ModelSignal<boolean | undefined>;
  abstract chatClose: OutputRef<void>;
  abstract chatFullscreen: OutputRef<boolean>;
  abstract _chatFullscreen: boolean;
}
