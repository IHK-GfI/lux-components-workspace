import { NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  QueryList,
  ViewChild,
  ViewChildren,
  inject
} from '@angular/core';
import { MatError, MatHint } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
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
import { ILuxDialogConfig } from '../../../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-config.interface';
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

/**
 * @deprecated Diese Klasse ist veraltet und sollte nicht mehr verwendet werden.
 * Verwende stattdessen `LuxFileUploadComponent`.
 */
@Component({
  selector: 'lux-file-list',
  templateUrl: './lux-file-list.component.html',
  styleUrls: ['./lux-file-list.component.scss'],
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
    LuxIconComponent
  ]
})
export class LuxFileListComponent extends LuxFormFileBase<ILuxFileObject[] | null> implements AfterViewInit, AfterViewChecked, OnDestroy {
  private dialogService = inject(LuxDialogService);

  fileIcons: string[] = [];

  rowWidth = 0;
  iconActionBarWidth = 50;
  subscriptions: Subscription[] = [];

  @ViewChildren('fileEntry', { read: ElementRef }) fileEntries!: QueryList<ElementRef>;
  @ViewChild('fileUploadSingle', { read: ElementRef, static: true }) fileUploadSingleInput!: ElementRef;
  @ViewChild(LuxCardComponent, { read: ElementRef, static: true }) fileCard!: ElementRef;

  @Input() luxShowPreview = true;
  @Input() luxMultiple = true;
  @Input() luxHeading = 2;

  dialogReplaceConfig: ILuxDialogConfig = {
    disableClose: false,
    width: 'auto',
    height: 'auto',
    panelClass: ['file-dialog', 'file-replace-dialog']
  };

  _luxUploadActionConfig: ILuxFilesListActionConfig = {
    disabled: false,
    disabledHeader: false,
    hidden: false,
    hiddenHeader: false,
    iconName: 'lux-programming-cloud-upload',
    iconNameHeader: 'lux-programming-cloud-upload',
    label: $localize`:@@luxc.file-list.upload.lbl:Hochladen`,
    labelHeader: $localize`:@@luxc.file-list.upload_title.lbl:Neue Dateien hochladen`
  };
  _luxDeleteActionConfig: ILuxFileListDeleteActionConfig = {
    disabled: false,
    disabledHeader: false,
    hidden: false,
    hiddenHeader: false,
    iconName: 'lux-interface-delete-bin-5',
    iconNameHeader: 'lux-interface-delete-bin-5',
    label: $localize`:@@luxc.file-list.delete.lbl:Löschen`,
    labelHeader: $localize`:@@luxc.file-list.delete_title.lbl:Alle Dateien entfernen`,
    isDeletable: (_file: ILuxFileObject) => {
      return true;
    },
  };
  _luxViewActionConfig: ILuxFileActionConfig = {
    disabled: false,
    hidden: true,
    iconName: 'lux-interface-edit-view',
    label: $localize`:@@luxc.form-file-base.view.action.lbl:Ansehen`
  };
  _luxDownloadActionConfig: ILuxFileActionConfig = {
    disabled: false,
    hidden: true,
    iconName: 'lux-interface-download-button-2',
    label: $localize`:@@luxc.form-file-base.download.action.lbl:Download`
  };

  get luxUploadActionConfig(): ILuxFilesListActionConfig {
    return this._luxUploadActionConfig;
  }

  @Input() set luxUploadActionConfig(config: ILuxFilesListActionConfig) {
    if (config) {
      this._luxUploadActionConfig = config;
    }
  }

  get luxDeleteActionConfig(): ILuxFileListDeleteActionConfig {
    return this._luxDeleteActionConfig;
  }

  @Input() set luxDeleteActionConfig(config: ILuxFileListDeleteActionConfig) {
    if (config) {
      this._luxDeleteActionConfig = config;
    }
  }

  get luxViewActionConfig(): ILuxFileActionConfig {
    return this._luxViewActionConfig;
  }

  @Input() set luxViewActionConfig(config: ILuxFileActionConfig) {
    if (config) {
      this._luxViewActionConfig = config;
    }
  }

  get luxDownloadActionConfig(): ILuxFileActionConfig {
    return this._luxDownloadActionConfig;
  }

  @Input() set luxDownloadActionConfig(config: ILuxFileActionConfig) {
    if (config) {
      this._luxDownloadActionConfig = config;
    }
  }

  ngAfterViewInit() {
    this.subscriptions.push(
      this.fileEntries.changes.subscribe(() => {
        this.updateIconAndImage();
      })
    );

    this.updateIconAndImage();
  }

  private updateIconAndImage() {
    this.setFileIcons();

    if (this.luxShowPreview) {
      this.setImgSrc();
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();

    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  shouldDisplayPreviewImg(index: number): boolean {
    return this.luxShowPreview && this.fileIcons && !!this.fileIcons[index] && this.fileIcons[index] === 'lux-file-image';
  }

  /**
   * Entfernt eine Datei aus den selektierten Dateien.
   * @param index
   */
  removeFile(index: number) {
    this.formControl.markAsTouched();
    this.formControl.markAsDirty();

    // Wenn mehrere Dateien selektiert sind, diese nach der entfernten Datei filtern ansonsten "null" nutzen
    const newFiles = Array.isArray(this.luxSelected) ? this.luxSelected.filter((file, searchIndex) => searchIndex !== index) : null;

    // Via LiveAnnouncer mitteilen welche Datei entfernt wird
    const deletedFile = this.luxSelected![index];
    this.announceFileRemove(deletedFile.name);

    // Wir entfernen hier nur eine Datei, deshalb ist das neue Auslesen der Base64-Strings nicht nötig
    this.uploadFiles(newFiles).then(
      () => {
        this.luxSelected = newFiles;
        this.notifyFormValueChanged();
      },
      (error) => this.setFormControlErrors(error)
    );
    if (this.luxDeleteActionConfig.onClick) {
      this.luxDeleteActionConfig.onClick(deletedFile);
    }
  }

  onSelectFiles(target: EventTarget | null) {
    const fileList = target ? (target as HTMLInputElement).files : null;
    this.selectFiles(fileList ? Array.from(fileList) : []);
  }

  resetSelected() {
    this.luxSelected = [];
  }

  handleViewFileClick(file: ILuxFileObject) {
    if (file.content && this.luxViewActionConfig.onClick) {
      this.luxViewActionConfig.onClick(file);
      this.updateIconAndImage();
    }
  }

  handleDownloadClick(file: ILuxFileObject) {
    if (this.luxDownloadActionConfig.onClick) {
      this.luxDownloadActionConfig.onClick(file);
    }
  }

  handleUploadClick(files: ILuxFileObject[]) {
    if (this.luxUploadActionConfig.onClick) {
      this.luxUploadActionConfig.onClick(files);
    }
  }

  /**
   * Entfernt die aktuell selektierten Dateien und entfernt etwaige (spezifische) Fehler aus dem FormControl.
   * @param event
   */
  clearFiles(event?: Event) {
    this.formControl.markAsTouched();
    this.formControl.markAsDirty();

    if (!this.luxSelected) {
      this.luxSelected = [];
    }

    const deletedFiles = this.luxSelected
      ? [
          ...this.luxSelected.filter((file) =>
            this.luxDeleteActionConfig.isDeletable ? this.luxDeleteActionConfig.isDeletable!(file) : true
          )
        ]
      : [];
    this.luxSelected = this.luxSelected
      ? [
          ...this.luxSelected.filter((file) =>
            this.luxDeleteActionConfig.isDeletable ? !this.luxDeleteActionConfig.isDeletable!(file) : false
          )
        ]
      : [];

    this.notifyFormValueChanged();
    this.clearFormControlErrors();
    
    if (deletedFiles) {
      deletedFiles.forEach((file) => {
        if (this.luxDeleteActionConfig.onClick) {
          this.luxDeleteActionConfig.onClick(file);
        }
      });
    }

    this.announceAllFilesRemove();
  }

  /**
   * Fügt weitere Dateien zu den bereits vorhandenen hinzu bzw. ersetzt diese.
   * @param files
   */
  selectFiles(files: FileList | File[]) {
    this.formControl.markAsTouched();
    this.formControl.markAsDirty();
    this.forceProgressIndeterminate = true;
    this.announceFileProcess(files && files.length > 1);

    if (!files || files.length === 0) {
      this.forceProgressIndeterminate = false;
      return;
    }

    // Timeout, um Flackern durch Progress zu vermeiden
    setTimeout(() => {
      // Prüfen, ob die Dateien bereits vorhanden sind
      let selectedFilesArray: ILuxFileObject[] = [];
      const replaceableFilesMap = new Map<number, File>();
      let replaceFileDeleteProtection = false;
      if (this.luxSelected) {
        files = Array.from(files);
        selectedFilesArray = Array.isArray(this.luxSelected) ? this.luxSelected : [this.luxSelected];
        // zu ersetzende Indizes herausfinden
        files.forEach((file: File) => {
          const index = selectedFilesArray.findIndex((compareFile: ILuxFileObject) => compareFile.name === file.name);
          if (index > -1) {
            replaceableFilesMap.set(index, file);
            replaceFileDeleteProtection = replaceFileDeleteProtection || (this.luxDeleteActionConfig.isDeletable ? !this.luxDeleteActionConfig.isDeletable(files[0]) : false);
          }
        });
      }

      if (this.luxMultiple) {
        if (replaceableFilesMap.size > 0) {
          const dialogRef = this.dialogService.openComponent(LuxFileReplaceDialogComponent, this.dialogReplaceConfig, {
            multiple: this.luxMultiple,
            deleteProtection: replaceFileDeleteProtection
          });
          this.forceProgressIndeterminate = false;

          dialogRef.dialogConfirmed.subscribe(() => {
            this.updateFilesIntern(files, selectedFilesArray, replaceableFilesMap);
          });

          dialogRef.dialogDeclined.subscribe(() => {
            this.fileUploadInput.nativeElement.value = '';
          });

          dialogRef.dialogClosed.subscribe(() => {
            this.fileUploadInput.nativeElement.value = '';
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
        } else if (files.length === 1 && (!this.luxSelected || this.luxSelected.length === 0)) {
          this.updateSelectedFiles(files).then(
            (newFiles: ILuxFileObject[]) => {
              this.luxSelected = newFiles;
              this.notifyFormValueChanged();
              this.fileUploadInput.nativeElement.value = '';
            },
            (error) => this.setFormControlErrors(error)
          );
        } else if (files.length === 1 && this.luxSelected && this.luxSelected.length > 0) {
          const dialogRef = this.dialogService.openComponent(LuxFileReplaceDialogComponent, this.dialogReplaceConfig, {
            multiple: this.luxMultiple,
            deleteProtection: this.luxDeleteActionConfig.isDeletable ? !this.luxDeleteActionConfig.isDeletable(files[0]) : false
          });
          this.forceProgressIndeterminate = false;

          dialogRef.dialogConfirmed.subscribe(() => {
            this.updateSelectedFiles(files).then(
              (newFiles: ILuxFileObject[]) => {
                this.luxSelected = newFiles;
                this.notifyFormValueChanged();
                this.fileUploadInput.nativeElement.value = '';
              },
              (error) => this.setFormControlErrors(error)
            );
          });

          dialogRef.dialogDeclined.subscribe(() => {
            this.fileUploadInput.nativeElement.value = '';
          });

          dialogRef.dialogClosed.subscribe(() => {
            this.fileUploadInput.nativeElement.value = '';
          });
        }
      }
    }, this.defaultReadFileDelay);
  }

  private updateFilesIntern(files: FileList | File[], selectedFilesArray: any[], replaceableFilesMap: Map<number, File>) {
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

        this.luxSelected =
          tempSelectedFiles && tempSelectedFiles.length === 1 && !this.useArray() ? tempSelectedFiles[0] : tempSelectedFiles;
        this.notifyFormValueChanged();
        this.fileUploadInput.nativeElement.value = '';
      },
      (error) => this.setFormControlErrors(error)
    );
  }

  useArray(): boolean {
    return true;
  }

  /**
   * Aktualisiert die Preview-Bilder für die (Image-)Dateien.
   *
   * Aktualisierung absichtlich via Funktion und nicht Property-Binding, da potenziell Stack-Size Fehler auftreten,
   * wenn (große) Base64-Strings gegen die src gebunden werden.
   */
  private setImgSrc() {
    this.fileEntries.forEach((item: ElementRef, index: number) => {
      const imgElement: HTMLImageElement | null = (item.nativeElement as HTMLElement).querySelector('img');
      if (imgElement && this.luxSelected) {
        const targetFileContent = this.luxSelected[index].content;
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
    if (!this.luxSelected) {
      return;
    }

    this.fileIcons = [];
    const selectedFiles = [];

    if (!Array.isArray(this.luxSelected)) {
      selectedFiles.push(this.luxSelected);
    } else {
      selectedFiles.push(...this.luxSelected);
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
      this.fileIcons.push(newFileIcon);
    });
    this.cdr.detectChanges();
  }

  ngAfterViewChecked(): void {
    this.resizeIconActionBar();
  }

  isArray(object: any): boolean {
    return object && Array.isArray(object);
  }

  hasOnlyDeleteProtectedFiles(): boolean {
    return !!this.luxSelected &&
          this.luxSelected.length > 0 &&
          this.luxSelected.every((file) => (this.luxDeleteActionConfig.isDeletable ? !this.luxDeleteActionConfig.isDeletable(file) : false));
  }

  private resizeIconActionBar() {
    if (this.fileEntries && this.fileEntries.first && this.cdr) {
      const newRowWidth = this.fileEntries.first.nativeElement.offsetWidth;
      if (this.rowWidth !== newRowWidth) {
        let buttonCount = 0;
        if (this._luxViewActionConfig && !this._luxViewActionConfig.hidden) {
          buttonCount++;
        }
        if (this._luxDownloadActionConfig && !this._luxDownloadActionConfig.hidden) {
          buttonCount++;
        }
        if (this._luxUploadActionConfig && !this._luxUploadActionConfig.hidden) {
          buttonCount++;
        }
        if (this._luxDeleteActionConfig && !this._luxDeleteActionConfig.hidden) {
          buttonCount++;
        }
        if (this._luxCustomActionConfigs) {
          buttonCount += this._luxCustomActionConfigs.length;
        }

        this.rowWidth = newRowWidth;
        if (this.rowWidth >= 900) {
          this.iconActionBarWidth = Math.min(400, buttonCount * 50);
        } else if (this.rowWidth >= 800) {
          this.iconActionBarWidth = Math.min(350, buttonCount * 50);
        } else if (this.rowWidth >= 700) {
          this.iconActionBarWidth = Math.min(300, buttonCount * 50);
        } else if (this.rowWidth >= 600) {
          this.iconActionBarWidth = Math.min(250, buttonCount * 50);
        } else if (this.rowWidth >= 500) {
          this.iconActionBarWidth = Math.min(200, buttonCount * 50);
        } else if (this.rowWidth >= 400) {
          this.iconActionBarWidth = Math.min(150, buttonCount * 50);
        } else {
          this.iconActionBarWidth = 50;
        }

        this.cdr.detectChanges();
      }
    }
  }

  protected override errorMessageModifier(value: any, errors: LuxValidationErrors): string | undefined {
    if (errors['required']) {
      return $localize`:@@luxc.file-list.error_message.required:Es muss eine Datei ausgewählt werden`;
    }
    return super.errorMessageModifier(value, errors);
  }

  protected override notifyFormValueChanged() {
    super.notifyFormValueChanged();
    this.formControl.updateValueAndValidity();

    this.fileUploadSingleInput.nativeElement.value = null;
  }
}
