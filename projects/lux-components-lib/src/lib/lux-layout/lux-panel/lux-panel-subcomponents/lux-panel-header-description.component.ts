import { AfterViewInit, Component, ElementRef, input, viewChild } from '@angular/core';
import { MatExpansionPanelDescription } from '@angular/material/expansion';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'lux-panel-header-description',
  template: `<mat-panel-description
    [class.lux-crop]="luxTruncated()"
    [class.lux-hyphenate]="!luxTruncated()"
    [style.display]="luxTruncated() ? 'block' : null"
    matTooltip="{{ luxTruncatedTooltip() }}"
    [matTooltipShowDelay]="500"
    [matTooltipDisabled]="!luxTruncated()"
    ><ng-content></ng-content
  ></mat-panel-description>`,
  imports: [MatExpansionPanelDescription, MatTooltip]
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
