import { Component, OnInit, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  ILuxMessage,
  ILuxMessageChangeEvent,
  ILuxMessageCloseEvent,
  LuxAccordionComponent,
  LuxButtonComponent,
  LuxCardComponent,
  LuxCardContentComponent,
  LuxCardContentExpandedComponent,
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
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseOptionsActionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-options-actions.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { logResult } from '../../example-base/example-base-util/example-base-helper';

@Component({
  selector: 'app-message-box-example',
  templateUrl: './message-box-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    ExampleBaseOptionsActionsComponent,
    LuxCardComponent,
    LuxCardContentComponent,
    LuxCardContentExpandedComponent
  ]
})
export class MessageBoxExampleComponent implements OnInit {
  readonly showOutputEvents = signal(false);
  readonly showInCard = signal(false);
  log = logResult;
  readonly messages = signal<ILuxMessage[]>([]);
  readonly colors = LuxMessageBoxColors;
  newMessage: ILuxMessage = { text: '', iconName: '', color: 'blue' };
  readonly messageIndex = signal(1);
  readonly maximumDisplayed = signal(10);

  ngOnInit() {
    this.setMessages();
  }

  setMessages() {
    const messages: ILuxMessage[] = [];

    LuxMessageBoxColors.forEach((color, index) => {
      messages.push({
        text: 'Message #' + (index + 1),
        iconName: 'lux-interface-alert-alarm-bell-2',
        color: color
      });
    });

    this.messages.set(messages);
  }

  add() {
    this.messages.update((messages) => [...messages, JSON.parse(JSON.stringify(this.newMessage))]);
    this.newMessage = { text: '', iconName: '', color: 'blue' };
    this.log(this.showOutputEvents(), 'Messages updated', this.messages());
  }

  remove(i: number) {
    this.messages.update((messages) => messages.filter((_value, index) => index !== i));
  }

  logChanged(messageChangeEvent: ILuxMessageChangeEvent) {
    this.log(this.showOutputEvents(), '[Output-Event] Message wurde geändert:', messageChangeEvent);
  }

  logClosed(messageCloseEvent: ILuxMessageCloseEvent) {
    this.log(this.showOutputEvents(), '[Output-Event] Message wurde geschlossen', messageCloseEvent);
    if (Array.isArray(messageCloseEvent)) {
      messageCloseEvent.forEach((eventValue: ILuxMessageCloseEvent) => {
        this.messages.update((messages) => messages.filter((compareMessage: ILuxMessage) => compareMessage !== eventValue.message));
      });
    } else {
      this.messages.update((messages) => messages.filter((compareMessage: ILuxMessage) => compareMessage !== messageCloseEvent.message));
    }
  }

  logBoxClosed() {
    this.log(this.showOutputEvents(), '[Output-Event] MessageBox wurde geschlossen');
  }
}
