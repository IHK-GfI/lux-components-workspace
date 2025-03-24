import { Component, OnInit, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ILuxFileObject,
  ILuxFilesListActionConfig,
  LuxAutofocusDirective,
  LuxFileUploadComponent,
  LuxFormHintComponent,
  LuxInputAcComponent,
  LuxInputAcSuffixComponent,
  LuxSelectAcComponent,
  LuxToggleAcComponent,
  LuxUtil
} from 'lux-components-lib';
import { map, take } from 'rxjs/operators';
import { ExampleBaseContentComponent } from '../../../example-base/example-base-root/example-base-subcomponents/example-base-content/example-base-content.component';
import { ExampleBaseAdvancedOptionsComponent } from '../../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-advanced-options.component';
import { ExampleBaseSimpleOptionsComponent } from '../../../example-base/example-base-root/example-base-subcomponents/example-base-options/example-base-simple-options.component';
import { ExampleBaseStructureComponent } from '../../../example-base/example-base-root/example-base-subcomponents/example-base-structure/example-base-structure.component';
import { ExampleFormDisableComponent } from '../../../example-base/example-form-disable/example-form-disable.component';
import { ExampleFormValueComponent } from '../../../example-base/example-form-value/example-form-value.component';
import { FileExampleComponent } from '../file-example.component';

@Component({
  selector: 'lux-file-upload-example',
  templateUrl: './file-upload-example.component.html',
  imports: [
    LuxToggleAcComponent,
    LuxSelectAcComponent,
    LuxInputAcSuffixComponent,
    LuxInputAcComponent,
    LuxFormHintComponent,
    LuxFileUploadComponent,
    LuxAutofocusDirective,
    ExampleBaseStructureComponent,
    ExampleBaseContentComponent,
    ReactiveFormsModule,
    ExampleFormValueComponent,
    ExampleBaseSimpleOptionsComponent,
    ExampleFormDisableComponent,
    ExampleBaseAdvancedOptionsComponent
  ]
})
export class FileUploadExampleComponent extends FileExampleComponent<ILuxFileObject[] | null, ILuxFilesListActionConfig> implements OnInit {
  @ViewChild('fileBaseWithoutComponent', { read: LuxFileUploadComponent, static: true }) fileBaseWithoutComponent!: LuxFileUploadComponent;
  @ViewChild('fileBaseWithComponent', { read: LuxFileUploadComponent, static: true }) fileBaseWithComponent!: LuxFileUploadComponent;

  override label = $localize`:@@luxc.file.upload.label:Zum Hochladen Datei hier ablegen oder `;
  labelLink = $localize`:@@luxc.file.upload.label.link:Datei durchsuchen`;
  labelLinkShort = $localize`:@@luxc.file.upload.label.link.short:Datei hochladen`;
  uploadIcon = 'lux-programming-cloud-upload';
  deleteIcon = 'lux-interface-delete-bin-5';
  multiple = true;

  override ngOnInit() {
    this.maxSize = 10;
    this.capture = 'environment';
    this.accept = '.pdf,.jpeg,.jpg,.png';
    this.hint = `Sie können Dateien der Typen ${LuxUtil.getAcceptTypesAsMessagePart(this.accept)} mit einer Größe bis zu ${
      this.maxSize
    } Megabytes hochladen.`;
    super.ngOnInit();
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
          this.selected = [fileObject];
          this.form.get(this.controlBinding)!.setValue([fileObject]);
        })
      )
      .subscribe(() => {
        /* Do nothing */
      });
  }

  protected initUploadActionConfig() {
    return {
      disabled: false,
      disabledHeader: false,
      hidden: false,
      hiddenHeader: false,
      iconName: 'lux-programming-cloud-upload',
      iconNameHeader: 'lux-programming-cloud-upload',
      label: 'Hochladen',
      labelHeader: 'Neue Dateien hochladen',
      onClick: (files: ILuxFileObject[]) => {
        this.log(this.showOutputEvents, 'uploadActionConfig onClick', files);
        this.onUpload(files);
      }
    };
  }
}
