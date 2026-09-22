import { AfterViewInit, Component, OnInit, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import {
  LuxAlphabeticallySortedPipe,
  LuxAppFooterButtonService,
  LuxAriaLabelDirective,
  LuxAutofocusDirective,
  LuxIconComponent,
  LuxImageComponent,
  LuxInputComponent,
  LuxInputPrefixComponent,
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
    LuxInputPrefixComponent,
    LuxInputComponent,
    LuxAutofocusDirective,
    StatusMarkerComponent
  ]
})
export class ComponentsOverviewComponent implements OnInit, AfterViewInit {
  navigationService = inject(ComponentsOverviewNavigationService);

  readonly filterValue = signal('');

  private buttonService = inject(LuxAppFooterButtonService);

  ngOnInit() {
    this.buttonService.buttonInfos = [];
  }

  ngAfterViewInit() {
    LuxUtil.goToTop();
  }
}
