import { NgClass } from '@angular/common';
import { Component, inject, OnDestroy, model, effect, contentChild, DestroyRef } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { LuxIconComponent, LuxMediaQueryObserverService } from '@ihk-gfi/lux-components';
import { TranslocoPipe } from '@jsverse/transloco';
import { Unsubscribable } from 'rxjs';
import { LuxChatController } from '../lux-chat/lux-chat-controller';
import { outputToObservable, takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'lux-chat-popup',
  imports: [NgClass, LuxIconComponent, MatFabButton, TranslocoPipe],
  templateUrl: './lux-chat-popup.component.html'
})
export class LuxChatPopupComponent {
  private queryService = inject(LuxMediaQueryObserverService);
  private destroyRef = inject(DestroyRef);

  private childChat = contentChild(LuxChatController);

  public luxChatOpened = model(false);
  public luxFullScreen = model(false);
  public mobileView = false;

  constructor() {
    this.mobileView = this.queryService.activeMediaQuery === 'xs' || this.queryService.activeMediaQuery === 'sm';

    this.queryService
      .getMediaQueryChangedAsObservable()
      .pipe(takeUntilDestroyed())
      .subscribe((query) => {
        this.mobileView = query === 'xs' || query === 'sm';
      });

    effect(() => {
      const fullscreen = this.luxFullScreen();
      const childChat = this.childChat();

      if (childChat) {
        childChat._chatFullscreen = fullscreen;

        if (!childChat.chatPopupMode()) {
          childChat.chatPopupMode.set(true);
        }

        outputToObservable(childChat.chatClose)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.luxChatOpened.set(false);
          });

        outputToObservable(childChat.chatFullscreen)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe((value) => {
            this.luxFullScreen.set(value);
          });
      }
    });
  }

  public onChatIconClicked(value?: boolean): void {
    this.luxChatOpened.set(value !== undefined ? value : !this.luxChatOpened());
  }
}
