import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LuxIconComponent, LuxTileAcComponent } from '@ihk-gfi/lux-components';

@Component({
  selector: 'lux-overview-example',
  templateUrl: './overview-example.component.html',
  styleUrls: ['./overview-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxIconComponent, LuxTileAcComponent]
})
export class OverviewExampleComponent {}
