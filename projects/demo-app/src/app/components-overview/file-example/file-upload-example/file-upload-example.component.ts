import { AfterViewInit, Component, inject, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ILuxFileActionConfig,
  ILuxFileObject,
  ILuxFilesListActionConfig,
  LuxAutofocusDirective,
  LuxDialogService,
  LuxFileRenameDialogComponent,
  LuxFileUploadComponent,
  LuxFormHintComponent,
  LuxInputAcComponent,
  LuxInputAcSuffixComponent,
  LuxSelectAcComponent,
  LuxToggleAcComponent,
  LuxUtil
} from '@ihk-gfi/lux-components';
import { TranslocoService } from '@jsverse/transloco';
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
export class FileUploadExampleComponent extends FileExampleComponent<ILuxFileObject[] | null, ILuxFilesListActionConfig> implements OnInit, AfterViewInit {
  private tService = inject(TranslocoService);

  @ViewChildren(LuxFileUploadComponent) fileUploads!: QueryList<LuxFileUploadComponent>;
  @ViewChild('fileBaseWithoutComponent', { read: LuxFileUploadComponent, static: true }) fileBaseWithoutComponent!: LuxFileUploadComponent;
  @ViewChild('fileBaseWithComponent', { read: LuxFileUploadComponent, static: true }) fileBaseWithComponent!: LuxFileUploadComponent;

  dialogService = inject(LuxDialogService);
  override label = `Zum Hochladen Datei hier ablegen oder `;
  labelLink = `Datei durchsuchen`;
  labelLinkShort = `Datei hochladen`;
  uploadIcon = 'lux-programming-cloud-upload';
  deleteIcon = '';
  multiple = true;
  listOnly = false;

  customActionConfigs: ILuxFileActionConfig[] = [
    {
      disabled: false,
      hidden: false,
      iconName: 'lux-interface-edit-write-2',
      label: 'Dialog öffnen',
      prio: 15,
      onClick: (fileObject: ILuxFileObject) => {
        this.openDialog(fileObject);
      }
    }
  ];

  override ngOnInit() {
    this.maxSize = 10;
    this.capture = 'environment';
    this.accept = '.pdf,.jpeg,.jpg,.png';
    this.hint = `Sie können Dateien der Typen ${LuxUtil.getAcceptTypesAsMessagePart(this.tService, this.accept)} mit einer Größe bis zu ${
      this.maxSize
    } Megabytes hochladen.`;
    super.ngOnInit();
  }

  ngAfterViewInit() {
    this.fileComponents = this.fileUploads.toArray();
  }

  toogleCustomHiddenActionConfig() {
    this.customActionConfigs[0] = {
      ...this.customActionConfigs[0],
      hidden: !this.customActionConfigs[0].hidden,
    }
  }

  toogleCustomDisabeldActionConfig() {
    this.customActionConfigs[0] = {
      ...this.customActionConfigs[0],
      disabled: !this.customActionConfigs[0].disabled,
    }
  }

  toogleViewConfig() {
    this.viewActionConfig = {
      ...this.viewActionConfig,
      hidden: !this.viewActionConfig.hidden,
    }

    this.viewActionConfigForm = {
      ...this.viewActionConfigForm,
      hidden: !this.viewActionConfigForm.hidden,
    }
  }

  toogleDeleteHiddenConfig() {
    this.deleteActionConfig = {
      ...this.deleteActionConfig,
      hidden: !this.deleteActionConfig.hidden,
    }
  }

  toogleDeleteDisabledConfig() {
    this.deleteActionConfig = {
      ...this.deleteActionConfig,
      disabled: !this.deleteActionConfig.disabled,
    }
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

  openDialog(fileObject: ILuxFileObject) {
    const dialogRef = this.dialogService.openComponent(LuxFileRenameDialogComponent,{
      disableClose: false,
      width: 'auto',
      height: 'auto',
    }, fileObject);

    dialogRef.dialogClosed.subscribe((newFileName: any) => {
      if (typeof newFileName === 'string' && newFileName.length > 0) {
        fileObject.name = newFileName;
      }
    });
  }
}