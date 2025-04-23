import { CommonModule } from '@angular/common';
import { Component, ContentChild, TemplateRef, ViewChild } from '@angular/core';
import { LuxSanitizeConfig } from '@ihk-gfi/lux-components/lux-html';
import { LuxMarkdownComponent } from '@ihk-gfi/lux-components/lux-markdown';

@Component({
  selector: 'lux-chat-entry-content',
  imports: [
    CommonModule,
    LuxMarkdownComponent
  ],
  templateUrl: './lux-chat-entry-content.component.html',
  styleUrl: './lux-chat-entry-content.component.scss'
})
export class LuxChatEntryContentComponent {

  @ViewChild("core", { read: TemplateRef, static: true }) public templateRef!: TemplateRef<any>;
  @ContentChild(TemplateRef) contentTemplateRef?: TemplateRef<any>;

  public sanitizeConfig: LuxSanitizeConfig = {
      forbiddenTags: ["code"],
  };

}
