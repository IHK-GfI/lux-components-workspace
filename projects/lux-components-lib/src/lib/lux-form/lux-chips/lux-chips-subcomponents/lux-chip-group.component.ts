import { ChangeDetectionStrategy, Component, TemplateRef, contentChild, input, model, output } from '@angular/core';
import { LuxThemePalette } from '../../../lux-util/lux-colors.enum';

@Component({
  selector: 'lux-chip-group, lux-chip-ac-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: ''
})
export class LuxChipGroupComponent {
  /**
   * Die Labels der Gruppe. Änderungen (add/remove) erzeugen ein neues Array und werden als
   * luxLabelsChange gemeldet - für einen Abgleich mit dem Aufrufer bietet sich [(luxLabels)] an.
   */
  readonly luxLabels = model<string[]>([]);

  /**
   * Wird von der umgebenden lux-chips-ac-Komponente mitgesetzt, wenn dort luxDisabled wechselt.
   */
  readonly luxDisabled = model(false);
  readonly luxRemovable = input(true);

  readonly luxColor = input<LuxThemePalette, LuxThemePalette>('primary', {
    transform: (color) => (color === 'primary' || color === 'accent' || color === 'warn' ? color : undefined)
  });

  readonly luxChipClicked = output<number>();
  readonly luxChipAdded = output<string>();
  readonly luxChipRemoved = output<number>();

  readonly tempRef = contentChild(TemplateRef);

  add(label: string) {
    this.luxLabels.update((labels) => [...(labels ?? []), label]);
    this.luxChipAdded.emit(label);
  }

  remove(index: number) {
    this.luxChipRemoved.emit(index);
    this.luxLabels.update((labels) => labels.filter((_, i) => i !== index));
  }

  click(index: number) {
    this.luxChipClicked.emit(index);
  }
}
