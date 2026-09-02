import { AfterViewInit, Component, ElementRef, input, viewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'lux-panel-aria-header-title',
  template: `<span
    #panelTitle
    class="lux-expansion-panel-header-title lux-h4"
    [class.lux-crop]="luxTruncated()"
    [class.lux-hyphenate]="!luxTruncated()"
    tabindex="0"
    [style.display]="luxTruncated() ? 'block' : null"
    matTooltip="{{ luxTruncatedTooltip() }}"
    [matTooltipShowDelay]="500"
    [matTooltipDisabled]="!luxTruncated()"
    ><ng-content></ng-content
  ></span>`,
  standalone: true,
  imports: [MatTooltip]
})
export class LuxPanelAriaHeaderTitleComponent implements AfterViewInit {
  luxTruncated = input<boolean>(false);
  luxTruncatedTooltip = input<string>('');

  panelTitle = viewChild<ElementRef>('panelTitle');

  ngAfterViewInit(): void {
    if (this.luxTruncated() && !this.luxTruncatedTooltip()) {
      console.warn(
        `Für das Panel mit der ID "${this.panelTitle()?.nativeElement.textContent}" wurde die Property "luxTruncated" aktiviert, aber "luxTruncatedTooltip" nicht gesetzt!`
      );
    }
  }
}
