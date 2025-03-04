import { Component, OnInit } from '@angular/core';
import {
  ILuxMessage,
  ILuxMessageChangeEvent,
  ILuxMessageCloseEvent,
  LuxAccordionComponent,
  LuxButtonComponent,
  LuxFormHintComponent,
  LuxInputAcComponent,
  LuxMessageBoxColors,
  LuxMessageBoxComponent,
  LuxPanelComponent,
  LuxPanelContentComponent,
  LuxPanelHeaderDescriptionComponent,
  LuxPanelHeaderTitleComponent,
  LuxSelectAcComponent,
  LuxTextareaAcComponent,
  LuxToggleAcComponent
} from 'lux-components-lib';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseOptionsActionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-options-actions.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';

@Component({
  selector: 'app-message-box-example',
  templateUrl: './message-box-example.component.html',
  imports: [
    LuxMessageBoxComponent,
    LuxButtonComponent,
    LuxAccordionComponent,
    LuxPanelHeaderDescriptionComponent,
    LuxPanelHeaderTitleComponent,
    LuxPanelContentComponent,
    LuxPanelComponent,
    LuxToggleAcComponent,
    LuxTextareaAcComponent,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent,
    ExampleBaseOptionsActionsComponent
  ]
})
export class MessageBoxExampleComponent implements OnInit {
  showOutputEvents = false;
  log = logResult;
  messages: ILuxMessage[] = [];
  colors = LuxMessageBoxColors;
  newMessage: ILuxMessage = { text: '', iconName: '', color: 'blue' };
  messageIndex = 1;
  maximumDisplayed = 10;

  constructor() {}

  ngOnInit() {
    this.setMessages();
  }

  setMessages() {
    this.messages = [];

    LuxMessageBoxColors.forEach((color, index) => {
      this.messages.push({
        text: 'Message #' + (index + 1),
        iconName: 'lux-interface-alert-alarm-bell-2',
        color: color
      });
    });
  }

  add() {
    this.messages = [...this.messages, JSON.parse(JSON.stringify(this.newMessage))];
    this.newMessage = { text: '', iconName: '', color: 'blue' };
    this.log(this.showOutputEvents, 'Messages updated', this.messages);
  }

  remove(i: number) {
    this.messages = this.messages.filter((_value, index) => index !== i);
  }

  logChanged(messageChangeEvent: ILuxMessageChangeEvent) {
    this.log(this.showOutputEvents, '[Output-Event] Message wurde geändert:', messageChangeEvent);
  }

  logClosed(messageCloseEvent: ILuxMessageCloseEvent) {
    this.log(this.showOutputEvents, '[Output-Event] Message wurde geschlossen', messageCloseEvent);
    if (Array.isArray(messageCloseEvent)) {
      messageCloseEvent.forEach((eventValue: ILuxMessageCloseEvent) => {
        this.messages = this.messages.filter((compareMessage: ILuxMessage) => compareMessage !== eventValue.message);
      });
    } else {
      this.messages = this.messages.filter((compareMessage: ILuxMessage) => compareMessage !== messageCloseEvent.message);
    }
  }

  logBoxClosed() {
    this.log(this.showOutputEvents, '[Output-Event] MessageBox wurde geschlossen');
  }
}
