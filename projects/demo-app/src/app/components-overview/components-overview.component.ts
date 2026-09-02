import { AfterViewInit, Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  LuxAlphabeticallySortedPipe,
  LuxAppFooterButtonService,
  LuxAriaLabelDirective,
  LuxAutofocusDirective,
  LuxIconComponent,
  LuxImageComponent,
  LuxInputAcComponent,
  LuxInputAcPrefixComponent,
  LuxTileAcComponent,
  LuxUtil
} from '@ihk-gfi/lux-components';
import { StatusMarkerComponent } from '../base/status-marker/status-marker.component';
import { ComponentsOverviewNavigationService } from './components-overview-navigation.service';

@Component({
  selector: 'app-components',
  templateUrl: './components-overview.component.html',
  styleUrls: ['./components-overview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxAlphabeticallySortedPipe,
    LuxImageComponent,
    LuxIconComponent,
    LuxTileAcComponent,
    LuxAriaLabelDirective,
    LuxInputAcPrefixComponent,
    LuxInputAcComponent,
    LuxAutofocusDirective,
    StatusMarkerComponent
  ]
})
export class ComponentsOverviewComponent implements OnInit, AfterViewInit {
  private buttonService = inject(LuxAppFooterButtonService);
  navigationService = inject(ComponentsOverviewNavigationService);

  readonly filterValue = signal('');

  ngOnInit() {
    this.buttonService.buttonInfos = [];
  }

  ngAfterViewInit() {
    LuxUtil.goToTop();
  }
}
