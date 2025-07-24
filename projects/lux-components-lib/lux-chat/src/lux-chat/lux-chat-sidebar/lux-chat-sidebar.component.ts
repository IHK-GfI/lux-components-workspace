import { CommonModule } from '@angular/common';
import { AfterContentInit, Component, computed, effect, input, model, signal, TemplateRef, viewChild } from '@angular/core';
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
    
  public templateRef = viewChild.required<TemplateRef<any>>("core")

  public side = model<Side>('left');
  public computedClasses = computed(() => {
    const classes = [];
    classes.push("lux-chat-sidebar-container");
    
    if(this.overlay()) classes.push("overlay");

    const theSide = this.side();
    if(theSide){
      classes.push(theSide);
    }

    if(this.sidebarSlideAnimationClass()) classes.push("sidebar-show");

    return classes;
  });
  
  public overlay = input(false);

  public visible = model(false);
  public sidebarShow = signal(false);
  public sidebarSlideAnimationClass = signal(false);
  public title = input("");

  constructor(){
    effect(() => {
      if(this.visible()){
        this.sidebarShow.set(true);
        setTimeout(() => {
          this.sidebarSlideAnimationClass.set(true);
        });
      }
      else {
        this.sidebarSlideAnimationClass.set(false);
        setTimeout(() => {
          this.sidebarShow.set(false);
        }, 300);
      }
    });
  }

  ngAfterContentInit(){
    console.log(this.side())
    if(this.side() === undefined){
      this.side.set("left");
    }
  }

  onClosePressed(){
    this.visible.set(false);
  }

}
