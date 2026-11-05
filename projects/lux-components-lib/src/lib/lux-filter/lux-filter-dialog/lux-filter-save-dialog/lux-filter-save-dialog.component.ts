import { AfterViewInit, Component, OnInit, inject, ChangeDetectionStrategy, viewChild } from '@angular/core';
import { AbstractControl, ValidatorFn } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxButtonComponent } from '../../../lux-action/lux-button/lux-button.component';
import { LuxValidationErrors } from '../../../lux-form/lux-form-model/lux-form-component-base.class';
import { LuxInputComponent } from '../../../lux-form/lux-input/lux-input.component';
import { LuxDialogRef } from '../../../lux-popups/lux-dialog/lux-dialog-model/lux-dialog-ref.class';
import { LuxDialogActionsComponent } from '../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-actions.component';
import { LuxDialogContentComponent } from '../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-content.component';
import { LuxDialogTitleComponent } from '../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure-subcomponents/lux-dialog-title.component';
import { LuxDialogStructureComponent } from '../../../lux-popups/lux-dialog/lux-dialog-structure/lux-dialog-structure.component';
import { LuxFilter } from '../../lux-filter-base/lux-filter';
import { LuxFilterFormComponent } from '../../lux-filter-form/lux-filter-form.component';

@Component({
  selector: 'lux-filter-save-dialog',
  templateUrl: './lux-filter-save-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    LuxDialogStructureComponent,
    LuxDialogTitleComponent,
    LuxDialogContentComponent,
    LuxDialogActionsComponent,
    LuxInputComponent,
    LuxButtonComponent,
    TranslocoPipe
  ]
})
export class LuxFilterSaveDialogComponent implements OnInit, AfterViewInit {
  readonly filterNameComponent = viewChild.required(LuxInputComponent);

  luxDialogRef = inject<LuxDialogRef<LuxFilterFormComponent>>(LuxDialogRef);
  currentFilters: LuxFilter[] = [];
  filterName = '';
  filterErrorCallback = (value: any, errors: LuxValidationErrors) => {
    if (errors['forbiddenName']) {
      return 'Der Name existiert bereits.';
    } else if (errors['required']) {
      return 'Pflichtfeld';
    }
    return 'Es ist ein Fehler aufgetreten.';
  };

  ngOnInit() {
    this.currentFilters = this.luxDialogRef.data.luxStoredFilters() ?? [];
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.filterNameComponent().inputElement()?.nativeElement.focus();
    });
  }

  onSave() {
    // Damit die Fehler direkt angezeigt werden und nicht erst, wenn man das Feld verlässt.
    this.filterNameComponent().formControl.markAsTouched();

    if (!this.checkIfFilterNameExists()) {
      this.luxDialogRef.closeDialog(this.filterName);
    }
  }

  validateForbiddenName(): ValidatorFn {
    return (control: AbstractControl): Record<string, any> | null => {
      return this.checkIfFilterNameExists() ? { forbiddenName: { value: control.value } } : null;
    };
  }

  private checkIfFilterNameExists() {
    const filters = this.luxDialogRef.data.luxStoredFilters();
    return filters && filters.find((filter) => filter.name.toLowerCase().trim() === this.filterName.toLowerCase().trim());
  }
}
