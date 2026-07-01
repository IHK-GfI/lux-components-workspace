import { NgClass } from '@angular/common';
import { Component, inject, OnDestroy, model, effect, contentChild } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { LuxIconComponent, LuxMediaQueryObserverService } from '@ihk-gfi/lux-components'
import { LuxChatComponent } from '@ihk-gfi/lux-components/lux-chat'
import { TranslocoPipe } from '@jsverse/transloco';
import { Unsubscribable } from 'rxjs';

@Component({
  selector: 'lux-chat-popup',
  imports: [
    NgClass,
    LuxIconComponent,
    MatFabButton,
    TranslocoPipe
],
  templateUrl: './lux-chat-popup.component.html'
})
export class LuxChatPopupComponent implements OnDestroy {

  private queryService = inject(LuxMediaQueryObserverService);

  private childChat = contentChild(LuxChatComponent);

  public luxChatOpened = model(false);
  public luxFullScreen = model(false);
  public mobileView = false;
  
  chatCloseSubscriptions: Unsubscribable[] = [];
  chatFullscreenSubscriptions: Unsubscribable[] = [];
  subscriptions: Unsubscribable[] = [];

  public onChatIconClicked(value?: boolean): void {
    this.luxChatOpened.set((value !== undefined) ? value : !this.luxChatOpened());
  }

  constructor(){
    this.mobileView = this.queryService.activeMediaQuery === 'xs' || this.queryService.activeMediaQuery === 'sm';
    this.subscriptions.push(
      this.queryService.getMediaQueryChangedAsObservable().subscribe((query) => {
        this.mobileView = query === 'xs' || query === 'sm';
      })
    );

    effect(() => {
      const fullscreen = this.luxFullScreen();
      const childChat = this.childChat();

      if(childChat){
        childChat._chatFullscreen = fullscreen;

        if(!childChat.showFullscreenButton()){
          childChat.showFullscreenButton.set(true)
        }

        if(!childChat.showCloseButton()){
          childChat.showCloseButton.set(true);
        }

        this.setCloseListenerForChatContentChild(childChat);
        this.setFullscreenListenerForChatContentChild(childChat);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private setCloseListenerForChatContentChild(contentChild: LuxChatComponent){
    const subscriptionRef = contentChild.chatClose.subscribe(() => {
      this.luxChatOpened.set(false);
    });

    this.chatCloseSubscriptions.push(subscriptionRef);
    this.subscriptions.push(subscriptionRef);
  }

  private setFullscreenListenerForChatContentChild(contentChild: LuxChatComponent){
    const subscriptionRef = contentChild.chatFullscreen.subscribe(value => {
      this.luxFullScreen.set(value);
    });

    this.chatFullscreenSubscriptions.push(subscriptionRef)
    this.subscriptions.push(subscriptionRef);
  }



}
