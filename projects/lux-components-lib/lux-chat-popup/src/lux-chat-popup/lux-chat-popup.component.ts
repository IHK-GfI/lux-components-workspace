import { NgClass } from '@angular/common';
import { Component, contentChildren, inject, OnDestroy, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { MatFabButton } from '@angular/material/button';
import { LuxIconComponent, LuxMediaQueryObserverService } from '@ihk-gfi/lux-components'
import { LuxChatComponent } from '@ihk-gfi/lux-components/lux-chat'
import { TranslocoModule, TranslocoPipe } from '@jsverse/transloco';
import { Unsubscribable } from 'rxjs';

@Component({
  selector: 'lux-chat-popup',
  imports: [
    NgClass,
    LuxChatComponent,
    LuxIconComponent,
    MatFabButton,
    TranslocoPipe
],
  templateUrl: './lux-chat-popup.component.html'
})
export class LuxChatPopupComponent implements OnInit, OnDestroy {

  private queryService = inject(LuxMediaQueryObserverService);
  private destroyRef = inject(DestroyRef);

  children = contentChildren<LuxChatComponent>(LuxChatComponent);
  private children$ = toObservable(this.children);

  public chatOpened = false;
  public fullScreen = false;
  public mobileView = false;
  
  chatCloseSubscriptions: Unsubscribable[] = [];
  chatFullscreenSubscriptions: Unsubscribable[] = [];
  subscriptions: Unsubscribable[] = [];

  public onChatIconClicked(value?: boolean): void {
    this.chatOpened = (value !== undefined) ? value : !this.chatOpened;
  }

  constructor(){
    this.mobileView = this.queryService.activeMediaQuery === 'xs' || this.queryService.activeMediaQuery === 'sm';
    this.subscriptions.push(
      this.queryService.getMediaQueryChangedAsObservable().subscribe((query) => {
        this.mobileView = query === 'xs' || query === 'sm';
      })
    );
  }

  ngOnInit(): void {
    this.children$
    .pipe(
      takeUntilDestroyed(this.destroyRef)
    )
    .subscribe(changes => {
      this.unsubscribeAll();
      for(const item of changes){
        if(item.showFullscreenButton() === undefined){
          item.showFullscreenButton.set(true)
        }

        if(item.showCloseButton() === undefined){
          item.showCloseButton.set(true);
        }

        this.setCloseListenerForChatContentChild(item);
        this.setFullscreenListenerForChatContentChild(item);
      }
    })
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private unsubscribeAll(){
    for(const subscriptionRef of this.chatCloseSubscriptions){
      subscriptionRef.unsubscribe();
    }
    
    for(const subscriptionRef of this.chatFullscreenSubscriptions){
      subscriptionRef.unsubscribe();
    }
  }

  private setCloseListenerForChatContentChild(contentChild: LuxChatComponent){
    const subscriptionRef = contentChild.chatClose.subscribe(() => {
      this.chatOpened = false;
    });

    this.chatCloseSubscriptions.push(subscriptionRef);
    this.subscriptions.push(subscriptionRef);
  }

  private setFullscreenListenerForChatContentChild(contentChild: LuxChatComponent){
    const subscriptionRef = contentChild.chatFullscreen.subscribe(value => {
      this.fullScreen = value;
    });

    this.chatFullscreenSubscriptions.push(subscriptionRef)
    this.subscriptions.push(subscriptionRef);
  }



}
