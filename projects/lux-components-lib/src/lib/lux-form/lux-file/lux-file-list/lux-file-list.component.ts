import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
  viewChildren
} from '@angular/core';
import { MatError, MatHint } from '@angular/material/form-field';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxButtonComponent } from '../../../lux-action/lux-button/lux-button.component';
import { LuxMenuItemComponent } from '../../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-item.component';
import { LuxMenuComponent } from '../../../lux-action/lux-menu/lux-menu.component';
import { LuxAriaInvalidDirective } from '../../../lux-directives/lux-aria/lux-aria-invalid.directive';
import { LuxAriaLabelDirective } from '../../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxIconComponent } from '../../../lux-icon/lux-icon/lux-icon.component';
import { LuxCardActionsComponent } from '../../../lux-layout/lux-card/lux-card-subcomponents/lux-card-actions.component';
import { LuxCardContentComponent } from '../../../lux-layout/lux-card/lux-card-subcomponents/lux-card-content.component';
import { LuxCardInfoComponent } from '../../../lux-layout/lux-card/lux-card-subcomponents/lux-card-info.component';
import { LuxCardComponent } from '../../../lux-layout/lux-card/lux-card.component';
import { LuxDividerComponent } from '../../../lux-layout/lux-divider/lux-divider.component';
import {
  DIALOG_WIDTH_SMALL_PX,
  ILuxDialogConfig,
  minWidth
} from '../../../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-config.interface';
import { LuxDialogService } from '../../../lux-popups/lux-dialog/lux-dialog.service';
import { LuxValidationErrors } from '../../lux-form-model/lux-form-component-base.class';
import { LuxFormFileBase } from '../../lux-form-model/lux-form-file-base.class';
import { ILuxFileActionConfig } from '../lux-file-model/lux-file-action-config.interface';
import { LuxFileCaptureDirective } from '../lux-file-model/lux-file-capture.directive';
import { LuxFileErrorCause } from '../lux-file-model/lux-file-error.interface';
import { ILuxFileListDeleteActionConfig, ILuxFilesListActionConfig } from '../lux-file-model/lux-file-list-action-config.interface';
import { ILuxFileObject } from '../lux-file-model/lux-file-object.interface';
import { LuxFileProgressComponent } from '../lux-file-subcomponents/lux-file-progress/lux-file-progress.component';
import { LuxFileReplaceDialogComponent } from '../lux-file-subcomponents/lux-file-replace-dialog/lux-file-replace-dialog.component';

const defaultUploadActionConfig: ILuxFilesListActionConfig = {
  disabled: false,
  disabledHeader: false,
  hidden: false,
  hiddenHeader: false,
  iconName: 'lux-programming-cloud-upload',
  iconNameHeader: 'lux-programming-cloud-upload',
  label: '',
  labelHeader: ''
};
const defaultDeleteActionConfig: ILuxFileListDeleteActionConfig = {
  disabled: false,
  disabledHeader: false,
  hidden: false,
  hiddenHeader: false,
  iconName: 'lux-interface-delete-bin-5',
  iconNameHeader: 'lux-interface-delete-bin-5',
  label: '',
  labelHeader: '',
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

/**
 * @deprecated Diese Klasse ist veraltet und sollte nicht mehr verwendet werden.
 * Verwende stattdessen `LuxFileUploadComponent`.
 */
@Component({
  selector: 'lux-file-list',
  templateUrl: './lux-file-list.component.html',
  styleUrls: ['./lux-file-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    MatHint,
    NgTemplateOutlet,
    MatError,
    NgStyle,
    LuxFileCaptureDirective,
    LuxFileProgressComponent,
    LuxAriaLabelDirective,
    LuxAriaInvalidDirective,
    LuxCardInfoComponent,
    LuxCardComponent,
    LuxCardContentComponent,
    LuxDividerComponent,
    LuxCardActionsComponent,
    LuxMenuItemComponent,
    LuxMenuComponent,
    LuxButtonComponent,
    LuxIconComponent,
    TranslocoPipe
  ]
})
export class LuxFileListComponent extends LuxFormFileBase<ILuxFileObject[] | null> implements AfterViewChecked {
  readonly luxShowPreview = input(true);
  readonly luxMultiple = input(true);
  readonly luxHeading = input(2);
  readonly luxUploadActionConfig = input<ILuxFilesListActionConfig, ILuxFilesListActionConfig | undefined>(defaultUploadActionConfig, {
    transform: (config) => config ?? defaultUploadActionConfig
  });
  readonly luxDeleteActionConfig = input<ILuxFileListDeleteActionConfig, ILuxFileListDeleteActionConfig | undefined>(
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
  readonly fileUploadSingleInput = viewChild.required<ElementRef>('fileUploadSingle');

  readonly fileIcons = signal<string[]>([]);
  rowWidth = 0;
  readonly iconActionBarWidth = signal(50);
  dialogReplaceConfig: ILuxDialogConfig = {
    disableClose: false,
    width: minWidth(DIALOG_WIDTH_SMALL_PX),
    height: 'auto',
    panelClass: ['file-dialog', 'file-replace-dialog']
  };

  private dialogService = inject(LuxDialogService);

  constructor() {
    super();

    effect(() => {
      this.fileEntries();
      this.getValue();

      untracked(() => this.updateIconAndImage());
    });
  }

  ngAfterViewChecked(): void {
    this.resizeIconActionBar();
  }

  shouldDisplayPreviewImg(index: number): boolean {
    return this.luxShowPreview() && !!this.fileIcons()[index] && this.fileIcons()[index] === 'lux-file-image';
  }

  /**
   * Entfernt eine Datei aus den selektierten Dateien.
   * @param index
   */
  removeFile(index: number) {
    this.formControl.markAsTouched();
    this.formControl.markAsDirty();

    // Wenn mehrere Dateien selektiert sind, diese nach der entfernten Datei filtern ansonsten "null" nutzen
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

  onSelectFiles(target: EventTarget | null) {
    const fileList = target ? (target as HTMLInputElement).files : null;
    this.selectFiles(fileList ? Array.from(fileList) : []);
  }

  resetSelected() {
    this.setValue([]);
  }

  handleViewFileClick(file: ILuxFileObject) {
    const viewActionConfig = this.luxViewActionConfig();

    if (file.content && viewActionConfig.onClick) {
      viewActionConfig.onClick(file);
      this.updateIconAndImage();
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

  /**
   * Entfernt die aktuell selektierten Dateien und entfernt etwaige (spezifische) Fehler aus dem FormControl.
   * @param event
   */
  clearFiles(event?: Event) {
    this.formControl.markAsTouched();
    this.formControl.markAsDirty();

    const deleteActionConfig = this.luxDeleteActionConfig();
    const selected = this.getValue() ?? [];

    const deletedFiles = selected.filter((file) => (deleteActionConfig.isDeletable ? deleteActionConfig.isDeletable(file) : true));
    this.setValue(selected.filter((file) => (deleteActionConfig.isDeletable ? !deleteActionConfig.isDeletable(file) : false)));

    this.notifyFormValueChanged();
    this.clearFormControlErrors();

    deletedFiles.forEach((file) => {
      if (deleteActionConfig.onClick) {
        deleteActionConfig.onClick(file);
      }
    });

    this.announceAllFilesRemove();
  }

  /**
   * Fügt weitere Dateien zu den bereits vorhandenen hinzu bzw. ersetzt diese.
   * @param files
   */
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

  useArray(): boolean {
    return true;
  }

  isArray(object: any): boolean {
    return object && Array.isArray(object);
  }

  hasOnlyDeleteProtectedFiles(): boolean {
    return (
      !!this.getValue() &&
      this.getValue()!.length > 0 &&
      this.getValue()!.every((file) =>
        this.luxDeleteActionConfig().isDeletable ? !this.luxDeleteActionConfig().isDeletable!(file) : false
      )
    );
  }

  private updateIconAndImage() {
    this.setFileIcons();

    if (this.luxShowPreview()) {
      this.setImgSrc();
    }
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
   * Aktualisiert die Preview-Bilder für die (Image-)Dateien.
   *
   * Aktualisierung absichtlich via Funktion und nicht Property-Binding, da potenziell Stack-Size Fehler auftreten,
   * wenn (große) Base64-Strings gegen die src gebunden werden.
   */
  private setImgSrc() {
    const selected = this.getValue();

    this.fileEntries().forEach((item: ElementRef, index: number) => {
      const imgElement: HTMLImageElement | null = (item.nativeElement as HTMLElement).querySelector('img');
      if (imgElement && selected) {
        const targetFileContent = selected[index].content;
        if (targetFileContent instanceof Blob) {
          this.readFile(targetFileContent as File).then((content: any) => {
            imgElement.src = content;
          });
        } else {
          imgElement.src = targetFileContent as string;
        }
      }
    });
  }

  /**
   * Setzt die Icons für die Elemente in der Auflistung
   */
  private setFileIcons() {
    const selected = this.getValue();

    if (!selected) {
      return;
    }

    const fileIcons: string[] = [];
    const selectedFiles = [];

    if (!Array.isArray(selected)) {
      selectedFiles.push(selected);
    } else {
      selectedFiles.push(...selected);
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

  private resizeIconActionBar() {
    const fileEntries = this.fileEntries();
    if (fileEntries.length > 0 && this.cdr) {
      const newRowWidth = fileEntries[0].nativeElement.offsetWidth;
      if (this.rowWidth !== newRowWidth) {
        let buttonCount = 0;
        if (!this.luxViewActionConfig().hidden) {
          buttonCount++;
        }
        if (!this.luxDownloadActionConfig().hidden) {
          buttonCount++;
        }
        if (!this.luxUploadActionConfig().hidden) {
          buttonCount++;
        }
        if (!this.luxDeleteActionConfig().hidden) {
          buttonCount++;
        }
        buttonCount += this.luxCustomActionConfigs().length;

        this.rowWidth = newRowWidth;
        if (this.rowWidth >= 900) {
          this.iconActionBarWidth.set(Math.min(400, buttonCount * 50));
        } else if (this.rowWidth >= 800) {
          this.iconActionBarWidth.set(Math.min(350, buttonCount * 50));
        } else if (this.rowWidth >= 700) {
          this.iconActionBarWidth.set(Math.min(300, buttonCount * 50));
        } else if (this.rowWidth >= 600) {
          this.iconActionBarWidth.set(Math.min(250, buttonCount * 50));
        } else if (this.rowWidth >= 500) {
          this.iconActionBarWidth.set(Math.min(200, buttonCount * 50));
        } else if (this.rowWidth >= 400) {
          this.iconActionBarWidth.set(Math.min(150, buttonCount * 50));
        } else {
          this.iconActionBarWidth.set(50);
        }

        this.cdr.detectChanges();
      }
    }
  }

  protected override errorMessageModifier(value: any, errors: LuxValidationErrors): string | undefined {
    if (errors['required']) {
      return this.tService.translate('luxc.file-list.error_message.required');
    }
    return super.errorMessageModifier(value, errors);
  }

  protected override notifyFormValueChanged() {
    super.notifyFormValueChanged();
    this.formControl.updateValueAndValidity();

    this.fileUploadSingleInput().nativeElement.value = null;
  }
}
