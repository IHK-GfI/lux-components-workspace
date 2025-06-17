import { Component, ContentChild, ContentChildren, ElementRef, Input, ViewChild, QueryList, AfterContentInit } from '@angular/core';
import { LuxChatHeaderComponent } from './lux-chat-header/lux-chat-header.component';
import { LuxChatInputComponent } from './lux-chat-input/lux-chat-input.component';
import { LuxChatData } from './lux-chat-data';
import { CommonModule } from '@angular/common';
import { LuxChatEntryComponent } from "./lux-chat-entry/lux-chat-entry.component";
import { LuxChatControlRef } from './lux-chat-control-ref';
import { ScrollController } from './lux-chat-scroll-controller';
import { LuxAriaLabelDirective, LuxDividerComponent, LuxRelativeTimestampPipe, LuxTextareaAcComponent } from '@ihk-gfi/lux-components';
import { LuxChatSidebarComponent, Side } from './lux-chat-sidebar/lux-chat-sidebar.component';

@Component({
  selector: 'lux-chat',
  imports: [
    CommonModule,
    LuxDividerComponent,
    LuxChatHeaderComponent,
    LuxChatInputComponent,
    LuxChatEntryComponent,
    LuxTextareaAcComponent,
    LuxRelativeTimestampPipe,
    LuxAriaLabelDirective
],
  templateUrl: './lux-chat.component.html',
  styleUrl: './lux-chat.component.scss'
})
export class LuxChatComponent implements LuxChatControlRef, AfterContentInit {

  public defaultChatHeaderDatePrefix = $localize`:@@luxc.chat.default.header.date.prefix:Erstellt`
  
  @ContentChild(LuxChatHeaderComponent)
  public compChatHeader?: LuxChatHeaderComponent;

  @ContentChild(LuxChatEntryComponent)
  public compChatEntry?: LuxChatEntryComponent;

  @ContentChild(LuxChatInputComponent)
  public compChatInput?: LuxChatInputComponent;

  @ViewChild("chatBase", { read: ElementRef })
  public chatBase!: ElementRef;

  private _chatData?: LuxChatData;

  @Input()
  public set chatData(chatData: LuxChatData){
    chatData.initControl(this);
    this._chatData = chatData;
  }

  public get chatData(): LuxChatData | undefined {
    return this._chatData;
  }

  @Input()
  public userName = "User";

  public get chat(): LuxChatData | undefined {
    return this._chatData;
  }

  public chatInput = "";
  public chatAutoScroll = true;
  private scrollController = new ScrollController();
  private lastScroll = 0;

  @ContentChildren(LuxChatSidebarComponent) private sidebars!: QueryList<LuxChatSidebarComponent>;

  public sidebars_top: LuxChatSidebarComponent[] = [];
  public sidebars_left: LuxChatSidebarComponent[] = [];
  public sidebars_bottom: LuxChatSidebarComponent[] = [];
  public sidebars_right: LuxChatSidebarComponent[] = [];

  ngAfterContentInit(){
    for(const sidebar of this.sidebars){
      this.initSidebar(sidebar);
    }
    this.sidebars.changes.subscribe(c => {
      this.initSidebar(c);
    })
  }

  public onChatEntered(event: Event): void {
    //Prevent Enter key from being processed
    event.preventDefault();

    this.chatData?.addChatEntry(this.userName, this.chatInput, new Date());

    this.chatInput = ""
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
      const baseEl = this.chatBase.nativeElement;
      // this.scrollController.scrollTo(baseEl, baseEl.scrollHeight, 100, 10, smoothScrolling, () => {
      //   this.chatAutoScroll = true;
      // });
      // let scrollDist = baseEl.scrollHeight - (baseEl.clientHeight + baseEl.scrollTop);
      // baseEl.style["scroll-behavior"] = "smooth";
      // baseEl.scrollTop = baseEl.scrollHeight - baseEl.clientHeight;
      baseEl.scrollTo({
        top: baseEl.scrollHeight - baseEl.clientHeight,
        left: 0
      });
    }, 2);
  }

  public onChatScroll(e: any) {
    const scrollTop = this.chatBase.nativeElement.scrollTop;
    const scrollHeight = this.chatBase.nativeElement.scrollHeight;
    const elHeight = this.chatBase.nativeElement.clientHeight;

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
    this.onSidebarSideChange(sidebar, sidebar.side);
    sidebar.sideChange.subscribe(change => this.onSidebarSideChange(sidebar, change));
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
