import { AfterViewInit, Component, OnDestroy, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ILuxError,
  ILuxErrorPageConfig,
  LuxButtonComponent,
  LuxConsoleService,
  LuxErrorService,
  LuxErrorStoreService,
  LuxFormHintComponent,
  LuxInputAcComponent,
  LuxSelectAcComponent,
  LuxToggleAcComponent
} from '@ihk-gfi/lux-components';
import { Subscription } from 'rxjs';
import { ExampleBaseOptionsActionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-options-actions.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-errorpage-example',
  templateUrl: './errorpage-example.component.html',
  styleUrls: ['./errorpage-example.component.scss'],
  imports: [
    LuxButtonComponent,
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    ExampleBaseStructureComponent,
    ExampleBaseSimpleOptionsComponent,
    ReactiveFormsModule,
    ExampleBaseOptionsActionsComponent
  ]
})
export class ErrorpageExampleComponent implements AfterViewInit, OnDestroy {
  private errorService = inject(LuxErrorService);
  private errorStore = inject(LuxErrorStoreService);
  private logger = inject(LuxConsoleService);

  errorConfig: ILuxError = { errorId: '1234', errorMessage: 'Es ist ein Fehler aufgetreten.' };
  errorPageConfig: ILuxErrorPageConfig;
  updateButtonDisabled = true;
  configForm: FormGroup;
  subscription!: Subscription;

  constructor() {
    this.errorPageConfig = this.errorStore.config;
    this.configForm = new FormGroup({});
    Object.keys(this.errorPageConfig).forEach((key: string) => {
      this.configForm.setControl(key, new FormControl((this.errorPageConfig as any)[key]));
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.subscription = this.configForm.valueChanges.subscribe(() => {
      this.updateButtonDisabled = false;

      this.errorPageConfig = this.configForm.value;
    });
  }

  openErrorpage() {
    history?.pushState(null, '', 'components-overview/example/error-page');
    this.errorService.navigateToErrorPage(this.errorConfig);
    this.logger.log(this.errorStore.lastErrors);
  }

  updateErrorConfig() {
    this.errorService.setConfig(this.errorPageConfig);
    this.updateButtonDisabled = true;
  }
}
