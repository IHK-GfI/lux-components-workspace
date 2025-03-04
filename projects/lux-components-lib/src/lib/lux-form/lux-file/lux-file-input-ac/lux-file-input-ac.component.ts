import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { LuxMenuItemComponent } from '../../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-item.component';
import { LuxMenuComponent } from '../../../lux-action/lux-menu/lux-menu.component';
import { LuxAriaDescribedbyDirective } from '../../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxTagIdDirective } from '../../../lux-directives/lux-tag-id/lux-tag-id.directive';
import { LuxUtil } from '../../../lux-util/lux-util';
import { LuxFormControlWrapperComponent } from '../../lux-form-control-wrapper/lux-form-control-wrapper.component';
import { LuxValidationErrors } from '../../lux-form-model/lux-form-component-base.class';
import { LuxFormFileBase } from '../../lux-form-model/lux-form-file-base.class';
import { ILuxFileActionConfig } from '../lux-file-model/lux-file-action-config.interface';
import { LuxFileCaptureDirective } from '../lux-file-model/lux-file-capture.directive';
import { ILuxFileError } from '../lux-file-model/lux-file-error.interface';
import { ILuxFileObject } from '../lux-file-model/lux-file-object.interface';
import { LuxFileProgressComponent } from '../lux-file-subcomponents/lux-file-progress/lux-file-progress.component';

@Component({
  selector: 'lux-file-input-ac',
  templateUrl: './lux-file-input-ac.component.html',
  styleUrls: ['./lux-file-input-ac.component.scss'],
  imports: [
    LuxFormControlWrapperComponent,
    FormsModule,
    ReactiveFormsModule,
    MatInput,
    LuxFileCaptureDirective,
    LuxFileProgressComponent,
    LuxTagIdDirective,
    LuxAriaDescribedbyDirective,
    LuxMenuItemComponent,
    LuxMenuComponent
  ]
})
export class LuxFileInputAcComponent extends LuxFormFileBase<ILuxFileObject | null> implements AfterViewInit {
  @ViewChild('visibleInput', { read: ElementRef }) visibleInput!: ElementRef;

  @Output() luxBlur = new EventEmitter<FocusEvent>();
  @Output() luxFocus = new EventEmitter<FocusEvent>();

  @Input() luxPlaceholder = '';
  @Input() luxClearOnError = true;
  @Input() luxNoLabels = false;
  @Input() luxNoTopLabel = false;
  @Input() luxNoBottomLabel = false;

  focused = false;

  _luxUploadActionConfig: ILuxFileActionConfig = {
    disabled: false,
    hidden: false,
    iconName: 'lux-programming-cloud-upload',
    label: $localize`:@@luxc.form-file-base.upload.action.lbl:Hochladen`
  };
  _luxDeleteActionConfig: ILuxFileActionConfig = {
    disabled: false,
    hidden: false,
    iconName: 'lux-interface-delete-bin-2',
    label: $localize`:@@luxc.form-file-base.delete.action.lbl:Löschen`
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

  get luxUploadActionConfig(): ILuxFileActionConfig {
    return this._luxUploadActionConfig;
  }

  @Input() set luxUploadActionConfig(config: ILuxFileActionConfig) {
    if (config) {
      this._luxUploadActionConfig = config;
    }
  }

  get luxDeleteActionConfig(): ILuxFileActionConfig {
    return this._luxDeleteActionConfig;
  }

  @Input() set luxDeleteActionConfig(config: ILuxFileActionConfig) {
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
    LuxUtil.assertNonNull('visibleInput', this.visibleInput);
  }

  onSelectFiles(target: EventTarget | null) {
    const fileList = target ? (target as HTMLInputElement).files : null;
    this.selectFiles(fileList ? Array.from(fileList) : []);
  }

  clearFile() {
    this.formControl.markAsTouched();
    this.formControl.markAsDirty();

    const deletedFile = this.luxSelected;

    this.resetSelected();
    this.notifyFormValueChanged();
    this.clearFormControlErrors();
    if (deletedFile && this.luxDeleteActionConfig.onClick) {
      this.luxDeleteActionConfig.onClick(deletedFile);
      this.announceFileRemove(deletedFile.name);
    }
  }

  resetSelected() {
    this.luxSelected = null;
  }

  handleViewFileClick(file: ILuxFileObject) {
    if (file.content && this.luxViewActionConfig.onClick) {
      this.luxViewActionConfig.onClick(file);
    }
  }

  handleDownloadClick(file: ILuxFileObject) {
    if (this.luxDownloadActionConfig.onClick) {
      this.luxDownloadActionConfig.onClick(file);
    }
  }

  handleUploadClick(files: ILuxFileObject[]) {
    if (this.luxUploadActionConfig.onClick) {
      this.luxUploadActionConfig.onClick(files[0]);
    }
  }

  /**
   * Wird bei der Auswahl von Dateien (Dialog oder DnD) aufgerufen.
   * Aktualisiert die aktuell selektierten Dateien, stößt einen Upload an, handelt Fehlermeldungen und
   * emittet die entsprechenden Events.
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
      this.updateSelectedFiles(files).then(
        (newFiles: ILuxFileObject[]) => {
          this.luxSelected = newFiles[0];
          this.notifyFormValueChanged();
        },
        (error) => this.setFormControlErrors(error)
      );
    }, this.defaultReadFileDelay);
  }

  onFocus(e: FocusEvent) {
    this.focused = true;
    this.luxFocus.emit(e);
  }

  override onFocusIn(e: FocusEvent) {
    this.focused = true;
    this.luxFocusIn.emit(e);
  }

  onFocusOut(e: FocusEvent) {
    this.focused = false;
    this.luxFocusOut.emit(e);
  }

  descripedBy() {
    if (this.errorMessage) {
      return this.uid + '-error';
    } else {
      return (this.formHintComponent || this.luxHint) && (!this.luxHintShowOnlyOnFocus || (this.luxHintShowOnlyOnFocus && this.focused))
        ? this.uid + '-hint'
        : undefined;
    }
  }

  protected override errorMessageModifier(value: any, errors: LuxValidationErrors): string | undefined {
    if (errors['required']) {
      return $localize`:@@luxc.file-input.error_message.required:Es muss eine Datei ausgewählt werden`;
    }
    return super.errorMessageModifier(value, errors);
  }

  protected override setFormControlErrors(error: ILuxFileError) {
    if (this.luxClearOnError) {
      this.luxSelected = null;
    }

    super.setFormControlErrors(error);
  }
}
