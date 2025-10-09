import { AfterViewInit, Component, ElementRef, input, viewChild } from '@angular/core';
import { MatExpansionPanelTitle } from '@angular/material/expansion';
import { LuxTooltipDirective } from '../../../lux-directives/lux-tooltip/lux-tooltip.directive';

@Component({
  selector: 'lux-panel-header-title',
  template: `<mat-panel-title
    [class.lux-crop]="luxTruncated()"
    [class.lux-hyphenate]="!luxTruncated()"
    [style.display]="luxTruncated() ? 'block' : null"
    luxTooltip="{{ luxTruncatedTooltip() }}"
    [luxTooltipShowDelay]="500"
    [luxTooltipDisabled]="!luxTruncated()"
    ><ng-content></ng-content
  ></mat-panel-title>`,
  imports: [MatExpansionPanelTitle, LuxTooltipDirective]
})
export class LuxPanelHeaderTitleComponent implements AfterViewInit {
  luxTruncated = input<boolean>(false);
  luxTruncatedTooltip = input<string>('');

  matPanelTitle = viewChild(MatExpansionPanelTitle, { read: ElementRef });

  constructor() {}

  ngAfterViewInit(): void {
    if (this.luxTruncated() && !this.luxTruncatedTooltip()) {
      console.warn(
        `Für das Panel mit der ID "${
          this.matPanelTitle()?.nativeElement.textContent
        }" wurde die Property "luxTruncated" aktiviert, aber "luxTruncatedTooltip" nicht gesetzt!`
      );
    }
  }
}
