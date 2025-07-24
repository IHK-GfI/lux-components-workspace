import { CommonModule } from '@angular/common';
import { Component, contentChild, TemplateRef, viewChild } from '@angular/core';

@Component({
  selector: 'lux-chat-entry-footer',
  imports: [
    CommonModule
  ],
  templateUrl: './lux-chat-entry-footer.component.html',
  styleUrl: './lux-chat-entry-footer.component.scss'
})
export class LuxChatEntryFooterComponent {

  public templateRef = viewChild.required<TemplateRef<any>>("core");
  public footerTemplateRef = contentChild(TemplateRef);

}
