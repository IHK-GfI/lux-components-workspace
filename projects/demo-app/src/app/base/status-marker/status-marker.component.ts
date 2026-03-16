import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LuxBadgeComponent, LuxLabelComponent } from '@ihk-gfi/lux-components';
import { DemoMarkerType, getDemoMarkerColor, getDemoMarkerLabel } from './status-marker.model';

@Component({
  selector: 'app-status-marker',
  imports: [LuxBadgeComponent, LuxLabelComponent],
  templateUrl: './status-marker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatusMarkerComponent {
  private static globalCounter = 0;

  readonly markerType = input(DemoMarkerType.New);
  readonly label = computed(() => getDemoMarkerLabel(this.markerType()));
  readonly color = computed(() => getDemoMarkerColor(this.markerType()));
  readonly counter = StatusMarkerComponent.globalCounter++;
}
