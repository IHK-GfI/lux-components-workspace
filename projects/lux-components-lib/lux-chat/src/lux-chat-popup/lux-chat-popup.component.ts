import { NgClass } from '@angular/common';
import { Component, inject, OnDestroy, model, effect, contentChild } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { LuxIconComponent, LuxMediaQueryObserverService } from '@ihk-gfi/lux-components';
import { TranslocoPipe } from '@jsverse/transloco';
import { Unsubscribable } from 'rxjs';
import { LuxChatController } from '../lux-chat/lux-chat-controller';

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

  private childChat = contentChild(LuxChatController);

  public luxChatOpened = model(false);
  public luxFullScreen = model(false);
  public mobileView = false;
  
  chatCloseSubscriptions: Unsubscribable[] = [];
  chatFullscreenSubscriptions: Unsubscribable[] = [];
  subscriptions: Unsubscribable[] = [];

  private chatPopupCloseSubcription?: Unsubscribable;
  private chatPopupFullscreenSubcription?: Unsubscribable;

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

        if(this.chatPopupCloseSubcription){
          this.chatPopupCloseSubcription.unsubscribe();
        }

        this.chatPopupCloseSubcription = childChat.chatClose.subscribe(() => {
          this.luxChatOpened.set(false);
        });

        this.subscriptions.push(this.chatPopupCloseSubcription);

        if(this.chatPopupFullscreenSubcription){
          this.chatPopupFullscreenSubcription.unsubscribe();
        }
        
        this.chatPopupFullscreenSubcription = childChat.chatFullscreen.subscribe(value => {
          this.luxFullScreen.set(value);
        });

        this.subscriptions.push(this.chatPopupFullscreenSubcription);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

}
