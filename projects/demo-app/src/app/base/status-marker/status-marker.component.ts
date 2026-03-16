import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LuxBadgeComponent, LuxLabelComponent } from '@ihk-gfi/lux-components';
import { DemoMarkerType, getDemoMarkerLabel } from './status-marker.model';

@Component({
  selector: 'app-status-marker',
  imports: [LuxBadgeComponent, LuxLabelComponent],
  templateUrl: './status-marker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusMarkerComponent {
  private static globalCounter = 0;

  readonly markerType = input(DemoMarkerType.New);
  readonly badgeColor = computed(() => (this.markerType() === DemoMarkerType.New ? 'green' : 'lightblue'));
  readonly label = computed(() => getDemoMarkerLabel(this.markerType()));
  readonly counter = StatusMarkerComponent.globalCounter++;
}
