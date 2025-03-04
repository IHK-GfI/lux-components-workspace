import { Component } from '@angular/core';
import { LuxIconComponent, LuxTileAcComponent } from 'lux-components-lib';

@Component({
  selector: 'lux-overview-example',
  templateUrl: './overview-example.component.html',
  styleUrls: ['./overview-example.component.scss'],
  imports: [LuxIconComponent, LuxTileAcComponent]
})
export class OverviewExampleComponent {
  constructor() {}
}
