import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxButtonComponent } from '../../../lux-action/lux-button/lux-button.component';
import { LuxAriaLabelDirective } from '../../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxAriaRoleDirective } from '../../../lux-directives/lux-aria/lux-aria-role.directive';
import { LuxIconComponent } from '../../../lux-icon/lux-icon/lux-icon.component';
import { LuxUtil } from '../../../lux-util/lux-util';
import { ILuxMessage } from '../lux-message-box-model/lux-message.interface';

@Component({
  selector: 'lux-message',
  templateUrl: './lux-message.component.html',
  imports: [LuxAriaRoleDirective, LuxButtonComponent, LuxAriaLabelDirective, LuxIconComponent, TranslocoPipe]
})
export class LuxMessageComponent {
  private _luxMessage?: ILuxMessage;

  backgroundCSSClass = 'lux-bg-color-blue';
  fontCSSClass = 'lux-font-color-white';

  @Output() luxMessageClosed = new EventEmitter<ILuxMessage>();

  @Input() set luxMessage(message: ILuxMessage | undefined) {
    this._luxMessage = message;
    if (this.luxMessage) {
      this.updateColor();
    }
  }

  get luxMessage(): ILuxMessage | undefined {
    return this._luxMessage;
  }

  constructor() {}

  /**
   * Setzt die Messages auf ein leeres Array, um so die MessageBox auszublenden.
   */
  close() {
    this.luxMessageClosed.emit(this.luxMessage);
  }

  /**
   * Aktualisiert die Farbe dieser Box passend zur Farbe der Nachricht.
   */
  private updateColor() {
    if (this.luxMessage) {
      const color = this.luxMessage.color;
      const result = LuxUtil.getColorsByBgColorsEnum(color);

      this.fontCSSClass = result.fontCSSClass;
      this.backgroundCSSClass = result.backgroundCSSClass;
    }
  }
}
