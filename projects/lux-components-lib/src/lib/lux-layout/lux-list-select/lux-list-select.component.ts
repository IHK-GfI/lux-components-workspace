import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, contentChild, effect, inject, input, model, output, TemplateRef } from '@angular/core';
import { MatRadioGroup } from '@angular/material/radio';
import { TranslocoService } from '@jsverse/transloco';
import { LuxListSelectItemComponent } from './lux-list-select-subcomponents/lux-list-select-item.component';
import { LuxListSelectMode } from './lux-list-select-model/lux-list-select-types';

@Component({
  selector: 'lux-list-select',
  templateUrl: './lux-list-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LuxListSelectItemComponent, MatRadioGroup, NgTemplateOutlet],
  host: {
    class: 'lux-list-select'
  }
})
export class LuxListSelectComponent<T = unknown> {
  private tService = inject(TranslocoService);

  readonly luxMode = input<LuxListSelectMode>('multi');
  readonly luxItems = input<T[]>([]);
  readonly luxLabelProp = input('label');
  readonly luxSubLabelProp = input('subLabel');
  readonly luxDisabledProp = input('disabled');
  readonly luxCompareWith = input<(a: T, b: T) => boolean>((a, b) => a === b);
  readonly luxLabel = input<string | undefined>(undefined);
  readonly luxDisabled = input(false);
  readonly luxTagId = input<string | undefined>(undefined);
  readonly luxShowDetailButton = input(false);
  readonly luxDetailIconName = input('lux-interface-arrows-expand-5');

  readonly luxSelected = model<T[]>([]);
  readonly luxDetailClicked = output<T>();

  readonly contentTemplate = contentChild<TemplateRef<unknown>>(TemplateRef);

  protected listLabel = computed(() => this.luxLabel() ?? this.tService.translate('luxc.list-select.arialabel'));

  constructor() {
    effect(() => {
      if (this.luxMode() === 'single' && this.luxSelected().length > 1) {
        this.luxSelected.set([this.luxSelected()[0]]);
      }
    });
  }

  isSelected(item: T): boolean {
    const compare = this.luxCompareWith();
    return this.luxSelected().some((selected) => compare(selected, item));
  }

  toggleItem(item: T) {
    if (this.luxDisabled() || this.isItemDisabled(item)) {
      return;
    }
    if (this.luxMode() === 'single') {
      if (!this.isSelected(item)) {
        this.luxSelected.set([item]);
      }
    } else {
      const compare = this.luxCompareWith();
      if (this.isSelected(item)) {
        this.luxSelected.update((selected) => selected.filter((entry) => !compare(entry, item)));
      } else {
        this.luxSelected.update((selected) => [...selected, item]);
      }
    }
  }

  protected getLabel(item: T): string {
    const value = (item as Record<string, unknown>)[this.luxLabelProp()];
    return value !== undefined && value !== null ? String(value) : '';
  }

  protected getSubLabel(item: T): string | null {
    const value = (item as Record<string, unknown>)[this.luxSubLabelProp()];
    return value !== undefined && value !== null ? String(value) : null;
  }

  protected isItemDisabled(item: T): boolean {
    return (item as Record<string, unknown>)[this.luxDisabledProp()] === true;
  }
}
