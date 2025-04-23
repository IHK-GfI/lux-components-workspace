import { CommonModule } from '@angular/common';
import { Component, ContentChild, TemplateRef, ViewChild } from '@angular/core';
import { LuxChatEntryHeaderComponent } from './lux-chat-entry-header/lux-chat-entry-header.component';
import { LuxChatEntryContentComponent } from './lux-chat-entry-content/lux-chat-entry-content.component';
import { LuxChatEntryFooterComponent } from './lux-chat-entry-footer/lux-chat-entry-footer.component';
import { LuxChatEntryActionsComponent } from './lux-chat-entry-actions/lux-chat-entry-actions.component';

@Component({
  selector: 'lux-chat-entry',
  imports: [
    CommonModule,
    LuxChatEntryHeaderComponent,
    LuxChatEntryContentComponent,
    LuxChatEntryFooterComponent
  ],
  templateUrl: './lux-chat-entry.component.html',
  styleUrl: './lux-chat-entry.component.scss'
})
export class LuxChatEntryComponent {

  @ViewChild("core", { read: TemplateRef, static: true }) public templateRef!: TemplateRef<any>;

  @ContentChild(LuxChatEntryHeaderComponent) public chatEntryHeader?: LuxChatEntryHeaderComponent;
  @ContentChild(LuxChatEntryContentComponent) public chatEntryContent?: LuxChatEntryContentComponent;
  @ContentChild(LuxChatEntryFooterComponent) public chatEntryFooter?: LuxChatEntryFooterComponent;
  @ContentChild(LuxChatEntryActionsComponent) public chatEntryActions?: LuxChatEntryActionsComponent;

}
