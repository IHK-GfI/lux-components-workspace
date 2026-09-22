import { HttpClient } from '@angular/common/http';
import { Directive, inject, signal, OnInit } from '@angular/core';
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
  readonly showOutputEvents = signal(false);
  realBackends: any[] = [];
  readonly mockBackend = signal(false);
  log = logResult;
  form: FormGroup<FileDummyForm>;

  fileComponents: LuxFormFileBase[] = [];

  readonly dndActive = signal(true);
  readonly selected = signal<T | null>(null);
  readonly contentAsBlob = signal(false);
  readonly reportProgress = signal(false);
  readonly hint = signal('Datei hierher ziehen oder über den Button auswählen');
  readonly hintShowOnlyOnFocus = signal(false);
  readonly label = signal('Anhänge');
  readonly uploadUrl = signal('');
  controlBinding = 'uploadExample';
  readonly disabled = signal(false);
  readonly readonly = signal(false);
  readonly required = signal(false);
  readonly maxSize = signal(5);
  readonly maxFileCount = signal(5);
  readonly capture = signal('');
  readonly accept = signal('');
  maximumExtended = 6;
  readonly undeletableFileNames = signal('example.png');

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
      return this.undeletableFileNames().includes(file.name) === false;
    },
    onClick: (file: ILuxFileObject) => {
      this.log(this.showOutputEvents(), 'deleteActionConfig onClick', file);
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
    onClick: (file) => this.log(this.showOutputEvents(), 'downloadActionConfig onClick', file)
  };

  protected http = inject(HttpClient);
  protected snackbar = inject(LuxSnackbarService);
  protected filePreviewService = inject(LuxFilePreviewService);

  constructor() {
    this.form = new FormGroup({
      uploadExample: new FormControl<ILuxFileObject[] | null>(null)
    });
  }

  ngOnInit() {
    this.initSelected();
  }

  changeRequired(required: boolean) {
    this.required.set(required);
    setRequiredValidatorForFormControl(required, this.form, this.controlBinding);
  }

  pickValidatorValueFn(selected: any) {
    return selected.value;
  }

  onDelete(_file: ILuxFileObject) {
    // Do nothing
  }

  onUpload(_files: ILuxFileObject[]) {
    // Do nothing
  }

  onSelectedChange(files: T | null) {
    this.selected.set(files);
    this.log(true, 'luxSelectedChange', files);
  }

  changeMockBackend(useMockBackend: boolean) {
    this.mockBackend.set(useMockBackend);
    if (this.mockBackend()) {
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

  protected abstract initSelected(): void;

  protected abstract initUploadActionConfig(): U;
}
