import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, viewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LuxAppFooterButtonInfo,
  LuxAppFooterButtonService,
  LuxSnackbarService,
  LuxTabComponent,
  LuxTabsComponent,
  LuxUtil
} from '@ihk-gfi/lux-components';
import { FormCommonComponent } from './form-common/form-common.component';
import { FormDualColComponent } from './form-dual-col/form-dual-col.component';
import { FormExampleStateKey, FormExampleStateService } from './form-example-state.service';
import { FormSingleColComponent } from './form-single-col/form-single-col.component';
import { FormThreeColComponent } from './form-three-col/form-three-col.component';
import { TableExampleDataProviderService } from './table-example-data-provider.service';
import { IUnsavedDataCheck } from './unsaved-data-guard/unsaved-data-check.interface';
import { WebFontDemoComponent } from './web-font-demo/web-font-demo.component';

@Component({
  selector: 'app-form-example',
  templateUrl: './form-example.component.html',
  styles: [':host { display: flex; flex-direction: column; flex: 1 1 auto;}'],
  imports: [
    LuxTabsComponent,
    LuxTabComponent,
    FormCommonComponent,
    FormSingleColComponent,
    FormDualColComponent,
    FormThreeColComponent,
    WebFontDemoComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TableExampleDataProviderService]
})
export class FormExampleComponent implements IUnsavedDataCheck, OnInit, AfterViewInit, OnDestroy {
  private router = inject(Router);
  private buttonService = inject(LuxAppFooterButtonService);
  private snackbar = inject(LuxSnackbarService);
  private readonly state = inject(FormExampleStateService);

  readonly formCommon = viewChild.required(FormCommonComponent);
  readonly formSingle = viewChild.required(FormSingleColComponent);
  readonly formDuo = viewChild.required(FormDualColComponent);
  readonly formThree = viewChild.required(FormThreeColComponent);
  readonly tabComponent = viewChild.required(LuxTabsComponent);

  btnShowErrors = LuxAppFooterButtonInfo.generateInfo({
    cmd: 'btnShowErrors',
    label: 'Fehler anzeigen',
    iconName: 'lux-exclamation-mark',
    flat: true,
    raised: false,
    alwaysVisible: false,
    onClick: this.highlightErrors.bind(this)
  });

  btnSave = LuxAppFooterButtonInfo.generateInfo({
    cmd: 'btnSave',
    label: 'Speichern',
    iconName: 'lux-save',
    flat: true,
    raised: false,
    color: 'primary',
    alwaysVisible: false,
    onClick: this.handleSaveClicked.bind(this)
  });

  ngOnInit(): void {
    this.buttonService.buttonInfos = [
      this.btnShowErrors,
      this.btnSave,
      LuxAppFooterButtonInfo.generateInfo({
        label: 'Dokumentation',
        iconName: 'lux-interface-arrows-expand-5',
        cmd: 'documentation-btn',
        color: 'primary',
        flat: true,
        raised: false,
        alwaysVisible: true,
        onClick: () => {
          window.open('https://github.com/IHK-GfI/lux-components/wiki/lux%E2%80%90layout%E2%80%90form%E2%80%90row', '_blank');
        }
      }),
      LuxAppFooterButtonInfo.generateInfo({
        label: 'Overview',
        iconName: 'lux-interface-arrows-button-left',
        cmd: 'back-btn',
        color: 'primary',
        flat: true,
        raised: false,
        alwaysVisible: false,
        onClick: () => {
          this.router.navigate(['/']);
        }
      })
    ];
  }

  ngAfterViewInit() {
    LuxUtil.goToTop();
  }

  ngOnDestroy(): void {
    this.buttonService.buttonInfos = [];
  }

  hasUnsavedData(): boolean {
    return (
      this.formCommon().myGroup.dirty || this.formSingle().myGroup.dirty || this.formDuo().myGroup.dirty || this.formThree().myGroup.dirty
    );
  }

  handleSaveClicked() {
    let formGroup: FormGroup | null;
    let stateKey: FormExampleStateKey | null;
    switch (this.tabComponent().luxActiveTab()) {
      case 0:
        formGroup = this.formCommon().myGroup;
        stateKey = 'common';
        break;
      case 1:
        formGroup = this.formSingle().myGroup;
        stateKey = 'single';
        break;
      case 2:
        formGroup = this.formDuo().myGroup;
        stateKey = 'dual';
        break;
      case 3:
        formGroup = this.formThree().myGroup;
        stateKey = 'three';
        break;
      default:
        formGroup = null;
        stateKey = null;
        break;
    }

    if (formGroup && formGroup.valid) {
      formGroup.markAsPristine();
      if (stateKey) {
        this.state.markPristine(stateKey);
      }

      this.snackbar.open(2000, {
        text: 'Daten gespeichert!'
      });
    } else {
      this.highlightErrors();
    }
  }

  highlightErrors() {
    switch (this.tabComponent().luxActiveTab()) {
      case 0:
        LuxUtil.showValidationErrors(this.formCommon().myGroup);
        break;
      case 1:
        LuxUtil.showValidationErrors(this.formSingle().myGroup);
        break;
      case 2:
        LuxUtil.showValidationErrors(this.formDuo().myGroup);
        break;
      case 3:
        LuxUtil.showValidationErrors(this.formThree().myGroup);
        break;
      default:
        break;
    }
  }
}
