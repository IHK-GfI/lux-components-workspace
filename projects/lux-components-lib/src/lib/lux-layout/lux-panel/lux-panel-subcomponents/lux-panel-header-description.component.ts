import { AfterViewInit, Component, ElementRef, input, viewChild } from '@angular/core';
import { MatExpansionPanelDescription } from '@angular/material/expansion';
import { LuxTooltipDirective } from '../../../lux-directives/lux-tooltip/lux-tooltip.directive';

@Component({
  selector: 'lux-panel-header-description',
  template: `<mat-panel-description
    [class.lux-crop]="luxTruncated()"
    [class.lux-hyphenate]="!luxTruncated()"
    [style.display]="luxTruncated() ? 'block' : null"
    luxTooltip="{{ luxTruncatedTooltip() }}"
    [luxTooltipShowDelay]="500"
    [luxTooltipDisabled]="!luxTruncated()"
    ><ng-content></ng-content
  ></mat-panel-description>`,
  imports: [MatExpansionPanelDescription, LuxTooltipDirective]
})
export class LuxPanelHeaderDescriptionComponent implements AfterViewInit {
  luxTruncated = input<boolean>(false);
  luxTruncatedTooltip = input<string>('');

  matPanelDescription = viewChild(MatExpansionPanelDescription, { read: ElementRef });

  constructor() {}

  ngAfterViewInit(): void {
    if (this.luxTruncated() && !this.luxTruncatedTooltip()) {
      console.warn(
        `Für das Panel mit der ID "${
          this.matPanelDescription()?.nativeElement.textContent
        }" wurde die Property "luxTruncated" aktiviert, aber "luxTruncatedTooltip" nicht gesetzt!`
      );
    }
  }
}
