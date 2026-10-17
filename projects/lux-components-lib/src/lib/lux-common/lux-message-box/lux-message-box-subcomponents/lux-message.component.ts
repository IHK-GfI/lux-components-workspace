import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxButtonComponent } from '../../../lux-action/lux-button/lux-button.component';
import { LuxAriaLabelDirective } from '../../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxAriaRoleDirective } from '../../../lux-directives/lux-aria/lux-aria-role.directive';
import { LuxIconComponent } from '../../../lux-icon/lux-icon/lux-icon.component';
import { ILuxMessage } from '../lux-message-box-model/lux-message.interface';

@Component({
  selector: 'lux-message',
  templateUrl: './lux-message.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxAriaRoleDirective, LuxButtonComponent, LuxAriaLabelDirective, LuxIconComponent, TranslocoPipe, NgClass]
})
export class LuxMessageComponent {
  readonly closing = signal(false);

  luxMessageClosed = output<ILuxMessage>();

  readonly luxMessage = input<ILuxMessage | undefined>(undefined);

  constructor() {
    effect(() => {
      this.luxMessage();
      this.closing.set(false);
    });
  }

  /**
   * Setzt das closing-Signal auf true – die CSS-Transition übernimmt das Ausblenden.
   * Der Close-Event wird erst in onTransitionEnd() emittiert.
   */
  close() {
    this.closing.set(true);
  }

  onTransitionEnd(event: TransitionEvent) {
    if (this.closing() && event.propertyName === 'opacity') {
      this.luxMessageClosed.emit(this.luxMessage()!);
    }
  }
}
