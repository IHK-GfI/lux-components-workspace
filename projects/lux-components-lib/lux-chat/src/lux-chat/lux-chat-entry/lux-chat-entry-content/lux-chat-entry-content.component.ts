import { CommonModule } from '@angular/common';
import { Component, contentChild, TemplateRef, viewChild } from '@angular/core';
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

  public templateRef = viewChild.required<TemplateRef<any>>("core");
  public contentTemplateRef = contentChild(TemplateRef);

  public sanitizeConfig: LuxSanitizeConfig = {
      forbiddenTags: ["code"],
  };

}
