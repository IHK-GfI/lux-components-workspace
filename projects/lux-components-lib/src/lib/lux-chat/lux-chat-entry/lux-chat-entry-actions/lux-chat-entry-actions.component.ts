import { CommonModule } from '@angular/common';
import { Component, ContentChild, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'lux-chat-entry-actions',
  imports: [
    CommonModule
  ],
  templateUrl: './lux-chat-entry-actions.component.html',
  styleUrl: './lux-chat-entry-actions.component.scss'
})
export class LuxChatEntryActionsComponent {

  @ViewChild("core", { read: TemplateRef, static: true }) public templateRef!: TemplateRef<any>;
  @ContentChild(TemplateRef) actionsTemplateRef?: TemplateRef<any>;

}
