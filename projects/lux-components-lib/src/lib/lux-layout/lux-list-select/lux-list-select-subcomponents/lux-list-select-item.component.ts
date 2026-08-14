import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, output, TemplateRef } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatRadioButton } from '@angular/material/radio';
import { TranslocoPipe } from '@jsverse/transloco';
import { LuxIconComponent } from '../../../lux-icon/lux-icon/lux-icon.component';
import { LuxListSelectMode } from '../lux-list-select-model/lux-list-select-types';

@Component({
  selector: 'lux-list-select-item',
  templateUrl: './lux-list-select-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatCheckbox, MatRadioButton, NgTemplateOutlet, LuxIconComponent, TranslocoPipe]
})
export class LuxListSelectItemComponent<T = unknown> {
  readonly luxItem = input.required<T>();
  readonly luxMode = input<LuxListSelectMode>('multi');
  readonly luxSelected = input(false);
  readonly luxDisabled = input(false);
  readonly luxLabel = input('');
  readonly luxSubLabel = input<string | null>(null);
  readonly luxShowDetailButton = input(false);
  readonly luxDetailIconName = input('lux-interface-arrows-expand-5');
  readonly luxContentTemplate = input<TemplateRef<unknown> | null>(null);

  readonly luxToggleSelected = output<void>();
  readonly luxDetail = output<void>();

  onCardClick(event: MouseEvent) {
    if (this.luxDisabled()) {
      return;
    }
    const target = event.target as HTMLElement;
    if (target.closest('mat-checkbox, mat-radio-button, .lux-list-select-detail')) {
      return;
    }
    this.luxToggleSelected.emit();
  }

  onControlChange() {
    if (!this.luxDisabled()) {
      this.luxToggleSelected.emit();
    }
  }
}
