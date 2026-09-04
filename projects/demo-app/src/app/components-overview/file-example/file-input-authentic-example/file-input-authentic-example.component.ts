import { AfterViewInit, Component, signal, viewChild, viewChildren, ChangeDetectionStrategy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ILuxFileActionConfig,
  ILuxFileObject,
  LuxAutofocusDirective,
  LuxButtonComponent,
  LuxFileInputComponent,
  LuxFormHintComponent,
  LuxInputComponent,
  LuxToggleComponent
} from '@ihk-gfi/lux-components';
import { map, take } from 'rxjs/operators';
import { ExampleBaseContentComponent } from '../../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { ExampleFormValueComponent } from '../../../example-base/example-form-value/example-form-value.component';
import { FileExampleAdvancedOptionsComponent } from '../file-example-advanced-options/file-example-advanced-options.component';
import { FileExampleSimpleOptionsComponent } from '../file-example-simple-options/file-example-simple-options.component';
import { FileExampleComponent } from '../file-example.component';
import { StatusMarkerComponent } from '../../../base/status-marker/status-marker.component';
import { DemoMarkerType } from '../../../base/status-marker/status-marker.model';

@Component({
  selector: 'lux-file-input-authentic-example',
  templateUrl: './file-input-authentic-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxButtonComponent,
    LuxToggleComponent,
    LuxInputComponent,
    LuxFormHintComponent,
    LuxFileInputComponent,
    LuxAutofocusDirective,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ReactiveFormsModule,
    ExampleFormValueComponent,
    ExampleBaseSimpleOptionsComponent,
    FileExampleSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent,
    FileExampleAdvancedOptionsComponent,
    StatusMarkerComponent
  ]
})
export class FileInputAuthenticExampleComponent extends FileExampleComponent implements AfterViewInit {
  readonly fileInputs = viewChildren(LuxFileInputComponent);
  readonly fileBaseWithoutComponent = viewChild.required('fileinputexamplewithoutform', { read: LuxFileInputComponent });
  readonly fileBaseWithComponent = viewChild.required('fileinputexamplewithform', { read: LuxFileInputComponent });

  readonly placeholder = signal('Placeholder');
  readonly clearOnError = signal(true);
  readonly noTopLabel = signal(false);
  readonly noBottomLabel = signal(false);
  readonly noLabels = signal(false);
  readonly markerTypeUpdated = DemoMarkerType.Updated;

  readonly namePrefixAccept = signal('(OK) ');
  readonly nameSuffixAccept = signal(` (${new Date().toLocaleDateString()})`);

  readonly namePrefixDecline = signal('(ERR) ');
  readonly nameSuffixDecline = signal(` (${new Date().toLocaleDateString()})`);

  customActionConfigs: ILuxFileActionConfig[] = this.createCustomConfigs();
  customActionsConfigsForm: ILuxFileActionConfig[] = this.createCustomConfigs();

  readonly labelLongFormat = signal(false);
  readonly denseFormat = signal(false);

  ngAfterViewInit() {
    this.fileComponents = [...this.fileInputs()];
  }

  initSelected() {
    this.http
      .get('assets/png/example.png', { responseType: 'blob' })
      .pipe(
        take(1),
        map((response: Blob) => {
          const file = response as any;
          file.name = 'example.png';
          file.lastModifiedDate = new Date();
          const fileObject = { name: 'example.png', content: file, type: file.type, size: file.size };
          this.selected.set(fileObject);
          this.form.get(this.controlBinding)!.setValue(fileObject);
        })
      )
      .subscribe(() => {
        /* Do nothing */
      });
  }

  onKeepFileWithoutForm(keepFile: boolean) {
    if (keepFile) {
      const fileCopy = { name: '', type: '' };
      Object.assign(fileCopy, this.selected());
      this.fileBaseWithoutComponent().setValue(fileCopy);
    } else {
      this.fileBaseWithoutComponent().setValue(null);
    }
  }

  onKeepFileWithForm(keepFile: boolean) {
    if (keepFile) {
      const fileCopy = { name: '', type: '' };
      Object.assign(fileCopy, this.fileBaseWithComponent().value());
      this.fileBaseWithComponent().setValue(fileCopy);
    } else {
      this.fileBaseWithComponent().setValue(null);
    }
  }

  override onDelete(_event: any) {
    this.customActionConfigs.forEach((config) => (config.disabled = true));
  }

  override onUpload(_event: any) {
    this.customActionConfigs.forEach((config) => (config.disabled = false));
  }

  protected initUploadActionConfig() {
    return {
      disabled: false,
      hidden: false,
      iconName: 'lux-programming-cloud-upload',
      label: 'Hochladen',
      onClick: (file?: ILuxFileObject) => {
        this.log(this.showOutputEvents(), 'uploadActionConfig onClick', file);
        this.onUpload(file);
      }
    };
  }

  private createCustomConfigs(): ILuxFileActionConfig[] {
    const customConfigAccept = {
      disabled: false,
      hidden: false,
      iconName: 'lux-interface-validation-check',
      label: 'Akzeptieren',
      prio: 1,
      onClick: (fileObject: ILuxFileObject) => {
        if (fileObject) {
          customConfigAccept.disabled = true;
          customConfigDecline.disabled = false;
          fileObject.namePrefix = this.namePrefixAccept();
          fileObject.nameSuffix = this.nameSuffixAccept();
        }
      }
    };

    const customConfigDecline = {
      disabled: false,
      hidden: false,
      iconName: 'lux-interface-delete-1',
      label: 'Ablehnen',
      prio: 2,
      onClick: (fileObject: ILuxFileObject) => {
        if (fileObject) {
          customConfigAccept.disabled = false;
          customConfigDecline.disabled = true;
          fileObject.namePrefix = this.namePrefixDecline();
          fileObject.nameSuffix = this.nameSuffixDecline();
        }
      }
    };

    return [customConfigAccept, customConfigDecline];
  }
}
