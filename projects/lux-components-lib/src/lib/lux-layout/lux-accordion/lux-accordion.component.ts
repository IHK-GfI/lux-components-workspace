import { NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, input, viewChild } from '@angular/core';
import { MatAccordion, MatAccordionDisplayMode, MatAccordionTogglePosition } from '@angular/material/expansion';
import { LuxAccordionColor, LuxAccordionColors } from '../../lux-util/lux-colors.enum';
import { LuxUtil } from '../../lux-util/lux-util';

export declare type LuxModeType = MatAccordionDisplayMode;
export declare type LuxTogglePosition = MatAccordionTogglePosition | undefined;

@Component({
  selector: 'lux-accordion',
  templateUrl: './lux-accordion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, MatAccordion]
})
export class LuxAccordionComponent implements AfterViewInit {
  readonly luxMode = input<LuxModeType>('default');
  readonly luxMulti = input(false);
  readonly luxColor = input<LuxAccordionColor | undefined, LuxAccordionColor | undefined>('primary', {
    transform: (value: LuxAccordionColor | undefined) => LuxAccordionColors.find((entry) => entry === value) ?? undefined
  });

  readonly luxStickyHeader = input<boolean | undefined>();
  readonly luxStickyHeaderOffset = input<string | undefined>();

  readonly luxDisabled = input<boolean | undefined>();
  readonly luxHideToggle = input<boolean | undefined>();
  readonly luxDynamicHeaderHeight = input<boolean | undefined>();
  readonly luxExpandedHeaderHeight = input<string | undefined>();
  readonly luxCollapsedHeaderHeight = input<string | undefined>();
  readonly luxTogglePosition = input<LuxTogglePosition>();

  readonly matAccordion = viewChild.required(MatAccordion);

  ngAfterViewInit() {
    LuxUtil.assertNonNull('matAccordion', this.matAccordion());
  }
}
