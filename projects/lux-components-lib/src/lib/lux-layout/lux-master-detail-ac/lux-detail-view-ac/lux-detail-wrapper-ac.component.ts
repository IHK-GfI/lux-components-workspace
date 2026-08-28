import { NgTemplateOutlet } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, input, OnInit, output, TemplateRef } from '@angular/core';
import { LuxUtil } from '../../../lux-util/lux-util';

@Component({
  selector: 'lux-detail-wrapper-ac',
  template: '<ng-container *ngTemplateOutlet="luxDetailTemplate(); context: luxDetailContext()"></ng-container>',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet]
})
export class LuxDetailWrapperAcComponent implements OnInit, AfterViewInit {
  readonly luxDetailContext = input<any>();
  readonly luxDetailTemplate = input<TemplateRef<any> | undefined>();

  readonly luxDetailRendered = output<void>();

  ngOnInit() {
    LuxUtil.assertNonNull('luxDetailTemplate', this.luxDetailTemplate());
  }

  ngAfterViewInit() {
    this.luxDetailRendered.emit();
  }
}
