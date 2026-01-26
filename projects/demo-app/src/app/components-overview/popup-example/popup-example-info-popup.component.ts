import { Component, ViewChild, input } from '@angular/core';
import { LuxPopupCloseReason, LuxPopupComponent } from '@ihk-gfi/lux-components';

@Component({
  selector: 'app-popup-example-info-popup',
  standalone: true,
  imports: [LuxPopupComponent],
  exportAs: 'popupExampleInfoPopup',
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

  @ViewChild(LuxPopupComponent, { static: true }) private popupInstance!: LuxPopupComponent;

  get popup(): LuxPopupComponent {
    return this.popupInstance;
  }

  onClosed(reason: LuxPopupCloseReason) {
    console.log(`Popup closed due to: ${reason}`);
  }
}
