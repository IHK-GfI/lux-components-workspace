import { Component } from '@angular/core';
import { LuxBadgeComponent, LuxLabelComponent } from '@ihk-gfi/lux-components';

@Component({
  selector: 'app-new-marker',
  imports: [LuxBadgeComponent, LuxLabelComponent],
  templateUrl: './new-marker.component.html'
})
export class NewMarkerComponent {
  private static globalCounter = 0;
  counter: number;

  constructor() {
    this.counter = NewMarkerComponent.globalCounter++;
  }
}
