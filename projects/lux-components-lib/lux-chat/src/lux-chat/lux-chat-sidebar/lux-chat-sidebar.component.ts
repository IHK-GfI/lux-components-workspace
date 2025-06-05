import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { LuxIconComponent } from '@ihk-gfi/lux-components';

export type Side = "top" | "left" | "bottom" | "right";

@Component({
  selector: 'lux-chat-sidebar',
  imports: [
    CommonModule,
    LuxIconComponent,
  ],
  templateUrl: './lux-chat-sidebar.component.html',
  styleUrl: './lux-chat-sidebar.component.scss'
})
export class LuxChatSidebarComponent implements AfterContentInit {
    
  @ViewChild("core", { read: TemplateRef, static: true }) public templateRef!: TemplateRef<any>;

  public _side: Side = 'left';
  
  @Input()
  public set side(side: Side){
    this._side = side;
    this.sideChange.emit(side);
  }

  public get side(){
    return this._side;
  }

  @Input()
  public overlay = false;

  private _visible = false;
  public sidebarShown = false;

  @Input()
  public set visible(visible: boolean){
    if(this._visible === visible) return;

    if(visible){
      this._visible = true;
      setTimeout(() => {
        this.sidebarShown = true;
      })
    }
    else {
      this.sidebarShown = false;
      setTimeout(() => {
        this._visible = false;
      }, 400);
    }
  }

  public get visible(): boolean {
    return this._visible;
  }

  @Input()
  public title = "";

  public sideChange: EventEmitter<Side> = new EventEmitter<Side>();

  @Output()
  private visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngAfterContentInit(){
    if(this.side === undefined){
      this.side = "left";
    }
  }

  onClosePressed(){
    this.visible = false;
    this.visibleChange.emit(false);
  }

}
