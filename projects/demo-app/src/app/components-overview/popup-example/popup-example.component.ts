import { Component } from '@angular/core';
import {
  LuxAriaLabelDirective,
  LuxButtonComponent,
  LuxInputAcComponent,
  LuxLinkComponent,
  LuxPopupActionsDirective,
  LuxPopupCloseReason,
  LuxPopupComponent,
  LuxPopupPosition,
  LuxPopupTriggerDirective,
  LuxSelectAcComponent,
  LuxTextareaAcComponent,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseContentComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { PopupExampleInfoPopupComponent } from './popup-example-info-popup.component';

@Component({
  selector: 'app-popup-example',
  templateUrl: './popup-example.component.html',
  imports: [
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ExampleBaseSimpleOptionsComponent,
    LuxPopupComponent,
    LuxPopupTriggerDirective,
    LuxPopupActionsDirective,
    LuxButtonComponent,
    LuxLinkComponent,
    LuxInputAcComponent,
    LuxTextareaAcComponent,
    LuxSelectAcComponent,
    LuxToggleAcComponent,
    PopupExampleInfoPopupComponent,
    LuxAriaLabelDirective
  ]
})
export class PopupExampleComponent {
  title = 'Kontextinformationen';
  text = 'Die Popup-Komponente zeigt erweiterte Tooltips mit mehrzeiligen Texten an.';
  showDelay = 500;
  hideDelay = 120;
  minWidth = 240;
  maxWidth = 360;
  position: LuxPopupPosition = 'above';
  disabled = false;
  positionOptions: LuxPopupPosition[] = ['above', 'below', 'before', 'after', 'left', 'right'];

  onAction(popup: LuxPopupComponent, actionLabel: string) {
    console.log(`Action "${actionLabel}" clicked!`);
    popup.close();
  }

  onClosed(reason: LuxPopupCloseReason) {
    console.log(`Popup closed due to: ${reason}`);
  }
}
