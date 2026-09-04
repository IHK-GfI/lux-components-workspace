import { ChangeDetectionStrategy, Component, input, viewChild } from '@angular/core';
import { LuxPopupCloseReason, LuxPopupComponent } from '@ihk-gfi/lux-components';

@Component({
  selector: 'app-popup-example-info-popup',
  imports: [LuxPopupComponent],
  exportAs: 'popupExampleInfoPopup',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <lux-popup
      [luxTitle]="title()"
      [luxPersistent]="false"
      [luxMinWidth]="minWidth()"
      [luxMaxWidth]="maxWidth()"
      (luxClosed)="onClosed($event)"
    >
      <p>{{ text() }}</p>
      <p>Lorem ipsum...</p>
    </lux-popup>
  `
})
export class PopupExampleInfoPopupComponent {
  readonly title = input<string | undefined>();
  readonly text = input<string | undefined>();
  readonly minWidth = input.required<number>();
  readonly maxWidth = input.required<number>();

  private readonly popupInstance = viewChild.required(LuxPopupComponent);

  get popup(): LuxPopupComponent {
    return this.popupInstance();
  }

  onClosed(reason: LuxPopupCloseReason) {
    console.log(`Popup closed due to: ${reason}`);
  }
}
