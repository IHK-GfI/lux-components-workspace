import { AfterViewInit, ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
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
import { ExampleBaseOptionsActionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-options-actions.component';
import { ExampleBaseSimpleOptionsComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';

@Component({
  selector: 'app-errorpage-example',
  templateUrl: './errorpage-example.component.html',
  styleUrls: ['./errorpage-example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
export class ErrorpageExampleComponent implements AfterViewInit {
  readonly errorId = signal('1234');
  readonly errorMessage = signal('Es ist ein Fehler aufgetreten.');
  readonly updateButtonDisabled = signal(true);
  errorPageConfig: ILuxErrorPageConfig;
  configForm: FormGroup;

  private errorService = inject(LuxErrorService);
  private errorStore = inject(LuxErrorStoreService);
  private logger = inject(LuxConsoleService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.errorPageConfig = this.errorStore.config;
    this.configForm = new FormGroup({});
    Object.keys(this.errorPageConfig).forEach((key: string) => {
      this.configForm.setControl(key, new FormControl((this.errorPageConfig as any)[key]));
    });
  }

  ngAfterViewInit() {
    this.configForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.updateButtonDisabled.set(false);
      this.errorPageConfig = this.configForm.value;
    });
  }

  openErrorpage() {
    history?.pushState(null, '', 'components-overview/example/error-page');
    this.errorService.navigateToErrorPage({ errorId: this.errorId(), errorMessage: this.errorMessage() });
    this.logger.log(this.errorStore.lastErrors);
  }

  updateErrorConfig() {
    this.errorService.setConfig(this.errorPageConfig);
    this.updateButtonDisabled.set(true);
  }
}
