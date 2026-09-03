import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, computed, input, output, signal, viewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxMenuItemComponent } from '../../../lux-action/lux-menu/lux-menu-subcomponents/lux-menu-item.component';
import { LuxMenuComponent } from '../../../lux-action/lux-menu/lux-menu.component';
import { LuxAriaDescribedbyDirective } from '../../../lux-directives/lux-aria/lux-aria-describedby.directive';
import { LuxAriaLabelDirective } from '../../../lux-directives/lux-aria/lux-aria-label.directive';
import { LuxAriaLabelledbyDirective } from '../../../lux-directives/lux-aria/lux-aria-labelledby.directive';
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

const defaultUploadActionConfig: ILuxFileActionConfig = {
  disabled: false,
  hidden: false,
  iconName: 'lux-programming-cloud-upload',
  label: ''
};
const defaultDeleteActionConfig: ILuxFileActionConfig = {
  disabled: false,
  hidden: false,
  iconName: 'lux-interface-delete-bin-2',
  label: ''
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
  selector: 'lux-file-input-ac',
  templateUrl: './lux-file-input-ac.component.html',
  styleUrls: ['./lux-file-input-ac.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxFormControlWrapperComponent,
    FormsModule,
    ReactiveFormsModule,
    MatInput,
    LuxFileCaptureDirective,
    LuxFileProgressComponent,
    LuxTagIdDirective,
    LuxAriaDescribedbyDirective,
    LuxAriaLabelDirective,
    LuxAriaLabelledbyDirective,
    LuxMenuItemComponent,
    LuxMenuComponent,
    TranslocoPipe
  ]
})
export class LuxFileInputAcComponent extends LuxFormFileBase<ILuxFileObject | null> implements AfterViewInit {
  readonly luxPlaceholder = input('');
  readonly luxClearOnError = input(true);
  readonly luxUploadActionConfig = input<ILuxFileActionConfig, ILuxFileActionConfig | undefined>(defaultUploadActionConfig, {
    transform: (config) => config ?? defaultUploadActionConfig
  });
  readonly luxDeleteActionConfig = input<ILuxFileActionConfig, ILuxFileActionConfig | undefined>(defaultDeleteActionConfig, {
    transform: (config) => config ?? defaultDeleteActionConfig
  });
  readonly luxViewActionConfig = input<ILuxFileActionConfig, ILuxFileActionConfig | undefined>(defaultViewActionConfig, {
    transform: (config) => config ?? defaultViewActionConfig
  });
  readonly luxDownloadActionConfig = input<ILuxFileActionConfig, ILuxFileActionConfig | undefined>(defaultDownloadActionConfig, {
    transform: (config) => config ?? defaultDownloadActionConfig
  });

  readonly luxBlur = output<FocusEvent>();
  readonly luxFocus = output<FocusEvent>();

  readonly visibleInput = viewChild.required<ElementRef>('visibleInput');

  readonly focused = signal(false);

  readonly describedBy = computed(() => {
    if (this.errorMessage()) {
      return this.uid() + '-error';
    }

    const hasHint = !!this.formHintComponent() || !!this.luxHint();
    return hasHint && (!this.luxHintShowOnlyOnFocus() || this.focused()) ? this.uid() + '-hint' : undefined;
  });

  ngAfterViewInit() {
    LuxUtil.assertNonNull('visibleInput', this.visibleInput());
  }

  onSelectFiles(target: EventTarget | null) {
    const fileList = target ? (target as HTMLInputElement).files : null;
    this.selectFiles(fileList ? Array.from(fileList) : []);
  }

  clearFile() {
    this.formControl.markAsTouched();
    this.formControl.markAsDirty();

    const deletedFile = this.getValue();
    const deleteActionConfig = this.luxDeleteActionConfig();

    this.resetSelected();
    this.notifyFormValueChanged();
    this.clearFormControlErrors();
    if (deletedFile && deleteActionConfig.onClick) {
      deleteActionConfig.onClick(deletedFile);
      this.announceFileRemove(deletedFile.name);
    }
  }

  resetSelected() {
    this.setValue(null);
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
      uploadActionConfig.onClick(files[0]);
    }
  }

  /**
   * Wird bei der Auswahl von Dateien (Dialog oder DnD) aufgerufen.
   * Aktualisiert die aktuell selektierten Dateien, stößt einen Upload an, handelt Fehlermeldungen und
   * meldet die entsprechenden Änderungen nach außen.
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
    setTimeout(() => {
      this.updateSelectedFiles(files).then(
        (newFiles: ILuxFileObject[]) => {
          this.setValue(newFiles[0]);
          this.notifyFormValueChanged();
        },
        (error) => this.setFormControlErrors(error)
      );
    }, this.defaultReadFileDelay);
  }

  onFocus(e: FocusEvent) {
    this.focused.set(true);
    this.luxFocus.emit(e);
  }

  override onFocusIn(e: FocusEvent) {
    this.focused.set(true);
    this.luxFocusIn.emit(e);
  }

  onFocusOut(e: FocusEvent) {
    this.focused.set(false);
    this.luxFocusOut.emit(e);
  }

  protected override errorMessageModifier(value: any, errors: LuxValidationErrors): string | undefined {
    if (errors['required']) {
      return this.tService.translate('luxc.file-input.error_message.required');
    }
    return super.errorMessageModifier(value, errors);
  }

  protected override setFormControlErrors(error: ILuxFileError) {
    if (this.luxClearOnError()) {
      this.setValue(null);
    }

    super.setFormControlErrors(error);
  }
}
