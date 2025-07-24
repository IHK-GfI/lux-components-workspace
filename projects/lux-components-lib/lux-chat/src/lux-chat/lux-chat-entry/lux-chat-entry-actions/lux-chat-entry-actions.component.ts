import { CommonModule } from '@angular/common';
import { Component, contentChild, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'lux-chat-entry-actions',
  imports: [
    CommonModule
  ],
  templateUrl: './lux-chat-entry-actions.component.html',
  styleUrl: './lux-chat-entry-actions.component.scss'
})
export class LuxChatEntryActionsComponent {

  public templateRef = viewChild.required<TemplateRef<any>>("core");
  public actionsTemplateRef = contentChild(TemplateRef);

}
