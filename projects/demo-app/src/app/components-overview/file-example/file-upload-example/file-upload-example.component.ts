import { AfterViewInit, Component, inject, OnInit, signal, viewChild, viewChildren, ChangeDetectionStrategy } from '@angular/core';
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
  LuxInputComponent,
  LuxInputSuffixComponent,
  LuxSelectComponent,
  LuxToggleComponent,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxToggleComponent,
    LuxSelectComponent,
    LuxInputSuffixComponent,
    LuxInputComponent,
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
export class FileUploadExampleComponent
  extends FileExampleComponent<ILuxFileObject[] | null, ILuxFilesListActionConfig>
  implements OnInit, AfterViewInit
{
  readonly fileUploads = viewChildren(LuxFileUploadComponent);
  readonly fileBaseWithoutComponent = viewChild.required('fileBaseWithoutComponent', { read: LuxFileUploadComponent });
  readonly fileBaseWithComponent = viewChild.required('fileBaseWithComponent', { read: LuxFileUploadComponent });

  override readonly label = signal(`Zum Hochladen Datei hier ablegen oder `);
  readonly labelLink = signal(`Datei durchsuchen`);
  readonly labelLinkShort = signal(`Datei hochladen`);
  readonly uploadIcon = signal('lux-programming-cloud-upload');
  readonly deleteIcon = signal('');
  readonly multiple = signal(true);
  readonly listOnly = signal(false);

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

  private tService = inject(TranslocoService);
  private dialogService = inject(LuxDialogService);

  override ngOnInit() {
    this.maxSize.set(10);
    this.capture.set('environment');
    this.accept.set('.pdf,.jpeg,.jpg,.png');
    this.hint.set(
      `Sie können Dateien der Typen ${LuxUtil.getAcceptTypesAsMessagePart(this.tService, this.accept())} mit einer Größe bis zu ${this.maxSize()} Megabytes hochladen.`
    );
    super.ngOnInit();
  }

  ngAfterViewInit() {
    this.fileComponents = [...this.fileUploads()];
  }

  toogleCustomHiddenActionConfig() {
    this.customActionConfigs[0] = {
      ...this.customActionConfigs[0],
      hidden: !this.customActionConfigs[0].hidden
    };
  }

  toogleCustomDisabeldActionConfig() {
    this.customActionConfigs[0] = {
      ...this.customActionConfigs[0],
      disabled: !this.customActionConfigs[0].disabled
    };
  }

  toogleViewConfig() {
    this.viewActionConfig = {
      ...this.viewActionConfig,
      hidden: !this.viewActionConfig.hidden
    };

    this.viewActionConfigForm = {
      ...this.viewActionConfigForm,
      hidden: !this.viewActionConfigForm.hidden
    };
  }

  toogleDeleteHiddenConfig() {
    this.deleteActionConfig = {
      ...this.deleteActionConfig,
      hidden: !this.deleteActionConfig.hidden
    };
  }

  toogleDeleteDisabledConfig() {
    this.deleteActionConfig = {
      ...this.deleteActionConfig,
      disabled: !this.deleteActionConfig.disabled
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
          this.selected.set([fileObject]);
          this.form.get(this.controlBinding)!.setValue([fileObject]);
        })
      )
      .subscribe(() => {
        /* Do nothing */
      });
  }

  openDialog(fileObject: ILuxFileObject) {
    const dialogRef = this.dialogService.openComponent(
      LuxFileRenameDialogComponent,
      {
        disableClose: false,
        width: 'auto',
        height: 'auto'
      },
      fileObject
    );

    dialogRef.dialogClosed.subscribe((newFileName: any) => {
      if (typeof newFileName === 'string' && newFileName.length > 0) {
        fileObject.name = newFileName;
      }
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
        this.log(this.showOutputEvents(), 'uploadActionConfig onClick', files);
        this.onUpload(files);
      }
    };
  }
}
