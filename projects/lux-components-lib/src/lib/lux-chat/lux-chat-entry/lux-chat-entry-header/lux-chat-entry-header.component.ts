import { CommonModule } from '@angular/common';
import { Component, ContentChild, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'lux-chat-entry-header',
  imports: [
    CommonModule
  ],
  templateUrl: './lux-chat-entry-header.component.html',
  styleUrl: './lux-chat-entry-header.component.scss'
})
export class LuxChatEntryHeaderComponent {
  
  @ViewChild("core", { read: TemplateRef, static: true }) public templateRef!: TemplateRef<any>;
  @ContentChild(TemplateRef) headerTemplateRef?: TemplateRef<any>;

}
