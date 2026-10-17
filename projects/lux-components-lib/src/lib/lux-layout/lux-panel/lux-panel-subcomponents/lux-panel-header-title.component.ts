import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, input, viewChild } from '@angular/core';
import { MatExpansionPanelTitle } from '@angular/material/expansion';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'lux-panel-header-title',
  template: `<mat-panel-title
    [class.lux-crop]="luxTruncated()"
    [class.lux-hyphenate]="!luxTruncated()"
    [style.display]="luxTruncated() ? 'block' : null"
    matTooltip="{{ luxTruncatedTooltip() }}"
    [matTooltipShowDelay]="500"
    [matTooltipDisabled]="!luxTruncated()"
    ><ng-content
  /></mat-panel-title>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatExpansionPanelTitle, MatTooltip]
})
export class LuxPanelHeaderTitleComponent implements AfterViewInit {
  readonly luxTruncated = input<boolean>(false);
  readonly luxTruncatedTooltip = input<string>('');

  readonly matPanelTitle = viewChild(MatExpansionPanelTitle, { read: ElementRef });

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
