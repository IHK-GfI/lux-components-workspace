import { AfterViewInit, ChangeDetectionStrategy, Component, TemplateRef, input, model, output, viewChild } from '@angular/core';
import { LuxThemePalette } from '../../../lux-util/lux-colors.enum';
import { LuxUtil } from '../../../lux-util/lux-util';

@Component({
  selector: 'lux-chip-ac',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `
})
export class LuxChipAcComponent implements AfterViewInit {
  private removeClicked = false;

  readonly templateRef = viewChild.required(TemplateRef);

  readonly luxChipRemoved = output<number>();
  readonly luxChipClicked = output<number>();

  /**
   * Wird von der umgebenden lux-chips-ac-Komponente mitgesetzt, wenn dort luxDisabled wechselt.
   */
  readonly luxDisabled = model(false);
  readonly luxRemovable = input(true);

  readonly luxColor = input<LuxThemePalette, LuxThemePalette>('primary', {
    transform: (color) => (color === 'primary' || color === 'accent' || color === 'warn' ? color : undefined)
  });

  ngAfterViewInit() {
    LuxUtil.assertNonNull('templateRef', this.templateRef());
  }

  remove(index: number) {
    this.luxChipRemoved.emit(index);
    this.removeClicked = true;
  }

  click(index: number) {
    if (!this.removeClicked) {
      this.luxChipClicked.emit(index);
    }
  }
}
