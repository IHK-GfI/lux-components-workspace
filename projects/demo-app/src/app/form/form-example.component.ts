import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject, viewChild } from '@angular/core';
import { FieldState } from '@angular/forms/signals';
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

  private router = inject(Router);
  private buttonService = inject(LuxAppFooterButtonService);
  private snackbar = inject(LuxSnackbarService);
  private readonly state = inject(FormExampleStateService);

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
      this.formCommon().myForm().dirty() ||
      this.formSingle().myForm().dirty() ||
      this.formDuo().myForm().dirty() ||
      this.formThree().myForm().dirty()
    );
  }

  handleSaveClicked() {
    let field: FieldState<unknown> | null;
    let stateKey: FormExampleStateKey | null;
    switch (this.tabComponent().luxActiveTab()) {
      case 0:
        field = this.formCommon().myForm();
        stateKey = 'common';
        break;
      case 1:
        field = this.formSingle().myForm();
        stateKey = 'single';
        break;
      case 2:
        field = this.formDuo().myForm();
        stateKey = 'dual';
        break;
      case 3:
        field = this.formThree().myForm();
        stateKey = 'three';
        break;
      default:
        field = null;
        stateKey = null;
        break;
    }

    if (field && field.valid()) {
      field.reset();
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
        this.formCommon().myForm().markAsTouched();
        break;
      case 1:
        this.formSingle().myForm().markAsTouched();
        break;
      case 2:
        this.formDuo().myForm().markAsTouched();
        break;
      case 3:
        this.formThree().myForm().markAsTouched();
        break;
      default:
        break;
    }
  }
}
