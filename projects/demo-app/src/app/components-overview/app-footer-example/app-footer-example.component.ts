import { Component, OnDestroy, inject } from '@angular/core';
import {
    ILuxAppFooterButtonInfo,
    LuxAccordionComponent,
    LuxAppFooterButtonInfo,
    LuxAppFooterButtonService,
    LuxAppFooterLinkInfo,
    LuxAppFooterLinkService,
    LuxButtonComponent,
    LuxFormHintComponent,
    LuxInputAcComponent,
    LuxPanelComponent,
    LuxPanelContentComponent,
    LuxPanelHeaderTitleComponent,
    LuxSelectAcComponent,
    LuxSnackbarService,
    LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-footer-example',
  templateUrl: './app-footer-example.component.html',
  imports: [
    LuxButtonComponent,
    LuxAccordionComponent,
    LuxPanelHeaderTitleComponent,
    LuxPanelContentComponent,
    LuxPanelComponent,
    ExampleBaseStructureComponent,
    ExampleBaseSimpleOptionsComponent,
    LuxFormHintComponent,
    LuxInputAcComponent,
    LuxSelectAcComponent,
    LuxToggleAcComponent
  ]
})
export class AppFooterExampleComponent implements OnDestroy {
  buttonService = inject(LuxAppFooterButtonService);
  linkService = inject(LuxAppFooterLinkService);
  private snackbar = inject(LuxSnackbarService);

  mementoLinkInfos;
  mementoButtonInfos;

  constructor() {
    this.mementoButtonInfos = [...this.buttonService.buttonInfos];
    this.mementoLinkInfos = [...this.linkService.linkInfos];
  }

  /**
   * Beim Verlassen der Component sicherheitshalber die Footer-Links und Footer-Buttons leeren.
   */
  ngOnDestroy() {
    this.buttonService.buttonInfos = this.mementoButtonInfos;
    this.linkService.linkInfos = this.mementoLinkInfos;
  }

  addFooterButton() {
    this.buttonService.pushButtonInfos(
      LuxAppFooterButtonInfo.generateInfo({
        cmd: 'btn' + this.buttonService.buttonInfos.length,
        label: 'Neu (' + this.buttonService.buttonInfos.length + ')',
        alwaysVisible: false,
        tooltip: '',
        onClick: this.buttonInfoClicked.bind(this)
      })
    );
  }

  removeFooterButton() {
    this.buttonService.removeButtonInfoAtIndex(this.buttonService.buttonInfos.length - 1);
  }

  buttonInfoClicked(that: ILuxAppFooterButtonInfo) {
    this.snackbar.open(2000, {
      text: that.label + ' clicked! [cmd: ' + that.cmd + ']'
    });
  }

  addFooterLink() {
    this.linkService.pushLinkInfos(
      LuxAppFooterLinkInfo.generateInfo({
        label: 'Neu (' + this.linkService.linkInfos.length + ')',
        path: '/components-overview'
      })
    );
  }

  removeFooterLink() {
    this.linkService.removeLinkInfoAtIndex(this.linkService.linkInfos.length - 1);
  }
}
