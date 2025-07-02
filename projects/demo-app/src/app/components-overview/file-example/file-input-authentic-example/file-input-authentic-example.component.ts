import { AfterViewInit, Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ILuxFileActionConfig,
  ILuxFileObject,
  LuxAutofocusDirective,
  LuxButtonComponent,
  LuxFileInputAcComponent,
  LuxFormHintComponent,
  LuxInputAcComponent,
  LuxToggleAcComponent
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

@Component({
  selector: 'lux-file-input-authentic-example',
  templateUrl: './file-input-authentic-example.component.html',
  imports: [
    LuxButtonComponent,
    LuxToggleAcComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    LuxFileInputAcComponent,
    LuxAutofocusDirective,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ReactiveFormsModule,
    ExampleFormValueComponent,
    ExampleBaseSimpleOptionsComponent,
    FileExampleSimpleOptionsComponent,
    ExampleBaseAdvancedOptionsComponent,
    FileExampleAdvancedOptionsComponent
  ]
})
export class FileInputAuthenticExampleComponent extends FileExampleComponent implements AfterViewInit {
  @ViewChildren(LuxFileInputAcComponent) fileInputs!: QueryList<LuxFileInputAcComponent>;
  @ViewChild('fileinputexamplewithoutform', { read: LuxFileInputAcComponent, static: true })
  fileBaseWithoutComponent!: LuxFileInputAcComponent;
  @ViewChild('fileinputexamplewithform', { read: LuxFileInputAcComponent, static: true }) fileBaseWithComponent!: LuxFileInputAcComponent;

  placeholder = 'Placeholder';
  clearOnError = true;

  namePrefixAccept = '(OK) ';
  nameSuffixAccept = ` (${new Date().toLocaleDateString()})`;

  namePrefixDecline = '(ERR) ';
  nameSuffixDecline = ` (${new Date().toLocaleDateString()})`;

  customActionConfigs: ILuxFileActionConfig[] = this.createCustomConfigs();
  customActionsConfigsForm: ILuxFileActionConfig[] = this.createCustomConfigs();

  labelLongFormat = false;
  denseFormat = false;

  protected initUploadActionConfig() {
    return {
      disabled: false,
      hidden: false,
      iconName: 'lux-programming-cloud-upload',
      label: 'Hochladen',
      onClick: (file?: ILuxFileObject) => {
        this.log(this.showOutputEvents, 'uploadActionConfig onClick', file);
        this.onUpload(file);
      }
    };
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
          this.selected = fileObject;
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
      Object.assign(fileCopy, this.selected);
      this.fileBaseWithoutComponent.luxSelected = fileCopy;
    } else {
      this.fileBaseWithoutComponent.luxSelected = null as any;
    }
  }

  onKeepFileWithForm(keepFile: boolean) {
    if (keepFile) {
      const fileCopy = { name: '', type: '' };
      Object.assign(fileCopy, this.fileBaseWithComponent.luxSelected);
      this.fileBaseWithComponent.luxSelected = fileCopy;
    } else {
      this.fileBaseWithComponent.luxSelected = null as any;
    }
  }

  ngAfterViewInit() {
    this.fileComponents = this.fileInputs.toArray();
  }

  override onDelete(_event: any) {
    this.customActionConfigs.forEach((config) => (config.disabled = true));
  }

  override onUpload(_event: any) {
    this.customActionConfigs.forEach((config) => (config.disabled = false));
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
          fileObject.namePrefix = this.namePrefixAccept;
          fileObject.nameSuffix = this.nameSuffixAccept;
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
          fileObject.namePrefix = this.namePrefixDecline;
          fileObject.nameSuffix = this.nameSuffixDecline;
        }
      }
    };

    return [customConfigAccept, customConfigDecline];
  }
}
