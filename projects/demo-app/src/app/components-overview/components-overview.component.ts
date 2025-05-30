import { AfterViewInit, Component, OnInit, inject } from '@angular/core';
import {
  LuxAlphabeticallySortedPipe,
  LuxAppFooterButtonService,
  LuxAriaLabelDirective,
  LuxAriaRoleDirective,
  LuxAutofocusDirective,
  LuxBadgeNotificationDirective,
  LuxIconComponent,
  LuxImageComponent,
  LuxInputAcComponent,
  LuxInputAcPrefixComponent,
  LuxInputAcSuffixComponent,
  LuxTileAcComponent,
  LuxUtil
} from '@ihk-gfi/lux-components';
import { ComponentsOverviewNavigationService } from './components-overview-navigation.service';

@Component({
  selector: 'app-components',
  templateUrl: './components-overview.component.html',
  styleUrls: ['./components-overview.component.scss'],
  imports: [
    LuxAlphabeticallySortedPipe,
    LuxImageComponent,
    LuxIconComponent,
    LuxTileAcComponent,
    LuxBadgeNotificationDirective,
    LuxAriaRoleDirective,
    LuxAriaLabelDirective,
    LuxInputAcSuffixComponent,
    LuxInputAcPrefixComponent,
    LuxInputAcComponent,
    LuxAutofocusDirective
  ]
})
export class ComponentsOverviewComponent implements OnInit, AfterViewInit {
  private buttonService = inject(LuxAppFooterButtonService);
  navigationService = inject(ComponentsOverviewNavigationService);

  filterValue = '';

  ngOnInit() {
    this.buttonService.buttonInfos = [];
  }

  ngAfterViewInit() {
    LuxUtil.goToTop();
  }
}
