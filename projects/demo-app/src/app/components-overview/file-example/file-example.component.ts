import { HttpClient } from '@angular/common/http';
import { Directive, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  ILuxFileActionBaseConfig,
  ILuxFileActionConfig,
  ILuxFileListDeleteActionConfig,
  ILuxFileObject,
  LuxFormFileBase,
  LuxSnackbarService
} from '@ihk-gfi/lux-components';
import { LuxFilePreviewService } from '@ihk-gfi/lux-components/lux-file-preview';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { logResult, setRequiredValidatorForFormControl } from '../../example-base/example-base-util/example-base-helper';

interface FileDummyForm {
  uploadExample: FormControl<ILuxFileObject[] | null>;
}

@Directive()
export abstract class FileExampleComponent<T = any, U extends ILuxFileActionBaseConfig = any> implements OnInit {
  protected http = inject(HttpClient);
  protected snackbar = inject(LuxSnackbarService);
  protected filePreviewService = inject(LuxFilePreviewService);

  showOutputEvents = false;
  realBackends: any[] = [];
  mockBackend = false;
  log = logResult;
  form: FormGroup<FileDummyForm>;

  fileComponents: LuxFormFileBase[] = [];

  dndActive = true;
  selected: T | null = null;
  contentAsBlob = false;
  reportProgress = false;
  hint = 'Datei hierher ziehen oder über den Button auswählen';
  hintShowOnlyOnFocus = false;
  label = 'Anhänge';
  uploadUrl = '';
  controlBinding = 'uploadExample';
  disabled = false;
  readonly = false;
  required = false;
  maxSize = 5;
  maxFileCount = 5;
  capture = '';
  accept = '';
  maximumExtended = 6;
  undeletableFileNames = 'example.png';

  uploadActionConfig: U = this.initUploadActionConfig();

  deleteActionConfig: ILuxFileListDeleteActionConfig = {
    disabled: false,
    disabledHeader: false,
    hidden: false,
    hiddenHeader: false,
    iconName: 'lux-interface-delete-bin-5',
    iconNameHeader: 'lux-interface-delete-bin-5',
    label: 'Löschen',
    labelHeader: 'Alle Dateien entfernen',
    isDeletable: (file: ILuxFileObject) => {
      return this.undeletableFileNames.includes(file.name) === false;
    },
    onClick: (file: ILuxFileObject) => {
      this.log(this.showOutputEvents, 'deleteActionConfig onClick', file);
      this.onDelete(file);
    }
  };
  viewActionConfig: ILuxFileActionConfig = {
    disabled: false,
    hidden: false,
    iconName: 'lux-interface-edit-view',
    label: 'Ansehen',
    onClick: (fileObject: ILuxFileObject) => {
      this.filePreviewService.open({
        previewData: {
          fileComponent: this.fileComponents[0],
          fileObject
        }
      });
    }
  };

  viewActionConfigForm: ILuxFileActionConfig = {
    disabled: false,
    hidden: false,
    iconName: 'lux-interface-edit-view',
    label: 'Ansehen',
    onClick: (fileObject: ILuxFileObject) => {
      this.filePreviewService.open({
        previewData: {
          fileComponent: this.fileComponents[1],
          fileObject
        }
      });
    }
  };

  downloadActionConfig: ILuxFileActionConfig = {
    disabled: false,
    hidden: false,
    iconName: 'lux-interface-download-button-2',
    label: 'Download',
    onClick: (file) => this.log(this.showOutputEvents, 'downloadActionConfig onClick', file)
  };

  constructor() {
    this.form = new FormGroup({
      uploadExample: new FormControl<ILuxFileObject[] | null>(null)
    });
  }

  changeRequired(required: boolean) {
    this.required = required;
    setRequiredValidatorForFormControl(required, this.form, this.controlBinding);
  }

  pickValidatorValueFn(selected: any) {
    return selected.value;
  }

  ngOnInit() {
    this.initSelected();
  }

  protected abstract initSelected(): void;

  protected abstract initUploadActionConfig(): U;

  onDelete(_file: ILuxFileObject) {
    // Do nothing
  }

  onUpload(_files: ILuxFileObject[]) {
    // Do nothing
  }

  onSelectedChange(files: T | null) {
    this.selected = files;
    this.log(true, 'luxSelectedChange', files);
  }

  changeMockBackend(useMockBackend: boolean) {
    this.mockBackend = useMockBackend;
    if (this.mockBackend) {
      this.realBackends = [];
      this.fileComponents.forEach((input: LuxFormFileBase<any>) => {
        this.realBackends.push(input['http']);
        input['http'] = {
          post: () => of('ok').pipe(delay(2000))
        } as any;
      });
    } else {
      this.fileComponents.forEach((input: LuxFormFileBase<any>, index: number) => {
        input['http'] = this.realBackends[index];
      });
    }
  }
}
