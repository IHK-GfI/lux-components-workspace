import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ILuxAppFooterButtonInfo,
  LuxAccordionComponent,
  LuxAppFooterButtonInfo,
  LuxAppFooterButtonService,
  LuxAppFooterLinkInfo,
  LuxAppFooterLinkService,
  LuxButtonComponent,
  LuxFormHintComponent,
  LuxInputComponent,
  LuxPanelComponent,
  LuxPanelContentComponent,
  LuxPanelHeaderTitleComponent,
  LuxSelectComponent,
  LuxSnackbarService,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-footer-example',
  templateUrl: './app-footer-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxButtonComponent,
    LuxAccordionComponent,
    LuxPanelHeaderTitleComponent,
    LuxPanelContentComponent,
    LuxPanelComponent,
    ExampleBaseStructureComponent,
    ExampleBaseSimpleOptionsComponent,
    LuxFormHintComponent,
    LuxInputComponent,
    LuxSelectComponent,
    LuxToggleComponent
  ]
})
export class AppFooterExampleComponent {
  readonly buttonService = inject(LuxAppFooterButtonService);
  readonly linkService = inject(LuxAppFooterLinkService);
  readonly buttonInfos = toSignal(this.buttonService.getButtonInfosAsObservable(), { initialValue: this.buttonService.buttonInfos });
  readonly linkInfos = toSignal(this.linkService.getLinkInfosAsObservable(), { initialValue: this.linkService.linkInfos });

  private readonly destroyRef = inject(DestroyRef);
  private readonly snackbar = inject(LuxSnackbarService);
  private readonly mementoLinkInfos = [...this.linkService.linkInfos];
  private readonly mementoButtonInfos = [...this.buttonService.buttonInfos];

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.buttonService.buttonInfos = this.mementoButtonInfos;
      this.linkService.linkInfos = this.mementoLinkInfos;
    });
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
    this.refreshButtonInfos();
  }

  removeFooterButton() {
    this.buttonService.removeButtonInfoAtIndex(this.buttonService.buttonInfos.length - 1);
    this.refreshButtonInfos();
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
    this.refreshLinkInfos();
  }

  removeFooterLink() {
    this.linkService.removeLinkInfoAtIndex(this.linkService.linkInfos.length - 1);
    this.refreshLinkInfos();
  }

  refreshButtonInfos() {
    this.buttonService.buttonInfos = [...this.buttonService.buttonInfos];
  }

  refreshLinkInfos() {
    this.linkService.linkInfos = [...this.linkService.linkInfos];
  }
}
