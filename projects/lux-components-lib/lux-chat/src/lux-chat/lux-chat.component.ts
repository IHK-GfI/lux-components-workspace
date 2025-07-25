import { Component, ElementRef, contentChild, viewChild, input, effect, contentChildren, Injector, inject, untracked } from '@angular/core';
import { LuxChatHeaderComponent } from './lux-chat-header/lux-chat-header.component';
import { LuxChatInputComponent } from './lux-chat-input/lux-chat-input.component';
import { LuxChatData } from './lux-chat-data';
import { CommonModule } from '@angular/common';
import { LuxChatEntryComponent } from "./lux-chat-entry/lux-chat-entry.component";
import { LuxChatControlRef } from './lux-chat-control-ref';
import { LuxAriaLabelDirective, LuxDividerComponent, LuxTextareaAcComponent } from '@ihk-gfi/lux-components';
import { LuxChatSidebarComponent, Side } from './lux-chat-sidebar/lux-chat-sidebar.component';
import { toObservable } from '@angular/core/rxjs-interop';
import { LuxChatRelativeUntilTimestamp } from './lux-chat-relative-until-timestamp.pipe';

@Component({
  selector: 'lux-chat',
  imports: [
    CommonModule,
    LuxDividerComponent,
    LuxChatHeaderComponent,
    LuxChatInputComponent,
    LuxChatEntryComponent,
    LuxTextareaAcComponent,
    LuxAriaLabelDirective,
    LuxChatRelativeUntilTimestamp
],
  templateUrl: './lux-chat.component.html',
  styleUrl: './lux-chat.component.scss'
})
export class LuxChatComponent implements LuxChatControlRef {

  private injector = inject(Injector);

  public defaultChatHeaderDatePrefix = $localize`:@@luxc.chat.default.header.date.prefix:Erstellt`

  public compChatHeader = contentChild(LuxChatHeaderComponent);
  public compChatEntry = contentChild(LuxChatEntryComponent);
  public compChatInput = contentChild(LuxChatInputComponent);
  private sidebars = contentChildren(LuxChatSidebarComponent);

  public chatBase = viewChild<ElementRef>("chatBase");

  public chatData = input<LuxChatData>();
  public user = input("User");

  public chatInput = "";
  public chatAutoScroll = true;
  private lastScroll = 0;

  public sidebars_top: LuxChatSidebarComponent[] = [];
  public sidebars_left: LuxChatSidebarComponent[] = [];
  public sidebars_bottom: LuxChatSidebarComponent[] = [];
  public sidebars_right: LuxChatSidebarComponent[] = [];

  constructor(){
    effect(() => {
      this.chatData()?.initControl(this);
    })

    effect(() => {
      for(const sidebar of this.sidebars()){
        const _sidebar: any = sidebar;
        if(_sidebar["initialized"]) {
          continue;
        }
        else {
          _sidebar["initialized"] = true;
        }

        untracked(() => {
          this.initSidebar(sidebar);
        });
      }
    })
  }

  public onChatEntered(event: Event): void {
    //Prevent Enter key from being processed
    event.preventDefault();

    this.chatData()?.addChatEntry(this.userName, this.chatInput, new Date());

    this.chatInput = ""
  }

  public get userName(){
    return this.user();
  }

  public get chat(): LuxChatData | undefined {
    return this.chatData();
  }

  public scrollToBottom(smoothScrolling = true) {
    if(!this.chatAutoScroll) return;

    this.doScrollToBottom(smoothScrolling);
  }

  public scrollToBottomForced(smoothScrolling = true) {
    this.doScrollToBottom(smoothScrolling);
  }

  private doScrollToBottom(smoothScrolling = true){
    setTimeout(() =>{
      this.chatAutoScroll = true;
      const baseEl = this.chatBase()!.nativeElement;
      
      baseEl.scrollTo({
        top: baseEl.scrollHeight - baseEl.clientHeight,
        left: 0
      });
    }, 2);
  }

  public onChatScroll(e: any) {
    const scrollTop = this.chatBase()!.nativeElement.scrollTop;
    const scrollHeight = this.chatBase()!.nativeElement.scrollHeight;
    const elHeight = this.chatBase()!.nativeElement.clientHeight;

    if(scrollHeight <= elHeight) return;

    const deltaY = scrollTop - this.lastScroll;

    if(this.chatAutoScroll && deltaY < 0){
      this.chatAutoScroll = false;
    }
    else if(!this.chatAutoScroll && deltaY > 0){
      if(scrollTop + deltaY + elHeight >= scrollHeight){
        this.chatAutoScroll = true;
      }
    }

    this.lastScroll = scrollTop;
  }

  private initSidebar(sidebar: LuxChatSidebarComponent){
    this.onSidebarSideChange(sidebar, sidebar.side());
    toObservable(sidebar.side, {injector: this.injector}).subscribe(change => this.onSidebarSideChange(sidebar, change));
  }

  private onSidebarSideChange(sidebar: LuxChatSidebarComponent, side: Side){
    const removeFunc = (arr: any[]) => {
      let i = 0;
      while (i < arr.length) {
        if (arr[i] === sidebar) {
          arr.splice(i, 1);
        } else {
          ++i;
        }
      }

      return arr;
    }
    
    removeFunc(this.sidebars_top);
    removeFunc(this.sidebars_left);
    removeFunc(this.sidebars_bottom);
    removeFunc(this.sidebars_right);

    switch(side){
      case 'top': this.sidebars_top.push(sidebar); break;
      case 'left': this.sidebars_left.push(sidebar); break;
      case 'bottom': this.sidebars_bottom.push(sidebar); break;
      case 'right': this.sidebars_right.push(sidebar); break;
    }
  }

}
