import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, contentChild, effect, inject, model, signal, untracked } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFabButton } from '@angular/material/button';
import { LuxIconComponent, LuxMediaQueryObserverService } from '@ihk-gfi/lux-components';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxChatController } from '../lux-chat/lux-chat-controller';

/** Auf kleinen Bildschirmen (xs, sm) wird das Popup immer im Vollbild dargestellt. */
function isMobileQuery(query: string): boolean {
  return query === 'xs' || query === 'sm';
}

@Component({
  selector: 'lux-chat-popup',
  imports: [NgClass, LuxIconComponent, MatFabButton, TranslocoPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lux-chat-popup.component.html'
})
export class LuxChatPopupComponent {
  private queryService = inject(LuxMediaQueryObserverService);

  private childChat = contentChild(LuxChatController);

  public luxChatOpened = model(false);
  public luxFullScreen = model(false);
  public mobileView = signal(isMobileQuery(this.queryService.activeMediaQuery));

  constructor() {
    this.queryService
      .getMediaQueryChangedAsObservable()
      .pipe(takeUntilDestroyed())
      .subscribe((query) => this.mobileView.set(isMobileQuery(query)));

    // Vollbildzustand an den Chat weitergeben (steuert u.a. das Icon im Standard-Header des Chats).
    effect(() => {
      this.childChat()?._chatFullscreen.set(this.luxFullScreen());
    });

    // Den Chat einmal je Chat-Instanz verdrahten. Bewusst getrennt vom Effect oben, der bei jedem
    // Umschalten des Vollbildmodus erneut läuft und sonst jedes Mal weitere Subscriptions anlegen würde.
    effect((onCleanup) => {
      const childChat = this.childChat();
      if (!childChat) {
        return;
      }

      untracked(() => {
        if (!childChat.chatPopupMode()) {
          childChat.chatPopupMode.set(true);
        }
      });

      const closeSubscription = childChat.chatClose.subscribe(() => this.luxChatOpened.set(false));
      const fullscreenSubscription = childChat.chatFullscreen.subscribe((value) => this.luxFullScreen.set(value));

      onCleanup(() => {
        closeSubscription.unsubscribe();
        fullscreenSubscription.unsubscribe();
      });
    });
  }

  public onChatIconClicked(value?: boolean): void {
    this.luxChatOpened.set(value !== undefined ? value : !this.luxChatOpened());
  }
}
