import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChildren
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatError, MatHint } from '@angular/material/form-field';
import { MatProgressBar } from '@angular/material/progress-bar';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxButtonComponent } from '../../../lux-action/lux-button/lux-button.component';
import { LuxLinkPlainComponent } from '../../../lux-action/lux-link-plain/lux-link-plain.component';
import { LuxAriaLabelDirective } from '../../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxTooltipDirective } from '../../../lux-directives/lux-tooltip/lux-tooltip.directive';
import { LuxIconComponent } from '../../../lux-icon/lux-icon/lux-icon.component';
import { LuxBytesToLabelPipe } from '../../../lux-pipes/lux-bytes-to-label/lux-bytes-to-label.pipe';
import {
  DIALOG_WIDTH_SMALL_PX,
  ILuxDialogConfig,
  minWidth
} from '../../../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-config.interface';
import { LuxDialogService } from '../../../lux-popups/lux-dialog/lux-dialog.service';
import { LuxTheme } from '../../../lux-theme/lux-theme';
import { LuxThemeService } from '../../../lux-theme/lux-theme.service';
import { LuxMediaQueryObserverService } from '../../../lux-util/lux-media-query-observer.service';
import { LuxUtil } from '../../../lux-util/lux-util';
import { LuxFormFileBase } from '../../lux-form-model/lux-form-file-base.class';
import { ILuxFileActionConfig, ILuxFilesActionConfig } from '../lux-file-model/lux-file-action-config.interface';
import { LuxFileCaptureDirective } from '../lux-file-model/lux-file-capture.directive';
import { LuxFileErrorCause } from '../lux-file-model/lux-file-error.interface';
import { ILuxFileObject } from '../lux-file-model/lux-file-object.interface';
import { ILuxFileUploadDeleteActionConfig } from '../lux-file-model/lux-file-upload-action-config.interface';
import { LuxFileDeleteDialogComponent } from '../lux-file-subcomponents/lux-file-delete-dialog/lux-file-delete-dialog.component';
import { LuxFileReplaceDialogComponent } from '../lux-file-subcomponents/lux-file-replace-dialog/lux-file-replace-dialog.component';

const defaultUploadActionConfig: ILuxFilesActionConfig = {
  disabled: false,
  hidden: false,
  iconName: 'lux-programming-cloud-upload',
  label: ''
};
const defaultDeleteActionConfig: ILuxFileUploadDeleteActionConfig = {
  disabled: false,
  hidden: false,
  iconName: 'lux-interface-delete-bin-2',
  label: '',
  isDeletable: () => true
};
const defaultViewActionConfig: ILuxFileActionConfig = {
  disabled: false,
  hidden: true,
  iconName: 'lux-interface-edit-view',
  label: ''
};
const defaultDownloadActionConfig: ILuxFileActionConfig = {
  disabled: false,
  hidden: true,
  iconName: 'lux-interface-download-button-2',
  label: ''
};

@Component({
  selector: 'lux-file-upload',
  templateUrl: './lux-file-upload.component.html',
  styleUrls: ['./lux-file-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    NgTemplateOutlet,
    MatProgressBar,
    MatHint,
    MatError,
    NgStyle,
    LuxFileCaptureDirective,
    LuxAriaLabelDirective,
    LuxButtonComponent,
    LuxIconComponent,
    LuxLinkPlainComponent,
    TranslocoPipe,
    LuxBytesToLabelPipe,
    LuxTooltipDirective
  ]
})
export class LuxFileUploadComponent extends LuxFormFileBase<ILuxFileObject[] | null> {
  readonly luxLabelLink = input('');
  readonly luxLabelLinkShort = input('');
  readonly luxMultiple = input(true);
  readonly luxUploadIcon = input('lux-programming-cloud-upload');
  readonly luxListOnly = input(false);

  /**
   * Ohne gesetztes Icon wird abhängig vom Theme ein passendes Standard-Icon verwendet.
   */
  readonly luxDeleteIcon = input('');

  readonly luxUploadActionConfig = input<ILuxFilesActionConfig, ILuxFilesActionConfig | undefined>(defaultUploadActionConfig, {
    transform: (config) => config ?? defaultUploadActionConfig
  });
  readonly luxDeleteActionConfig = input<ILuxFileUploadDeleteActionConfig, ILuxFileUploadDeleteActionConfig | undefined>(
    defaultDeleteActionConfig,
    { transform: (config) => config ?? defaultDeleteActionConfig }
  );
  readonly luxViewActionConfig = input<ILuxFileActionConfig, ILuxFileActionConfig | undefined>(defaultViewActionConfig, {
    transform: (config) => config ?? defaultViewActionConfig
  });
  readonly luxDownloadActionConfig = input<ILuxFileActionConfig, ILuxFileActionConfig | undefined>(defaultDownloadActionConfig, {
    transform: (config) => config ?? defaultDownloadActionConfig
  });

  readonly fileEntries = viewChildren('fileEntry', { read: ElementRef });

  readonly fileIcons = signal<string[]>([]);
  ariaLabelProgress = '';
  readonly isMobile = signal(false);

  dialogDeleteConfig: ILuxDialogConfig = {
    disableClose: false,
    width: minWidth(DIALOG_WIDTH_SMALL_PX),
    height: 'auto',
    panelClass: ['file-dialog', 'file-delete-dialog']
  };

  dialogReplaceConfig: ILuxDialogConfig = {
    disableClose: false,
    width: minWidth(DIALOG_WIDTH_SMALL_PX),
    height: 'auto',
    panelClass: ['file-dialog', 'file-replace-dialog']
  };

  private dialogService = inject(LuxDialogService);
  private queryService = inject(LuxMediaQueryObserverService);
  private themeService = inject(LuxThemeService);

  // Muss nach themeService deklariert werden, da der Initializer synchron auf this.themeService zugreift.
  readonly theme = signal(this.themeService.getTheme().name);

  readonly deleteIcon = computed(
    () => this.luxDeleteIcon() || (this.theme() === 'authentic' ? 'lux-interface-delete-1' : 'lux-interface-delete-bin-5')
  );

  constructor() {
    super();

    this.queryService
      .getMediaQueryChangedAsObservable()
      .pipe(takeUntilDestroyed())
      .subscribe((query) => this.isMobile.set(query === 'xs' || query === 'sm'));

    this.themeService
      .getThemeAsObservable()
      .pipe(takeUntilDestroyed())
      .subscribe((theme: LuxTheme) => this.theme.set(theme.name));

    effect(() => {
      this.fileEntries();
      this.getValue();

      untracked(() => this.setFileIcons(this.formControl?.value ?? null));
    });
  }

  useArray(): boolean {
    return true;
  }

  resetSelected() {
    this.setValue([]);
  }

  handleViewFileClick(file: ILuxFileObject) {
    const viewActionConfig = this.luxViewActionConfig();

    if (file.content && viewActionConfig.onClick) {
      viewActionConfig.onClick(file);
    }
  }

  handleDownloadClick(file: ILuxFileObject) {
    const downloadActionConfig = this.luxDownloadActionConfig();

    if (downloadActionConfig.onClick) {
      downloadActionConfig.onClick(file);
    }
  }

  handleUploadClick(files: ILuxFileObject[]) {
    const uploadActionConfig = this.luxUploadActionConfig();

    if (uploadActionConfig.onClick) {
      uploadActionConfig.onClick(files);
    }
  }

  selectFiles(files: FileList | File[]) {
    this.formControl.markAsTouched();
    this.formControl.markAsDirty();
    this.forceProgressIndeterminate.set(true);
    this.announceFileProcess(files && files.length > 1);

    if (!files || files.length === 0) {
      this.forceProgressIndeterminate.set(false);
      return;
    }

    // Timeout, um Flackern durch Progress zu vermeiden
    const deleteActionConfig = this.luxDeleteActionConfig();

    setTimeout(() => {
      // Prüfen, ob die Dateien bereits vorhanden sind
      let selectedFilesArray: ILuxFileObject[] = [];
      const replaceableFilesMap = new Map<number, File>();
      let replaceFileDeleteProtection = false;
      const selected = this.getValue();
      if (selected) {
        files = Array.from(files);
        selectedFilesArray = Array.isArray(selected) ? selected : [selected];
        // zu ersetzende Indizes herausfinden
        files.forEach((file: File) => {
          const index = selectedFilesArray.findIndex((compareFile: ILuxFileObject) => compareFile.name === file.name);
          if (index > -1) {
            replaceableFilesMap.set(index, file);
            replaceFileDeleteProtection =
              replaceFileDeleteProtection || (deleteActionConfig.isDeletable ? !deleteActionConfig.isDeletable(files[0]) : false);
          }
        });
      }

      if (this.luxMultiple()) {
        if (replaceableFilesMap.size > 0) {
          const dialogRef = this.dialogService.openComponent(LuxFileReplaceDialogComponent, this.dialogReplaceConfig, {
            multiple: this.luxMultiple(),
            deleteProtection: replaceFileDeleteProtection
          });
          this.forceProgressIndeterminate.set(false);

          dialogRef.dialogConfirmed.subscribe(() => {
            this.updateFilesIntern(files, selectedFilesArray, replaceableFilesMap);
          });

          dialogRef.dialogDeclined.subscribe(() => {
            this.fileUploadInput().nativeElement.value = '';
          });

          dialogRef.dialogClosed.subscribe(() => {
            this.fileUploadInput().nativeElement.value = '';
          });
        } else {
          this.updateFilesIntern(files, selectedFilesArray, replaceableFilesMap);
        }
      } else {
        if (files.length > 1) {
          this.setFormControlErrors({
            cause: LuxFileErrorCause.MultipleForbidden,
            exception: this.getMultipleForbiddenMessage(),
            file: undefined
          });

          return;
        } else if (files.length === 1 && (!selected || selected.length === 0)) {
          this.updateSelectedFiles(files).then(
            (newFiles: ILuxFileObject[]) => {
              this.setValue(newFiles);
              this.notifyFormValueChanged();
              this.fileUploadInput().nativeElement.value = '';
            },
            (error) => this.setFormControlErrors(error)
          );
        } else if (files.length === 1 && selected && selected.length > 0) {
          const dialogRef = this.dialogService.openComponent(LuxFileReplaceDialogComponent, this.dialogReplaceConfig, {
            multiple: this.luxMultiple(),
            deleteProtection: deleteActionConfig.isDeletable ? !deleteActionConfig.isDeletable(files[0]) : false
          });
          this.forceProgressIndeterminate.set(false);

          dialogRef.dialogConfirmed.subscribe(() => {
            this.updateSelectedFiles(files).then(
              (newFiles: ILuxFileObject[]) => {
                this.setValue(newFiles);
                this.notifyFormValueChanged();
                this.fileUploadInput().nativeElement.value = '';
              },
              (error) => this.setFormControlErrors(error)
            );
          });

          dialogRef.dialogDeclined.subscribe(() => {
            this.fileUploadInput().nativeElement.value = '';
          });

          dialogRef.dialogClosed.subscribe(() => {
            this.fileUploadInput().nativeElement.value = '';
          });
        }
      }
    }, this.defaultReadFileDelay);
  }

  onSelectFiles(target: EventTarget | null) {
    const fileList = target ? (target as HTMLInputElement).files : null;
    this.selectFiles(fileList ? Array.from(fileList) : []);
  }

  onUpload() {
    if (!this.luxDisabled() && !this.luxReadonly()) {
      this.fileUploadInput().nativeElement.click();
    }
  }

  onRemoveFile(index: number) {
    this.formControl.markAsTouched();
    this.formControl.markAsDirty();

    // Wenn mehrere Dateien selektiert sind, diese nach der entfernten Datei filtern ansonsten "undefined" nutzen
    const selected = this.getValue();
    const newFiles = Array.isArray(selected) ? selected.filter((file, searchIndex) => searchIndex !== index) : null;

    // Via LiveAnnouncer mitteilen welche Datei entfernt wird
    const deletedFile = selected![index];
    this.announceFileRemove(deletedFile.name);

    // Wir entfernen hier nur eine Datei, deshalb ist das neue Auslesen der Base64-Strings nicht nötig
    this.uploadFiles(newFiles).then(
      () => {
        this.setValue(newFiles);
        this.notifyFormValueChanged();
      },
      (error) => this.setFormControlErrors(error)
    );
    const deleteActionConfig = this.luxDeleteActionConfig();

    if (deleteActionConfig.onClick) {
      deleteActionConfig.onClick(deletedFile);
    }
  }

  openDeleteDialog(index: number) {
    const dialogRef = this.dialogService.openComponent(LuxFileDeleteDialogComponent, this.dialogDeleteConfig);

    dialogRef.dialogConfirmed.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.onRemoveFile(index));
  }

  protected override notifyFormValueChanged() {
    super.notifyFormValueChanged();
    this.formControl.updateValueAndValidity();
  }

  private updateFilesIntern(files: FileList | File[], selectedFilesArray: any[], replaceableFilesMap: Map<number, File>) {
    // Begrenzung der maximalen Anzahl an Dateien
    const selected = this.getValue();
    const currentCount = Array.isArray(selected) ? selected.length : selected ? 1 : 0;
    if (
      this.luxMaxFileCount() !== undefined &&
      this.luxMaxFileCount() !== null &&
      currentCount + files.length - replaceableFilesMap.size > this.luxMaxFileCount()
    ) {
      this.setFormControlErrors({
        cause: LuxFileErrorCause.MaxFileCount,
        exception: this.getMaxFileCountMessage(),
        file: undefined
      });
      this.forceProgressIndeterminate.set(false);
      return;
    }

    this.updateSelectedFiles(files).then(
      (newFiles: ILuxFileObject[]) => {
        const tempSelectedFiles = selectedFilesArray;

        // die zu ersetzenden Dateien durchgehen und aktualisieren
        replaceableFilesMap.forEach((file: File, index: number) => {
          const replaceableFileObject = newFiles.find((newFile: ILuxFileObject) => newFile.name === file.name);
          // das gefundene Objekt aus den newFiles entfernen
          newFiles = newFiles.filter((newFile) => newFile !== replaceableFileObject);
          // die selectedFiles aktualisieren
          tempSelectedFiles[index] = replaceableFileObject;
        });
        // die übrigen neuen Dateien anfügen
        tempSelectedFiles.push(...newFiles);

        this.setValue(tempSelectedFiles && tempSelectedFiles.length === 1 && !this.useArray() ? tempSelectedFiles[0] : tempSelectedFiles);
        this.notifyFormValueChanged();
        this.fileUploadInput().nativeElement.value = '';
      },
      (error) => this.setFormControlErrors(error)
    );
  }

  /**
   * Setzt die Icons für die Elemente in der Auflistung
   * @param files
   */
  private setFileIcons(files: ILuxFileObject | ILuxFileObject[] | null) {
    if (!files) {
      this.fileIcons.set([]);
      return;
    }

    const fileIcons: string[] = [];

    const selectedFiles = [];
    if (!Array.isArray(files)) {
      selectedFiles.push(files);
    } else {
      selectedFiles.push(...files);
    }

    selectedFiles.forEach((selectedFile: ILuxFileObject) => {
      let newFileIcon = 'lux-interface-content-file';
      if (selectedFile.type) {
        if (selectedFile.type.indexOf('image') > -1) {
          newFileIcon = 'lux-file-image';
        } else if (selectedFile.type.indexOf('pdf') > -1) {
          newFileIcon = 'lux-file-pdf';
        } else if (selectedFile.type.indexOf('spreadsheet') > -1) {
          newFileIcon = 'lux-interface-file-delete';
        } else if (selectedFile.type.indexOf('officedocument') > -1) {
          newFileIcon = 'lux-file-signature';
        } else if (selectedFile.type.indexOf('json') > -1) {
          newFileIcon = 'lux-programming-script-file-code-1';
        }
      }
      fileIcons.push(newFileIcon);
    });

    this.fileIcons.set(fileIcons);
  }

  protected override getMaxSizeErrorMessage(file: File): string {
    return this.tService.translate(`luxc.file.upload.error_message.max_file_size`, {
      fileName: file.name,
      maxSizeMiB: this.luxMaxSizeMiB()
    });
  }

  protected override getFileNotAcceptedMessage(file: File): string {
    return this.tService.translate(`luxc.file.upload.error_message.not_accepted`, {
      fileName: file.name,
      acceptTypes: LuxUtil.getAcceptTypesAsMessagePart(this.tService, this.luxAccept())
    });
  }

  protected override getMultipleForbiddenMessage(): string {
    return this.tService.translate(`luxc.file.upload.error_message.only_one_file`);
  }

  protected override getReadingFileErrorMessage(file: File): string {
    return this.tService.translate(`luxc.file.upload.error_message.read_error`);
  }

  protected override getUploadFileErrorMessage(files: File[]): string {
    return this.tService.translate(`luxc.file.upload.error_message.upload_error`);
  }
}
