import { NgClass } from '@angular/common';
import { Component, contentChildren, inject, OnDestroy, OnInit, DestroyRef, model, effect } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatFabButton } from '@angular/material/button';
import { LuxIconComponent, LuxMediaQueryObserverService } from '@ihk-gfi/lux-components'
import { LuxChatComponent } from '@ihk-gfi/lux-components/lux-chat'
import { LuxChatAiComponent } from '@ihk-gfi/lux-components/lux-chat-ai'
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
export class LuxChatPopupComponent implements OnInit, OnDestroy {

  private queryService = inject(LuxMediaQueryObserverService);
  private destroyRef = inject(DestroyRef);

  childrenChat = contentChildren<LuxChatComponent>(LuxChatComponent);
  private childrenChat$ = toObservable(this.childrenChat);

  childrenChatAi = contentChildren<LuxChatAiComponent>(LuxChatAiComponent);
  private childrenChatAi$ = toObservable(this.childrenChatAi);

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

      for(const chat of this.childrenChat()){
        chat._chatFullscreen = fullscreen;
      }
      
      for(const chat of this.childrenChatAi()){
        const chatVal = chat.luxChat();
        if(!chatVal) continue;
        
        chatVal._chatFullscreen = fullscreen;
      }
    });
  }

  ngOnInit(): void {
    this.childrenChat$
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(changes => {
      for(const item of changes){
        if(!item.showFullscreenButton()){
          item.showFullscreenButton.set(true)
        }

        if(!item.showCloseButton()){
          item.showCloseButton.set(true);
        }

        this.setCloseListenerForChatContentChild(item);
        this.setFullscreenListenerForChatContentChild(item);
      }
    });

    this.childrenChatAi$
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(changes => {
      for(const item of changes){
        if(!item.showFullscreenButton()){
          item.showFullscreenButton.set(true)
        }

        if(!item.showCloseButton()){
          item.showCloseButton.set(true);
        }

        this.setCloseListenerForChatContentChild(item);
        this.setFullscreenListenerForChatContentChild(item);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private setCloseListenerForChatContentChild(contentChild: LuxChatComponent | LuxChatAiComponent){
    const subscriptionRef = contentChild.chatClose.subscribe(() => {
      this.luxChatOpened.set(false);
    });

    this.chatCloseSubscriptions.push(subscriptionRef);
    this.subscriptions.push(subscriptionRef);
  }

  private setFullscreenListenerForChatContentChild(contentChild: LuxChatComponent | LuxChatAiComponent){
    const subscriptionRef = contentChild.chatFullscreen.subscribe(value => {
      this.luxFullScreen.set(value);
    });

    this.chatFullscreenSubscriptions.push(subscriptionRef)
    this.subscriptions.push(subscriptionRef);
  }



}
