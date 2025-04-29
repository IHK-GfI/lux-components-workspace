import { CommonModule } from '@angular/common';
import { Component, ContentChild, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'lux-chat-entry-footer',
  imports: [
    CommonModule
  ],
  templateUrl: './lux-chat-entry-footer.component.html',
  styleUrl: './lux-chat-entry-footer.component.scss'
})
export class LuxChatEntryFooterComponent {

  @ViewChild("core", { read: TemplateRef, static: true }) public templateRef!: TemplateRef<any>;
  @ContentChild(TemplateRef) footerTemplateRef?: TemplateRef<any>;

}
